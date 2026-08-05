import { computed, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import type { AdContext } from '@/api'

/**
 * 从当前路由推导广告投放上下文：
 * - 分类列表页 /list/:category → categoryId（仅当参数为数字ID时）
 * - 文章详情页 /article/:id → articleId（路由里的加密串原样传给后端解密）
 * - 其他页面（首页等）→ 无上下文，只匹配通投广告
 *
 * 返回 computed，路由变化时自动更新，供广告组件 watch 重新拉取
 */
export function useAdContext(): Readonly<Ref<AdContext>> {
  const route = useRoute()

  return computed<AdContext>(() => {
    if (route.name === 'List' && route.params.category) {
      const category = String(route.params.category)
      if (/^\d+$/.test(category)) {
        return { categoryId: parseInt(category, 10) }
      }
      return {}
    }
    if (route.name === 'Article' && route.params.id) {
      return { articleId: String(route.params.id) }
    }
    return {}
  })
}
