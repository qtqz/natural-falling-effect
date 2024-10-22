//Natural falling
/* eslint-disable */
/**
 * @name naturalfalling.js
 * @version 
 * @date 2023.8.14
 * @author 轻稚天雪 (qtqz)
 * @license MIT
 * @param {Object} mc master config，主人配置
 * @param {Object} c config，访客配置
 * 
 * 更多描述见github
 * 
 * edited by qtqz 2023.8.8
 * 改为普通js模块
 * 加大花瓣最小速度和大小
 * 往左飘改为随机往左右飘
 * 可以停止飘落
 * 优化性能
 * 
 * edited by qtqz 2023.8.11
 * 整合落花落叶下雪下雨
 * 
 * edited by qtqz 2023.8.13
 * 接受配置
 * 
 * 2024.1.14
 * 项目重启，作为pnpm子库
 * 
 * 2024.1.16
 * 调整代码结构
 * 
 * 2024.1.23
 * 适配移动端
 * 
 * 下一步
 * 
 * 数值校验：vue
 * 适配移动端
 * 自定义按钮
 * 结束方案，可能无法结束
 * 任一方更新，重置访客配置
 * 
 * 
 * 0.8.0：优化小屏幕显示，整理越来越乱的代码 :（
 * 0.8.1：更好地判断季节
 * 0.8.2：修复季节bug
 * 0.8.3：修复构建异常
 * 
 */

//
export const version = '0.8.2'
export const defaultConfig = {
    open: true,//总开关
    custom: true,//总自定义开关，仅访客的有效，如果单独使用js，访客不能自定义
    changeImg: true,//子自定义开关，**仅访客的有效**
    changeShow: true,//子自定义开关，**仅访客的有效**
    changeRain: true,//子自定义开关，**仅访客的有效**
    imgSetting: [],//图案，有['petal','leaf','snow','rain']
    imgNumSetting: [40, 40, 80, 60],//每个图案的数量
    showSetting: {
        fadeIn: true,//淡入（下雨始终淡入）
        fadeOut: false,//淡出
        time: 20//几秒后开始淡出
    },
    rainSetting: {
        wind_speed: 70,//风力
        wind_deviation: 4,//横向风力误差
        wind_angle: 255,//风向，从+x方向逆时针角度，270为垂直向下
        hasBounce: true,//落地溅水花
        numLevel: 0.3//淡入速度，0~1之间，**访客不可修改**
    },
    gravity: 0.163,//重力，**访客不可修改**
    zIndex: 100,//自定义canvas的css z-index，可以实现不遮挡网页正文
    imgSize: [40, 40, 2.5],//图案大小（花瓣，树叶，天雪），**访客不可修改**，雨滴的大小跟风力有关
    wind_x: null// -35//前三种图案飘落横向风力，正负决定方向
}
const id = 'canvas_natural_falling'//+'_type'+'_'+t
let t1, t2//用于清除定时器
const destroyFalling = (t) => {
    isDestroyed = true
    for (let i = 0; i < 4; i++) {
        const createdFalling = document.getElementById(id)
        if (createdFalling) createdFalling.remove()
    }
    clearTimeout(t1)
    clearTimeout(t2)
}

function getSeason(month, day) {
    if ((month === 3 && day >= 21) || (month === 4) || (month === 5) || (month === 6 && day < 21)) {
        return "petal";
    } else if ((month === 6 && day >= 21) || (month === 7) || (month === 8) || (month === 9 && day < 22)) {
        return "rain";
    } else if ((month === 9 && day >= 22) || (month === 10) || (month === 11) || (month === 12 && day < 21)) {
        return "leaf";
    } else {
        return "snow";
    }
}

/**
 * @param {Object} mc master config，主人配置
 * @param {Object} c config，访客配置
 * 用于判断图案类型
 */
