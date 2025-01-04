### undefined和null有什么区别，怎么检测它们? (字节一面)

> 区别:
> undefined 表示变量已经声明了但未赋值,是变量的初始值
>
> null 表示变量的值为'空'
> 检测:
>
> 严格等于号 ===
>
> typeof 判断 undefined (typeof 判断 null 回返回'object',历史遗留问题, js 的值是32位存储的, null 刚好符合对象的存储模式,所以被判定为对象)
>
> Object.prototype.toString.call()

### loader和plugin的区别 (字节一面)

> loader:
>
> loader 是webpack中用于对模块的源代码进行转换的工具,例如将 CSS 预处理器（如 Less、Sass）编写的样式文件转换为普通 CSS 文件,将 TypeScript 代码转换为 JavaScript 代码等;在配置文件中module的rules中配置
>
> plugin:
>
> plugin 是用于扩展 webpack 功能的工具,可以在 webpack 的生命周期的各个阶段中进行操作，实现优化打包结果、生成额外的文件、注入环境变量等各种复杂的功能;在配置文件中plugin数组中配置

### UDP之上的应用层有什么协议 (懂车帝一面)

> 域名系统（DNS）：用于将域名转换为 IP 地址，使人们能够更方便地访问互联网资源，而无需记住复杂的 IP 地址数串。它使用 UDP 协议的 53 号端口进行传输
>
> 动态主机配置协议（DHCP）：主要用于局域网中，为网络中的设备自动分配 IP 地址、子网掩码、网关和 DNS 服务器等网络配置信息
>
> 简单文件传输协议（TFTP）：提供一种简单的文件传输服务，常用于在设备初始化或启动过程中传输小文件，如路由器的配置文件、无盘工作站的启动文件等

### Proxy如何实现代理对象的 (懂车帝一面)

> Proxy通过传入一个handler对象,对目标对象target的操作进行拦截,handler内部封装了set方法,get方法等,当目标对象进行操作时,会触发相应的方法
