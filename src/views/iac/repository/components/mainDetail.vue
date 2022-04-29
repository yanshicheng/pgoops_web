<template>
  <el-dialog
    title="代码"
    :visible.sync="mainVisible"
    width="50%"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-card class="box-card" style="margin: 10px">
      <div class="text item">
        <!--                <code class="language-yaml " v-html="resultYaml"></code>-->
        <!--          <pre class="language-yaml " style="height: 350px; ">-->
        <!--                <code class="language-yaml  line-highlight line-numbers copy-to-clipboard" v-html="mainDetailData" />-->
        <!--            </pre>-->
        <codemirror
          ref="mycode"
          :value="mainDetailData"
          :options="cmOptions"
          class="code"
        />
      </div>
    </el-card>
    <el-button style="position: absolute;right:10px;top:5px;" @click="handleClose"> 取 消</el-button>
  </el-dialog>
</template>
<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/theme/ambiance.css' // 这里引入的是主题样式，根据设置的theme的主题引入，一定要引入！！
require('codemirror/mode/javascript/javascript') // 这里引入的模式的js
import 'codemirror/theme/material.css' // 引入控制主题，没有的话主题不起效果
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/xml-fold.js')
require('codemirror/addon/fold/indent-fold.js')
require('codemirror/addon/fold/markdown-fold.js')
require('codemirror/addon/fold/comment-fold.js')

export default {
  name: 'MainDetail',
  components: {
    codemirror
  },
  props: {
    mainVisible: {
      type: Boolean,
      default:
        false
    },
    mainDetailData: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cmOptions: { // 配置项
        tabSize: 4, // 制表符的宽度
        mode: 'text/x-yaml', // 使用的模式
        // mode: 'python', // 使用的模式
        theme: 'material', // 主题黑色
        // theme: 'darcula', // 主题白色
        lineNumbers: true, // 是否显示行号
        lineWrapping: true, // 是否应滚动或换行以显示长行
        extraKeys: { 'Ctrl': 'autocomplete' },
        lineWiseCopyCut: true, // 在没有选择的情况下进行复制或剪切将复制或剪切有光标的整行。
        showCursorWhenSelecting: true, // 选择处于活动状态时是否应绘制光标
        maxHighlightLength: Infinity, // 显示长行的时候 这个值是不限制，如果要做限制的话，值是number类型
        matchBrackets: true, // 光标匹配括号
        line: true,
        readOnly: true // 只读
      }
    }
  },
  created() {
    // this.$nextTick(() => {
    //   Prism.highlightAll()
    // })
  },
  methods: {
    handleClose(done) {
      // this.mainVisible = false
      this.$emit('main-detail-func', false)
    }
  }
}
</script>

<style scoped>

</style>
