module.exports = {
  // 预设 处理es兼容语法箭头函数等语法
  presets: [
    [
      '@babel/preset-env',
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }//自动引入按需引入core-js
    ]
  ],

}