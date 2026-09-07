import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChatMessage } from '@/types'
import { fetchHistory, streamChat } from '@/api/chat'

const THREAD_KEY = 'blog-chat-thread'

function uid(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export const useChatStore = defineStore('chat', () => {
  // 会话状态
  const messages = ref<ChatMessage[]>([])
  const isStreaming = ref(false)
  const statusText = ref('') // 检索改写等中间状态提示
  const threadId = ref<string | null>(localStorage.getItem(THREAD_KEY))
  const panelOpen = ref(false)
  const historyLoaded = ref(false)
  const unread = ref(false) // 面板关闭时收到新回复

  let abortController: AbortController | null = null

  const openPanel = () => {
    panelOpen.value = true
    unread.value = false
    loadHistory()
  }

  const closePanel = () => {
    panelOpen.value = false
  }

  const togglePanel = () => {
    if (panelOpen.value) closePanel()
    else openPanel()
  }

  const loadHistory = async (force = false) => {
    if ((historyLoaded.value && !force) || !threadId.value) return
    try {
      const list = await fetchHistory(threadId.value)
      // 远端与本地不一致时以远端为准（多标签页场景）
      messages.value = list
      historyLoaded.value = true
    } catch (error) {
      console.error('Failed to load chat history:', error)
    }
  }

  const send = async (text: string) => {
    const content = text.trim()
    if (!content || isStreaming.value) return
    stop() // 中断上一条未完成的流

    if (!threadId.value) {
      threadId.value = uid()
      localStorage.setItem(THREAD_KEY, threadId.value)
    }

    messages.value.push({ id: uid(), role: 'user', content })
    const assistant: ChatMessage = { id: uid(), role: 'assistant', content: '', sources: [] }
    messages.value.push(assistant)
    isStreaming.value = true
    statusText.value = ''
    abortController = new AbortController()

    try {
      await streamChat({
        threadId: threadId.value,
        message: content,
        signal: abortController.signal,
        handlers: {
          onStart: (tid) => {
            if (tid && tid !== threadId.value) {
              threadId.value = tid
              localStorage.setItem(THREAD_KEY, tid)
            }
          },
          onStatus: (phase, query) => {
            if (phase === 'rewrite') statusText.value = `正在换一种方式检索：${query ?? ''}`
          },
          onSources: (sources) => {
            assistant.sources = sources
          },
          onDelta: (chunk) => {
            statusText.value = ''
            assistant.content += chunk
          },
          onError: (msg) => {
            if (!assistant.content) {
              assistant.error = true
              assistant.content = msg
            }
          }
        }
      })
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        assistant.error = true
        if (!assistant.content) assistant.content = '网络异常，请稍后重试'
      }
    } finally {
      isStreaming.value = false
      statusText.value = ''
      abortController = null
      if (!panelOpen.value && assistant.content) unread.value = true
    }
  }

  const stop = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    isStreaming.value = false
  }

  const reset = () => {
    stop()
    threadId.value = null
    localStorage.removeItem(THREAD_KEY)
    messages.value = []
    statusText.value = ''
    historyLoaded.value = true // 空会话无需拉取
  }

  const retry = () => {
    const lastUser = [...messages.value].reverse().find((m) => m.role === 'user')
    if (!lastUser) return
    const idx = messages.value.findIndex((m) => m.id === lastUser.id)
    messages.value.splice(idx) // 连同失败回答一并移除，重发
    send(lastUser.content)
  }

  return {
    messages,
    isStreaming,
    statusText,
    threadId,
    panelOpen,
    historyLoaded,
    unread,
    openPanel,
    closePanel,
    togglePanel,
    loadHistory,
    send,
    stop,
    reset,
    retry
  }
})
