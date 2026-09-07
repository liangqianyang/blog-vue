<script setup lang="ts">
import { onMounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import ChatMessageList from '@/components/chat/ChatMessageList.vue'
import ChatComposer from '@/components/chat/ChatComposer.vue'

const store = useChatStore()

onMounted(() => {
  store.loadHistory(true) // 与浮窗共享 thread，直开页面也要有历史
})
</script>

<template>
  <div class="chat-view">
    <div class="chat-shell">
      <header class="shell-header">
        <div class="header-info">
          <h2>AI 问答</h2>
          <p>基于博客文章的智能助手，支持多轮追问与来源引用</p>
        </div>
        <button class="new-chat" @click="store.reset()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          新对话
        </button>
      </header>
      <ChatMessageList />
      <ChatComposer />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.chat-view {
  padding: $spacing-lg 0 $spacing-xl;
}

.chat-shell {
  @include flex-column;
  width: min(100%, 800px);
  margin: 0 auto;
  height: calc(100dvh - #{$header-height} - 120px);
  min-height: 480px;
  background: $white-bg;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  overflow: hidden;

  @include respond-to('sm') {
    border: none;
    border-radius: 0;
  }
}

.shell-header {
  @include flex-between;
  padding: $spacing-md $spacing-lg;
  border-bottom: 1px solid $border-color;

  .header-info h2 {
    margin: 0 0 2px;
    font-size: $font-size-lg;
    color: $text-primary;
  }

  .header-info p {
    margin: 0;
    font-size: $font-size-xs;
    color: $text-muted;
  }
}

.new-chat {
  @include flex-start;
  gap: 4px;
  flex-shrink: 0;
  padding: 6px 14px;
  border: 1px solid $border-light;
  border-radius: $radius-full;
  background: $white-bg;
  color: $text-secondary;
  font-size: $font-size-xs;
  cursor: pointer;
  transition: $transition-fast;

  &:hover {
    border-color: $primary;
    color: $primary-dark;
  }
}
</style>