const readyCreate = (mc, c) => {
    if (mc == undefined) mc = defaultConfig
    if (c == undefined) c = mc
    if (!c.open) return
    let imgs
    let date = new Date()
    let m = date.getMonth() + 1
    let d = date.getDate()
    //先读主人设置, 无视自定义开关，若都不选就是自动选择，不是不开启
    imgs = mc.imgSetting
    //读访客设置
    if (c.custom && c.changeImg) imgs = c.imgSetting
    if (!imgs || imgs.length == 0) {
        /*
        //按月份粗略判断季节 1 2 | 3 4 5 | 6 7 8 | 9 10 11 | 12
        if (m >= 3 && m <= 5) imgs = ['petal']
        else if (m >= 9 && m <= 11) imgs = ['leaf']
        else if (m == 12 || m <= 2) imgs = ['snow']
        else if (m >= 6 && m <= 8) imgs = ['rain']*/
        /**
        春分(公历3月20日~3月21日之间)
        夏至(公历6月21日~6月22日之间)
        秋分(公历9月23日~9月24日之间)
        冬至(公历12月21日~12月23日之间)
         */
        imgs = [getSeason(m, d)]
    }

    w = window.innerWidth
    h = window.innerHeight
    img = new Image(), img2 = new Image(), img3 = new Image()
    {
        img.src =
            'data:image/png;base64,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'

        //银杏//https://github.com/BlackCatCj/Defoliation-animation
        img2.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAbgUlEQVR4nO2cCZBlV3nff+cub+3Xy0zPrkhIMAgtBpfsISE2CIiw4xhjbBe4ogR5oSxSxE6giiKJUew4xK644nJ5xTZWYstBEZblwmC8BVAkwInLNkRGaJA0WIA0i3qm9+633e2kvrO8e9+b0ah71D3jSnGqbvXrd9+999z//db/953L18fXxxUdqnpx/clv3PpcUg2zIRyMYTmDlRzmQkg0RAq0gs0U+kPY37L/y8jc/gDoF/az7Mq13Rcr+3cAdDXsUTDshZxZDzjYgZfuzzjZ1+b6h2I4l0Ahk9fQCO15cyrfBRAqWM/t9aZD+73sl/nLeQYaNnP7O6WgKGBhGeamoVWHvBi7dXXbI6PP0RV7eoWGJLfANkOoy82HLyLUx8iLiCy/D61vRuUfhNoU7dkQHWmarYwX1XtkepFYnSJOnyYtvsQwe5w8f9zcfFpYYMblY1fG5QdQnqY8UJGM2fo0nfrraMVvAL4Vrb+BJA/IU2gW9zPFJnn0KvrKStVAuWNjKyUiqZ0GaCdtaX6Covg/DLNPkWSfoJudIZMDg/8PABQVFfDiAGYar2O68c+pRd9NEO41QKQZ5JkFQgBpq+9lSf2emWEsqo1VMZHcrLCbjMT9NQKnjhKFR4mjOwgYMJN9kiS/j0H6YQZJYaRd7+xt7T6Ahbtx0aaZ1h3Mtf8lcfhKI1G5A065/X7Txha9lX2tJfoZpEMInH3yAONU1EsfehwcTQOl3sh044004p/hbO9uwvzXiZuLpHJc8dxz3sbYPdnWHpQcNpO3sX/6ONfO30MtfiXDHPLcquFoVOyVAYrvIMtvR+nEzDLEgjg6P/Z4A8SEWBknUdhj5AE9sXoNS+n7UZwgT+4iS2PCYEds5M4DqD14BQTpNxHHD7HE7/Do6g0cX7Rq2o7H5+4lSAWlNEZhmzx/O0UeGk8dutkaCdTlMeddX1s1957++Aqc7cKUAWyWXvZ+guRxGvlbjQa8QBB3FkDt1VWkK/sP6PivCeq30g4hS+HLK/D5s3C2B80YosDerK4CUVFnsXtKh6UEOu9dXETqZL/8TsKhJ9fgbB+mI3t8pKEmwIbXkSa/Szb4EHk+TXHpIO4cgCJ1omI1riJSnyYLfpIwgoaCurI3MV+HYQaPnoUnli1IErt5LJSzc14q5LO3nx7A5wKuKplyva9uwsmevW5cOd5s7hw6/2eEyWOE6T8x0p9XtGCLY4cAdMFnnvwjNI9C/GqmatBUVhLE88ah88AxdGI4tQ5fOAeDHBpR6RiqzsTfR6DHb1w9B3Aifc0Azg7gqU2rtjV3XOg2f97Q29r8Ktr6XSbAbommJJBkWwbxhXlhXZGSRn47m+m9FJlVzSiEWmQlTG5Mgtvcec1A9gWwMYTHzsH1e61dHBTuBlXFM7vPgZNydJllULWJWPXspXBiwwIn0q90KX2TD0b2xfLw6u+j7x7IeheazS0D+MIk0KRICfQG76Cl7qUeQ01bR9Eb2Mms9WCYWkmUG4qcbZNtrmbzrifOWTDrUUV93ebVTkAIdWkzxyQQ67QE2S9vSEANU2Epef4ulS6B9BIgZkapb0YVU/YreVhOnXcVQEmVMjPnt1MPf504tgBIljAlW2SlTLKKbg/W+5CkVkrqDkgBRdRZPn9lWcIdK7UjW1gFUtvNAFYBzgCZ2XOe6cPy0IFXOLWtHu9AHD0YyYUTyLo/Q033WE1Fe+4kSn+e6Zo9MLi4JG5fhb3n70i2EL2J2drdDBObGUjokAcuBhM1LhyI2kpFT4JiAbkGtdBmJrKJlx5kcHIFrtlj1SrPJkD0wbIApsaBFOnu5nCqb6U8Ls53GpMqrNzNiLmJ2/+WZ1c1/cE9tMM7jMZM1Xr0i7tMzBqqiUihHNuXQHOeAq5q38iB9kfRApRIX4yRQpGgyU2IglZkNy1A9jGgR865yM3KPhHphTU72SAonQqVmzYA5vY8XgpFSk73rIQ3vcfVJYCToPk/RjpDMUNvI0+eZE7dQb2wDysZvI+s+0NsDtxcLjy2J4E++p+LIjpTn7LOIIMidFJXlBmG30RKvFSKRApoInWiOpKmicEOIvtdK4bhEFY2Ybo5bg/xj9tlL4WbkJiE1QQWB9AOKlJXEY9JyVNO8oYFrG6I6fgWY368uuOcVaf4bwzzv2aYP2o0qTg//RsH8PnSQ1HT2QCOzP4eUXRw5O5FXeUpCVhhWAEwt8AEDsjC2aXCAZllMOxDvW4lUUgFUW2RUNlfc7+pSmI1FzaflQ1bZPJGmtW4ylalEOf4ZIjz20jsOdrhuC4aO+mcUmvwZ2yEhwlbVtInVHkcwMZFDKZ4v1YA18y+l1brzfTdxUcXdbOVyRsnEFpQQwdcXpHIwoEqoU7uyIJazf7v1dSA2HQkAuMA+vkY6RvC+tDGcEZ1CwfYhNqZ9FBZe7zupD9yD38EWEXNtScrkkNE6jcY1t9heEsuCuBFTKJPkQb5LeieBUhsn7lecT45YEyYs+QmfKiAl3t1d84mc1SWCVXk9xEkiWWzxbb6SasqE+M+Lydl2jcCT02ELC5WlSxIpC53Abe1SeNhjXLgjb5TIoV3stn9r2SdvzSgPyeAvefR4UxBf/GPaGffTySeVKSmblVQ/o/iUnWrNJNyEmFIhsA+bXECJhMI7HcSigigyhEHoo7CpHjzgPfKzvMKIBupLRu0BLzcSmvgwPP2yAf6/Ry6id3fUOVDGJOoYtxc+HOY9HDjXob1o0SNiwCYPU/waM5f/1Oy+BhZfhOb/WPEvVcRqFtM/CcOodaCMLYXFak6b6iKuldUMogtCIVTndDZ1FRis6i8KZ+FyMzXEgtsVHEeqvrQ3NZLrPRFPq6rgDdmGvz9TwArGVSYvAS6byOt//fqHW2vqFQ4yJsu2C1ccBvmRxmmryPI30RNfQetekCjDXHD/k6ALCpPczRHL616fCt0uU8oeaPmhZXgdt097AJObdpJ1dR43Ccn99IoMZ3UXkZ8YsUcVG9spHwV8HysaYDOIQnPkR3Yr9742OjI7ceByqVNytkxA2J0gqj1QdLWG0lqL2EteS9LS8dZFbKg63LZ4Hyg0OfnvaNruGM8heVv2jPc3dSCW1MVyauka3LuQWJpNM/GVMOYKnijfyvgGVPkbLOYEgn06e4jXb6rCscLy4V1xWsFLgCtx19Bt/4Lw+ZN9Iu3sLr6WdaXIRs6z+iYG52PsymjB6QYo7WM/StKrygPTpxOP7XaEOgKeMUohDNBdeHUVumKXayqaVHaapmPMDGDPvS7kPStYxRnGdeg1YbmlGQ9R6sQ7ExNZGRHKJ+ikZ7mA+jiAdaHb2K48T4atVdah+OI1JxKwF2RSvGS9cBmMEMfjLvYsd+zKlkEVrK8FI88KNZumph0Ip+elDSRYJFQAU9Aarag0YRGA5pifmqWalOhhUrQOrX6ATi9AwBWtSB3f31RPKhU4eTm0sbHCPXHSAdvJk8/CPV9Vnq1tW9hzRIR3q6K1Dzbs1lJx3luz+WJJCfud7FDx4dJ8lkAEckKJsAr3D8ClsSdMjcBamYvTHWg2ZZIYhUdPolST5AWTxHlJzk7XIBkhU4wQJMR87dVGLYOYCUyKNMhZRmZ3CX0gSo9eeEMfU0yhOLvo6NXEbavY30Q0V2HTs0yNzXx3nVo1EvVNcWgZTjZh7aoj0sDw9Q5pLoLfJUzHf5BZlby1GTwraxDEuAkWJ+dg5kZqLe7RI3PUOiHWR/8b4ruo3STFQOuhHRHIjiT2vjYpJkuBdw2gNpF8RICbRY2Ya87p1Adck+pY5gjDrPUv51Q/VMatVuMpEnUIexGw3UiCNEgqV+gSlUWVVpfBb0J9ZqVmKEroucD0KnNWrTravDpXOFSr7ESqbJqmgwtw3NgPzTnIGr8AUlxP+vDBxl2FwwrLkLQikrnZbIUmaerZXstmLjlbQCIpejXLhCDaidtolYz9es4PPNuTnd/mPV+i9maDZYlMBYGxnB3NWcj3WR9vVc5SdncgEUJpJUlaE1gHVgJy11oEUx4TFWtsLnzDR2TMr8PZvY8DfW7WRp+iHz1KyYAN8UmN4eQkraqSu/zjO2pcD5xYt8UJN6q02jSaf4kzfp7qNdCNjYsQHGlMJRmZTzmC+VVAIUdTjdhqQ+9CJpVz6nsdfxkVJXqqoCnnB3UGXRmxMadIGz+PEl6N8urmbmO5M1J5NLGybBme+OFeeHU2Z+9U29m39QvQHCNAVSIBk/jC1CRUyXZ6o4xMSmaIxxGkiyxWw9WvQOqAKjdg5IsZxS6VIFzv5EcWiR8+tAqjemfoq9/ke6aNoxL7MjdHWzvuDQAlWsSErtwZPpXadbfaWxUkZVZg4AVByWllDoDbwAIKjSYD0EktEksu7IZWlZZV2yFJyFiV3f2w6u+gCvlg04Hpg/8Fkn0b1jpnzO/ql5nh8elAZgY8vMAnfYfEsfHjCRCacD9Uw5VyYj4VotQlXbHZx6GVQ5siLLY75MGTVNVU0VZ+TPel5KTqwIigbVI5cz8adTsO9jUH0f3SypsiwWiSxnby0S8QITq5TTjp1D6mEmX8kqe63NZVaHWvXqNwKuSsL7bILcBcMCrGabvt9io0s4JSP6h4DIHnNQb9nj/H9LcezOb6ceNDQy36AUuK4Ch84oNtUiRtwzD4VUrn0iTRuyIZ3GLiuRVNu1snQDRSzboTH2OmeAniIrPW2Ad2Zk7lTYzdiBKWUCOnTv80+jOmxgOV4xObaOz4IWOrQHo6aeafgVT+n4W89P08n9gPJ0JLVKXjqmK9PkMQZe2PqqGLkEJuHxOjST/L1QM+2Ylp349Qb5pK2/OphKUuXc6sHFk56ofImjeBellA606Lg6gcrap24fTGzUW8o+ThG+hEf4NjfoSefEh2xiZO1Y5L21WPFGSDCjVN5jgAg0gBoDPjAjQsLlGEH+XSXW0y5s905w6Rvzg1d9F1Pptd+wVGRcH0Gvlnkgk7E84k1xlgtuweDmD9AkyDhoDbYpHXhqLMnSpxmqBexg+gEaVVT6fReTB52yDj7aBd9B8iDD6JYK07Egthnbfgau/jUbj42SDLQe9uzGeG8CR90rhpfPv5dXXvp5OaCtg0keyOQwY5rfZ7npfgXPshpxVqmvKpVYjqat63kph3No34eSPG/AaLseVHDmc/dcM1UkLsnM0jf3fy9z0J0zYE+x82+52xjiAeWVL3Q3ON4+iaj9rWjD+4WHY14ClxC4NEOAk9828I6l0nkrAXCVIRwXuSujiPbZcMMm/xmq+YB5O13XaC4jSydDvvG3UnhHNv5Nh+yM824cFSfqxXf6XyetOjvE4sF3JJSXpF+p+f+fDRpWldCgkwC374cSq2EQbp3TcWgtVKUiJXYxdQo4LuIMK86wnMozMZDRPsye2bRsyKwFyQ9Z1KJjpPMRXVzbI1F+xGf8arRwWU0d94Ti7wM638CHOlQDQl+zk3qT0sK/9FsLwFhOuyM0PXKZxdMYWo59et0UdScqzigSIRxV1jX2YUlVfH9bk4ylczjnrKLQVV7GnkpYVo2MzesEfGZsnzUrVcc5V8aQnUdpLZhuWBku9975cAC67m5ILH5BGyPovlssInLSIdEnseqht6Z+vrtry4rQ/lYu25UaEexMQqGQpvr5cZXKk9bavFznraHpTlXOORB6YFMH7RZ16MG2O9ZxjlQmXgF76WOQ6S5ILN2BPE6bqNqB/3raLnQDwoOPDhB/b27odgkO2NFmtWbi/UmOVpsijc3ByHTb6tq3N0N+uTisSnVKqsQ+Aq5KHc1ah6tJxtBKVCMA0IMkxgSILIkOsesqp6jxMe7E7WMCU+Zxdtwtx5qfgUMsCv8MSOQ5g4pJ2AbEW3WUvNuHiqp2hfddhdfUMnJWO0549vuHXzLl2C1/PsAdOAOhsYE0VHI5L7u9UD84NHXtjAMpJdcxcfeu5rUi7mB2x11luwYyDHW2tHwdw4C443zxGI7zBOBI/Jltq/ZACT2DspWWpV7pW5Rq6jP0Mj+fqikWFevJFKBMyEXAuKwPuTefNU1fYTsiYipvMTdke5q0OX2eRMmiewJ6GNUE7s0zkAq0dAsLe+tvP60Oe/FutwJlYMLOGWyRtrQsDlx2YChw2Thx54YlzWEBbrDqJF7snx0tRKQ1sZ0KmUrJoD+02NLLtm7RpZzt9+4rQ9aLy4uSGW28qvziAsek6lWLP91i1mzjpKHbzGYSP4xwYQqLKzc+1rQ0SCl8uETiqPnDNzrrC9fmQJgj2Mu9UWCp0T63D8oY1B9KPouN1Ej3L2RXnmF6A+HgGaEXB/im7pLV/aengOIDS1zxVk6VY+41q+gB5xKo7ciBwlbPIxXqecfFGWu6t3bCqKAbd01g+PhtbaeQkWOv9NgNxXnmmbacnXVRCvy/3lxj0582qI3ONHTBkkgSc24C/Nwd7pi6JdB0HUDxrpG/jma61M0VF4vwIKHPd2NWCxdCbQnhQGmmRMmlNE4n0KzHRpZelYgftyqNrTJ+zdiGM8apOteqSHqZn0OFNXNsuWZ8XOkzN2jHZEjVIKCZLa9e3TvtPdGflsJAeMwFtqMq91XjLbK4MmOqym8rcsLIgSh1VsoOm65Y3Cb+r8Od5KbHVtgrUNdQ5QKYWaEn1T8ND7iblfJ38GVJ9K1+a4rnabS9tuLmcyKyZORzA9S672jaAUuRuZDeMOgqoGns/fGA9VrkuWWXx5H33ABpumZVxpQN7HmmdkLpuMdGZpQhJipvos2AW3IjjePEee6hxROsn2Oh2UF1bX97pIfOUwrlI30bTOsTa8xMVEx2q4Rw6e1G5NkKXtm8Uu401wpRi6QvcHlRDgib2ZgUwldqGHeEW5UHNTFv1TrJSCqP0GJ32gyavFub7ixmccT3Mreg4WRBytH6Y2ei0udmdHsqRKKvuHQqS5zdd98WWAFT5VShdP68R54JzrT6dovx/JLGqDFiL1Kp8rW0LR5td2JRVlFPQaVk6X5wW2a1E/OzIvu0TqcDWh8Pgi6Sq4MHiJfQ5faEugR0ZXvOEEZpP4PWStjqneQHnPxlIz9p4iQmJ83Fg5bd+TTB5pctUlyECEz3NZl9ii+ezs9DrwuKaXQq2t23VJRveSprVSdVw1NPnr9niWdZZp5W/gv182sxxVxisSplBGKHHRRoVvBS7/m4i2hkHsBNcXVLwqqKulJJY1VzfoK0rfTLqAplG4LhF81tXiJJOU1kzLJnL19bkPQowR4so+cdEnY+a2u+RwNJqNZfVbAQnOcgtvEycjNolACtDpLGr4GQBBzN4cQSbFwMw5QTN4ClifZ3l1TxYvvhdZVUkRvQdA76/r6gAWVkq4I8dBc6uk0q+29eCZmqZbjHghzZ/kKDxUZZ6sCnblLTHwX7JJmpf4Jy+kcPOkV0O2q/hJO/zGXxZWxArY+K/6C8hfglNfpOk/3Zj4MOwlDIJrE1zo2eeK5mEB4hKM6NS4yI7ArmyCXUmE7w6hDM5fHXpzaj8drT6H9QHMJfDp0N4RLwynyHjVp50a0R2Ihbc6hAhWirsi36eE8DUUOSaAf+OTm2JqdqP0O3PGXpLgEuLylIAv4C54iwulE8aSXVtHSYAlwci7R3hs+joBAVPE8WnGKZLHMl7nCn2sbBxL7X6bajmD7NvCDcO4bNSSgj+BJ3/FAfVEa5Tp0y4dLnHhEceB3DDNQANOUePu6mrt7Len7OVNsdYR7pU48k2sCplL8UfkVKp3U7J0of6SVT8EEQPU4R/hQ6eIFMDu7oyhFVZaZnCbCQrLz9Cd/h/SfQryRqv4FVhboiGL0VfY0+xyHpxG19S95jXQ13BihznATgbN+gOf5yVwfcRFDcaaZNguBGUJcpRl747ZrSqxzU5SjOjkAbCmrRaPYLG/STRfWj1kAkEUrd+TgyYWRsXuIDaxYOFYaUfYe9Mk43kMRaSISvFEb5hdYGvtSFpPM5G/lqWHYC79+KWLY1xAE/3Nfnw3xsuz/QuB2Vvi/eu1VqvH6atbGBVdM8ctKefpqj/Kqh76GcLZm1azRGlY319FRM5cjLK2tpWMWBv48UMNj7JI+vPckNwE8c4zvHOn1IP7+ANNrm5IiXNXys/TjLSQ+rhp6llrzFBWFhdhFcBceyYxLab7ZVm7b2LUP/PDNNfpjdIjJE3C68nXprzfENMgTDa0hO9v3Yby/oeHi0e4+rkZm7IfpO/iH+QZ/J55oNFA+IVHOMAzhgb9wi5fg1RXpEWXUrHKKgW9tplE/NHQLd+hTT5CdbWV8wxcbA90CaHcp5POMbr9/wATxUrPLn2Ra5NOjQbD/BF/X0c0L9xsTTrcoxxAO2ajD+nof9VGSJM5LxyZ2LnxG4dOQLzB59kKbuT5dWHTfN5HOysWok6y/sQ5mbfxRNZxGZvg72197FU6xpmenhlvchEg6WEJI0HUYlGFWpiJZ1VLVnFI+TAi49CPPPbLKz+CBv9zFTo2AWbpNyLwuR9C42ZH6VLgFr7aep7P8Cjslx/d8qVWx0TnQmyOqdYRAUPQ/LaCvtpR3fTLkq57gbpIHg3zyz8giVWI9c9ukuz7AL7tSUVpjvv5MkiZ7n/o0y1fpzr1ZpxdJcTxwfKj+MAmj4/0xl0L0HvtXbBtEvP+pswuw9edjOs9L6HheU/GFtdtBvDvydLqCthZmYKG1I9Nv1jpN2X0ur+OTe0b+aosq8LvQJjHMBR0aj9YeLuB0iS2LDI3Q2YPwDXvxw211/L6urDpvNgt81P6N6AFLoCvTgMWSEqtHvW+nb0cJG/SH6OIH4Ph5ykXuYxDqAk76Zhp7aJin8L1b/TfDe3D258OaytvYbe5mdMrWOwW1In3Ju8eSiFA/tAzdjvfWe+PLQ3aPjOAP64fj2PJIvMFA/yheCPjaRe5sB6HMCmW8wsrylJWv8JtXSnYY5v/kYpMX43K2sWvGQX1aWRw9kQjk/BgaB8q251oXbdsSRfUUv0wtv4QnEf13MDNwVL5jeX0R6OA9hy7wMQMnEQPkNv5l9w9Np3M0zu58nFj9mFMZmlvaVrNdjhyWrHstRnLI2VXKRWK78Viutl0adY1L/EUvHLPKVv54zbf5mim/FAxS/5l1xW3pghL5E41IDBEDZ0udRLANzrCkaF+9+vCfHhYrUDa+CK9H4tmufxMvf2DNl3agjtoV12GrvXN21F0KVm8ZSGj3AfC/r3+RYeMC+h2MW2afWuvxl9vvhCm9CtDvdNj4U+n4HZqSG5ck/BOW27sbY8tF09eoD3sK7+I7r4BARrnP+Kl10ZFwfQL6O6wBt7dnQErjv2IzF8TtZ9XMLJY32KPPgYn1U/QFr8CpkqLocaX7k3mU8OKdxcK68J1VYatz2kM4KPkqpvNfKs1O7RDP+z/Ph3A0BHD3KjI20vRdi1u5sunyVUkXkIV7B7/+tjKwP4f+R0UdbKxmBhAAAAAElFTkSuQmCC'

        //橘黄枫叶//https://github.com/lw308069077/maple-leaf
        img3.src = 'data:image/png;base64,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'
    }

    //有关访客设置，如果访客改了，以访客为准，不然依主人配置（默认配置）
    if (c.changeImg && c.custom) {
        [sNum1, sNum2, sNum3, sNum4] = c.imgNumSetting
    }
    else {
        [sNum1, sNum2, sNum3, sNum4] = mc.imgNumSetting
    }

    [sSize1, sSize2, sSize4] = mc.imgSize

    gravity = mc.gravity
    wind_x = mc.wind_x
    isDestroyed = false

    //优化小屏幕显示，在雨那里也有
    if (w < 760) {
        [sNum1, sNum2, sNum3, sNum4] = [sNum1, sNum2, sNum3, sNum4].map((s) => {
            return Math.floor(s / 2)
        });
        [sSize1, sSize2] = [sSize1, sSize2].map((s) => {
            return Math.floor(s / 1.2)
        })
        sSize4 -= 0.5
        gravity = gravity / 2
    }

    //淡出，访客改了依访客，不然依主人
    if (c.changeShow && c.custom) {
        if (c.showSetting.time >= 1) {
            isFadeOut = c.showSetting.fadeOut
            fadeOutTime = c.showSetting.time
        } else isFadeOut = false
    }
    else if (mc.showSetting.time >= 1) {
        isFadeOut = mc.showSetting.fadeOut
        fadeOutTime = mc.showSetting.time
    } else isFadeOut = false
    if (isFadeOut) {
        t1 = setTimeout(() => {
            isTimeOver = true
            //console.log('timeOver')
        }, fadeOutTime * 1000)
        t2 = setTimeout(() => {
            isDestroyed = true
            destroyFalling()
            //console.log('destroy')
        }, fadeOutTime * 1000 + 15000)
    }
    //淡入
    c.changeShow && c.custom ? isFadeIn = c.showSetting.fadeIn : isFadeIn = mc.showSetting.fadeIn



    for (let i = 0; i < imgs.length; i++) {
        //每个特别定义
        ((t) => {
            if (t == 'petal') startFall(t, mc, sNum1)
            if (t == 'leaf') {
                halfNum = sNum2 / 2
                startFall(t, mc, sNum2)
            }
            if (t == 'snow') startFall(t, mc, sNum3)
            if (t == 'rain') {
                if (c.changeRain && c.custom) {
                    wind_speed = c.rainSetting.wind_speed
                    wind_deviation = c.rainSetting.wind_deviation
                    wind_angle = c.rainSetting.wind_angle
                    hasBounce = c.rainSetting.hasBounce
                } else {
                    wind_angle = mc.rainSetting.wind_angle
                    wind_deviation = mc.rainSetting.wind_deviation
                    wind_speed = mc.rainSetting.wind_speed
                    hasBounce = mc.rainSetting.hasBounce
                }
                if (w < 760) {
                    wind_speed = wind_speed / 1.5
                    wind_deviation = wind_deviation / 1.5
                }
                numLevel = mc.rainSetting.numLevel
                a2 = wind_angle * eachAnger
                startFall(t, mc, sNum4)
            }
        })(imgs[i])
        //createFalling(imgs[i], mc, c)
    }
}
/**
 * 考虑：新增淡出函数，调用时开始淡出，可以不依赖时间
 * isTimeOver = true
 * setTimeout
 */

