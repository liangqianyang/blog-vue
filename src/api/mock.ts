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

// 默认作者
const defaultAuthor = {
  name: '杨青青',
  avatar: '/images/avatar.jpg'
}

// 分类数据
const categoryBlog: Category = { id: 1, name: '个人博客', slug: 'blog' }
const categoryDiary: Category = { id: 2, name: '工作日记', slug: 'diary' }
const categoryLife: Category = { id: 3, name: '心路历程', slug: 'life' }
const categoryMyBlog: Category = { id: 4, name: '我的博客', slug: 'myblog' }
const categoryFrontend: Category = { id: 5, name: '前端技术', slug: 'frontend' }
const categoryTemplate: Category = { id: 6, name: '原创模板', slug: 'template' }
const categoryBuild: Category = { id: 7, name: '快速建站', slug: 'build' }
const categoryDesign: Category = { id: 8, name: '设计制作', slug: 'design' }

const categories: Category[] = [
  categoryBlog, categoryDiary, categoryLife, categoryMyBlog,
  categoryFrontend, categoryTemplate, categoryBuild, categoryDesign
]

// 文章数据
const articles: Article[] = [
  {
    id: 1,
    title: '个人博客，属于我的小世界！',
    summary: '个人博客，用来做什么？我刚开始就把它当做一个我吐槽心情的地方，也就相当于一个网络记事本，写上一些关于自己生活工作中的小情小事，也会放上一些照片，音乐。每天工作回家后就能访问自己的网站，一边听着音乐，一边写写文章。',
    cover: '/images/2.jpg',
    category: categoryBlog,
    author: defaultAuthor,
    createTime: '2018-10-28',
    isTop: false
  },
  {
    id: 2,
    title: '安静地做一个爱设计的女子',
    summary: '自从入了这行，很多人跟我说可以做网络教程，我也有考虑，但最终没有实现，因为我觉得在这个教程泛滥的时代，直接做一套免费的原创个人博客模板更为实在。',
    cover: '/images/3.jpg',
    category: categoryBlog,
    author: defaultAuthor,
    createTime: '2018-10-28',
    isTop: false
  },
  {
    id: 3,
    title: '我是怎么评价自己的？',
    summary: '为了挨打轻一些，问我哪里来的，我瞎说了一个说那个谁家的，结果，打得更凶。最后事情还原了真相，我妈说，你要说说奶奶家的，都不会打你了。从此以后，我知道撒谎是会付出更惨痛的代价的，我不再撒谎，也不喜欢爱撒谎的人。',
    cover: '/images/1.jpg',
    category: categoryLife,
    author: defaultAuthor,
    createTime: '2018-10-28',
    isTop: false
  },
  {
    id: 4,
    title: '个人网站做好了，百度不收录怎么办？来，看看他们怎么做的。',
    summary: '不管你是学前端的还是后端的，作为一个程序员，做一个自己的博客，那是必然的。咱们的圈子就这么大，想让更多的人了解你，看看你的技术多牛逼，扔一个博客地址就行了',
    cover: '/images/4.jpg',
    category: categoryFrontend,
    author: defaultAuthor,
    createTime: '2018-10-28',
    isTop: false
  },
  {
    id: 5,
    title: '做个人博客如何用帝国cms美化留言增加头像选择',
    summary: '帝国cms的留言板系统很简单，用户名，邮箱，电话，没有头像显示，如果要增加头像选择，而又不增加表或者字段的情况下，选择改用其中一个字段，比如电话这个，修改一下即可',
    cover: '/images/b01.jpg',
    category: categoryFrontend,
    author: defaultAuthor,
    createTime: '2018-10-28',
    isTop: false
  },
  {
    id: 6,
    title: '别让这些闹心的套路，毁了你的网页设计!',
    summary: '如图，要实现上图效果，我采用如下方法：1、首先在数据库模型，增加字段，分别是图片2，图片3。2、增加标签模板，用if，else if 来判断，输出。思路已打开，样式调用就可以多样化啦！',
    cover: '/images/b02.jpg',
    images: ['/images/b02.jpg', '/images/b03.jpg', '/images/b04.jpg', '/images/b05.jpg'],
    category: categoryTemplate,
    author: defaultAuthor,
    createTime: '2018-10-28',
    isTop: true
  },
  {
    id: 7,
    title: '【个人博客网站制作】自己不会个人博客网站制作，你会选择用什么博客程序源码？',
    summary: '这些开源的博客程序源码，都是经过很多次版本测试的，都有固定的使用人群。我所知道的主流的博客程序有，Z-blog，Emlog，WordPress，Typecho等，免费的cms系统有，织梦cms（dedecms），phpcms，帝国cms（EmpireCMS）！',
    cover: '/images/b01.jpg',
    category: categoryTemplate,
    author: defaultAuthor,
    createTime: '2018-10-28',
    isTop: false
  },
  {
    id: 8,
    title: '宝宝个人博客模板-亲子博客模板-宝宝个人网站模板',
    summary: '这是一个记录宝宝成长点滴的个人博客，用作于宝宝博客，亲子博客，都是适用的。颜色为蓝色调，头部有飘动的卡通云，采用css3动画效果，布局简单，代码精简，还有相册功能，发图片，视频，时间轴可记录重要时刻，也可记录宝宝的生长发育状况，也可以统计宝宝博客网站的所有文章',
    cover: '/images/b02.jpg',
    category: categoryTemplate,
    author: defaultAuthor,
    createTime: '2018-10-28',
    isTop: false
  },
  {
    id: 9,
    title: '如何快速建立自己的个人博客网站',
    summary: '各大博客门户网站，相继关闭，做一个独立的个人博客网站，那是将来的趋势。越来越多的个人站长倾向于独立建站，有个属于自己的博客网站，那如何快速建立自己的个人博客网站呢，接下来，我就简单给大家介绍一下：以阿里云为例',
    cover: '/images/b03.jpg',
    category: categoryBuild,
    author: defaultAuthor,
    createTime: '2018-10-28',
    isTop: false
  },
  {
    id: 10,
    title: '作为一个设计师,如果遭到质疑你是否能恪守自己的原则?',
    summary: '就拿我自己来说吧，有时候会很矛盾，设计好的作品，不把它分享出来，会觉得待在自己电脑里面实在是没有意义。干脆就发布出去吧。我也害怕收到大家不好的评论，有些评论，可能说者无意，但是对于每一个用心的站长来说，都会受很深的影响，愤怒，恼羞。',
    cover: '/images/b04.jpg',
    category: categoryDesign,
    author: defaultAuthor,
    createTime: '2018-10-28',
    isTop: false
  },
  {
    id: 11,
    title: '个人博客模板《今夕何夕》-响应式个人博客模板',
    summary: '个人博客模板《今夕何夕》，宽屏响应式个人博客模板，采用冷色系为主，固定导航栏和侧边栏，无缝滚动图片...',
    cover: '/images/1.jpg',
    category: categoryTemplate,
    author: defaultAuthor,
    createTime: '2018-10-28',
    isTop: false
  },
  {
    id: 12,
    title: '十条设计原则教你学会如何设计网页布局!',
    summary: '网页设计布局是网页设计的基础，一个好的布局能让网页更加美观、易读。本文将介绍十条设计原则，帮助你学会如何设计网页布局。',
    cover: '/images/text01.jpg',
    category: categoryDesign,
    author: defaultAuthor,
    createTime: '2018-10-28',
    isTop: false
  }
]

