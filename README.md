# @ymd/utils
一个工具库: 
## feature:
* [X] 缓存,cookie
  * [x] cookie读写
  * [x] 缓存读写：支持localStorge sessionStorage
  * [x] 支持函数装饰器
* [x] emitter 事件监听
* [X] log 打点
    * [x] 日志上报
    * [x] 本地log输出
    * [ ] log优化：支持分组，支持颜色区分，支持时间差值
* [x] lru-cache
  * [x] lru继承能力
  * [x] 越界触发删除时支持回调给调用方
* [x] fetch 请求库
  * [x] 直接中间件做扩展
    * [x] 支持请求重试
    * [x] 支持请求合并
  * [x] 支持xmlhttprequest, fetch, jsonp的方式
* [x] 执行队列
  * [x] 任务队列 支持同步任务与异步任务
  * [x] 支持任务优先级
  * [x] 支持并发个数限制
  * [x] 支持中断 暂停，恢复，清空任务
  * [x] 支持空闲调度任务的低优先级任务
* [x] pipeline 异步管道模型
  * [x] 支持同步与异步管道节点方法
  * [x] 可以被继承调用与 创建调用
  * [x] 支持扩展重试管道
  * [ ] 支持并发管道
* [X] 扩展函数
  * [x] array扩展
    * [x] uniq 数组去重,
    * [x] union 数组合并去重
  * [x] function 扩展
    * [x] debounce 防抖函数，优化clearTimout性能问题
    * [x] throttle 节流函数
  * [x] object 扩展
    * [x] isObject 判断
    * [x] pick 对象筛选
    * [x] omit 对象剔除
    * [x] deepAssign 深度继承（ps: array不做拼接处理）
    * [x] clone 深度克隆
  * [x] promise 扩展
    * [x] finally polyfill
    * [x] awaitWrap async/await 的输出优化，方便判断处理
    * [x] serial 串行执行
    * [x] parallel 并行执行
  * [x] string 扩展
    * [x] upperFirst 转大写
    * [x] camelCase 转驼峰
    * [x] pascalCase 转首字母大写的驼峰
    * [x] snakeCase 转下划线
    * [x] kebabCase 转中划线
    * [x] pad 字符串长度补足
  * [x] tree 树形结构扩展
    * [x] arrToTree 数组转树
    * [x] treeSort 树排序
    * [x] treeSet 树设置子节点
    * [x] treeEach 树遍历
    * [x] treeMap 树遍历修改，与Array下map类似
    * [x] treeFind 树查找
  * [x] url 扩展
    * [x] parse 字符串url解析
    * [x] stringify url转字符串
    * [x] buildURL 链接拼接
    * [x] isSameOrigin 同域判断