//s: some
let sSize1, sSize2, sSize4
let sNum1, sNum2, sNum3, sNum4
//树叶，两种各一半
let halfNum
let isTimeOver = false,//启用淡出且超时为true，否则永远false
    isDestroyed = false
let w,
    h

let isFadeOut, fadeOutTime, isFadeIn

let rain_width = 2//1.5
let drops = [], bounces = []
let wind_speed, wind_deviation, wind_angle, hasBounce, numLevel, gravity, wind_x
//将角度乘 0.017 （2PI/360）可转换为弧度。
let a2, eachAnger = 0.017

let img, img2, img3

const getRandom = (option, type) => {
    let ret, random
    switch (option) {
        case 'x':
            ret = Math.random() * w
            break
        case 'y':
            ret = Math.random() * h
            break
        case 's':
            if (type == 'petal') ret = Math.random() * 0.75 + 0.25
            else if (type == 'leaf') ret = Math.random() * 0.7 + 0.3
            else if (type == 'snow') ret = Math.random() * sSize4 + 2
            break
        case 'a':
            ret = Math.random() * 6
            break
        case 'o':
            ret = Math.random() * 0.4 + 0.5
            if (ret > 0.8) ret = 1
            break
        case 'fnx':
            if (wind_x) {//if 60,1.5~2.2
                let x = wind_x / 40
                if (x > 0) random = x + Math.random() * 0.8
                else random = x - Math.random() * 0.8
            }
            else random = 3 * (-0.5 + Math.random())//+-1.5~
            ret = function (x) {
                return x + random
            }
            break
        case 'fny'://0.7.3启用重力影响，0.8->0.815
            if (type == 'petal') random = 1.3 + Math.random() * gravity * 5
            else if (type == 'leaf') random = 1.6 + Math.random() * gravity * 5
            else if (type == 'snow') random = 1 + Math.random() * gravity * 5
            ret = function (y) {
                return y + random
            }
            break
        case 'fna':
            random = Math.random() * 0.03
            ret = function (a) {
                return a + random
            }
            break
    }
    return ret
}

