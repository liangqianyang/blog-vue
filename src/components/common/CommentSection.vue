<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { commentApi } from '@/api'
import type { Comment } from '@/types'

const props = defineProps<{
  articleId: number | string
}>()

const comments = ref<Comment[]>([])
const loading = ref(false)
const submitting = ref(false)

// 评论表单
const form = ref({
  content: '',
  nickname: '',
  email: ''
})

// 回复状态
const replyTarget = ref<{
  parentId: number     // 根评论 ID（用于 parent_id）
  replyToId: number    // 被回复的评论 ID
  replyToNickname: string
} | null>(null)

// 加载评论列表
const loadComments = async () => {
  loading.value = true
  try {
    comments.value = await commentApi.getComments(props.articleId)
  } catch (error) {
    console.error('加载评论失败:', error)
  } finally {
    loading.value = false
  }
}

// 回复评论
const handleReply = (comment: Comment) => {
  // 如果是顶级评论（parent_id === 0），parentId 就是自身
  // 如果是回复，parentId 是其 root_id 或 parent_id
  const parentId = comment.parent_id === 0 ? comment.id : (comment.root_id || comment.parent_id)
  
  replyTarget.value = {
    parentId,
    replyToId: comment.id,
    replyToNickname: comment.nickname
  }
  
  // 滚动到评论表单
  const formEl = document.querySelector('.comment-form')
  formEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

// 取消回复
const cancelReply = () => {
  replyTarget.value = null
}

// 提交评论
const submitComment = async () => {
  if (!form.value.content.trim()) {
    alert('请输入评论内容')
    return
  }
  if (!form.value.nickname.trim()) {
    alert('请输入昵称')
    return
  }

  submitting.value = true
  try {
    await commentApi.createComment(props.articleId, {
      content: form.value.content,
      nickname: form.value.nickname,
      email: form.value.email || undefined,
      parent_id: replyTarget.value?.parentId,
      reply_to_id: replyTarget.value?.replyToId
    })
    // 清空表单
    form.value.content = ''
    replyTarget.value = null
    // 重新加载评论
    await loadComments()
  } catch (error) {
    console.error('评论提交失败:', error)
    alert('评论提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 生成卡通头像 URL（基于昵称）
const getAvatar = (nickname: string, avatar?: string) => {
  if (avatar && !avatar.includes('avatar.jpg')) return avatar
  // 使用 DiceBear 的 adventurer-neutral 风格生成卡通头像
  return `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(nickname)}`
}

// 格式化时间
const formatTime = (time: string) => {
  if (!time) return ''
  const date = new Date(time)
  if (isNaN(date.getTime())) return time
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

onMounted(() => {
  loadComments()
})

watch(() => props.articleId, () => {
  loadComments()
})
</script>

<template>
  <div class="comment-section">
    <h3 class="comment-title">
      评论
      <span class="comment-count" v-if="comments.length">({{ comments.length }})</span>
    </h3>

    <!-- 评论表单 -->
    <div class="comment-form">
      <div class="reply-hint" v-if="replyTarget">
        回复 <strong>{{ replyTarget.replyToNickname }}</strong>
        <a href="javascript:;" class="cancel-reply" @click="cancelReply">取消回复</a>
      </div>
      <div class="form-row">
        <div class="form-item">
          <input
            v-model="form.nickname"
            type="text"
            placeholder="昵称 *"
            class="form-input"
            maxlength="20"
          />
        </div>
        <div class="form-item">
          <input
            v-model="form.email"
            type="email"
            placeholder="邮箱（选填）"
            class="form-input"
            maxlength="50"
          />
        </div>
      </div>
      <div class="form-item">
        <textarea
          v-model="form.content"
          :placeholder="replyTarget ? `回复 ${replyTarget.replyToNickname}...` : '写下你的评论...'"
          class="form-textarea"
          rows="4"
          maxlength="500"
        ></textarea>
      </div>
      <div class="form-actions">
        <button
          class="submit-btn"
          @click="submitComment"
          :disabled="submitting"
        >
          {{ submitting ? '提交中...' : '发表评论' }}
        </button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div v-if="loading" class="comment-loading">加载评论中...</div>
    <div v-else-if="comments.length === 0" class="comment-empty">暂无评论，快来抢沙发吧~</div>
    <div v-else class="comment-list">
      <div class="comment-item" v-for="comment in comments" :key="comment.id">
        <!-- 顶级评论 -->
        <div class="comment-main">
          <div class="comment-avatar">
            <img :src="getAvatar(comment.nickname, comment.avatar)" :alt="comment.nickname" />
          </div>
          <div class="comment-body">
            <div class="comment-meta">
              <span class="comment-nickname">{{ comment.nickname }}</span>
              <span class="comment-time">{{ formatTime(comment.created_at) }}</span>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
            <div class="comment-actions">
              <a href="javascript:;" class="reply-btn" @click="handleReply(comment)">回复</a>
            </div>
          </div>
        </div>

        <!-- 嵌套回复列表 -->
        <div class="comment-children" v-if="comment.replies && comment.replies.length">
          <div class="comment-child-item" v-for="reply in comment.replies" :key="reply.id">
            <div class="comment-avatar small">
              <img :src="getAvatar(reply.nickname, reply.avatar)" :alt="reply.nickname" />
            </div>
            <div class="comment-body">
              <div class="comment-meta">
                <span class="comment-nickname" :class="{ 'is-admin': reply.is_admin_reply }">{{ reply.nickname }}</span>
                <span class="admin-badge" v-if="reply.is_admin_reply">站长</span>
                <span class="reply-to" v-if="reply.reply_to">
                  回复 <strong>{{ reply.reply_to.nickname }}</strong>
                </span>
                <span class="comment-time">{{ formatTime(reply.created_at) }}</span>
              </div>
              <div class="comment-content">{{ reply.content }}</div>
              <div class="comment-actions">
                <a href="javascript:;" class="reply-btn" @click="handleReply(reply)">回复</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.comment-section {
  margin-top: $spacing-lg;
}

.comment-title {
  font-size: 18px;
  font-weight: bold;
  padding-bottom: $spacing-sm;
  border-bottom: 2px solid $primary;
  margin-bottom: $spacing-lg;

  .comment-count {
    font-size: $font-size-sm;
    color: $text-muted;
    font-weight: normal;
  }
}

// 评论表单
.comment-form {
  background: $light-bg;
  padding: $spacing-lg;
  border-radius: $radius-md;
  margin-bottom: $spacing-xl;

  .reply-hint {
    padding: $spacing-sm $spacing-md;
    background: #fff;
    border-left: 3px solid $primary;
    margin-bottom: $spacing-md;
    font-size: $font-size-sm;
    color: $text-secondary;

    strong {
      color: $primary;
    }

    .cancel-reply {
      margin-left: $spacing-sm;
      color: $text-muted;
      font-size: $font-size-xs;

      &:hover {
        color: $danger;
      }
    }
  }

  .form-row {
    display: flex;
    gap: $spacing-md;
    margin-bottom: $spacing-md;

    .form-item {
      flex: 1;
    }
  }

  .form-input {
    width: 100%;
    padding: $spacing-sm $spacing-md;
    border: 1px solid $border-color;
    border-radius: $radius-sm;
    font-size: $font-size-sm;
    outline: none;
    transition: border-color 0.3s;
    box-sizing: border-box;

    &:focus {
      border-color: $primary;
    }
  }

  .form-textarea {
    width: 100%;
    padding: $spacing-sm $spacing-md;
    border: 1px solid $border-color;
    border-radius: $radius-sm;
    font-size: $font-size-sm;
    outline: none;
    resize: vertical;
    font-family: inherit;
    transition: border-color 0.3s;
    box-sizing: border-box;
    min-height: 80px;

    &:focus {
      border-color: $primary;
    }
  }

  .form-item {
    margin-bottom: $spacing-md;
  }

  .form-actions {
    text-align: right;
  }

  .submit-btn {
    padding: $spacing-sm $spacing-xl;
    background: $primary;
    color: #fff;
    border: none;
    border-radius: $radius-sm;
    font-size: $font-size-sm;
    cursor: pointer;
    transition: background 0.3s;

    &:hover:not(:disabled) {
      background: $primary-dark;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

// 评论列表
.comment-loading,
.comment-empty {
  text-align: center;
  padding: $spacing-xl 0;
  color: $text-muted;
  font-size: $font-size-sm;
}

.comment-list {
  .comment-item {
    margin-bottom: $spacing-lg;
    padding-bottom: $spacing-lg;
    border-bottom: 1px solid $border-color;

    &:last-child {
      border-bottom: none;
    }
  }
}

.comment-main {
  display: flex;
  gap: $spacing-md;
}

.comment-avatar {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: $radius-full;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &.small {
    width: 32px;
    height: 32px;
  }
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-xs;
  flex-wrap: wrap;

  .comment-nickname {
    font-weight: bold;
    font-size: $font-size-sm;
    color: $text-primary;
  }

  .reply-to {
    font-size: $font-size-xs;
    color: $text-muted;

    strong {
      color: $primary;
      font-weight: normal;
    }
  }

  .comment-time {
    font-size: $font-size-xs;
    color: $text-muted;
  }
}

.comment-content {
  font-size: $font-size-sm;
  line-height: 1.6;
  color: $text-secondary;
  word-break: break-word;
}

.comment-actions {
  margin-top: $spacing-xs;

  .reply-btn {
    font-size: $font-size-xs;
    color: $text-muted;
    transition: color 0.3s;

    &:hover {
      color: $primary;
    }
  }
}

// 子评论
.comment-children {
  margin-left: 56px;
  margin-top: $spacing-md;
  padding: $spacing-md;
  background: $light-bg;
  border-radius: $radius-md;

  .comment-child-item {
    display: flex;
    gap: $spacing-sm;
    padding: $spacing-sm 0;
    border-bottom: 1px dashed $border-color;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    &:first-child {
      padding-top: 0;
    }
  }
}

// 管理员标识
.comment-meta .comment-nickname.is-admin {
  color: $primary;
}

.admin-badge {
  display: inline-block;
  padding: 0 6px;
  font-size: 11px;
  line-height: 18px;
  color: #fff;
  background: $primary;
  border-radius: 3px;
  font-weight: normal;
}

// 响应式
@media (max-width: $breakpoint-md) {
  .comment-form .form-row {
    flex-direction: column;
    gap: 0;
  }

  .comment-children {
    margin-left: $spacing-xl;
    padding: $spacing-sm;
  }
}
</style>
