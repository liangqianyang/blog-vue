<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  total: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
}>()

const pages = computed(() => {
  const result: (number | string)[] = []
  const current = props.currentPage
  const total = props.totalPages
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      result.push(i)
    }
  } else {
    result.push(1)
    
    if (current > 3) {
      result.push('...')
    }
    
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      result.push(i)
    }
    
    if (current < total - 2) {
      result.push('...')
    }
    
    result.push(total)
  }
  
  return result
})

const goToPage = (page: number | string) => {
  if (typeof page === 'number' && page !== props.currentPage) {
    emit('update:currentPage', page)
  }
}

const prevPage = () => {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1)
  }
}

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('update:currentPage', props.currentPage + 1)
  }
}
</script>

<template>
  <div class="pagination" v-if="totalPages > 1">
    <span class="total">共 <b>{{ total }}</b> 条</span>
    
    <a 
      href="javascript:;"
      class="page-btn"
      :class="{ disabled: currentPage === 1 }"
      @click="prevPage"
    >
      上一页
    </a>
    
    <template v-for="page in pages" :key="page">
      <b v-if="page === currentPage" class="current">{{ page }}</b>
      <span v-else-if="page === '...'" class="ellipsis">...</span>
      <a v-else href="javascript:;" @click="goToPage(page)">{{ page }}</a>
    </template>
    
    <a 
      href="javascript:;"
      class="page-btn"
      :class="{ disabled: currentPage === totalPages }"
      @click="nextPage"
    >
      下一页
    </a>
    
    <a 
      href="javascript:;"
      class="page-btn"
      @click="goToPage(totalPages)"
    >
      尾页
    </a>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.pagination {
  text-align: center;
  color: $text-secondary;
  width: 100%;
  clear: both;
  margin: $spacing-lg 0 $spacing-sm;
  
  a, b {
    display: inline-block;
    margin: 0 5px 10px;
    padding: 5px 10px;
    background: $hover-bg;
  }
  
  a {
    color: $text-secondary;
    transition: all 0.2s;
    
    &:hover:not(.disabled) {
      color: $text-white;
      background: $dark-bg;
    }
    
    &.disabled {
      color: $text-muted;
      cursor: not-allowed;
    }
  }
  
  b.current {
    color: $text-white;
    background: $dark-bg;
  }
  
  .total {
    margin-right: $spacing-sm;
    
    b {
      padding: 0;
      background: none;
      color: $primary;
    }
  }
  
  .ellipsis {
    padding: 5px;
  }
}
</style>