/*
this.list.forEach(i => {
    i.draw(ctx)*/

/**
 * petal(sakura)
 * @param {*} x x
 * @param {*} y y
 * @param {*} s size
 * @param {*} a angle
 * @param {*} fn fn，运动方式
 */
class Petal {
    constructor(x, y, s, a, fn) {
        this.x = x
        this.y = y
        this.s = s
        this.a = a
        this.fn = fn
    }
    draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.a)
        ctx.drawImage(img, 0, 0, sSize1 * this.s, sSize1 * this.s)
        ctx.restore()
    }
    update() {
        //每一个的fn都是不变的，匀速直线运动，匀速旋转Math.floor()
        this.x = this.fn.x(this.x)
        this.y = this.fn.y(this.y)
        this.a = this.fn.a(this.a)
        //为支持淡入，取消判断this.y < 0
        if (this.y > h) {
            //isFadeOut && 
            if (isTimeOver) return
            this.x = getRandom('x')
            this.y = 0
        }
        if (this.x > w) {
            if (isTimeOver) return
            this.x = 0
        } else if (this.x < 0) {
            if (isTimeOver) return
            this.x = w
        }
    }
}

/**
 * 
 * @param {*} x x
 * @param {*} y y
 * @param {*} s size
 * @param {*} a angle
 * @param {*} fn fn，运动方式
 * @param {*} i number
 */
