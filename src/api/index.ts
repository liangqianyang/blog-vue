import axios from 'axios'
import type { 
  Article, 
  Banner, 
  Category, 
  PaginatedResponse, 
  SidebarArticle,
  Tag,
  BlogSite,
  AboutInfo
} from '@/types'
import { mockData } from './mock'

// 从环境变量获取配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
})

// 开发环境下打印配置信息
if (import.meta.env.DEV) {
  console.log('🔧 API 配置:', {
    环境: import.meta.env.VITE_APP_ENV,
    API地址: API_BASE_URL,
    使用Mock: USE_MOCK
  })
}

// 文章相关 API
export const articleApi = {
  // 获取文章列表
  async getList(params?: { 
    category?: string
    page?: number
    pageSize?: number 
  }): Promise<PaginatedResponse<Article>> {
    if (USE_MOCK) {
      return mockData.getArticles(params)
    }
    const { data } = await api.get('/articles', { params })
    return data
  },

  // 获取文章详情
  async getDetail(id: number): Promise<Article> {
    if (USE_MOCK) {
      return mockData.getArticleById(id)
    }
    const { data } = await api.get(`/articles/${id}`)
    return data
  },

  // 获取热门文章
  async getHotList(limit = 8): Promise<SidebarArticle[]> {
    if (USE_MOCK) {
      return mockData.getHotArticles(limit)
    }
    const { data } = await api.get('/articles/hot', { params: { limit } })
    return data
  },

  // 获取推荐文章
  async getRecommendList(limit = 7): Promise<SidebarArticle[]> {
    if (USE_MOCK) {
      return mockData.getRecommendArticles(limit)
    }
    const { data } = await api.get('/articles/recommend', { params: { limit } })
    return data
  }
}

// 轮播图 API
export const bannerApi = {
  async getList(): Promise<Banner[]> {
    if (USE_MOCK) {
      return mockData.getBanners()
    }
    const { data } = await api.get('/carousels/public/enabled')
    // 转换接口返回的数据格式
    if (data.code === 0 && Array.isArray(data.data)) {
      return data.data.map((item: { 
        id: number
        title: string
        image_url: string
        link_url: string | null
      }) => ({
        id: item.id,
        title: item.title,
        image: item.image_url,
        link: item.link_url || ''
      }))
    }
    return []
  }
}

// 分类 API
export const categoryApi = {
  async getList(): Promise<Category[]> {
    if (USE_MOCK) {
      return mockData.getCategories()
    }
    const { data } = await api.get('/categories')
    return data
  }
}

// 标签 API
export const tagApi = {
  async getList(): Promise<Tag[]> {
    if (USE_MOCK) {
      return mockData.getTags()
    }
    const { data } = await api.get('/tags')
    return data
  }
}

// 博客导航 API
export const blogSiteApi = {
  async getList(): Promise<BlogSite[]> {
    if (USE_MOCK) {
      return mockData.getBlogSites()
    }
    const { data } = await api.get('/blog-sites')
    return data
  }
}

// 关于页 API
export const aboutApi = {
  async getInfo(): Promise<AboutInfo> {
    if (USE_MOCK) {
      return mockData.getAboutInfo()
    }
    const { data } = await api.get('/about')
    return data
  }
}

// 搜索 API
export const searchApi = {
  async search(keyword: string): Promise<Article[]> {
    if (USE_MOCK) {
      return mockData.searchArticles(keyword)
    }
    const { data } = await api.post('/search', { keyword })
    return data
  }
}

export default api
