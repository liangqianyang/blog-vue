<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { messageApi } from '@/api'
import type { Message } from '@/types'

const messages = ref<Message[]>([])
const loading = ref(false)
const submitting = ref(false)
const page = ref(1)
const total = ref(0)
const hasMore = ref(false)

// 表单数据
const form = ref({
  nickname: '',
  email: '',
  content: ''
})

// 获取留言列表
const loadMessages = async (isLoadMore = false) => {
  if (loading.value) return
  loading.value = true
  try {
    const res = await messageApi.getList({
      page: isLoadMore ? page.value + 1 : 1,
      pageSize: 10
    })
    
    if (isLoadMore) {
      messages.value.push(...res.list)
      page.value += 1
    } else {
      messages.value = res.list
      page.value = 1
    }
    
    total.value = res.total
    hasMore.value = messages.value.length < total.value
  } catch (error) {
    console.error('Failed to load messages:', error)
  } finally {
    loading.value = false
  }
}

// 提交留言
const handleSubmit = async () => {
  if (!form.value.nickname || !form.value.content) {
    alert('请输入昵称和留言内容')
    return
  }
  
  submitting.value = true
  try {
    await messageApi.create(form.value)
    alert('留言提交成功！')
    form.value = { nickname: '', email: '', content: '' }
    loadMessages() // 重新加载列表
  } catch (error) {
    console.error('Failed to submit message:', error)
    alert('留言提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadMessages()
})
</script>

<template>
  <div class="message-board">
    <h2 class="section-subtitle">给我留言</h2>
    
    <!-- 留言表单 -->
    <div class="message-form">
      <div class="form-row">
        <input 
          v-model="form.nickname" 
          type="text" 
          placeholder="您的昵称 *"
          class="form-input"
        >
        <input 
          v-model="form.email" 
          type="email" 
          placeholder="电子邮箱（保密）"
          class="form-input"
        >
      </div>
      <textarea 
        v-model="form.content" 
        placeholder="想对我说点什么..."
        class="form-textarea"
        rows="4"
      ></textarea>
      <div class="form-action">
        <button 
          class="submit-btn" 
          :disabled="submitting"
          @click="handleSubmit"
        >
          {{ submitting ? '提交中...' : '提交留言' }}
        </button>
      </div>
    </div>
    
    <!-- 留言列表 -->
    <div class="message-list">
      <div v-for="msg in messages" :key="msg.id" class="message-item">
        <div class="message-avatar">
          <img :src="msg.avatar || '/images/default-avatar.jpg'" :alt="msg.nickname">
        </div>
        <div class="message-content">
          <div class="message-info">
            <span class="nickname">{{ msg.nickname }}</span>
            <span class="time">{{ msg.createTime }}</span>
          </div>
          <p class="text">{{ msg.content }}</p>
        </div>
      </div>
      
      <!-- 加载更多 -->
      <div v-if="hasMore" class="load-more">
        <button @click="loadMessages(true)" :disabled="loading">
          {{ loading ? '加载中...' : '查看更多留言' }}
        </button>
      </div>
      <div v-else-if="messages.length > 0" class="no-more">
        没有更多留言了
      </div>
      <div v-else class="empty-state">
        还没有留言，快来抢沙发吧！
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.message-board {
  margin-top: $spacing-xl;
  padding-top: $spacing-lg;
  border-top: 1px dashed #eee;
}

.section-subtitle {
  margin: $spacing-lg 0;
  font-size: $font-size-lg;
  background: url('/images/hline.png') no-repeat bottom right;
  width: 120px;
  clear: both;
  background-size: 40px;
  border-bottom: 1px dashed #000;
  padding-left: $spacing-sm;
  padding-bottom: 5px;
  display: inline-block;
}

.message-form {
  margin-bottom: $spacing-xl;
  background: #f9f9f9;
  padding: $spacing-lg;
  border-radius: $radius-sm;
}

.form-row {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
  
  @include respond-to('sm') {
    flex-direction: column;
  }
}

.form-input {
  flex: 1;
  height: 40px;
  padding: 0 $spacing-md;
  border: 1px solid #ddd;
  border-radius: $radius-sm;
  outline: none;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: $primary;
  }
}

.form-textarea {
  width: 100%;
  padding: $spacing-md;
  border: 1px solid #ddd;
  border-radius: $radius-sm;
  outline: none;
  resize: vertical;
  margin-bottom: $spacing-md;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: $primary;
  }
}

.form-action {
  text-align: right;
}

.submit-btn {
  background: #000;
  color: #fff;
  padding: 8px 24px;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.message-list {
  margin-top: $spacing-lg;
}

.message-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
}

.message-avatar {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
}

.message-content {
  flex: 1;
}

.message-info {
  margin-bottom: 5px;
  
  .nickname {
    font-weight: bold;
    margin-right: $spacing-md;
    color: #333;
  }
  
  .time {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

.text {
  line-height: 1.6;
  color: #666;
}

.load-more {
  text-align: center;
  margin-top: $spacing-lg;
  
  button {
    background: #f5f5f5;
    color: #666;
    padding: 8px 20px;
    border-radius: 20px;
    
    &:hover {
      background: #eee;
    }
  }
}

.no-more, .empty-state {
  text-align: center;
  color: $text-secondary;
  padding: $spacing-lg 0;
  font-size: $font-size-sm;
}
</style>