class Leaf {
    constructor(x, y, s, a, fn, i) {
        this.x = x
        this.y = y
        this.s = s
        this.a = a
        this.fn = fn
        this.i = i
    }
    draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.a)
        if (this.i < halfNum) ctx.drawImage(img2, 0, 0, sSize2 * this.s, sSize2 * this.s)
        else ctx.drawImage(img3, 0, 0, sSize2 * this.s, sSize2 * this.s)
        ctx.restore()
    }
    update() {
        this.x = this.fn.x(this.x,)
        this.y = this.fn.y(this.y)
        this.a = this.fn.a(this.a)
        if (this.y > h) {
            if (isTimeOver) return
            this.x = getRandom('x')
            this.y = 0
        }
        if (this.x > w) {
            if (isTimeOver) return
            this.x = 0
        } else if (this.x < 0) {
            if (isTimeOver) return
            this.x = w
        }
    }
}

/**
 * 
 * @param {*} x x
 * @param {*} y y
 * @param {*} s size
 * @param {*} fn fn，运动方式
 * @param {*} o opacity
 */
class Snow {
    constructor(x, y, s, fn, o) {
        this.x = x
        this.y = y
        this.s = s
        this.fn = fn
        this.o = o
    }
    draw(ctx) {
        ctx.save()
        ctx.globalAlpha = this.o
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2, false)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
    }
    update() {
        this.x = this.fn.x(this.x)
        this.y = this.fn.y(this.y)
        if (this.y > h) {
            //isFadeOut && 
            if (isTimeOver) return
            this.x = getRandom('x')
            this.y = 0
        }
        if (this.x > w) {
            if (isTimeOver) return
            this.x = 0
        } else if (this.x < 0) {
            if (isTimeOver) return
            this.x = w
        }
    }
}

