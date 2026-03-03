<script setup lang="ts">
import { ref } from 'vue'

const showContact = ref(false)

const info = {
  name: '梁前扬',
  title: '高级后端开发工程师（PHP / Golang）',
  tags: ['9年开发经验', '📍 安徽·合肥', '本科', '全职'],
  summary: '9年互联网全栈开发经验，精通PHP，熟练掌握Golang，了解Java。擅长高并发系统设计与性能优化，主导过大型ERP系统、SaaS商城、微服务架构落地等多类核心项目，具备从0到1的完整系统搭建与团队管理能力。深度实践MySQL调优、Redis缓存策略、Kafka消息队列、Elasticsearch搜索引擎等中间件技术；熟悉Docker/K8s容器化部署与CI/CD流程；拥有丰富的Go-Zero微服务架构经验及Vue前后端分离开发经验。具备优秀的技术攻关能力与跨团队协作经验，适应快速迭代的互联网研发节奏。',
  contact: {
    phone: '18155371631',
    email: '543492227@qq.com',
    github: 'https://github.com/liangqianyang',
    blog: 'https://lqy-comic.com'
  }
}

const skills = [
  { name: 'PHP', level: 92, tag: '精通', desc: 'ThinkPHP / Laravel / Yii，8年+深度使用' },
  { name: 'Golang', level: 86, tag: '熟练', desc: 'Go-Zero微服务架构，3年+项目经验' },
  { name: 'MySQL / Redis', level: 90, tag: '熟练', desc: '慢查询优化、索引设计、缓存策略' },
  { name: 'Go-Zero 微服务', level: 83, tag: '熟练', desc: '服务拆分、RPC通信、服务治理' },
  { name: 'Kafka / MQ', level: 80, tag: '熟练', desc: '异步解耦、削峰填谷、消息可靠投递' },
  { name: 'Vue / 前端', level: 82, tag: '熟练', desc: 'Vue + ElementUI，前后端分离开发' },
  { name: 'Docker / K8s / Linux', level: 74, tag: '了解', desc: '容器化部署、集群编排、CI/CD' },
  { name: 'Java / Spring', level: 65, tag: '了解', desc: 'Spring MVC / Hibernate，有项目经验' }
]

