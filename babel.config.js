module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  'env': {
    'development': {
      'plugins': ['dynamic-import-node']
    }
  },
  'plugins': [
    ['prismjs', {
      'languages': ['javascript', 'css', 'markup', 'yaml'], // 这是语言类型
      'plugins': ['line-numbers', 'line-highlight', 'copy-to-clipboard'], // 使用了行号还可以添加其他插件，具体看官网
      'theme': 'twilight', // 主题
      'css': true
    }]
  ]
}
