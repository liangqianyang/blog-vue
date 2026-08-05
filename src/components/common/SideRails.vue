<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import AdSlot from './AdSlot.vue'
import { adApi } from '@/api'
import type { AdSlotData } from '@/types'
import { useAdContext } from '@/composables/useAdContext'

/**
 * 两侧翼悬浮广告
 * 钉在主容器两侧留白处，仅宽屏（>1360px）显示
 * 由父级统一请求，确认有在投广告才把轨道渲染进 DOM（无广告时彻底移除）
 * 每侧可单独关闭，关闭状态当次会话内有效
 * 携带路由上下文实现定向投放：不同文章/分类可展示不同的侧翼广告
 */
const STORAGE_KEY_PREFIX = 'side-rail-closed:'

const leftClosed = ref(sessionStorage.getItem(`${STORAGE_KEY_PREFIX}left`) === '1')
const rightClosed = ref(sessionStorage.getItem(`${STORAGE_KEY_PREFIX}right`) === '1')

const leftData = ref<AdSlotData | null>(null)
const rightData = ref<AdSlotData | null>(null)

const context = useAdContext()

async function loadRails() {
  // 已关闭的一侧无需再请求
  const tasks: Promise<void>[] = []
  if (!leftClosed.value) {
    tasks.push(
      adApi
        .getBySlot('side_left', context.value)
        .then(data => {
          leftData.value = data
        })
        .catch(error => console.error('左侧翼广告加载失败:', error))
    )
  }
  if (!rightClosed.value) {
    tasks.push(
      adApi
        .getBySlot('side_right', context.value)
        .then(data => {
          rightData.value = data
        })
        .catch(error => console.error('右侧翼广告加载失败:', error))
    )
  }
  await Promise.all(tasks)
}

onMounted(loadRails)

// 路由上下文变化（切换文章/分类）时重新拉取定向广告
watch(context, () => loadRails())

function close(side: 'left' | 'right') {
  sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${side}`, '1')
  if (side === 'left') {
    leftClosed.value = true
  } else {
    rightClosed.value = true
  }
}
</script>

<template>
  <!-- 左侧翼 -->
  <div v-if="!leftClosed && leftData?.ads.length" class="side-rail side-rail--left">
    <button class="rail-close" title="关闭" @click="close('left')">×</button>
    <AdSlot code="side_left" :data="leftData" />
  </div>

  <!-- 右侧翼 -->
  <div v-if="!rightClosed && rightData?.ads.length" class="side-rail side-rail--right">
    <button class="rail-close" title="关闭" @click="close('right')">×</button>
    <AdSlot code="side_right" :data="rightData" />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.side-rail {
  position: fixed;
  top: 100px; // 避开 60px sticky header
  z-index: 90; // 低于 header / back-to-top（1000）
  width: min(calc((100vw - #{$container-width}) / 2 - 24px), 300px);

  &--left {
    left: 12px;
  }

  &--right {
    right: 12px;
  }

  // 两侧留白不足时整体隐藏
  @media (max-width: 1360px) {
    display: none;
  }

  // 格子卡片在窄轨上收紧内边距
  :deep(.ad-stack-item) {
    padding: 0;
    margin-bottom: $spacing-md;
  }

  :deep(img) {
    width: 100%;
  }
}

.rail-close {
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 1;
  width: 20px;
  height: 20px;
  padding: 0;
  font-size: 14px;
  line-height: 18px;
  color: #fff;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  border-radius: 50%;

  &:hover {
    background: rgba(0, 0, 0, 0.6);
  }
}
</style>
