<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { AgentSearchResult } from '@/types'
import { agentSearch } from '@/api/chat'

const router = useRouter()

const query = ref('')
const results = ref<AgentSearchResult[]>([])
const loading = ref(false)
const searched = ref(false)
const errorMsg = ref('')

const goArticle = (url: string) => {
  router.push(url).catch(() => window.open(url, '_blank'))
}

const submit = async () => {
  const q = query.value.trim()
  if (!q || loading.value) return
  loading.value = true
  errorMsg.value = ''
  results.value = []
  try {
    results.value = await agentSearch(q)
  } catch (e) {
    errorMsg.value = '检索服务暂时不可用，请稍后重试'
    console.error('Agent search failed:', e)
  } finally {
    searched.value = true
    loading.value = false
  }
}
</script>

<template>
  <div class="ai-search-view">
    <div class="search-shell">
      <header class="search-header">
        <h2>AI 语义检索</h2>
        <p>基于向量检索，理解语义而非关键词匹配，直达文章相关章节</p>
      </header>

      <div class="search-bar">
        <input
          v-model="query"
          type="text"
          placeholder="用一句话描述想找的内容，如：怎么给 PHP 数组去重"
          maxlength="400"
          @keydown.enter="submit()"
        />
        <button class="search-btn" :disabled="!query.trim() || loading" @click="submit()">
          {{ loading ? '检索中…' : '检索' }}
        </button>
      </div>

      <div v-if="loading" class="state loading">
        <span class="spinner"></span> 正在语义匹配…
      </div>
      <div v-else-if="errorMsg" class="state error">{{ errorMsg }}</div>
      <div v-else-if="searched && !results.length" class="state empty">
        没有找到语义相关的内容，换个说法试试
      </div>

      <div v-else class="results">
        <article v-for="(item, i) in results" :key="i" class="result-card" @click="goArticle(item.url)">
          <div class="card-head">
            <span class="score" :class="{ strong: item.score >= 0.75 }">
              {{ (item.score * 100).toFixed(0) }}% 相关
            </span>
            <h3 class="title">{{ item.title }}</h3>
          </div>
          <p v-if="item.heading" class="heading">{{ item.heading }}</p>
          <p class="snippet">{{ item.text }}</p>
          <div class="card-meta">
            <span v-if="item.category" class="meta-item">{{ item.category }}</span>
            <span v-for="label in item.labels" :key="label" class="meta-item label">{{ label }}</span>
            <span v-if="item.publishedAt" class="meta-item time">{{ item.publishedAt.slice(0, 10) }}</span>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.ai-search-view {
  padding: $spacing-lg 0 $spacing-xl;
}

.search-shell {
  width: min(100%, 800px);
  margin: 0 auto;
}

.search-header {
  text-align: center;
  margin-bottom: $spacing-lg;

  h2 {
    margin: 0 0 4px;
    font-size: $font-size-xl;
    color: $text-primary;
  }

  p {
    margin: 0;
    font-size: $font-size-sm;
    color: $text-muted;
  }
}

.search-bar {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;

  input {
    flex: 1;
    height: 44px;
    padding: 0 16px;
    border: 2px solid $border-light;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    color: $text-primary;
    outline: none;
    transition: $transition-fast;

    &:focus {
      border-color: $primary;
    }

    &::placeholder {
      color: $text-muted;
    }
  }
}

.search-btn {
  @include btn-primary;
  height: 44px;
  padding: 0 24px;
  border: none;
  font-size: $font-size-sm;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.state {
  text-align: center;
  padding: $spacing-xl 0;
  color: $text-muted;
  font-size: $font-size-sm;

  &.error {
    color: $danger;
  }
}

.loading {
  @include flex-center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid $border-color;
  border-top-color: $primary;
  border-radius: $radius-full;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.result-card {
  background: $white-bg;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  padding: $spacing-md $spacing-lg;
  margin-bottom: $spacing-md;
  cursor: pointer;
  transition: $transition-base;

  &:hover {
    box-shadow: $shadow-card;
    border-color: $primary-light;

    .title {
      color: $primary-dark;
    }
  }
}

.card-head {
  @include flex-start;
  gap: $spacing-sm;
}

.score {
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: $radius-full;
  background: rgba(0, 193, 222, 0.1);
  color: $primary-dark;
  font-size: $font-size-xs;

  &.strong {
    background: $primary;
    color: $text-white;
  }
}

.title {
  margin: 0;
  font-size: $font-size-base;
  color: $text-primary;
  transition: $transition-fast;
  @include text-ellipsis;
}

.heading {
  margin: 6px 0 0;
  font-size: $font-size-xs;
  color: $text-muted;
}

.snippet {
  margin: 8px 0 0;
  font-size: $font-size-sm;
  line-height: $line-height-lg;
  color: $text-secondary;
  @include text-clamp(2);
}

.card-meta {
  @include flex-start;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.meta-item {
  padding: 1px 8px;
  border-radius: $radius-sm;
  background: $light-bg;
  color: $text-muted;
  font-size: $font-size-xs;

  &.label {
    background: rgba(0, 193, 222, 0.08);
    color: $primary-dark;
  }

  &.time {
    background: none;
    padding: 1px 0;
  }
}
</style>
