import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NavItem } from '@/types'

export const useAppStore = defineStore('app', () => {
  // 搜索框状态
  const isSearchOpen = ref(false)
  
  // 移动端菜单状态
  const isMobileMenuOpen = ref(false)
  
  // 导航菜单
  const navItems = ref<NavItem[]>([
    { id: 1, name: '首页', path: '/' },
    { id: 2, name: '个人博客日记', path: '/list/diary' },
    { id: 3, name: '博客网站制作', path: '/list/web', children: [ { id: 31, name: '推荐工具', path: '/list/tools' }, { id: 32, name: 'JS经典实例', path: '/list/js' }, { id: 33, name: '网站建设', path: '/list/build' }, { id: 34, name: 'CSS3|Html5', path: '/list/css' }, { id: 35, name: '心得笔记', path: '/list/notes' } ] },
    { id: 6, name: '关于我', path: '/about' }
  ])

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
