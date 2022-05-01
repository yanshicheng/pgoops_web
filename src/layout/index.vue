<!--<template>-->
<!--  <div :class="classObj" class="app-wrapper">-->
<!--    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>-->
<!--    <sidebar class="sidebar-container"/>-->
<!--    &lt;!&ndash;    左侧区域&ndash;&gt;-->
<!--    <div :class="{hasTagsView:needTagsView}" class="main-container">-->
<!--      <div :class="{'fixed-header':fixedHeader}">-->
<!--        <navbar/>-->
<!--        &lt;!&ndash;        上面导航区域&ndash;&gt;-->
<!--        <tags-view v-if="needTagsView"/>-->
<!--        &lt;!&ndash;        导航条&ndash;&gt;-->
<!--      </div>-->
<!--      <app-main style="margin-top: 30px; margin-left: 20px;width: 97%;"/>-->
<!--      &lt;!&ndash;      <div class="bottom-info" style="margin-top: 30px">&ndash;&gt;-->
<!--      &lt;!&ndash;        <div>&ndash;&gt;-->
<!--      &lt;!&ndash;          <span>Powered by</span>&ndash;&gt;-->
<!--      &lt;!&ndash;          <span>&ndash;&gt;-->
<!--      &lt;!&ndash;        <a href="https://github.com/flipped-aurora/gin-vue-admin">xxx</a>&ndash;&gt;-->
<!--      &lt;!&ndash;      </span>&ndash;&gt;-->
<!--      &lt;!&ndash;          <el-divider direction="vertical" />&ndash;&gt;-->
<!--      &lt;!&ndash;          <span>Copyright</span>&ndash;&gt;-->
<!--      &lt;!&ndash;          <span>&ndash;&gt;-->
<!--      &lt;!&ndash;        <a href="https://github.com/flipped-aurora">flipped-aurora团队</a>&ndash;&gt;-->
<!--      &lt;!&ndash;      </span>&ndash;&gt;-->
<!--      &lt;!&ndash;        </div>&ndash;&gt;-->
<!--      &lt;!&ndash;      </div>&ndash;&gt;-->
<!--      <div class="bottom-info" style="padding: 16px 0px;bottom: 25px;">-->
<!--        <div>-->
<!--          <a target="_blank" href="http://www.pgoops.com" class="ele-text-secondary" style="margin-left: 5px"> 官网 </a>-->
<!--          <em></em>-->
<!--          <a target="_blank" href="http://www.pgoops.com" class="ele-text-secondary"  style="margin-left: 5px"> 文档 </a>-->
<!--          <em></em>-->
<!--          <a target="_blank" href="https://gitee.com/pgoops/" class="ele-text-secondary"  style="margin-left: 5px"> gitee </a>-->
<!--        </div>-->
<!--        <div class="ele-text-secondary" style="margin-top: 8px;">-->
<!--          <a target="_blank" href="https://beian.miit.gov.cn/#/Integrated/index" class="ele-text-secondary"  style="margin-left: 5px"> 京ICP备16013810号 </a>-->
<!--          Copyright © 2019~2022 pgoops自动化运维平台-->
<!--        </div>-->
<!--      </div>-->
<!--      &lt;!&ndash;      //style="margin: 20px; width: 97%; "&ndash;&gt;-->
<!--      &lt;!&ndash;      内容区域&ndash;&gt;-->
<!--      &lt;!&ndash;      <right-panel v-if="showSettings">&ndash;&gt;-->
<!--      &lt;!&ndash;        <settings />&ndash;&gt;-->
<!--      &lt;!&ndash;      </right-panel>&ndash;&gt;-->

<!--    </div>-->
<!--  </div>-->
<!--</template>-->
<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main style="margin-top: 30px; margin-left: 20px;width: 97%;" />
<!--      <right-panel v-if="showSettings">-->
<!--        <settings />-->
<!--      </right-panel>-->
      <div class="bottom-info" style="padding: 33px 0px;">
        <div>
          <a target="_blank" href="http://www.pgoops.com" class="ele-text-secondary" style="margin-left: 5px"> 官网 </a>
          <em />
          <a target="_blank" href="http://www.pgoops.com" class="ele-text-secondary" style="margin-left: 5px"> 文档 </a>
          <em />
          <a target="_blank" href="https://gitee.com/pgoops/" class="ele-text-secondary" style="margin-left: 5px"> gitee </a>
        </div>
        <div class="ele-text-secondary" style="margin-top: 8px;">
          <a target="_blank" href="https://beian.miit.gov.cn/#/Integrated/index" class="ele-text-secondary" style="margin-left: 5px"> 京ICP备16013810号 </a>
          Copyright © 2019~2022 pgoops自动化运维平台
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import RightPanel from '@/components/RightPanel'
// import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import { AppMain, Navbar, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'

import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    // RightPanel,
    // Settings,
    Sidebar,
    TagsView

  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

.mobile .fixed-header {
  width: 100%;
}

.bottom-info {
  color: #888;
  height: 30px;
  line-height: 12px;

  a {
    color: #888;
  }

  div {
    display: flex;
    justify-content: center;

    span {
      margin: 0 3px;
    }
  }
}
</style>