/**
 * brownliu/rain.js: 纯js的下雨效果https://github.com/brownliu/rain.js
 * 
 * edited by qtqz 2023.8.11
 * 整理代码，简化逻辑，提高性能，整合进此文件
 * 
 * 
 * x, y 位置
 * s 速度大小
 * p 旧位置
 */
//下雨相关类定义
class Drop {
    constructor() {
        this.x = w * Math.random()
        this.y = 0//if 50,=50+-15
        this.s = 30 * (Math.random() - 0.5) + wind_speed
        this.speed_x = this.s * Math.cos(a2) + (Math.random() - 0.5) * wind_deviation
        this.speed_y = -this.s * Math.sin(a2)
        this.px = this.x
        this.py = this.y
    }
    update() {
        this.px = this.x
        this.py = this.y
        this.speed_y += gravity
        this.x += this.speed_x
        this.y += this.speed_y
        if (this.y > h) {
            //只处理超过底部的雨，溅水花，在别处处理超过两侧的雨
            if (isFadeOut && isTimeOver) return
            this.x = w * Math.random()
            this.y = 0
            this.px = this.x
            this.py = this.y
            this.speed_y = -this.s * Math.sin(a2)
            if (hasBounce) {
                var n = Math.round(4 + Math.random() * 4)
                while (n--) bounces.push(new Bounce(this.x, h))
            };
        }
    }
    draw(ctx) {
        var color = ctx.createLinearGradient(this.px, this.py, this.x, this.y)
        //color.addColorStop(0, 'rgba(66,66,66,0');
        color.addColorStop(0, 'rgba(0,0,0,0)')
        color.addColorStop(0.5, 'rgba(223,223,223,0.6)')
        ctx.strokeStyle = color
        ctx.beginPath()
        ctx.moveTo(this.px, this.py)
        ctx.lineTo(this.x, this.y)
        ctx.stroke()
    }
}