const experiences = [
  {
    period: '2025.05 - 至今',
    company: '合肥元算点安全技术服务有限公司',
    role: '技术组长 · PHP',
    industry: '在线教育',
    description: '担任技术组长，全面负责团队日常开发管理及系统稳定运营，主导在线教育业务系统的迭代优化与技术攻关。',
    highlights: [
      '主持月度需求评审与技术方案设计，合理分配开发任务，确保版本按时高质量上线',
      '主导日志系统建设，实现异常实时监控与告警，系统故障响应效率大幅提升',
      '主导搭建内部数据中心，整合多业务线数据资源，统一数据标准与存储规范，为后续数据驱动决策奠定基础',
      '设计并开发开放平台，将平台核心数据能力以标准API形式开放给第三方机构，支撑课程收费等商业化场景的数据对接，推动业务生态持续扩展',
      '系统化梳理并解决历史遗留Bug，显著提升系统稳定性与用户体验'
    ]
  },
  {
    period: '2021.11 - 2025.05',
    company: '云汉芯城（上海）互联网科技股份有限公司',
    role: 'Golang 后端开发工程师',
    industry: '电子/半导体 · 500-1000人',
    description: '主要承担核心ERP系统（云策）及SaaS商城（芯晶采）的后端研发，以Golang重构关键业务模块，深度参与微服务架构落地。',
    highlights: [
      '主导ERP销售模块Golang重构，引入索引优化与缓存策略，慢查询减少30%，QPS提升35%',
      '负责SaaS商城订单模块与授信额度模块设计，支撑月均5万+订单稳定处理',
      '基于Go-Zero完成订单核心状态机设计，结合Kafka异步解耦，核心链路响应时间压缩至200ms内',
      '推动自营备货管理系统从0到1落地，借助大数据能力实现智能备货推荐，作为项目负责人协调多方资源按期交付'
    ]
  },
  {
    period: '2020.07 - 2021.07',
    company: '上海远播教育科技集团股份有限公司',
    role: 'PHP 后端开发工程师',
    industry: '教育培训 · 已上市',
    description: '负责教育培训事业部学习中心ERP系统的功能迭代与维护，系统覆盖学生、财务、排课、教学等多个核心业务模块。',
    highlights: [
      '基于Laravel 5.5 + PolarDB + Redis + Kafka 构建高可用ERP系统',
      '独立完成PC端管理后台与家长/教师移动端的核心模块迭代开发',
      '对接微信推送能力，实现上课提醒、课堂反馈等消息通知，提升家校互动效率'
    ]
  },
  {
    period: '2019.05 - 2020.07',
    company: '上海熠升网络科技有限公司',
    role: 'PHP 开发工程师',
    industry: '电商',
    description: '独立负责百步生活电商平台的全栈迭代开发与系统维护，覆盖PC端、移动端及微信公众号多端场景。',
    highlights: [
      '重构遗留订单模块数据库结构，优化慢查询15+项，API响应时间从800ms降至200ms，系统稳定性提升30%',
      '引入阿里OSS静态资源加速方案，有效降低服务器压力，并发处理能力提升2倍',
      '负责日均UV 2000+ 的电商平台日常运维与功能迭代，保障平台持续稳定运营'
    ]
  },
  {
    period: '2018.05 - 2019.05',
    company: '上海榕智市场营销策划股份有限公司',
    role: 'PHP 开发工程师',
    industry: '广告营销 · 已上市',
    description: '主导微信生态开发矩阵建设，服务兰芝、青岛啤酒等多个品牌客户的差异化运营需求。',
    highlights: [
      '基于OAuth2.0构建多公众号统一授权中心，日均处理用户授权请求10万+',
      '开发微信卡券核销自动化系统（OCR识别），卡券核销率提升37%，人工审核成本降低60%',
      '封装H5营销组件库（抽奖/预约/裂变分享），复用率达85%，平均活动开发周期缩短40%'
    ]
  },
  {
    period: '2017.09 - 2018.05',
    company: '上海美橙科技信息发展有限公司',
    role: 'PHP 开发工程师',
    industry: '互联网 · 500-1000人',
    description: '独立评估项目需求、设计数据库架构并完成企业官网、微信商城等多类项目的全栈开发交付。',
    highlights: [
      '独立完成企业官网、微信商城、民宿定制开发等多类项目全流程交付',
      '参与客户需求沟通与项目评估，积累微信生态开发与数据库设计实战经验',
      '开发社体连线平台（多角色体系 + 多支付渠道 + 财务报表）'
    ]
  },
  {
    period: '2016.03 - 2017.06',
    company: '上海雅宽信息科技有限公司',
    role: '软件工程师',
    industry: '软件服务',
    description: '参与多个企业级系统开发，涉及Java、C#、PHP多语言技术栈，积累扎实工程实践经验。',
    highlights: [
      '参与厦门航空掌上乘务系统开发（C# + Oracle），服务于乘务部门日常管理',
      '独立负责东城渠道销售系统开发（Java + MiniUI + Oracle），管理经销商与分销商业务',
      '参与浦东新区企业家创新领导力平台（Java + Hibernate + Oracle）'
    ]
  }
]

