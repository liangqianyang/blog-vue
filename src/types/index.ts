// 文章分类
export interface Category {
  id: number
  name: string
  slug?: string
}

// 作者信息
export interface Author {
  name: string
  avatar: string
}

// 文章
export interface Article {
  id: number
  title: string
  summary: string
  content?: string
  cover?: string
  images?: string[]
  category: Category
  author: Author
  createTime: string
  isTop?: boolean
  viewCount?: number
  likeCount?: number
  commentCount?: number
  labels?: Tag[]
}

// 轮播图
export interface Banner {
  id: number
  image: string
  link: string
  title?: string
}

// 导航项
export interface NavItem {
  id: number
  name: string
  path: string
  children?: NavItem[]
}

// 站点信息
export interface SiteInfo {
  createTime: string
  program: string
  theme: string
  articleCount: number
  commentCount: number
}

// 分页参数
export interface PaginationParams {
  page: number
  pageSize: number
}

// 分页响应
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 侧边栏文章（简化版）
export interface SidebarArticle {
  id: number
  title: string
  cover?: string
}

// 友情链接
export interface FriendLink {
  id: number
  name: string
  url: string
}

// 标签
export interface Tag {
  id: number
  name: string
  color?: string
}

// 标签（从接口返回）
export interface Label {
  id: number
  title: string
  is_special: string
  created_at: string
  updated_at: string
}

// 博客推荐站点
export interface BlogSite {
  id: number
  name: string
  url: string
  category?: string
}

// 关于页信息
export interface AboutInfo {
  name: string
  avatar: string
  title: string
  description: string
  intro: string
  experiences: Experience[]
  blogs: BlogInfo[]
  contacts: Contact[]
}

export interface Experience {
  id: number
  title: string
  summary: string
  cover: string
  link: string
}

export interface BlogInfo {
  label: string
  value: string
  link?: string
  buttonText?: string
}

export interface Contact {
  type: 'qq' | 'wechat'
  qrcode: string
  title: string
  subtitle: string
}
