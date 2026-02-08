import axios from 'axios'
import type { 
  Article, 
  Banner, 
  Category, 
  PaginatedResponse, 
  SidebarArticle,
  Tag,
  Label,
  BlogSite,
  AboutInfo,
  Announcement,
  NavItem,
  AboutMe
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

// API 响应数据到前端 Article 类型的映射函数
function mapArticleFromApi(item: {
  id: number
  title: string
  summary: string
  content?: string
  thumbnail?: string
  category?: { id: number; name: string }
  labels?: { id: number; title: string }[]
  published_at?: string
  created_at?: string
  is_top?: boolean
  view_count?: number
}): Article {
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    content: item.content,
    cover: item.thumbnail,  // thumbnail -> cover
    category: item.category || { id: 0, name: '' },
    author: { name: '', avatar: '' },
    createTime: item.published_at || item.created_at || '',
    isTop: item.is_top,
    viewCount: item.view_count
  }
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

  // 获取公开文章列表（已发布且发布时间已到）
  async getPublicList(params?: {
    page?: number
    per_page?: number
    category_id?: number
    label_id?: number
  }): Promise<{ list: Article[], total: number, page: number, lastPage: number }> {
    if (USE_MOCK) {
      const result = mockData.getArticles({ page: params?.page, pageSize: params?.per_page })
      return { list: result.list, total: result.total, page: result.page, lastPage: Math.ceil(result.total / (params?.per_page || 15)) }
    }
    const { data } = await api.get('/articles/public/list', { params })
    if (data.code === 0 && data.data) {
      const articles = data.data.data.map((item: {
        id: number
        title: string
        summary: string
        content?: string
        thumbnail?: string
        category?: { id: number; name: string }
        labels?: { id: number; title: string }[]
        published_at?: string
        created_at?: string
        is_top?: boolean
        view_count?: number
      }) => mapArticleFromApi(item))
      return {
        list: articles,
        total: data.data.meta.total,
        page: data.data.meta.current_page,
        lastPage: data.data.meta.last_page
      }
    }
    return { list: [], total: 0, page: 1, lastPage: 1 }
  },

  // 获取文章详情
  async getDetail(id: number): Promise<Article> {
    if (USE_MOCK) {
      return mockData.getArticleById(id)
    }
    const { data } = await api.get(`/articles/public/${id}`)
    if (data.code === 0 && data.data) {
      const item = data.data
      return {
        id: item.id,
        title: item.title,
        summary: item.summary,
        content: item.content,
        cover: item.thumbnail,
        category: item.category || { id: 0, name: '' },
        author: { name: '', avatar: '' },
        createTime: item.published_at || item.created_at || '',
        isTop: item.is_top,
        viewCount: item.view_count,
        likeCount: item.like_count,
        commentCount: item.comment_count,
        labels: item.labels?.map((label: { id: number; title: string }) => ({
          id: label.id,
          name: label.title
        }))
      }
    }
    throw new Error('文章不存在')
  },

  // 获取热门文章（点击排行，按浏览量排序）
  async getHotList(limit = 7): Promise<SidebarArticle[]> {
    if (USE_MOCK) {
      return mockData.getHotArticles(limit)
    }
    const { data } = await api.get('/articles/public/top-ranked', { 
      params: { limit, order_by: 'view_count' } 
    })
    // 处理响应格式，转换为 SidebarArticle
    if (data.code === 0 && Array.isArray(data.data)) {
      return data.data.map((item: { id: number; title: string; thumbnail?: string }) => ({
        id: item.id,
        title: item.title,
        cover: item.thumbnail
      }))
    }
    return []
  },

  // 获取推荐文章（站长推荐，按点赞数排序）
  async getRecommendList(limit = 7): Promise<SidebarArticle[]> {
    if (USE_MOCK) {
      return mockData.getRecommendArticles(limit)
    }
    const { data } = await api.get('/articles/public/top-ranked', { 
      params: { limit, order_by: 'like_count' } 
    })
    // 处理响应格式，转换为 SidebarArticle
    if (data.code === 0 && Array.isArray(data.data)) {
      return data.data.map((item: { id: number; title: string; thumbnail?: string }) => ({
        id: item.id,
        title: item.title,
        cover: item.thumbnail
      }))
    }
    return []
  },

  // 获取头条文章（按浏览量排序）
  async getTopRanked(params: { limit?: number, order_by?: string, category_id?: number, label_id?: number } = {}): Promise<Article[]> {
    if (USE_MOCK) {
      return mockData.getArticles({ pageSize: params.limit || 2 }).list
    }
    const { data } = await api.get('/articles/public/top-ranked', { params })
    // 处理响应格式，转换字段名
    if (data.code === 0 && Array.isArray(data.data)) {
      return data.data.map(mapArticleFromApi)
    }
    return data
  },

  // 点赞文章
  async like(id: number): Promise<{ likeCount: number }> {
    const { data } = await api.post(`/articles/public/${id}/like`)
    if (data.code === 0) {
      return { likeCount: data.data?.like_count || 0 }
    }
    throw new Error(data.message || '点赞失败')
  },

  // 取消点赞文章
  async unlike(id: number): Promise<{ likeCount: number }> {
    const { data } = await api.post(`/articles/public/${id}/unlike`)
    if (data.code === 0) {
      return { likeCount: data.data?.like_count || 0 }
    }
    throw new Error(data.message || '取消点赞失败')
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
  },

  // 获取前端展示的文章分类列表
  async getArticleCategoriesList(): Promise<Category[]> {
    if (USE_MOCK) {
      return mockData.getCategories()
    }
    const { data } = await api.get('/article-categories/public/list')
    if (data.code === 0 && Array.isArray(data.data)) {
      return data.data.map((item: {
        id: number
        name: string
        description?: string
        cover_image?: string
        pid?: number
        sort?: number
      }) => ({
        id: item.id,
        name: item.name,
        slug: item.description
      }))
    }
    return []
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
  },

  // 获取特别推荐标签列表
  async getSpecialList(): Promise<Tag[]> {
    if (USE_MOCK) {
      return mockData.getTags()
    }
    const { data } = await api.get('/labels/public/special')
    if (data.code === 0 && Array.isArray(data.data)) {
      return data.data.map((item: {
        id: number
        title: string
        is_special?: string
        created_at?: string
        updated_at?: string
      }) => ({
        id: item.id,
        name: item.title
      }))
    }
    return []
  },

  // 获取所有标签列表（标签云）
  async getPublicList(): Promise<Label[]> {
    if (USE_MOCK) {
      return []
    }
    const { data } = await api.get('/labels/public/list')
    if (data.code === 0 && Array.isArray(data.data)) {
      return data.data
    }
    return []
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
    const { data } = await api.get('/about-me/public')
    if (data.code === 0 && data.data) {
      const item: AboutMe = data.data
      return {
        name: item.nickname || item.name,
        avatar: item.avatar ? item.avatar.replace(/`/g, '').trim() : '',
        title: item.profession || '',
        description: item.slogan || item.location || '',
        intro: item.bio || '',
        experiences: [],
        blogs: [],
        contacts: [
          ...(item.email ? [{
            type: 'wechat' as const, // 临时借用类型
            qrcode: '',
            title: 'Email',
            subtitle: item.email
          }] : []),
          ...(item.github ? [{
            type: 'wechat' as const,
            qrcode: '',
            title: 'GitHub',
            subtitle: item.github
          }] : [])
        ]
      }
    }
    throw new Error('获取关于信息失败')
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

// 公告 API
export const announcementApi = {
  async getEnabledList(): Promise<Announcement[]> {
    if (USE_MOCK) {
      return []
    }
    const { data } = await api.get('/announcements/public/enabled')
    if (data.code === 0 && Array.isArray(data.data)) {
      return data.data.map((item: {
        id: number
        title: string
        content?: string
        link?: string
        sort?: number
      }) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        link: item.link,
        sort: item.sort
      }))
    }
    return []
  }
}

// 站点导航 API
export const siteNavApi = {
  async getList(): Promise<NavItem[]> {
    if (USE_MOCK) {
      return []
    }
    const { data } = await api.get('/site-navs/public/list')
    if (data.code === 0 && Array.isArray(data.data)) {
      return data.data
    }
    return []
  }
}

export default api
