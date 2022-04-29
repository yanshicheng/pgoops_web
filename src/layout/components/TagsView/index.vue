<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag,$event)"
      >
        {{ tag.title }}
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
    <!--    <el-dropdown @command="handleCommand">-->
    <!--      <span style="cursor: pointer;">-->
    <!--        更多操作-->
    <!--        <i class="el-icon-arrow-down el-icon&#45;&#45;right" />-->
    <!--      </span>-->
    <!--      <el-dropdown-menu slot="dropdown" class="tags-more">-->
    <!--        &lt;!&ndash; <el-dropdown-item command="refreshRoute">-->
    <!--          刷新-->
    <!--        </el-dropdown-item> &ndash;&gt;-->
    <!--        <el-dropdown-item command="closeOthersTags">-->
    <!--          关闭其他-->
    <!--        </el-dropdown-item>-->
    <!--        <el-dropdown-item command="closeLeftTags">-->

    <!--          关闭左侧-->
    <!--        </el-dropdown-item>-->
    <!--        <el-dropdown-item command="closeRightTags">-->

    <!--          关闭右侧-->
    <!--        </el-dropdown-item>-->
    <!--        <el-dropdown-item command="closeAllTags">-->

    <!--          关闭全部-->
    <!--        </el-dropdown-item>-->
    <!--      </el-dropdown-menu>-->
    <!--    </el-dropdown>-->
  </div>
</template>

<script>
import ScrollPane from './ScrollPane'
import path from 'path'
import { mapGetters } from 'vuex'
export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    }
  },
  computed: {
    ...mapGetters({
      visitedViews: 'tagsView/visitedViews',
      routes: 'routes/routes'
    }),
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    routes() {
      return this.$store.state.permission.routes
    }
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    async closeAllTags() {
      const view = await this.toThisTag()
      const { visitedViews } = await this.$store.dispatch(
        'tagsView/delAllRoutes'
      )
      if (this.affixTags.some((tag) => tag.path === view.path)) {
        return
      }
      this.toLastTag(visitedViews, view)
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 10// 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY - 60
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    },
    handleScroll() {
      this.closeMenu()
    },
    handleCommand(command) {
      switch (command) {
        case 'refreshRoute':
          this.refreshRoute()
          break
        case 'closeOthersTags':
          this.closeOthersTagss()
          break
        case 'closeLeftTags':
          this.closeLeftTags()
          break
        case 'closeRightTags':
          this.closeRightTags()
          break
        case 'closeAllTags':
          this.closeAllTags()
          break
      }
    },
    async refreshRoute() {
      this.$baseEventBus.$emit('reloadRouterView')
    },
    // async closeSelectedTag(view) {
    //   const { visitedViews } = await this.$store.dispatch(
    //     'tagsView/delRoute',
    //     view
    //   )
    //   if (this.isActive(view)) {
    //     this.toLastTag(visitedViews, view)
    //   }
    // },
    async closeOthersTagss() {
      const view = await this.toThisTag()
      await this.$store.dispatch('tagsView/delOthersRoutes', view)
    },
    async closeLeftTags() {
      const view = await this.toThisTag()
      await this.$store.dispatch('tagsView/delLeftRoutes', view)
    },
    async closeRightTags() {
      const view = await this.toThisTag()
      await this.$store.dispatch('tagsView/delRightRoutes', view)
    },
    toLastTag(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView)
      } else {
        this.$router.push('/')
      }
    },
    async toThisTag() {
      const view = this.visitedViews.filter((item, index) => {
        if (item.path === this.$route.fullPath) {
          return item
        }
      })[0]
      if (this.$route.path !== view.path) this.$router.push(view)
      return view
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  //border: 1px solid #ebebeb;
  //border-radius: 3px;
  //transition: .2s;
  //background-color: #fff;
  //  position: relative;
    box-sizing: border-box;
    //display: flex;
    //align-content: center;
    //align-items: center;
    justify-content: space-between;
    height: 40px;
    padding-right: -100px;
    //padding-left: 20px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background: #fff;
    border-top: 1px solid #f6f6f6;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      padding: 0 20px;
      height: 40px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 40px;
      display: inline-block;
      list-style: none;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      position: relative;
      //box-sizing: border-box;
      //height: 30px;
      //margin-right: 5px;
      //line-height: 20px;
      border: none;
      border-left: 1px solid #f4f4f4;
      //padding-right: 20px;
      //padding: 0 8px;
      //border-bottom-color: #fff;
      border-bottom: 1px solid transparent;
      transition: color .3s cubic-bezier(.645,.045,.355,1),padding .3s cubic-bezier(.645,.045,.355,1);

    //border-radius: 2px;

      //display: inline-block;
      //position: relative;
      cursor: pointer;
      min-width: 70px;
      text-align:center;
      //background-color: #ddd;
      //background-color: #ddd;
      background-clip: padding-box;
      min-height: 28px;
      border-radius: 4px;
      //color: #495060;
      background-color: #ffffff;
      //background: #fff;

      //font-size: 12px;
      //margin-left: 3px;
      //margin-top: 9px;
      &:first-of-type {
        //margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        color: #1890ff;
        background-color: #409EFF14;
        //color: #1890ff;
        //border-color: #1890ff;
        &::before {
          color: #1890ff;
          //color: #eaeaea;
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          //margin-right: 2px;
        }
		&:hover{
      color: #1890ff;
		}
      }
      &:hover {

        color: #1890ff;
        border-color: #1890ff;

      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }

}
.el-dropdown {
    width: 90px;
    display: inline-block;
    position: relative;
    color: #606266;
    font-size: 14px;
	.tags-bar-container {
		position: relative;
		box-sizing: border-box;
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: space-between;
		height: 55px;
		padding-right: 20px;
		padding-left: 20px;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		background: #fff;
		border-top: 1px solid #f6f6f6;
	}
  }
</style>

