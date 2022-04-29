import Hljs from 'highlight.js'
import 'highlight.js/styles/an-old-hope.css'
const Highlight = function(Vue, options) {
  Vue.directive('highlight', function(el) {
    const blocks = el.querySelectorAll('pre code') // querySelectorAll可以根据自己的富文本生成的代码做调整 我这里默认刚好
    Array.prototype.forEach.call(blocks, Hljs.highlightBlock)
    // blocks.forEach((block) => { // 在forEach中做一些操作
    //   console.log(block)
    //   console.log(444444)
    //   // 1.创建ul节点
    //   let ul = document.createElement("ul");
    //   // 2.根据换行符获取行数，根据获取的行数生成行号
    //   let rowCount = block.outerHTML.split('\n').length;
    //   // console.log(rowCount)
    //   // for(let i=1;i <= rowCount;i++){
    //   //   //创建li节点，创建文本节点
    //   //   let li = document.createElement("li")
    //   //   let text = document.createTextNode(i)
    //   //   //为li追加文本节点，将li加入ul
    //   //   li.appendChild(text)
    //   //   ul.appendChild(li)
    //   // }
    //   // // 3.给行号添加类名
    //   // ul.className = 'pre-numbering'
    //   // // 4.将ul节点加到 代码块
    //   // block.parentNode.appendChild(ul)
    //   Hljs.highlightBlock(block)
    // })
  })
}
export default Highlight

// < pre
// v - highlight
// style = "margin: 0; margin-top: 2px " >
//   < code
// className = "css"
// style = "height: 300px;margin: 0;"
// v - html = "resultYaml" > < /code>
// </pre>
