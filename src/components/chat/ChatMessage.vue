<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ChatMessage } from '@/types'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps<{
  message: ChatMessage
  streaming?: boolean
}>()

const router = useRouter()

const rendered = computed(() => renderMarkdown(props.message.content))

const avatar = computed(() => {
  const seed = encodeURIComponent(props.message.id.slice(0, 8))
  return `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${seed}`
})

const goSource = (url: string) => {
  router.push(url).catch(() => window.open(url, '_blank'))
}
</script>

<template>
  <div class="chat-message" :class="message.role">
    <!-- 用户：头像在右 -->
    <img v-if="message.role === 'user'" class="avatar user-avatar" :src="avatar" alt="" />
    <div class="bubble-wrap">
      <div class="bubble" :class="{ error: message.error }">
        <template v-if="message.role === 'assistant'">
          <div v-if="!message.content" class="thinking">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </div>
          <div v-else class="markdown-body">
            <span v-html="rendered"></span><span v-if="streaming" class="cursor"></span>
          </div>
        </template>
        <template v-else>{{ message.content }}</template>
      </div>
      <!-- 引用来源 -->
      <div v-if="message.role === 'assistant' && message.sources?.length" class="sources">
        <button
          v-for="(source, i) in message.sources"
          :key="i"
          class="source-chip"
          :title="source.heading"
          @click="goSource(source.url)"
        >
          <span class="source-index">{{ i + 1 }}</span>
          <span class="source-title">{{ source.title }}</span>
        </button>
      </div>
    </div>
    <!-- 助手：头像在左 -->
    <div v-if="message.role === 'assistant'" class="avatar bot-avatar">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h3a4 4 0 0 1 4 4v1h1a1 1 0 0 1 0 2h-1v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3H3a1 1 0 0 1 0-2h1v-1a4 4 0 0 1 4-4h3V5.72A2 2 0 0 1 12 2zm-3 10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.chat-message {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;

  &.user {
    flex-direction: row-reverse;

    .bubble {
      background: $primary;
      color: $text-white;
      border-top-right-radius: $radius-sm;
    }
  }

  &.assistant .bubble {
    background: $light-bg;
    color: $text-primary;
    border-top-left-radius: $radius-sm;
  }
}

.avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: $radius-full;

  &.user-avatar {
    @include avatar(32px);
  }

  &.bot-avatar {
    @include flex-center;
    background: $gradient-avatar;
    color: $text-white;
  }
}

.bubble-wrap {
  max-width: 78%;
  display: flex;
  flex-direction: column;

  &.user {
    align-items: flex-end;
  }
}

.bubble {
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  font-size: $font-size-sm;
  line-height: $line-height-lg;
  word-break: break-word;
  white-space: pre-wrap;

  &.error {
    color: $danger;
  }
}

// 助手回答里的 markdown（v-html 需 :deep）
.bubble :deep(.markdown-body) {
  white-space: normal;

  p { margin: 0 0 $spacing-sm; }
  p:last-child { margin-bottom: 0; }

  pre {
    background: $dark-bg;
    color: #f0f0f0;
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-sm;
    overflow-x: auto;
    margin: 0 0 $spacing-sm;
    font-size: $font-size-xs;
    line-height: 1.6;
  }

  code {
    font-family: Menlo, Consolas, monospace;

    &:not(pre code) {
      background: rgba(0, 0, 0, 0.06);
      padding: 1px 5px;
      border-radius: $radius-sm;
      font-size: $font-size-xs;
    }
  }

  ul, ol { margin: 0 0 $spacing-sm; padding-left: 1.4em; }
  li { margin: 2px 0; }

  h1, h2, h3, h4 {
    margin: $spacing-sm 0 $spacing-xs;
    font-size: $font-size-base;
    font-weight: bold;
  }

  a { color: $primary-dark; }
  blockquote {
    margin: 0 0 $spacing-sm;
    padding: $spacing-xs $spacing-sm;
    border-left: 3px solid $primary;
    background: rgba(0, 193, 222, 0.06);
  }
  table {
    border-collapse: collapse;
    margin: 0 0 $spacing-sm;
    font-size: $font-size-xs;

    th, td { border: 1px solid $border-color; padding: 4px 8px; }
  }
}

// 等待首字的三点动画
.thinking {
  display: inline-flex;
  gap: 4px;
  padding: 4px 0;

  .dot {
    width: 6px;
    height: 6px;
    border-radius: $radius-full;
    background: $text-muted;
    animation: blink 1.2s infinite ease-in-out;

    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

// 流式光标
.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 2px;
  vertical-align: text-bottom;
  background: $primary;
  animation: blink 0.8s infinite;
}

@keyframes blink {
  0%, 80%, 100% { opacity: 0.2; }
  40% { opacity: 1; }
}

// 引用来源
.sources {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.source-chip {
  @include flex-start;
  gap: 5px;
  max-width: 100%;
  padding: 3px 8px 3px 3px;
  background: $white-bg;
  border: 1px solid $border-color;
  border-radius: $radius-full;
  font-size: $font-size-xs;
  color: $text-secondary;
  cursor: pointer;
  transition: $transition-fast;

  &:hover {
    border-color: $primary;
    color: $primary-dark;
  }
}

.source-index {
  @include flex-center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border-radius: $radius-full;
  background: $primary;
  color: $text-white;
  font-size: 10px;
}

.source-title {
  @include text-ellipsis;
  max-width: 200px;
}
</style>