/**
 * @param x, y 基础坐标
 * dist 反弹力度，与风力有关
 * angle 角度弧度
 */
class Bounce {
    constructor(x, y) {
        let dist = Math.random() * wind_speed / 12
        let angle = Math.PI + Math.random() * Math.PI
        this.x = x
        this.y = y
        this.radius = 0.2 + Math.random() * 0.8
        this.speed_x = Math.cos(angle) * dist
        this.speed_y = Math.sin(angle) * dist
    }
    update() {
        this.speed_y += gravity
        //this.speed_x *= 0.95
        this.x += this.speed_x
        this.y += this.speed_y
    }
    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
    }
}


/**
 * @param {String} t type，petal 花瓣，leaf 落叶，snow 雪花，rain 雨滴
 * @param {Object} c config，访客配置
 * @param {Object} mc master config，主人配置
 * 定义基本变量，定义通用列表，分别定义每种类与方法
 * 进入if定义随机函数，定义start函数，调用start函数
 * 
 * main code by https://github.com/tangly1024/NotionNext/blob/main/components/Sakura.js
 * MIT license
 * and https://www.lifeee.top/posts/64617.html
 * and https://qiu-weidong.github.io/2022/04/30/blog/sakura/
 * 
 */
//const createFalling = (t, mc, c) => {
//}

