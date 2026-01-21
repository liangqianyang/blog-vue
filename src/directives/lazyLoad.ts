import type { Directive, DirectiveBinding } from 'vue'

interface LazyLoadElement extends HTMLImageElement {
  _lazyLoadObserver?: IntersectionObserver
}

const lazyLoad: Directive<LazyLoadElement, string> = {
  mounted(el: LazyLoadElement, binding: DirectiveBinding<string>) {
    // 设置占位图
    const placeholder = '/images/avatar.jpg'
    el.src = placeholder
    
    // 保存真实图片地址
    const realSrc = binding.value
    
    // 使用 IntersectionObserver 实现懒加载
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            
            // 加载真实图片
            const image = new Image()
            image.src = realSrc
            image.onload = () => {
              img.src = realSrc
              img.classList.add('loaded')
            }
            image.onerror = () => {
              img.src = placeholder
              img.classList.add('error')
            }
            
            // 停止观察
            observer.unobserve(img)
          }
        })
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    )
    
    observer.observe(el)
    el._lazyLoadObserver = observer
  },
  
  unmounted(el: LazyLoadElement) {
    if (el._lazyLoadObserver) {
      el._lazyLoadObserver.disconnect()
    }
  }
}

export default lazyLoad
