import { ref, onMounted, onUnmounted, type Ref } from 'vue'

interface UseIntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

export function useIntersectionObserver(
  target: Ref<Element | null>,
  callback: IntersectionObserverCallback,
  options: UseIntersectionObserverOptions = {}
) {
  const isIntersecting = ref(false)
  let observer: IntersectionObserver | null = null

  const defaultOptions: UseIntersectionObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  }

  const mergedOptions = { ...defaultOptions, ...options }

  onMounted(() => {
    if (!target.value) return

    observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        isIntersecting.value = entry.isIntersecting
      })
      callback(entries, obs)
    }, mergedOptions)

    observer.observe(target.value)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    isIntersecting
  }
}

// 用于触发动画的 composable
export function useScrollAnimation(
  target: Ref<Element | null>,
  animationClass = 'animate-in'
) {
  const isVisible = ref(false)

  const { isIntersecting } = useIntersectionObserver(
    target,
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isVisible.value) {
          isVisible.value = true
          entry.target.classList.add(animationClass)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  )

  return {
    isVisible,
    isIntersecting
  }
}