const coreProjects = [
  {
    name: '芯晶采 SaaS 商城系统',
    period: '2024.08 - 2025.05',
    company: '云汉芯城',
    tag: '核心项目',
    role: '后端核心开发',
    tech: 'Golang · Go-Zero · Kafka · Redis · MySQL',
    highlights: [
      '定制化B2B电商SaaS平台，为大客户提供精准物料推荐与替代方案',
      '主导订单模块与授信额度模块架构设计，支撑月均5万+订单处理',
      '基于Kafka实现异步消息解耦，核心链路响应时间≤200ms',
      '设计订单状态机，保障复杂业务流转的数据一致性'
    ]
  },
  {
    name: '云策 ERP 系统',
    period: '2021.11 - 2025.05',
    company: '云汉芯城',
    tag: '长期维护',
    role: '销售模块负责人',
    tech: 'PHP · Golang · Go-Zero · Kafka · Redis · Yii',
    highlights: [
      '覆盖销售、会员、物流、资金流等全业务域的大型ERP平台',
      '完成Golang核心重构，慢查询减少30%，QPS提升35%',
      '推动微服务架构（Go-Zero）落地，负责系统异常巡检与需求迭代',
      '逐步梳理Legacy代码，制定重构计划并稳步推进'
    ]
  },
  {
    name: '在线100分教育平台',
    period: '2025.05 - 至今',
    company: '合肥元算点',
    tag: '团队管理',
    role: '技术组长',
    tech: 'PHP · MySQL · Redis',
    highlights: [
      '在线教育SaaS平台，担任技术组长统筹团队开发管理',
      '主导日志系统与数据中心建设，搭建开放平台支撑第三方数据对接',
      '实现异常实时监控与告警，系统故障响应效率大幅提升',
      '系统化治理技术债务，平台稳定性显著提升'
    ]
  },
  {
    name: '自营备货管理系统',
    period: '2023.06 - 2023.08',
    company: '云汉芯城',
    tag: '从0到1',
    role: '项目负责人',
    tech: 'Golang · Go-Zero · Kafka · Redis · MySQL',
    highlights: [
      '基于大数据驱动的智能备货平台，自动推送待备货型号',
      '涵盖备货计划、询价、参考信息等核心模块',
      '作为项目负责人协调产品/测试/研发资源，按期高质量交付',
      '借助历史数据构建智能推荐，提升备货准确率'
    ]
  },
  {
    name: '学习中心 ERP 系统',
    period: '2020.07 - 2021.07',
    company: '远播教育',
    tag: '核心项目',
    role: '后端核心开发',
    tech: 'PHP · Laravel · PolarDB · Redis · Kafka',
    highlights: [
      '教育培训ERP系统，覆盖学生管理、财务、排课、教学等模块',
      '独立完成PC端后台 + 家长端/教师端移动端核心功能',
      '对接微信推送实现上课提醒与课堂反馈通知',
      '系统分PC端与手机端，家长端支持课程表、评价、考试信息查看'
    ]
  }
]

const otherProjects = [
  {
    name: '百步生活商城',
    period: '2019.05 - 2020.07',
    tech: 'PHP · ECMall · MySQL · Redis · 阿里OSS',
    description: '电商系统，覆盖PC/移动/公众号多端。重构订单模块，优化慢查询15+项，API响应800ms→200ms，引入OSS加速并发提升2倍。'
  },
  {
    name: 'H5营销开发矩阵',
    period: '2018.05 - 2019.05',
    tech: 'PHP · ThinkPHP · MySQL · Redis · 微信API',
    description: '服务兰芝、青岛啤酒等品牌客户，封装H5营销组件库（抽奖/预约/裂变），复用率85%，开发周期缩短40%。'
  },
  {
    name: '社体连线平台',
    period: '2017.09 - 2018.03',
    tech: 'PHP · ThinkPHP · MySQL · Redis · 支付宝/微信支付',
    description: '体育赛事信息综合平台，含四角色体系，集成多种支付渠道与财务报表系统。'
  },
  {
    name: '国健医疗微信商城',
    period: '2018.02 - 2018.03',
    tech: 'PHP · ThinkPHP · SQL Server · 微信支付',
    description: '医疗器械微信商城，对接药神系统数据库获取商品，实现公众号自动登录与微信支付。'
  },
  {
    name: '兴趣班小程序 + 公众号',
    period: '2018.03 - 2018.05',
    tech: 'PHP · ThinkPHP · MySQL · 微信小程序',
    description: '与兴趣班App数据对接，实现找老师、找机构、附近搜索、课程购买等核心功能。'
  },
  {
    name: '厦门航空掌上乘务系统',
    period: '2016.10 - 2017.03',
    tech: 'C# · Oracle · Visual Studio',
    description: '服务厦门航空乘务部门，涵盖百分制信息、航班准备、网上考试等功能模块。'
  },
  {
    name: '东城渠道销售系统',
    period: '2016.06 - 2016.10',
    tech: 'Java · MiniUI · Oracle',
    description: '经销商与分销商关系管理，含下单管理、订单统计、返利计算及多维报表。'
  },
  {
    name: '供应链管理系统',
    period: '2016.03 - 2016.06',
    tech: 'Java · Spring MVC · Hibernate · Oracle',
    description: '供应链信息化服务系统，负责系统管理、供应商信息、商户品牌与类别管理等模块。'
  }
]

