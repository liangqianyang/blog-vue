<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { adApi, type AdContext } from '@/api'
import type { Ad, AdSlotData } from '@/types'
import { useAdContext } from '@/composables/useAdContext'

/**
 * 广告位组件
 * 按广告位标识从后端拉取在投广告，按广告位的展示模式渲染：
 * banner-通栏横幅 / stack-竖向堆叠小格 / text-文字链 / inline-信息流 / html-代码片段
 * 无在投广告时整体不渲染（不留空白占位）
 *
 * 自动携带当前路由上下文（分类/文章）实现定向投放：
 * 列表页带 category_id、文章页带加密文章ID，路由切换时自动重新拉取
 */
const props = defineProps<{
  /** 广告位标识，如 home_banner、article_bottom */
  code: string
  /** 父级预取好的广告位数据；传入后组件不再自行请求（null 表示确认无广告） */
  data?: AdSlotData | null
  /** 手动指定投放上下文，默认从当前路由推导 */
  context?: AdContext
}>()

/** 数据加载完成后抛出，供父级决定是否显示周边元素（如分组标题） */
const emit = defineEmits<{
  loaded: [data: AdSlotData | null]
}>()

const routeContext = useAdContext()
// 优先用父级指定的上下文，否则用路由推导的
const effectiveContext = computed<AdContext>(() => props.context ?? routeContext.value)

const slotData = ref<AdSlotData | null>(null)
const rootRef = ref<HTMLElement | null>(null)

// 已上报曝光的广告，同一页面上下文内只上报一次
const reportedViews = new Set<number>()
let observer: IntersectionObserver | null = null

function reportViews() {
  if (!slotData.value) return
  slotData.value.ads.forEach(ad => {
    if (!reportedViews.has(ad.id)) {
      reportedViews.add(ad.id)
      adApi.reportView(ad.id)
    }
  })
}

async function loadAds() {
  try {
    slotData.value = await adApi.getBySlot(props.code, effectiveContext.value)
  } catch (error) {
    console.error(`广告位 ${props.code} 加载失败:`, error)
    slotData.value = null
  } finally {
    emit('loaded', slotData.value)
  }
}

onMounted(() => {
  // 父级已预取数据时直接使用，避免重复请求
  if (props.data !== undefined) {
    slotData.value = props.data
    emit('loaded', slotData.value)
    return
  }
  loadAds()
})

// 路由上下文变化（如文章甲→文章乙、分类A→分类B）时重新拉取定向广告
watch(effectiveContext, (val, oldVal) => {
  if (props.data !== undefined) return
  if (val.categoryId === oldVal?.categoryId && val.articleId === oldVal?.articleId) return
  // 新页面是新的曝光机会，清空已上报记录
  reportedViews.clear()
  loadAds()
})

// 父级预取数据更新（如侧翼广告定向重取）时同步刷新展示
watch(
  () => props.data,
  val => {
    if (val === undefined) return
    reportedViews.clear()
    slotData.value = val
  }
)

// 广告数据加载后元素才渲染，等待 DOM 更新再开始曝光观察
watch(slotData, async val => {
  if (!val || val.ads.length === 0) return
  await nextTick()
  if (!rootRef.value) return

  observer?.disconnect()
  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reportViews()
        }
      })
    },
    { threshold: 0.1, rootMargin: '50px' }
  )
  observer.observe(rootRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})

/** 广告是否可点击 */
function clickable(ad: Ad): boolean {
  return !!ad.clickUrl
}
</script>

