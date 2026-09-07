<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import ChatPanel from './ChatPanel.vue'

const store = useChatStore()
</script>

<template>
  <div class="chat-entry">
    <ChatPanel />
    <Transition name="scale">
      <button
        v-if="!store.panelOpen"
        class="chat-widget"
        title="AI 问答"
        @click="store.openPanel()"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h3a4 4 0 0 1 4 4v1h1a1 1 0 0 1 0 2h-1v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3H3a1 1 0 0 1 0-2h1v-1a4 4 0 0 1 4-4h3V5.72A2 2 0 0 1 12 2zm-3 10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
        </svg>
        <span v-if="store.unread" class="unread-dot"></span>
      </button>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.chat-widget {
  @include flex-center;
  position: fixed;
  right: 20px;
  bottom: calc(10% + 48px); // 叠在返回顶部按钮上方
  width: 44px;
  height: 44px;
  border-radius: $radius-full;
  background: $dark-bg;
  color: $text-white;
  cursor: pointer;
  transition: $transition-base;
  z-index: $z-fixed;

  &:hover {
    background: $primary;
    transform: translateY(-2px);
  }

  @include respond-to('md') {
    right: 10px;
    bottom: 72px; // 移动端返回顶部在 bottom:20px，40px 高
  }
}

.unread-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: $radius-full;
  background: $warning;
  border: 2px solid $white-bg;
}
</style>
