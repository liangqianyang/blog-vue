<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores'
import SearchBox from '@/components/common/SearchBox.vue'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const isMenuOpen = ref(false)
const openSubmenu = ref<number | null>(null)

const navItems = computed(() => appStore.navItems)
const isSearchOpen = computed(() => appStore.isSearchOpen)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleSubmenu = (id: number) => {
  openSubmenu.value = openSubmenu.value === id ? null : id
}

const closeSubmenu = () => {
  openSubmenu.value = null
}

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleNavClick = (item: typeof navItems.value[0]) => {
  if (item.children && window.innerWidth <= 768) {
    toggleSubmenu(item.id)
  } else {
    router.push(item.path)
    isMenuOpen.value = false
    openSubmenu.value = null
  }
}
</script>

<template>
  <header class="header">
    <div class="header-bar"></div>
    <div class="nav-box">
      <!-- 移动端菜单按钮 -->
      <button 
        class="mobile-menu-btn"
        :class="{ open: isMenuOpen }"
        @click="toggleMenu"
      >
        <span class="nav-icon"></span>
      </button>
      
      <!-- Logo -->
      <div class="logo">
        <router-link to="/">枫叶个人博客</router-link>
      </div>
      
      <!-- 导航菜单 -->
      <nav class="nav" :class="{ open: isMenuOpen }">
        <ul class="nav-list">
          <li 
            v-for="item in navItems" 
            :key="item.id"
            :class="{ 
              'has-submenu': item.children,
              'submenu-open': openSubmenu === item.id
            }"
            @mouseleave="closeSubmenu"
          >
            <a 
              :class="{ active: isActive(item.path) }"
              @click.prevent="handleNavClick(item)"
            >
              {{ item.name }}
            </a>
            
            <!-- 子菜单 -->
            <ul v-if="item.children" class="submenu">
              <li v-for="child in item.children" :key="child.id">
                <router-link 
                  :to="child.path"
                  @click="isMenuOpen = false; closeSubmenu()"
                >
                  {{ child.name }}
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      
      <!-- 搜索图标 -->
      <button class="search-icon" @click="appStore.toggleSearch">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </button>
    </div>
    
    <!-- 搜索框 -->
    <Transition name="slide">
      <SearchBox v-if="isSearchOpen" />
    </Transition>
  </header>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.header {
  width: 100%;
  background: $dark-bg;
  position: sticky;
  top: 0;
  z-index: $z-fixed;
}

.header-bar {
  height: 5px;
  background: $gradient-header;
}

.nav-box {
  width: $container-width;
  margin: 0 auto;
  height: 50px;
  @include flex-between;
  
  @include respond-to('xl') {
    width: 100%;
    padding: 0 $spacing-md;
  }
}

.logo {
  font-size: $font-size-xl;
  
  a {
    color: $text-white;
    
    &:hover {
      color: $primary;
    }
  }
}

.nav {
  flex: 1;
  margin-left: 60px;
  
  @include respond-to('md') {
    position: fixed;
    top: 55px;
    left: 0;
    right: 0;
    background: $dark-bg;
    margin-left: 0;
    display: none;
    
    &.open {
      display: block;
    }
  }
}

.nav-list {
  @include flex-start;
  height: 50px;
  
  @include respond-to('md') {
    flex-direction: column;
    height: auto;
  }
  
  > li {
    position: relative;
    
    @include respond-to('md') {
      width: 100%;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    > a {
      display: block;
      padding: 0 $spacing-lg;
      color: $text-white;
      line-height: 50px;
      cursor: pointer;
      
      &:hover,
      &.active {
        color: $primary;
      }
      
      @include respond-to('md') {
        padding: $spacing-md $spacing-lg;
        line-height: 1.5;
      }
    }
    
    &.has-submenu > a::after {
      content: "";
      display: inline-block;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid currentColor;
      margin-left: 8px;
      vertical-align: middle;
      transition: transform 0.3s;
    }
    
    &:hover > a::after,
    &.submenu-open > a::after {
      transform: rotate(180deg);
    }
  }
}

.submenu {
  position: absolute;
  top: 50px;
  left: 0;
  background: $dark-bg;
  min-width: 150px;
  display: none;
  z-index: $z-dropdown;
  
  @include respond-to('md') {
    position: static;
    background: rgba(0, 0, 0, 0.2);
  }
  
  li {
    a {
      display: block;
      padding: $spacing-sm $spacing-lg;
      color: $text-white;
      font-size: $font-size-sm;
      
      &:hover {
        color: $primary;
      }
    }
    
    &:last-child {
      padding-bottom: $spacing-sm;
    }
  }
  
  .has-submenu:hover &,
  .submenu-open & {
    display: block;
  }
}

.search-icon {
  width: 40px;
  height: 40px;
  @include flex-center;
  color: $text-white;
  cursor: pointer;
  transition: $transition-base;
  
  &:hover {
    color: $primary;
  }
}

.mobile-menu-btn {
  display: none;
  width: 30px;
  height: 40px;
  @include flex-center;
  
  @include respond-to('md') {
    display: flex;
  }
}

.nav-icon {
  display: block;
  position: relative;
  width: 24px;
  height: 3px;
  background: $text-white;
  transition: $transition-base;
  
  &::before,
  &::after {
    content: '';
    display: block;
    width: 24px;
    height: 3px;
    position: absolute;
    background: $text-white;
    transition: $transition-base;
  }
  
  &::before {
    top: -8px;
  }
  
  &::after {
    bottom: -8px;
  }
  
  .open & {
    background: transparent;
    
    &::before {
      top: 0;
      transform: rotate(45deg);
    }
    
    &::after {
      bottom: 0;
      transform: rotate(-45deg);
    }
  }
}
</style>
