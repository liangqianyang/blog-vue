<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useChatStore } from '@/stores/chat'

const store = useChatStore()
const text = ref('')
const textareaEl = ref<HTMLTextAreaElement | null>(null)

// 自适应高度（上限 5 行）
const adjustHeight = () => {
  nextTick(() => {
    const el = textareaEl.value
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 105)}px`
  })
}

// 中文输入法回车确认不触发发送
const onEnter = (e: KeyboardEvent) => {
  if (e.isComposing || e.keyCode === 229) return
  if (!e.shiftKey) {
    e.preventDefault()
    submit()
  }
}

const submit = () => {
  const content = text.value.trim()
  if (!content || store.isStreaming) return
  text.value = ''
  adjustHeight()
  store.send(content)
}
</script>

<template>
  <div class="chat-composer">
    <textarea
      ref="textareaEl"
      v-model="text"
      rows="1"
      placeholder="问问博客里的内容，Enter 发送，Shift+Enter 换行"
      maxlength="4000"
      @input="adjustHeight"
      @keydown="onEnter"
    ></textarea>
    <button v-if="store.isStreaming" class="btn stop" title="停止生成" @click="store.stop()">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <rect x="6" y="6" width="12" height="12" rx="2" />
      </svg>
    </button>
    <button
      v-else
      class="btn send"
      :disabled="!text.trim()"
      title="发送"
      @click="submit()"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
      </svg>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.chat-composer {
  display: flex;
  align-items: flex-end;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md $spacing-md;
  border-top: 1px solid $border-color;
}

textarea {
  flex: 1;
  resize: none;
  border: 1px solid $border-light;
  border-radius: $radius-md;
  padding: 8px 12px;
  font-size: $font-size-sm;
  font-family: inherit;
  line-height: 1.5;
  color: $text-primary;
  background: $white-bg;
  outline: none;
  transition: $transition-fast;

  &:focus {
    border-color: $primary;
  }

  &::placeholder {
    color: $text-muted;
  }
}

.btn {
  @include flex-center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: $radius-md;
  cursor: pointer;
  transition: $transition-fast;
  color: $text-white;

  &.send {
    background: $primary;

    &:hover:not(:disabled) {
      background: $primary-dark;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &.stop {
    background: $text-secondary;

    &:hover {
      background: $text-primary;
    }
  }
}
</style>