<template>
  <div
    v-if="slotData && slotData.ads.length > 0"
    ref="rootRef"
    class="ad-slot"
    :class="`ad-slot--${slotData.displayMode}`"
  >
    <!-- 通栏横幅：只展示第一条 -->
    <template v-if="slotData.displayMode === 'banner'">
      <template v-for="ad in slotData.ads.slice(0, 1)" :key="ad.id">
        <div v-if="ad.type === 'html'" class="ad-html" v-html="ad.htmlCode" />
        <a
          v-else-if="clickable(ad)"
          :href="ad.clickUrl!"
          target="_blank"
          rel="noopener nofollow"
          class="ad-banner-link"
        >
          <img
            v-if="ad.type === 'image'"
            :src="ad.image!"
            :alt="ad.title"
            loading="lazy"
          />
          <span v-else class="ad-text">🔥 {{ ad.textContent }}</span>
        </a>
        <img
          v-else-if="ad.type === 'image'"
          :src="ad.image!"
          :alt="ad.title"
          loading="lazy"
        />
      </template>
    </template>

    <!-- 堆叠格子：竖排小卡片 -->
    <template v-else-if="slotData.displayMode === 'stack'">
      <div
        v-for="ad in slotData.ads"
        :key="ad.id"
        class="ad-stack-item"
      >
        <div v-if="ad.type === 'html'" class="ad-html" v-html="ad.htmlCode" />
        <a
          v-else-if="clickable(ad)"
          :href="ad.clickUrl!"
          target="_blank"
          rel="noopener nofollow"
          class="ad-stack-link"
        >
          <img
            v-if="ad.type === 'image'"
            :src="ad.image!"
            :alt="ad.title"
            loading="lazy"
          />
          <span v-else class="ad-text">🔥 {{ ad.textContent }}</span>
        </a>
        <img
          v-else-if="ad.type === 'image'"
          :src="ad.image!"
          :alt="ad.title"
          loading="lazy"
        />
      </div>
    </template>

    <!-- 文字链 -->
    <template v-else-if="slotData.displayMode === 'text'">
      <a
        v-for="ad in slotData.ads"
        :key="ad.id"
        :href="ad.clickUrl || undefined"
        target="_blank"
        rel="noopener nofollow"
        class="ad-text-link"
      >
        🔥 {{ ad.textContent || ad.title }}
      </a>
    </template>

    <!-- 信息流：带"推广"标识的卡片 -->
    <template v-else-if="slotData.displayMode === 'inline'">
      <div
        v-for="ad in slotData.ads"
        :key="ad.id"
        class="ad-inline-item"
      >
        <div v-if="ad.type === 'html'" class="ad-html" v-html="ad.htmlCode" />
        <a
          v-else-if="clickable(ad)"
          :href="ad.clickUrl!"
          target="_blank"
          rel="noopener nofollow"
          class="ad-inline-link"
        >
          <img
            v-if="ad.type === 'image'"
            :src="ad.image!"
            :alt="ad.title"
            loading="lazy"
          />
          <span v-else class="ad-text">🔥 {{ ad.textContent }}</span>
          <span class="ad-badge">推广</span>
        </a>
      </div>
    </template>

    <!-- 代码片段 -->
    <template v-else-if="slotData.displayMode === 'html'">
      <div
        v-for="ad in slotData.ads"
        :key="ad.id"
        class="ad-html"
        v-html="ad.htmlCode"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.ad-slot {
  img {
    max-width: 100%;
    display: block;
  }
}

// 通栏横幅
.ad-slot--banner {
  @include card;
  padding: 0;

  .ad-banner-link {
    display: block;
  }

  .ad-text {
    display: block;
    padding: $spacing-lg;
    color: $primary;
  }
}

// 堆叠格子
.ad-slot--stack {
  .ad-stack-item {
    @include card;
    @include img-scale;
    padding: 0;
  }

  .ad-stack-link {
    display: block;
  }

  .ad-text {
    display: block;
    padding: $spacing-md;
    font-size: $font-size-sm;
    color: $primary;
  }
}

// 文字链
.ad-slot--text {
  .ad-text-link {
    display: block;
    padding: $spacing-sm 0;
    font-size: $font-size-sm;
    color: $primary;
    text-decoration: none;
    @include text-ellipsis;

    &:hover {
      text-decoration: underline;
    }
  }
}

// 信息流
.ad-slot--inline {
  .ad-inline-item {
    @include card;
    padding: 0;
  }

  .ad-inline-link {
    display: block;
    position: relative;
  }

  .ad-badge {
    position: absolute;
    top: 6px;
    right: 6px;
    padding: 1px 6px;
    font-size: 12px;
    color: #fff;
    background: rgba(0, 0, 0, 0.35);
    border-radius: 3px;
  }
}

// 代码片段
.ad-html {
  width: 100%;
}
</style>
