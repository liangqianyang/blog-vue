import type { AgentSearchResult, ChatMessage, ChatSource } from '@/types'

// AI 问答走独立的 Python 服务（fetch 流式），不复用 axios 实例与 Laravel 包络约定
const BASE_URL: string = import.meta.env.VITE_CHAT_API_BASE_URL || '/agent-api'

export interface StreamHandlers {
  onStart?: (threadId: string) => void
  onStatus?: (phase: string, query?: string) => void
  onSources?: (sources: ChatSource[]) => void
  onDelta?: (text: string) => void
  onError?: (message: string) => void
  onDone?: (threadId: string) => void
}

interface Frame {
  event: string
  data: string
}

// SSE 帧边界：规范允许 \n\n / \r\n\r\n / \r\r
const FRAME_BOUNDARY = /\r\n\r\n|\n\n|\r\r/
const LINE_SPLIT = /\r\n|\n|\r/

function parseFrame(raw: string): Frame | null {
  let event = 'message'
  const dataLines: string[] = []
  for (const line of raw.split(LINE_SPLIT)) {
    if (line.startsWith(':')) continue // keepalive 注释
    if (line.startsWith('event:')) event = line.slice(6).trim()
    else if (line.startsWith('data:')) dataLines.push(line.slice(5).replace(/^ /, ''))
  }
  const data = dataLines.join('\n')
  if (!data) return null
  return { event, data }
}

function dispatch(frame: Frame, handlers: StreamHandlers) {
  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(frame.data)
  } catch {
    return
  }
  switch (frame.event) {
    case 'status':
      if (payload.phase === 'start' && typeof payload.thread_id === 'string') {
        handlers.onStart?.(payload.thread_id)
      } else {
        handlers.onStatus?.(String(payload.phase ?? ''), payload.query as string | undefined)
      }
      break
    case 'sources':
      handlers.onSources?.((payload.sources as ChatSource[]) || [])
      break
    case 'delta':
      handlers.onDelta?.((payload.text as string) || '')
      break
    case 'error':
      handlers.onError?.((payload.message as string) || '服务暂时不可用')
      break
    case 'done':
      handlers.onDone?.((payload.thread_id as string) || '')
      break
  }
}

export async function streamChat(options: {
  threadId: string | null
  message: string
  handlers: StreamHandlers
  signal?: AbortSignal
}): Promise<void> {
  const resp = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ thread_id: options.threadId, message: options.message }),
    signal: options.signal
  })
  if (!resp.ok || !resp.body) {
    throw new Error(`HTTP ${resp.status}`)
  }

  const reader = resp.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  const drain = (flush = false) => {
    for (;;) {
      const match = FRAME_BOUNDARY.exec(buffer)
      if (!match) break
      const frame = parseFrame(buffer.slice(0, match.index))
      buffer = buffer.slice(match.index + match[0].length)
      if (frame) dispatch(frame, options.handlers)
    }
    if (flush && buffer.trim()) {
      const frame = parseFrame(buffer)
      buffer = ''
      if (frame) dispatch(frame, options.handlers)
    }
  }

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    drain()
  }
  buffer += decoder.decode()
  drain(true)
}

export async function fetchHistory(threadId: string): Promise<ChatMessage[]> {
  const resp = await fetch(`${BASE_URL}/api/history/${encodeURIComponent(threadId)}`)
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  const data = await resp.json()
  return (data.messages || []) as ChatMessage[]
}

export async function agentSearch(query: string, topK = 8): Promise<AgentSearchResult[]> {
  const resp = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}&top_k=${topK}`)
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  const data = await resp.json()
  return (data.results || []).map(
    (r: Record<string, unknown>): AgentSearchResult => ({
      title: String(r.title || ''),
      url: String(r.url || ''),
      heading: String(r.heading || ''),
      score: Number(r.score || 0),
      text: String(r.text || ''),
      category: (r.category as string) || null,
      labels: (r.labels as string[]) || [],
      publishedAt: (r.published_at as string) || null
    })
  )
}
