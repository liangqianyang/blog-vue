import { onUnmounted } from 'vue'

interface SeoOptions {
  title?: string
  description?: string
  keywords?: string
}

const DEFAULT_TITLE = '枫叶博客'
const DEFAULT_DESCRIPTION = '枫叶博客，专注 PHP 开发、编程工具与 Web 技术分享。提供高质量代码示例、实用开发技巧和行业洞察，帮助程序员高效学习与成长。'
const DEFAULT_KEYWORDS = '枫叶博客，PHP 开发，编程教程，代码示例，开发工具，技术分享，程序员博客，Web 开发，后端开发，编程技巧，技术博客，编程学习'

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useSeo() {
  const setSeo = (options: SeoOptions) => {
    const { title, description, keywords } = options

    // 设置页面标题
    document.title = title ? `${title} - ${DEFAULT_TITLE}` : DEFAULT_TITLE

    // 设置 meta 标签
    setMeta('title', document.title)
    setMeta('description', description || DEFAULT_DESCRIPTION)
    setMeta('keywords', keywords || DEFAULT_KEYWORDS)
  }

  // 组件卸载时恢复默认值
  onUnmounted(() => {
    document.title = DEFAULT_TITLE
    setMeta('title', DEFAULT_TITLE)
    setMeta('description', DEFAULT_DESCRIPTION)
    setMeta('keywords', DEFAULT_KEYWORDS)
  })

  return { setSeo }
}
