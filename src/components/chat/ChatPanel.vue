<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import ChatMessageList from './ChatMessageList.vue'
import ChatComposer from './ChatComposer.vue'

const store = useChatStore()
</script>

<template>
  <Transition name="slide-right">
    <div v-if="store.panelOpen" class="chat-panel">
      <header class="panel-header">
        <div class="header-info">
          <h3>AI 助手</h3>
          <span class="sub">基于博客文章的问答</span>
        </div>
        <div class="header-actions">
          <button class="icon-btn" title="新对话" @click="store.reset()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          </button>
          <button class="icon-btn" title="收起" @click="store.closePanel()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </header>
      <ChatMessageList />
      <ChatComposer />
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.chat-panel {
  @include flex-column;
  position: fixed;
  right: 20px;
  bottom: calc(10% + 104px); // 悬浮气泡(48px) + 间距，叠在返回顶部上方
  width: 380px;
  height: min(60vh, 560px);
  background: $white-bg;
  border-radius: $radius-md;
  box-shadow: $shadow-md, 0 0 40px rgba(0, 0, 0, 0.08);
  z-index: $z-modal;
  overflow: hidden;

  @include respond-to('md') {
    right: 10px;
  }

  @include respond-to('sm') {
    inset: 0;
    width: 100%;
    height: 100dvh;
    border-radius: 0;
  }
}

.panel-header {
  @include flex-between;
  padding: $spacing-sm $spacing-md;
  border-bottom: 1px solid $border-color;
  background: $white-bg;

  .header-info h3 {
    margin: 0;
    font-size: $font-size-base;
    color: $text-primary;
  }

  .sub {
    font-size: $font-size-xs;
    color: $text-muted;
  }
}

.header-actions {
  @include flex-start;
  gap: 4px;
}

.icon-btn {
  @include flex-center;
  width: 28px;
  height: 28px;
  border-radius: $radius-sm;
  color: $text-secondary;
  cursor: pointer;
  transition: $transition-fast;

  &:hover {
    background: $hover-bg;
    color: $text-primary;
  }
}
</style>
