import { ref, type Ref } from 'vue'

interface UseApiOptions<T> {
  immediate?: boolean
  initialData?: T
}

interface UseApiReturn<T, P extends unknown[]> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  execute: (...args: P) => Promise<T>
}

export function useApi<T, P extends unknown[] = []>(
  apiFn: (...args: P) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T, P> {
  const { initialData = null } = options
  
  const data = ref<T | null>(initialData) as Ref<T | null>
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const execute = async (...args: P): Promise<T> => {
    loading.value = true
    error.value = null
    
    try {
      const result = await apiFn(...args)
      data.value = result
      return result
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    execute
  }
}

// 分页数据 composable
export function usePagination(initialPage = 1, initialPageSize = 10) {
  const page = ref(initialPage)
  const pageSize = ref(initialPageSize)
  const total = ref(0)

  const totalPages = ref(0)

  const setTotal = (newTotal: number) => {
    total.value = newTotal
    totalPages.value = Math.ceil(newTotal / pageSize.value)
  }

  const nextPage = () => {
    if (page.value < totalPages.value) {
      page.value++
    }
  }

  const prevPage = () => {
    if (page.value > 1) {
      page.value--
    }
  }

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
      page.value = newPage
    }
  }

  return {
    page,
    pageSize,
    total,
    totalPages,
    setTotal,
    nextPage,
    prevPage,
    goToPage
  }
}