// 轮播图数据
const banners: Banner[] = [
  { id: 1, image: '/images/1.jpg', link: '/', title: '个人博客模板' },
  { id: 2, image: '/images/2.jpg', link: '/', title: '响应式设计' },
  { id: 3, image: '/images/3.jpg', link: '/', title: '前端技术分享' },
  { id: 4, image: '/images/4.jpg', link: '/', title: '网页设计心得' }
]

// 标签数据
const tags: Tag[] = [
  { id: 1, name: '个人博客模板', color: '#036564' },
  { id: 2, name: 'css动画', color: '#8A9B0F' },
  { id: 3, name: '布局', color: '#EB6841' },
  { id: 4, name: '今夕何夕', color: '#3FB8AF' },
  { id: 5, name: 'SEO', color: '#FE4365' },
  { id: 6, name: '女程序员', color: '#FC9D9A' },
  { id: 7, name: '小世界', color: '#EDC951' },
  { id: 8, name: '个人博客', color: '#C8C8A9' },
  { id: 9, name: '网页设计', color: '#3299BB' }
]

// 博客导航站点
const blogSites: BlogSite[] = [
  { id: 1, name: '杨青青个人博客', url: 'http://www.yangqq.com', category: '个人博客' },
  { id: 2, name: '阮一峰的网络日志', url: 'http://www.ruanyifeng.com', category: '技术博客' },
  { id: 3, name: '张鑫旭博客', url: 'https://www.zhangxinxu.com', category: '前端博客' },
  { id: 4, name: '廖雪峰的官方网站', url: 'https://www.liaoxuefeng.com', category: '技术博客' }
]

