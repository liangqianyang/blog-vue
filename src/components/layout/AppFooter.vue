<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- 微信二维码 -->
      <div class="wx-box">
        <ul>
          <li>
            <img src="/images/wxgzh.jpg" alt="微信公众号">
            <span>微信公众号</span>
          </li>
          <li>
            <img src="/images/wx.png" alt="我的微信">
            <span>我的微信</span>
          </li>
        </ul>
      </div>
      
      <!-- 站点声明 -->
      <div class="footer-nav">
        <p><b>站点声明：</b></p>
        <p>1、本站个人博客模板，均为杨青青本人设计，个人可以使用，但是未经许可不得用于任何商业目的。</p>
        <p>2、所有文章未经授权禁止转载、摘编、复制或建立镜像，如有违反，追究法律责任。举报邮箱：<a href="mailto:dacesmiling@qq.com">dacesmiling@qq.com</a></p>
        <p>
          Copyright © {{ currentYear }} 
          <a href="http://www.yangqq.com" target="_blank">www.yangqq.com</a> 
          All Rights Reserved. 
          备案号：<a href="http://www.miitbeian.gov.cn/" target="_blank" rel="noopener">蜀ICP备11002373号-1</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.footer {
  background: #373d41;
  width: 100%;
  border-top: 10px solid $primary;
  padding: $spacing-xl 0;
  color: $text-light;
  font-size: $font-size-sm;
}

.footer-content {
  width: $container-width;
  margin: 0 auto;
  @include clearfix;
  
  @include respond-to('xl') {
    width: 100%;
    padding: 0 $spacing-md;
  }
  
  @include respond-to('md') {
    text-align: center;
  }
}

.wx-box {
  float: left;
  margin-right: $spacing-lg;
  
  @include respond-to('md') {
    float: none;
    margin-right: 0;
    margin-bottom: $spacing-lg;
  }
  
  ul {
    display: flex;
    gap: $spacing-lg;
    
    @include respond-to('md') {
      justify-content: center;
    }
  }
  
  li {
    text-align: center;
    
    img {
      height: 100px;
      margin-bottom: $spacing-xs;
    }
    
    span {
      display: block;
      font-size: $font-size-xs;
    }
  }
}

.footer-nav {
  overflow: hidden;
  
  b {
    font-size: $font-size-md;
    color: $primary;
  }
  
  p {
    margin-bottom: $spacing-xs;
    line-height: 1.6;
  }
  
  a {
    color: $text-light;
    
    &:hover {
      color: $primary;
    }
  }
}
</style>
