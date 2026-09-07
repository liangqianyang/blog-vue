<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import ChatMessage from './ChatMessage.vue'

const store = useChatStore()
const listEl = ref<HTMLElement | null>(null)

// 用户手动上滚时暂停自动跟随；回到底部附近再恢复
const isNearBottom = () => {
  const el = listEl.value
  if (!el) return true
  return el.scrollHeight - el.scrollTop - el.clientHeight < 80
}

const scrollToBottom = (force = false) => {
  const el = listEl.value
  if (!el) return
  if (force || isNearBottom()) {
    nextTick(() => {
      el.scrollTop = el.scrollHeight
    })
  }
}

// 新消息强制滚底；流式增量只跟随
watch(
  () => store.messages.length,
  () => scrollToBottom(true)
)
watch(
  () => store.messages[store.messages.length - 1]?.content,
  () => scrollToBottom()
)
</script>

<template>
  <div ref="listEl" class="chat-message-list">
    <div v-if="!store.messages.length" class="empty-hint">
      <p>你好，我是博客的 AI 助手 🤖</p>
      <p class="sub">基于站内文章回答问题，支持多轮追问</p>
    </div>
    <ChatMessage
      v-for="(message, i) in store.messages"
      :key="message.id"
      :message="message"
      :streaming="store.isStreaming && i === store.messages.length - 1 && message.role === 'assistant'"
    />
    <div v-if="store.statusText" class="status-line">{{ store.statusText }}</div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.chat-message-list {
  @include flex-column;
  flex: 1;
  overflow-y: auto;
  padding: $spacing-md;
  overscroll-behavior: contain;
}

.empty-hint {
  margin: auto;
  text-align: center;
  color: $text-muted;
  font-size: $font-size-sm;

  p { margin: 4px 0; }

  .sub {
    font-size: $font-size-xs;
  }
}

.status-line {
  margin: 0 auto $spacing-sm;
  padding: 3px 12px;
  border-radius: $radius-full;
  background: $light-bg;
  color: $text-muted;
  font-size: $font-size-xs;
  @include text-ellipsis;
  max-width: 90%;
}
</style>