// 关于页信息
const aboutInfo: AboutInfo = {
  name: '杨青青',
  avatar: '/images/avatar.jpg',
  title: '一个80后草根女站长！Web前端设计师、网页设计师。',
  description: '天津智尚互联科技有限公司设计总监，青于蓝网络工作室创始人。',
  intro: '我叫杨青青，我是一个80后草根女站长！09年入行。我一直潜心研究网页前端技术，一边工作一边积累经验，分享一些个人博客模板，以及网站优化等心得。我入行早，大家也亲切的叫我"青姐"。我的个人博客搜索"个人博客"、"博客"，一直都靠前。最有意思的是，我有三年的时间没有去更新它，依然排在前面。虽然期间有很多的不容易，但是我都没有放弃过。选了这一行 ，就深深的喜欢上它。我喜欢一句话"冥冥中该来则来，无处可逃"。我喜欢上了前端设计，喜欢坐在电脑前敲代码，喜欢跟一堆程序员聊天。这辈子，我也逃不出去了，深深的陷了进来。',
  experiences: [
    {
      id: 1,
      title: '我是怎么评价自己的？',
      summary: '我性格属于好静的，喜欢写写画画，自从读了计算机专业，那就更好静了，我可以两星期都不出门，但是半刻钟也不能离开电脑。',
      cover: '/images/1.jpg',
      link: '/'
    },
    {
      id: 2,
      title: '个人博客，属于我的小世界！',
      summary: '个人博客，用来做什么？我刚开始就把它当做一个我吐槽心情的地方，也就相当于一个网络记事本，写上一些关于自己生活工作中的小情小事，也会放上一些照片，音乐。每天工作回家后就能访问自己的网站，一边听着音乐，一边写写文章。',
      cover: '/images/2.jpg',
      link: '/'
    },
    {
      id: 3,
      title: '【爱设计】安静地做一个爱设计的女子',
      summary: '自从入了这行，很多人跟我说可以做网络教程，我也有考虑，但最终没有实现，因为我觉得在这个教程泛滥的时代，直接做一套免费的原创个人博客模板更为实在。',
      cover: '/images/3.jpg',
      link: '/'
    },
    {
      id: 4,
      title: '【匆匆那些年】总结个人博客经历的这四年',
      summary: '博客从最初的域名购买，到上线已经有四年的时间了，这四年的时间，有笑过，有怨过，有悔过，有执着过，也有放弃过…但最后还是坚持了下来，时间如此匆匆，等再回过头已来不及去弥补',
      cover: '/images/4.jpg',
      link: '/'
    }
  ],
  blogs: [
    { label: '创建时间', value: '2011年01月12日', buttonText: '主页', link: 'http://www.yangqq.com' },
    { label: '主题模板', value: '《今夕何夕》', buttonText: '下载', link: '/' },
    { label: '网站程序', value: '帝国CMS7.5', buttonText: '下载', link: '/' },
    { label: '服务器商', value: '阿里云服务器', buttonText: '1888代金券领取', link: '/' },
    { label: '免费空间', value: '金牛云服', buttonText: '国内主机免费领', link: '/' }
  ],
  contacts: [
    { type: 'qq', qrcode: '/images/qq1.png', title: '网页设计交流吧①', subtitle: 'QQ群号：280998807' },
    { type: 'qq', qrcode: '/images/qq2.png', title: '网页设计交流吧②', subtitle: 'QQ群号：291195645' },
    { type: 'wechat', qrcode: '/images/joinwx.png', title: '关注官方微信公众号', subtitle: '掌握最新的模板信息！' },
    { type: 'wechat', qrcode: '/images/joinwxqun.png', title: '网页设计交流微信群', subtitle: '目前只接受群主拉进群' }
  ]
}

// Mock 数据方法
export const mockData = {
  // 获取文章列表
  getArticles(params?: { category?: string; page?: number; pageSize?: number }): PaginatedResponse<Article> {
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    let filteredArticles = [...articles]
    
    if (params?.category) {
      filteredArticles = filteredArticles.filter(
        a => a.category.slug === params.category || a.category.name === params.category
      )
    }
    
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      list: filteredArticles.slice(start, end),
      total: filteredArticles.length,
      page,
      pageSize
    }
  },

  // 获取文章详情
  getArticleById(id: number): Article {
    const article = articles.find(a => a.id === id)
    if (!article) {
      throw new Error('Article not found')
    }
    return {
      ...article,
      content: `<p>${article.summary}</p><p>这是文章的详细内容...</p>`
    }
  },

  // 获取热门文章
  getHotArticles(limit: number): SidebarArticle[] {
    return articles.slice(0, limit).map(a => ({
      id: a.id,
      title: a.title,
      cover: a.cover
    }))
  },

  // 获取推荐文章
  getRecommendArticles(limit: number): SidebarArticle[] {
    return articles.slice(0, limit).map(a => ({
      id: a.id,
      title: a.title,
      cover: a.cover
    }))
  },

  // 获取轮播图
  getBanners(): Banner[] {
    return banners
  },

  // 获取分类
  getCategories(): Category[] {
    return categories
  },

  // 获取标签
  getTags(): Tag[] {
    return tags
  },

  // 获取博客站点
  getBlogSites(): BlogSite[] {
    return blogSites
  },

  // 获取关于页信息
  getAboutInfo(): AboutInfo {
    return aboutInfo
  },

  // 搜索文章
  searchArticles(keyword: string): Article[] {
    if (!keyword) return []
    const lowerKeyword = keyword.toLowerCase()
    return articles.filter(
      a => a.title.toLowerCase().includes(lowerKeyword) || 
           a.summary.toLowerCase().includes(lowerKeyword)
    )
  },

  // 按分类获取文章（用于 Tab 切换）
  getArticlesByCategory(categoryId: number): Article[] {
    return articles.filter(a => a.category.id === categoryId).slice(0, 5)
  }
}

export { categories, articles, banners, tags, blogSites, aboutInfo }
