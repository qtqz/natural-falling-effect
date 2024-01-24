# 自然飘落特效

## 介绍

这是一个让你的页面可以**飘落花瓣树叶、下雨下雪**的特效组件，支持自定义配置。支持以 **js 模块**或 **vue 组件**形式使用。使用 js 绘制 canvas 实现。

This is a special effects component that allows your page to float petals and leaves, rain and snow, and supports custom configuration. Support the use of **js modules** or **Vue components**.It is implemented using JavaScript to draw canvas.

核心 js 功能：

* 漂亮的效果
* 丰富的可配置项
* 支持淡入淡出
* 性能较好\*

vue 组件额外功能：

* 访客可以自定义配置
* 支持简单模式/自定义入口按钮
* GUI适配暗黑模式、适配移动端

## 预览

838

性能方面，

## 使用

### 核心 js

直接使用：

```html
<!-- 自行托管 -->
<script type="module">
    import { fallingCreate, fallingDestroy, version, defaultConfig } from './naturalfalling.min.js'
    FallingCreate()
</script>

<!-- 使用CDN -->
<script type="module">
    import { fallingCreate, fallingDestroy, version, defaultConfig } from 'https://cdn.jsdelivr.net/npm/natural-falling-js/naturalfalling.min.js'
    FallingCreate()
</script>
```

> 如需预览，因为用了`type="module"`，需要从本地web服务器打开，不能从文件夹打开。

在项目中安装：

```bash
# 推荐使用pnpm，节省硬盘空间
pnpm i natural-falling-js
# 如果没有pnpm：npm i natural-falling-js
```

然后引入：`import { fallingCreate, fallingDestroy, version, defaultConfig } from 'natural-falling-js'`

说明：

* `fallingCreate()`可传入一个对象，配置如下，不传则用默认配置。如需自定义，请完整传入整个对象，不要省略属性。
* `fallingDestroy()`调用可以立即结束特效。
* `version`为当前js版本号。
* `defaultConfig`默认配置。

```js
{
    open: true,//总开关
    custom: true,//总自定义开关，仅访客的有效，如果单独使用js，访客不能自定义
    changeImg: true,//子自定义开关，**仅访客的有效**
    changeShow: true,//子自定义开关，**仅访客的有效**
    changeRain: true,//子自定义开关，**仅访客的有效**
    imgSetting: [],//图案，有['petal','leaf','snow','rain']
    imgNumSetting: [40, 40, 80, 60],//对应上面，每个图案的数量
    showSetting: {//显示设置
        fadeIn: true,//淡入（下雨始终淡入）
        fadeOut: false,//淡出
        time: 10//几秒后开始淡出
    },
    rainSetting: {//下雨设置
        wind_speed: 70,//风力
        wind_deviation: 4,//横向风力误差
        wind_angle: 255,//风向，从+x方向逆时针角度，270为垂直向下
        hasBounce: true,//落地溅水花
        numLevel: 0.005//淡入速度，**访客不可修改**
    },
    gravity: 0.163,//重力，**访客不可修改**
    zIndex: 100,//自定义canvas的css z-index，可以实现不遮挡网页正文
    imgSize: [40, 40, 2.5],//图案大小（花瓣，树叶，天雪），**访客不可修改**，雨滴的大小跟风力有关
    wind_x: null// -50//前三种图案飘落横向风力，默认为空（无方向微风），填-50且关闭淡入时，效果与文末参考链接效果相似
}
```

图案如果不填，将根据大致季节自动选择（3 4 5月为春，飘落花瓣，4 5 6月下雨，以此类推）。

如果你的页面内容较多，又想使用特效，为**避免干扰阅读**，可勾选**淡出**，这样组件挂载你设置的秒数后，将不再会飘落特效。

### vue 组件

```bash
# 推荐使用pnpm，节省硬盘空间
pnpm i vue-natural-falling
# 如果没有pnpm：npm i vue-natural-falling
```

然后引入：`import VueNaturalFalling from 'vue-natural-falling'`

```vue
  <VueNaturalFalling :masterConfig="naturalFallingConfig" :buttonClass="''" :easyMode="false" />
```

* `masterConfig: object` 配置，不传则用默认配置，内容详见上一节。如需自定义，请完整传入整个对象，不要省略属性。
* `buttonClass: string` 自定义入口按钮，传入按钮的CSS类名，允许你将默认按钮换成一个与页面风格更一致的，组件挂载时必须存在于DOM树中。
* `easyMode: boolean` 简单模式，默认关闭，传入`true`启用，会将入口按钮的用途从**开关界面**改为**开关特效**。

将此组件置于`dark`类名下，即可启用暗黑模式。

## 已知问题与将来

* vue组件：输入约束
* 

## 项目历程

1. 2023.8 启动，整合多个项目，初步可用，后搁置
2. 2024.1 重启，重构代码，完善功能

## 支持我

## 许可证与参考

此项目许可证为MIT License，署名或注明出处后放心使用。参考的项目：

* 花瓣//https://github.com/tangly1024/NotionNext/blob/main/components/Sakura.js
* 花瓣来源2//https://qiu-weidong.github.io/2022/04/30/blog/sakura/
* 橘黄枫叶//https://github.com/lw308069077/maple-leaf
* 银杏树叶//https://github.com/BlackCatCj/Defoliation-animation
* 下雨//https://github.com/brownliu/rain.js
* 下雪的效果//https://nextapps.de/snowflake/
* 花瓣的效果2//