const education = {
  period: '2012.09 - 2016.07',
  school: '安徽师范大学皖江学院',
  major: '信息管理与信息系统（本科·全日制）',
  desc: '主修信息技术与管理科学交叉方向，系统学习数据库原理、软件工程、程序设计等课程，为后续全栈开发工作奠定扎实理论基础。'
}
</script>

<template>
  <article class="resume-page">
    <div class="resume-container">
      <!-- 页面标题 -->
      <header class="resume-header">
        <div class="header-left">
          <h1>{{ info.name }}</h1>
          <p class="title">{{ info.title }}</p>
          <div class="meta-tags">
            <span class="meta-tag" v-for="tag in info.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
        <div class="header-right">
          <button class="contact-btn" @click="showContact = !showContact">
            <span v-if="!showContact">📬 查看联系方式</span>
            <span v-else>🔒 收起</span>
          </button>
          <Transition name="fade">
            <div class="contact-info" v-if="showContact">
              <p>📱 <strong>手机：</strong>{{ info.contact.phone }}</p>
              <p>📧 <strong>邮箱：</strong>{{ info.contact.email }}</p>
              <p>🐟 <strong>GitHub：</strong><a :href="info.contact.github" target="_blank">{{ info.contact.github }}</a></p>
              <p>🌐 <strong>博客：</strong><a :href="info.contact.blog" target="_blank">{{ info.contact.blog }}</a></p>
            </div>
          </Transition>
        </div>
      </header>

      <!-- 个人优势 -->
      <section class="resume-section summary-section">
        <h2 class="section-title"><i class="icon">👤</i> 个人优势</h2>
        <p class="summary-text">{{ info.summary }}</p>
      </section>

      <!-- 技能 -->
      <section class="resume-section">
        <h2 class="section-title"><i class="icon">🛠</i> 专业技能</h2>
        <div class="skills-grid">
          <div class="skill-item" v-for="skill in skills" :key="skill.name">
            <div class="skill-header">
              <span class="skill-name">{{ skill.name }} <em class="skill-tag" :class="skill.tag">{{ skill.tag }}</em></span>
              <span class="skill-level">{{ skill.level }}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-fill" :style="{ width: skill.level + '%' }"></div>
            </div>
            <p class="skill-desc">{{ skill.desc }}</p>
          </div>
        </div>
      </section>

      <!-- 工作经历 -->
      <section class="resume-section">
        <h2 class="section-title"><i class="icon">💼</i> 工作经历</h2>
        <div class="timeline">
          <div class="timeline-item" v-for="(exp, i) in experiences" :key="i">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="exp-header">
                <div class="exp-title-row">
                  <h3>{{ exp.role }}</h3>
                  <span class="industry-tag" v-if="exp.industry">{{ exp.industry }}</span>
                </div>
                <span class="period">{{ exp.period }}</span>
              </div>
              <p class="company">{{ exp.company }}</p>
              <p class="description">{{ exp.description }}</p>
              <ul class="highlights">
                <li v-for="(h, j) in exp.highlights" :key="j">{{ h }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 核心项目经验 -->
      <section class="resume-section">
        <h2 class="section-title"><i class="icon">🚀</i> 核心项目经验</h2>
        <div class="core-projects">
          <div class="core-project-card" v-for="(proj, i) in coreProjects" :key="i">
            <div class="proj-header">
              <div class="proj-title-row">
                <h3>{{ proj.name }}</h3>
                <span class="proj-tag core">{{ proj.tag }}</span>
              </div>
              <span class="proj-period">{{ proj.period }} · {{ proj.company }}</span>
            </div>
            <div class="proj-meta">
              <span class="proj-role">👤 {{ proj.role }}</span>
              <span class="tech-stack">⚙️ {{ proj.tech }}</span>
            </div>
            <ul class="proj-highlights">
              <li v-for="(h, j) in proj.highlights" :key="j">{{ h }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 其他项目经验 -->
      <section class="resume-section">
        <h2 class="section-title"><i class="icon">📂</i> 其他项目经验</h2>
        <div class="other-projects">
          <div class="other-project-item" v-for="(proj, i) in otherProjects" :key="i">
            <div class="other-proj-header">
              <h4>{{ proj.name }}</h4>
              <span class="other-proj-period">{{ proj.period }}</span>
            </div>
            <span class="other-tech-stack">{{ proj.tech }}</span>
            <p class="other-proj-desc">{{ proj.description }}</p>
          </div>
        </div>
      </section>

      <!-- 教育背景 -->
      <section class="resume-section">
        <h2 class="section-title"><i class="icon">🎓</i> 教育背景</h2>
        <div class="education-item">
          <div class="edu-header">
            <h3>{{ education.school }}</h3>
            <span class="period">{{ education.period }}</span>
          </div>
          <p class="edu-major">{{ education.major }}</p>
          <p class="edu-desc">{{ education.desc }}</p>
        </div>
      </section>

      <!-- 页脚 -->
      <footer class="resume-footer">
        <p>感谢您的阅读，诚待优质机会，期待与您进一步交流 🍁</p>
        <p class="footer-hint">可通过上方联系方式与我取得联系</p>
      </footer>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.resume-page {
  max-width: 900px;
  margin: 30px auto;
  padding: 0 20px;
}

.resume-container {
  background: $white-bg;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  overflow: hidden;
}

// Header
.resume-header {
  background: linear-gradient(135deg, #1c2327 0%, #2d3a40 100%);
  color: $text-white;
  padding: 50px 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;

  h1 {
    font-size: 36px;
    margin-bottom: 8px;
    font-weight: 700;
    letter-spacing: 2px;
  }

  .title {
    font-size: 18px;
    color: $primary;
    margin-bottom: 6px;
    font-weight: 500;
  }

  .motto {
    font-size: 14px;
    opacity: 0.7;
  }
}

.meta-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.meta-tag {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 3px 12px;
  border-radius: 12px;
}

.contact-btn {
  background: rgba(255, 255, 255, 0.12);
  color: $text-white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: $transition-base;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.contact-info {
  margin-top: 12px;
  font-size: 13px;
  line-height: 1.8;

  a {
    color: $primary;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

// Summary
.summary-section {
  background: linear-gradient(135deg, rgba($primary, 0.04), rgba($primary, 0.01));
  border-left: 3px solid $primary;
}

.summary-text {
  font-size: 14px;
  color: $text-secondary;
  line-height: 1.9;
}

// Sections
.resume-section {
  padding: 36px 40px;
  border-bottom: 1px solid $border-color;

  &:last-of-type {
    border-bottom: none;
  }
}

.section-title {
  font-size: 20px;
  color: $text-primary;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;

  .icon {
    font-style: normal;
    font-size: 22px;
  }

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, $border-color, transparent);
    margin-left: 12px;
  }
}

// Skills
.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px 30px;
}

.skill-item {
  .skill-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .skill-name {
    font-size: 14px;
    color: $text-primary;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;

    .skill-tag {
      font-style: normal;
      font-size: 11px;
      padding: 1px 7px;
      border-radius: 8px;
      font-weight: 400;

      &.精通 { background: rgba(#e74c3c, 0.1); color: #e74c3c; }
      &.熟练 { background: rgba($primary, 0.1); color: $primary; }
      &.了解 { background: rgba($text-muted, 0.12); color: $text-muted; }
    }
  }

  .skill-level {
    font-size: 12px;
    color: $text-muted;
  }
}

.skill-bar {
  height: 6px;
  background: $light-bg;
  border-radius: 3px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, $primary, $primary-light);
  border-radius: 3px;
  transition: width 1s ease;
}

.skill-desc {
  font-size: 12px;
  color: $text-muted;
  margin-top: 4px;
}

// Timeline
.timeline {
  position: relative;
  padding-left: 24px;

  &::before {
    content: '';
    position: absolute;
    left: 5px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: $border-color;
  }
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
}

.timeline-dot {
  position: absolute;
  left: -24px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: $primary;
  border: 2px solid $white-bg;
  box-shadow: 0 0 0 2px $primary;
}

.timeline-content {
  background: $light-bg;
  padding: 20px 24px;
  border-radius: $radius-md;
  transition: $transition-base;

  &:hover {
    box-shadow: $shadow-md;
  }
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;

  h3 {
    font-size: 16px;
    color: $text-primary;
    font-weight: 600;
  }
}

.exp-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.industry-tag {
  font-size: 11px;
  color: $text-muted;
  background: rgba($text-muted, 0.1);
  padding: 2px 8px;
  border-radius: 8px;
  white-space: nowrap;
}

.period {
  font-size: 13px;
  color: $text-muted;
  background: rgba($primary, 0.1);
  padding: 2px 10px;
  border-radius: 10px;
  white-space: nowrap;
}

.company {
  font-size: 14px;
  color: $primary-dark;
  margin-bottom: 8px;
  font-weight: 500;
}

.description {
  font-size: 14px;
  color: $text-secondary;
  line-height: 1.6;
  margin-bottom: 10px;
}

.highlights {
  padding-left: 18px;

  li {
    font-size: 13px;
    color: $text-secondary;
    line-height: 1.8;
    list-style: disc;

    &::marker {
      color: $primary;
    }
  }
}

// Core Projects
.core-projects {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.core-project-card {
  border: 1px solid $border-color;
  border-radius: $radius-md;
  padding: 22px 24px;
  transition: $transition-base;
  border-left: 3px solid $primary;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-1px);
  }

  .proj-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
  }

  .proj-title-row {
    display: flex;
    align-items: center;
    gap: 8px;

    h3 {
      font-size: 16px;
      color: $text-primary;
      font-weight: 600;
    }
  }

  .proj-tag.core {
    font-size: 11px;
    background: rgba($primary, 0.1);
    color: $primary;
    padding: 2px 8px;
    border-radius: 8px;
    white-space: nowrap;
  }

  .proj-period {
    font-size: 12px;
    color: $text-muted;
  }

  .proj-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 12px;
  }

  .proj-role {
    font-size: 12px;
    color: $primary-dark;
    font-weight: 500;
  }

  .tech-stack {
    font-size: 12px;
    color: $primary;
  }

  .proj-highlights {
    padding-left: 18px;

    li {
      font-size: 13px;
      color: $text-secondary;
      line-height: 1.8;
      list-style: disc;

      &::marker {
        color: $primary;
      }
    }
  }
}

// Other Projects
.other-projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.other-project-item {
  border: 1px solid $border-color;
  border-radius: $radius-md;
  padding: 16px 20px;
  transition: $transition-base;

  &:hover {
    border-color: rgba($primary, 0.3);
    box-shadow: $shadow-sm;
  }

  .other-proj-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;

    h4 {
      font-size: 14px;
      color: $text-primary;
      font-weight: 600;
    }
  }

  .other-proj-period {
    font-size: 11px;
    color: $text-muted;
    white-space: nowrap;
  }

  .other-tech-stack {
    display: inline-block;
    font-size: 11px;
    color: $primary;
    background: rgba($primary, 0.06);
    padding: 2px 8px;
    border-radius: 8px;
    margin-bottom: 8px;
  }

  .other-proj-desc {
    font-size: 12px;
    color: $text-secondary;
    line-height: 1.7;
  }
}

// Education
.education-item {
  .edu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 6px;

    h3 {
      font-size: 16px;
      color: $text-primary;
      font-weight: 600;
    }
  }

  p {
    font-size: 14px;
    color: $text-secondary;
  }

  .edu-major {
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 4px;
  }

  .edu-desc {
    font-size: 13px;
    color: $text-muted;
    line-height: 1.7;
  }
}

// Footer
.resume-footer {
  text-align: center;
  padding: 30px;
  color: $text-muted;
  font-size: 14px;
  border-top: 1px solid $border-color;

  p + p {
    margin-top: 4px;
  }

  .footer-hint {
    font-size: 12px;
    opacity: 0.7;
  }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Responsive
@media (max-width: $breakpoint-md) {
  .resume-page {
    margin: 15px auto;
    padding: 0 10px;
  }

  .resume-header {
    padding: 30px 20px;
    flex-direction: column;

    h1 {
      font-size: 28px;
    }
  }

  .resume-section {
    padding: 24px 20px;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .exp-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .other-projects {
    grid-template-columns: 1fr;
  }

  .core-project-card .proj-header {
    flex-direction: column;
  }
}
</style>
