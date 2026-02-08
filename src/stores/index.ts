import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NavItem } from '@/types'
import { siteNavApi } from '@/api'

export const useAppStore = defineStore('app', () => {
  // 搜索框状态
  const isSearchOpen = ref(false)
  
  // 移动端菜单状态
  const isMobileMenuOpen = ref(false)
  
  // 导航菜单
  const navItems = ref<NavItem[]>([])

  // 获取导航菜单
  const fetchNavItems = async () => {
    try {
      const list = await siteNavApi.getList()
      if (list && list.length > 0) {
        navItems.value = list
      }
    } catch (error) {
      console.error('Failed to fetch nav items:', error)
    }
  }
  
  // 初始化时获取导航数据
  fetchNavItems()

  const toggleSearch = () => {
    isSearchOpen.value = !isSearchOpen.value
  }

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
  }

  return {
    isSearchOpen,
    isMobileMenuOpen,
    navItems,
    toggleSearch,
    toggleMobileMenu,
    closeMobileMenu
  }
})