/**
 * @param {String} t 类型，petal 花瓣，leaf 落叶，snow 雪花
 * 进行基础操作，进入循环创建
 * 利用getRandom（已被定制）定义各属性，进入if创建实例
 */
function startFall(t, mc, sNum) {
    requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame
    let canvas = document.createElement('canvas'),
        zIndex = mc.zIndex,
        ctx
    canvas.width = w
    canvas.height = h
    canvas.setAttribute(
        'style',
        'position: fixed;left: 0;top: 0;pointer-events: none;z-index:' + zIndex + ';'
    )
    canvas.setAttribute('id', id)
    document.getElementsByTagName('body')[0].appendChild(canvas)
    ctx = canvas.getContext('2d')

    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        w = window.innerWidth
        h = window.innerHeight
        canvas.width = w
        canvas.height = h
        if (t == 'snow') {
            ctx.fillStyle = "#FFF"
        } else if (t == 'rain') {
            ctx.lineWidth = rain_width
            ctx.fillStyle = 'rgba(223,223,223,0.6)'
        }
    };

    let fallingList = []
    //每个的创建步骤
    if (t == 'petal') {
        for (let i = 0; i < sNum; i++) {
            let someFalling
            someFalling = new Petal(
                getRandom('x'),
                isFadeIn ? getRandom('y') - h : getRandom('y'),
                getRandom('s', t),
                getRandom('a'),
                {
                    x: getRandom('fnx'),
                    y: getRandom('fny', t),
                    a: getRandom('fna')
                })
            fallingList.push(someFalling)
        }
    } else if (t == 'leaf') {
        for (let i = 0; i < sNum; i++) {
            let someFalling
            someFalling = new Leaf(
                getRandom('x'),
                isFadeIn ? getRandom('y') - h : getRandom('y'),
                getRandom('s', t),
                getRandom('a'),
                {
                    x: getRandom('fnx'),
                    y: getRandom('fny', t),
                    a: getRandom('fna')
                },
                i)
            fallingList.push(someFalling)
        }
    } else if (t == 'snow') {
        ctx.fillStyle = "#FFF";
        for (let i = 0; i < sNum; i++) {
            let someFalling
            someFalling = new Snow(
                getRandom('x'),
                isFadeIn ? getRandom('y') - h : getRandom('y'),
                getRandom('s', t),
                {
                    x: getRandom('fnx'),
                    y: getRandom('fny', t)
                },
                getRandom('o'))
            fallingList.push(someFalling)
        }
    } else if (t == 'rain') {
        ctx.lineWidth = rain_width
        ctx.fillStyle = 'rgba(223,223,223,0.6)'
    }

    function updateRain() {
        if (drops.length < sNum) {
            if (Math.random() < numLevel) drops.push(new Drop())
        }
        let j = drops.length
        while (j--) {
            let drop = drops[j]
            drop.update();
            if (drop.x > w) {
                drop.x = 0
                drop.px = drop.x
                drop.py = drop.y
            } else if (drop.x < 0) {
                drop.x = w
                drop.px = drop.x
                drop.py = drop.y
            }
            drop.draw(ctx)
        }
        if (hasBounce) {
            let k = bounces.length;
            while (k--) {
                let bounce = bounces[k]
                bounce.update()
                bounce.draw(ctx)
                if (bounce.y > h) bounces.splice(k, 1)
            }
        }
    }

    const asd2 = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        updateRain()
        if (isDestroyed) return
        requestAnimationFrame(asd2)
    }
    const asd = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        let l = fallingList.length
        for (let i = 0; i < l; i++) {
            fallingList[i].update()
            fallingList[i].draw(ctx)
        }
        if (isDestroyed) return
        requestAnimationFrame(asd)
    }

    if (t == 'rain') requestAnimationFrame(asd2)
    else requestAnimationFrame(asd)
}

export const fallingCreate = readyCreate
export const fallingDestroy = destroyFalling
