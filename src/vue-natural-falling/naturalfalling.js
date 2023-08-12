//Natural falling
/* eslint-disable */
/**
 * by https://github.com/tangly1024/NotionNext/blob/main/components/Sakura.js
 * MIT license
 * and https://www.lifeee.top/posts/64617.html
 * and https://qiu-weidong.github.io/2022/04/30/blog/sakura/
 * 
 * edited by qztx(qtqz) 2023.8.8
 * 改为普通js模块
 * 加大花瓣最小速度和大小
 * 往左飘改为随机往左右飘
 * 可以停止飘落
 * 优化性能
 * 
 * TO DO
 * 支持飘落树叶、雪花、--雨滴--
 * 
 * 使用
 * import { Sakura, SakuraDestroy } from './sakura.js';
 * Sakura()//开始
 * SakuraDestroy()//结束
 * 
 * 
 * edited by qztx(qtqz) 2023.8.11
 * 整合
 * 
 * 
 * 
 */


/**
 * 创建樱花雨
 * @param config
 */
const id = 'canvas_natural_falling'
var stop
const destroyFalling = () => {
    const createdFalling = document.getElementById(id)
    if (createdFalling && createdFalling.parentNode) {
        window.cancelAnimationFrame(stop)
        window.cancelAnimationFrame(stop + 1)
        createdFalling.parentNode.removeChild(createdFalling)
    }
}
/**
 * @param {String} t 类型，petal 花瓣，leaf 落叶，snow 雪花
 * 定义基本变量，定义通用列表，分别定义每种类与方法
 * 进入if定义随机函数，定义start函数，调用start函数
 */
const createFalling = (t, opts) => {
    var staticx
    var w = window.innerWidth,
        h = window.innerHeight
    var img = new Image(), img2 = new Image(), img3 = new Image()

    let FallingList = function () {
        this.list = []
    }
    FallingList.prototype.push = function (sakura) {
        this.list.push(sakura)
    }
    FallingList.prototype.update = function () {
        for (var i = 0, len = this.list.length; i < len; i++) {
            this.list[i].update()
        }
    }
    FallingList.prototype.draw = function (ctx) {
        for (var i = 0, len = this.list.length; i < len; i++) {
            this.list[i].draw(ctx)
        }
    }
    FallingList.prototype.get = function (i) {
        return this.list[i]
    }
    FallingList.prototype.size = function () {
        return this.list.length
    }

    var getRandom

    //petal(sakura)
    function Petal(x, y, s, r, fn) {
        this.x = x
        this.y = y
        this.s = s
        this.r = r
        this.fn = fn
    }
    Petal.prototype.draw = function (ctx) {
        ctx.save()
        //var xc = (5 * this.s) / 5
        ctx.translate(this.x, this.y)
        ctx.rotate(this.r)
        //25,30
        ctx.drawImage(img, 0, 0, 40 * this.s, 40 * this.s)
        ctx.restore()
    }
    Petal.prototype.update = function () {
        //每一个的fn都是不变的，匀速直线运动，匀速旋转Math.floor()
        this.x = this.fn.x(this.x, this.y)
        this.y = this.fn.y(this.y, this.y)
        this.r = this.fn.r(this.r)
        if (
            this.x > w ||
            this.x < 0 ||
            this.y > h ||
            this.y < 0
        ) {
            let ran = Math.random()
            if (ran > 0.42) {
                //0.4//较大可能，顶部任意位置
                this.x = getRandom('x')
                this.y = 0
                this.s = getRandom('s')
                this.r = getRandom('r')
            } else if (ran < 0.21) {
                //右侧任意位置
                this.x = window.innerWidth
                this.y = getRandom('y')
                this.s = getRandom('s')
                this.r = getRandom('r')
            } else {
                //左侧任意位置
                this.x = 0
                this.y = getRandom('y')
                this.s = getRandom('s')
                this.r = getRandom('r')
            }
        }
    }

    function Leaf(x, y, s, r, fn, i) {
        this.x = x
        this.y = y
        this.s = s
        this.r = r
        this.fn = fn
        this.i = i
    }
    Leaf.prototype.draw = function (ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.r)
        if (this.i < 25) ctx.drawImage(img2, 0, 0, 40 * this.s, 40 * this.s)
        else ctx.drawImage(img3, 0, 0, 40 * this.s, 40 * this.s)
        ctx.restore()
    }
    Leaf.prototype.update = function () {
        this.x = this.fn.x(this.x, this.y)
        this.y = this.fn.y(this.y, this.y)
        this.r = this.fn.r(this.r)
        if (           this.x > w ||
            this.x < 0 ||
            this.y > h ||
            this.y < 0
        ) {
            let ran = Math.random()
            if (ran > 0.42) {
                this.x = getRandom('x')
                this.y = 0
                this.s = getRandom('s')
                this.r = getRandom('r')
            } else if (ran < 0.21) {
                this.x = window.innerWidth
                this.y = getRandom('y')
                this.s = getRandom('s')
                this.r = getRandom('r')
            } else {
                this.x = 0
                this.y = getRandom('y')
                this.s = getRandom('s')
                this.r = getRandom('r')
            }
        }
    }

    /**
     * 
     * @param {*} x x
     * @param {*} y y
     * @param {*} s speed
     * @param {*} r radius length
     * @param {*} fn fn
     * @param {*} o opacity
     */
    function Snow(x, y, s, r, fn, o) {
        this.x = x
        this.y = y
        this.s = s
        this.r = r
        this.fn = fn
        this.o = o
    }
    Snow.prototype.draw = function (ctx) {
        ctx.save()
        ctx.globalAlpha = this.o;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore()
    }
    Snow.prototype.update = function () {
        this.x = this.fn.x(this.x, this.y)
        this.y = this.fn.y(this.y, this.y)
        if (
            this.x > w ||
            this.x < 0 ||
            this.y > h ||
            this.y < 0
        ) {
            let ran = Math.random()
            if (ran > 0.42) {
                this.x = getRandom('x')
                this.y = 0
                this.s = getRandom('s')
                this.r = getRandom('r')
            } else if (ran < 0.21) {
                this.x = window.innerWidth
                this.y = getRandom('y')
                this.s = getRandom('s')
                this.r = getRandom('r')
            } else {
                this.x = 0
                this.y = getRandom('y')
                this.s = getRandom('s')
                this.r = getRandom('r')
            }
        }
    }


    /**
     * brownliu/rain.js: 纯js的下雨效果https://github.com/brownliu/rain.js
     * 
     * edited by qztx(qtqz) 2023.8.11
     * 整理代码，简化逻辑，提高性能，整合进此文件
     * 
     * 
     * x, y 位置
     * s 速度大小
     * p 旧位置
     */
    //下雨相关类定义
    function Drop() {
        this.x = w * Math.random()
        this.y = 0
        this.s = 10 + wind_speed * Math.random()
        this.speed_x = this.s * Math.cos(a2) + (Math.random() - 0.5) * 5
        this.speed_y = -this.s * Math.sin(a2);
        this.px = this.x
        this.py = this.y
    }

    Drop.prototype.update = function () {
        this.px = this.x
        this.py = this.y
        this.speed_y += gravity;
        this.x += this.speed_x
        this.y += this.speed_y
        if (this.y > h) {
            this.y = 0
            this.px = this.x
            this.py = this.y
            this.speed_y = -this.s * Math.sin(a2);
            if (hasBounce) {
                var n = Math.round(4 + Math.random() * 4);
                while (n--) bounces.push(new Bounce(this.x, h));
            };
        }
    }

    Drop.prototype.draw = function (ctx) {
        var color = ctx.createLinearGradient(this.px, this.py, this.x, this.y);
        //color.addColorStop(0, 'rgba(66,66,66,0');
        color.addColorStop(0, 'rgba(0,0,0,0');
        color.addColorStop(0.5, 'rgba(223,223,223,0.6)');
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(this.px, this.py);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    }
    /**
     * @param x, y 基础坐标
     * dist 比率
     * angle 角度弧度
     */
    function Bounce(x, y) {
        var dist = Math.random() * 4;
        var angle = Math.PI + Math.random() * Math.PI;
        this.x = x
        this.y = y
        this.radius = 0.2 + Math.random() * 0.8;
        this.speed_x = Math.cos(angle) * dist
        this.speed_y = Math.sin(angle) * dist;
    }

    Bounce.prototype.update = function () {
        this.speed_y += gravity;
        this.speed_x *= 0.95;
        this.x += this.speed_x
        this.y += this.speed_y
    }

    Bounce.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * DPR, 0, Math.PI * 2);
        ctx.fill();
    }


    //每个特别定义
    if (t == 'petal') {
        {
            img.src =
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAgAElEQVR4nO196ZbbSA/dBaqopTePd3u+NTnJj7xmfuU18gh5o5yc+cZLt+2x3d1ayCrkAFWkihTVbnsst+0RZmhSFEWxRRC4dbEUDnKQgxzkIAc5yEEOcpCDHOQgBznIQQ5ykIMc5CAHOchBDnKQgxzkIAc5yEEOcpCDHOQgX0Vonz/jH//7/+z3LhEhxIA6BnjvAQGwqiGOQOSwjBEiDXwQ0BpoYoNlXGAmHisPNBTghFHVjKaOWMcaPkRMVw3ePY6gAPACWJ84nC7ETv/2gcf994TgAI4RM5rij1M9J/CsfoDLeg15d4U1LyDrJYJbgeDsclfTFSarCUgIdVXDN862SRhgglBwHCjKlIVrgayA2oWv8lP9j//1P7/KeW4r/pt+219IhMQWDpQeXwKq2sE37AASwHsX2DtxFYgqRHIcPEFk2XC8FEiz38d+v3JQrK8sEQKJES6CfD058/X8KZgfAjJz4uYgnkGNU81HRHwCIQdIoBAvqYlvReKbeL1+uZyszpfTuDDlkh/vdzgo1p8Uve+BIkJWqKnzzLOjM1fPn9OMf5UZ/43Y/x0iT+H4Phwf2acILIIGdfOH1PW5hPqVuCYiNIFqX0+vYmzi+rw+wepHNFwHxfoMEQIaB0TSRTGXGE6b1x4zrsBcPZ356r/So9OnAvonQP9FQL8C/BxCjwFSy+UQ5b004S3q+hwk1yCZUoO5EI4AWSDGOYGO3ft4BS+r6BkUf5ifyeSgWDeI0EaJdKEoOL6OVRV4WkU6raJ/WDn/7P7y3r/dZPo8Vvzf2fn/JuzuQRfiBwSekeJzdWdRgKYRCWFJMTIce1TVBMBECFMimQowUbeJGCfVej3zC/jmzDX0g5mtg2KNiFoidW8swHxN07N3dN8Ln/lIzx5dT/6FafWEyP+dfPVv8pN/S1X9Q7y/z94xnAMRJx/pyEauEDG4Lmp2omoZTcUr1vIzMM3I0Rw12Tacm8HRjIjmkyDzGa+m104aPijWjylmUPJ/IKKH53w2CfR4gumvrpr8E+yeYFr9iunkX5hUT8n7Z6iq5+TdCbzSBQ6kisRsumTSrqPiLwEF0u8hMGbEmMHFKRqaiqMJMU3guELTTMCoBFJBYjVZx+mqXl0ZLPuBQPxfXrHUOkWzKBHz6KZznj6ujqunHv5Xcv5XmfhnmFR/J++fUOWfYzr5B9jdJ6YpvAcp/6TqIlmRsoWy15I1gZMbhVNXaFasEqIJxeCNagiklMNEGBMiVCJxiuCnmISpb/wUXPvlETdfidL6JvKXVSyjBSTCBccz4vvVbPqocpNnPJn8S6rqGbx7It4/dc7/isr9A849IXanUHc3ADzUUyTzeflLJDMFomwqzBiC9VVleCpgChi2mgnJjIRnwjQH88wW52bs3Pzo2s0uT+RyNRNUSpz+AG7xL6VYepODqpQIptH5afQPJlQ94/nsnzydPBFTpsnf1DrBu2fk3HNy7im8O1NlIlUoRjZNYoqS1rS52ZJRfzZhlK2W0VXZ4erRIu6UgIWIrBCVY5cViJcgXhNpnIBWIrSK3q/ni2p98mFVv38cV3rqg2J9R2LuLgpmUlUzmj6o3PQ5T6rnqNwzmVS/SlU9Ie8eofJ/UxcIdX1E9+A4uTe7mRnoSN7mbJ1cAufpjm+OlfZ9yVYN2YJF2zEF6BcQ10BsAGqQFKpRFgNAbQtxI1Ou733k1WrSXKyPWFy972Dcn5efXrHUOkGZcOeqmZ//4vnsObz7Fc4/FeeecuWe0KR6Rs4/hfeP4N3fwe4hcb51rVKpxULh6Vog3bNU2Yrl96lVMsnX0R6n3lSMUD0BYQWmJQQLRFzrtji3gHNH5PyxiCxlUi1cwMm9K7l+Nw1XTi8uft+a9VMrVkx3G1M/O6mq6TNTJnbPiemJjvJIcVNlVuq5vseOnyT+qT2DoMNT7TqicG8ZqHdDttZVom/ZTLnY9qXdCuQB8mbOTgFcA7KGusUga7hQC7saHGvi0IhztUylOV5OQvNx3VydYcXfudH6KRUrqVOEsY1ufs/72d+g9ADTI8VM5PiJOPeYvH9K7B5T5RSsPwflcEsyN8k0KSfVjvoMhCOxpt1IkPrWi1oQT5t9yNYrImVe2MAh81yRp4jyEERR3Z4tlleBWkA1yNXEWIvDWipZnSyxDL6+aDxF9x3TDz+lYlGIYD9x08nkIfnqSfT8HOyeqYsDk4Lxp6y8lCqWd0/g9D2ebIK92fK0iqNLLHwgpwMtzCLS6dzmAlptKpQvn1bTY0wxuV3UksUjsDsBxQWYrkG8IOYjjStKpCMQHZFue3fkJB4fr+T6j1lzGVX1vukve3v5qRRLcYxSCFM38W569FS8fy7Mj+D4GYifEvEjeH6qLhCGqdyv5N0DIU6/Q+vGzANS77W0ACsWoCpbNbK4YWHFeq6RkG1UG3s2UK95WKJYyYnmNhBFOhVSpbJlaQtoBeaVuUjENZjX0bnVdC3ro+u4WlVN7QKP/BJ3Lz+NYumN03QBnh/N3HSumEmt0FMiegR2mlnwjJgewfnHRiUoa878wJzUMDWlpBSyJPcl3bf1jpVWdTb2wxSzxVcGrwgSkhUzUrW1WjaqZCDEKZjvgUyZaji3Boc1RVoJoFTECixLMC+FeXV8xYtw5t6GSimy74+W/ykUS60UicNkOj+lyey5kCoRPybPz4jcIzgD688MsHvDVr/CudP04QIFD9dCG/a8A+ED/BRL5Rsgai42VKG8ZV6l10JZdTOgN1crJ+Q0oyEuJMoRhXAk0dykYr9jgizF8bV4OubollUti8VpWLjvMPPhh1esGCM8GNPp0UOqZs8FeKLgHAbSTZkeG2hn99y4Ke+egnjenYBK0D1QDEEH2qUM0XTvy8jnCqVr8Rmooy00QC1GksbOXWr6NHnNxxEnldxT10chrqTyK4S4JpG1iKyVPAW7JTiuYyXrk5VfLJt6uTiNcnw5T7zZdyI/tGKppfK+cr6aPaJq9ncwKan5OIVf+LG6QqjlcvwYlXJV7pnF5jAyVqeBybEwTXmjZHOcoO8qh6ZqSFEwFQpIIKfsPyUKQgOAMYN4HSUGOiaiM1GXaO6PV0DGXEQrYl7C81KEdaS4OrucrMU3f0SX+dp9/NBfIHtVLGn2FDVVkM4Enkydn508NgzFeAQF6kwPSUd/zj0E8UNy/ACe75O+Zq62fvqxRCcpXZyM6ldnprYUNNMPGfxTa62QR4mkaIxBHA1nte8bs5Gtmyjjz0o9UEPMWgoSjIJgFsu9EQmoWKKrw6TmeP9DVX+8H66YHPTo70G5fliLpS7FVdNfhPCQJN5PxCbdI+JfdA3gHjm+B+9+IcdKMxxtg6DuZBvr1AWUbzgGGFeqVjgpS6ezTD3aQat2zG2V7rKlHhTIR+fh4y/ZBdaIsqaGVpC4hkTFWUuKYYXIy+jj0js+mzfr1aIKjUyqgpy9O9mrYnEue/paYvnlEKynhCM/Owa7BxC5B89nIJwRYGsQnZlSOTolx7/ApSDyqNwqNXN4lwYK1m1ugtStCvUwHAo8xplqsJQdTuBdKzCcbmvIp9LMhzOILCzc42iBEFYatKYYloi0QnQrkbgWR81cfN2E1dvruYuWaDjEg99YfiiL1fKTE7gJvH9gForNQqVFt51XC3Uf3t8j7+7DuQdWZNhJnxFPJy5ohKEbbA+WESvQZoq2lqi0iO12F+IpR5L6UdbsdwuMi0tZNcbDeQ2Wu0xwQDMgaqNiGwriOJKOViI3iCEixkDkgjgEYrc+Jr+OYflB6x1ppzn9NrJfxaq+HnnXxtjIe67c7EEE3Sei+zDXx/eJ3C/w/AuxKdUv5FTRFGfRZHOSMTw1dIEyeKtNjxmM/IgGCgVs+Ube8Z3ckqmZw7JtzjSESwFqY8Wcgip161r1ukCgFcW4FInXiLREtPKwBREWkenYudnpacByFRbru6bk96tYX+mPU6VauXTCOVdn0fMvEDoD8SlYgS6dwvEZsTtTt0eOz1KpFR1vwjLFTW6VJ44o1ZBeGHMpnHzbqEJ11AX1larc1nNyynCwrFK0LtFlPstnUK+Y3VfEdKKsPAVW15eUK7o1YlRGfqXpNhpPVFLVT6pVHfkCnuDuMHFrz67w6/j5dqTuqukRUfVQBPeNNU91evepqh6S8zr6e6ghGjj32FygRVBygl57RSKb2N9N193xogNl3AJLBaVQXvBtqh84Zz2oUnGwka5iLBv1SiJSk8ukUyJaSaA1hbBWa0VgBfZLIizBatFoAQX1E7+ao1pIo3ny/NXuwefKfukGrv78OQywB8yEpy66R9Hjgeacm0J5pRKq+1TZ61/IOcVZOkJUzOUSzBlYinY9DOP0ZOTNdlTIRW7WGF67jZHgVrFpo1yc0pct3MPcBbrNcHlicXzKNS8khpXEqAq1ArAk0sxT5bywJEdrVG7taLpcLeJyvV4G5ruJJe5Zsf786VOGChOTuxeVOvD+TBdNFybvTuH8KWl4xtyhO9ZQDTFPv+yCi+0xxeMcmukOuIEc3dou6Qb7kzrXa3FEGyU6s1Qd9xWyizRsSXPxzSmFuCQJ1wCOCHIMaMErHYNE8da1ogUtfPWumvu4vLQo5h0Yre8cY4lBEOeqY0wqVaRjXcDumByfaJYlUnrJMZiPQXRCzCdbStEm5rX/CnaAdtkA9jLeXNIFKCxAx0N9grYYKNXWRnaBKW4omUDNKc9ROvdNnmZaHiaRJhCZKidBWuxqpWLwWi6GqGlawRGRD5zOiTswWnu2WH/2BIAXME2rE3g/J8dawXJErE+oEZ4a/jjWpxdanq5WC6huhBWfCNhaCswwZti9V74olx0H02abBidJCpSzEgibJ4FzcLq9Tn2tL1IIyItzXkvE0r1TlC+eolQSopWQQWgKiRN21ayeTPy6XjRMX5dPvI3sV7GqP2ey0qDIn9hIj6BKo8uJWqa08KmtOW1b95beBRTUweB1937HW7UWbMiwd1eTjVehde2myA4qo/voyOlyHldXgEEJX1n8UOy9NvhnCpgwmSfG3LJOEdVqzURkBopT0nWUiQBTEKaRMPVwE19zc6uBxFeW/TLv/stNljkEx0Q0ydaJNHVErZW6v7mGaLQMPb93nJVs9O/ZUqqysEE2SiWtog1dackcUBn7K/aVMrBWm/MMwkCSKAvTrVwNREUkWfK1WaZqIvIY0dxdBZGJxOgpRo9ATrzRpM4cqKglIw8mp5kTuIPCi70qll81X/Q5cxOVB3ylUf5krVKo5l4qmYISo/dhBKmRpA+JLPyxdS4Zviix1fB7842XdtRY7seIYoxe/PYBOz/SKrAOCgSD9ATZeMgS94l40QrqED0FLcWHN0WzrI2oFquCaCO3OCHnp5hNL6327RvLXhXrS8MKhj5cdUx+8ghRA8xGIdwnp3V+7gxsJOgptDKZ+cSAfHv3R0D7l1x5eyIaKopQHwwPU2Sww5LtjFXm7+il4lBB0hYumywKoJGEmXaoAdEUkIm6PrVgtk/XYhZNo9GVEhgx7ivNZLfsd1TovgQ0Sgrtaee7qCMf0h9Q2edKtU1NPDElU0/QpeqafGLbjd1IV+04qqWseg9GFxccoRiGfFahRD112uU6y/dksyN9TVawkA9KlC+LRZrtKM2gV7FyNFsrptJGkyFo6hKF+GWe48/IXhVr/YX8qBdyTmgCNfnsNIeqsifTFh31ID2d1veAZsA4ttpOdckyDDr3ULZswjVDF7ilUDfgqe7wT+CxrVMWTH8bGgI2VUPIQ9fu8tvN4iRRibGoiExbcBGHb99NZK+KVVdfZrGqmmcQHAnRnAgzSyVOgD318NSGGe0+U6zR0xTZCQN81Zkk6t8wFDeyVIhdSnWDq/8kCNgitHYw/aU93eg/28LEiKRrrfJhsf2U4kAO1qiLjmeg8O2TWPb6jdP68zGOjbJJm4/xlLQRGWkzGF3T1LbJtlWh5nmEmBRLBv4vP+3U1v21ijFUrq0bOlzvyBIdHr91itLKDT43irey+mxZL+ncYu4FwRauYksndRQdi4iDwgNhVSdHmnwjeoy2RPKVdv++6Tffh+x3VPiZmNHCF+Qm4pVWsIKHuRGfoLkthI3lYgOwcwx55R0GoGcheu6R81C+ULjy+JuohMH+LZ0YnqM7YAcDu7Wv5ceK4y1GwwrOvUEAh4qEKxGpSKQSSeQpSTT8STp6XH/7Mp79EqT0OTwWpcoVoTlE5ogxuTyYq9MW1tlamTJNk6LRbJv03IHWy04epSscsphfm/JpFXHUeN/EoN4QKNfBig1cbJTj0uDFkLsGVRXMM4JyXkISI9dx/XX/plvIXhUrfuaokMGORC2VAXRrQEbWk7PDVbOkVFnJQMXwYJDh2XGgIznsvTih9O/vWLrMVjC5GDFuWaP8Ysulbh00UObi+3rvbegHyg+H5GZd1jS3bdxFyH1CJNH3Ct0tok0U3E9GkNJn8EiJHKbKGr86TJAohcroBMlxMYuNcX5S9SmV4Z0rZKAtu1wkbrBaQzfYFklg5P3eKQZhn7H9vUse4bvGfruNV+Q2PzVrOOX/uHMTuYeSYvnqZ4sVxlv+PZK76VMTvBiD7FJAlZRSoAqsa56AuHWB81R1Q/0nva2GKSLNqVvxrvgfbgDvg5tN2K1UN352a2P7A61V3BVzHP0cFdfV6pzlcaVekobtzSJrytFOZ7wv2TPGup0JNkJvHR0FOpWKjy2YzHxMsNRjDS5r6nHKudLUGA3tkCpae4LyZvZd34ZvbDvGDEI6JTimEYUZc3W7RoUlnhrjpkb/+JEeXOV2y7h3lpc0lUadXGpdQkRCLX0fi0BjpDZNQ+QzXMdXkr0q1uTWoxELVRyJcydgHKeRoKbBaNtqTs1eDbjz1KyXtq5GETCmokfVrgezi/9R30JgBw1QbpclXaOY6tMUxM5rAm5hqTZKlT+TXCF1Se0ZZ9HGRaZ8Gw1CMlfVz2WxmltU6bS64Rpl19mTjXLIZYyVt/MIiOCsH7phrwG2ajEMcS++tuGxRtzhLkA95J9KpdpBNWz9QbuHgp8nNPogcJ6lwGJf+XUeKXLisayoTMNdlh+u2980rrNXxdJZ0j4l+sz5dfRo4hRe3ZsRoDPSkSHoyKgH0VFhTuYjyxTN1z04fxepGYz2ICMWbcdNH7FEN8KknZ8dDlF3uFj0rdUw6C1t1mFpnXW6FH24mD2iVHmQ44k5pczog6j7gfQwyrfPId1vPtYtHljLFgkKyK1Vz5GGcrqMUA3ncCZGlXU3TqsN4QxvVnZ1XfXNoO3QrcvOSzKydIdjYH0H1TAqYwz+TccXDXGHI9qOXshBHOlwVoojtotIJNFGD98cYu1XsdziE9a3vS9BcZObZhfn03WpKzQzXiW+ylxlSsntNZQtRAYvRi3WUIYKSturXYAet1CqrV0FEO+RtvndYX+I4WYeqGh0ULSziDWOF20YEjXviphEdFvLobW7r+Mo8cZat73IfoPQs5tPr79rtQ6e6zgV0lRbN00su1mpWeqFzil0I2jdYSIxev5JBlzVJ37HDsQP9t12JLf7pDf9tTu2i7c/YcEKK5wbbOXqCyvjQVSuPaXeks7XGoViFIk6wdPPlY8VbwHeadHk9GLDUXn0R9o2UVNiplpKoY1nyfEUTgPRQ5dSWqNtlyfl+2P9F3qnolEjcZN3+6TIiMVrr3t4stJ4bo0Ue0xrtKkSCY2QTjxgM/Q02vpIBDVZ9pYEEAU0TYTzP5fFqurddINxeE0kamQi3ldwbkLO2QxYaeRn5OjEiFLOC9ENGV63tDCjPFMfL3VwvcVVt+Tjdkqb8zKGsaTt9Nd2MU0HWdJeoUzSx4wtjsp4K1MLKYSTZi5ny8nSae74LjpJ3lldoQ2WNWjqnBfvdETjkRanQ+aUIZqG05Tcn0vczeBEw9HeToK9eL+7oaMattG77tgCB5UWaCtcs+OPpjGlos3MFd0ni9Hh4FydIaPuUBqUFGU8YHO7RGvQphZLYiPS/FwW66bkBkml6vpceYsF5qoSSzt2PEmKRhPKqck5qY/H3cNI9gJGFAnYAH7aZYkGMcZS94aP/lah4Y743gDs/5kWQ8mOxZDm2qHa5t5BrAGpjasinXSAg83PwxRs3uk7mPd3v4oVdv+A1AhoHY4AbgtOtTOMLifQ0nHSNR1bzSA0lIOjrtizOy1nfWof1m2MVfZY3+75OBztDS+y2LjBde48wegg8U+6VdilN6mkVaIB+dRxq30t1krS5vVUpiHGn65gNbpxk2X9Q9fBcSNH4pES9yTN3We4SmkFseBzZaFloyA2v47cxv2N7duiDdpVH9+U7/W2t5RzaD1HlK3nJsc+V+yjEfc7LkpNhVxiEZJy2RK690isnMImWvkKzVk+V/YbhB6r3UOLBiSFItilzCJWbdPGopQyunPuNlFXkdNRSv3TjudhbXmmHZ4K7chx7Dihkc9Rf90zfCNWsORrS7Ydw/5Zw6/oiK3xS84T2SVXy8U5M4EakZL+nKObWzbtR/ZLkO7CWGlGeJ37apLr4yY26XYiSRPDzsiMO1KK8i4XIqUy3IK/GsHYW+6Jyidgh6JgUEWzkxkYnlS236OBYqN9gnb9IZbMT5vvkrLcqN1WFxkMu8flrhPtTfZLkE63fbvFBhshH+OROD8jZ1PUzsmmq6UpJd5KCycUwE8sPUYn4R6pspJ2hNabPeIGrmoHxOq5QdmlgAVTvpX5gOHBI7tu668/9V6uMkyTZQYD7FZHj7rbFgXw1IhirBAahJ8NvI/1DLBiyqAc8YQmXJnSaLGSjgbZik9TESq0wkQ86YhQNtmifS/4CYph9KLaz7YvC3CPMd0orUm5fYNvHXmrF1y+KZ9LCs1uv6M/82ZMI8GMr8hGgiFNS9dhLZtERZvfqs3iP9325/NlzwTpIJKgf676x1XwIjIhBexafCqUF3udQXxXQj5HTmsTkoG5Gops3pMblAefcIW3lpETlgra8as3HNftpmJdXj9hM21r+8fFzYhQWjBrP0hMChZTuMdRiBUHcj9ZXWEz+IOsSbDOfRNlHtXl5WpmQNoRYa4fVMyl9YTJJdqHqWWo88nKVg1xt/u7aZ6GUYUausDRAd3okHNcz8q8sRZj37qt0MB3J9ylqcftqFBphya5QKzNHeqcO9plWbBCE3SigT8fOfgC2TPd0P+DNEzB1gAKU8NWPeXKID4rFlk4x8q+bKy8SW/vo2RCmwI9bEibXmySLMtP7QgC4waFKo+jQVxvdIQ4UKqdrhblB4o0nx3XEuUKItc23a9At68AudS1xKCvtbvMpcRwKfXyiuMI6/8N5NumJqtKrWoXNQnNk2aL6vdXlDNGKSemaSap4a6UQZrvz/iv0x8UlTvR3WkptaZsxpYxE+1yT+2+MSDfNgnZwV3RTTiqd2B53Z8AizHWElWJ4iVivBKJV7pGDNciuEbElfV+h1xL3VzF9SrSZ9V2fj3Zc7eZ4vSSi46p0VCNt+m2mR25BOAthGNA3lW2zwLPmuGA8ZuX8YepTQlyt8rmB6G0z3l8d1mZHUTrxv1h8107G4rsSvzD1gNQyMKmQAF01vulubtuW5L7E6w0poGIFVmx9B2Yq/1X6RQtA8jGM1oePod3M0rl88e50cdx15kP2vZRtPXjiYV60pm27y4VytVOndummhA27a6Hg7SRUeHmgm9Qpu2/bvCauodnc4KRyp9dxRjlziGNstFUnXFiDUEtZPiqLjCW4qtgkzrZgob85OdUrF7+PtnLCSKd5A7Hx10actejIZXSWyU0WS/Nza8yzMOSfhEq5en/NtOTFOokA2v1KfqIBko21OthrlSZxzVqFMct5VZTt+5o2VYu5aeipPmhRZY2K0WyUgvRSZwk6nIFdYlNcwltjsX0iT92f7JfxSowluUXRapyV2Of+g+Qy91TuHWUXRlTr/HDGPHYY0lHmM1SuRJRLSUHMXLejigdOVXvO7uPUv/Abiq5fBwPy/M3CrhLqXrnLwcjCbR/BBSw4wrAR1sEBtzzPgX0lxJUwe4GtLey31HhcZ4fSf/AEEEfLRmNU72bdszPYN3AgG3nHHdbig/jZnxEKFjxEauTox3U/ktDzbnhDgzojf6hbTtt6h3S/3ABvEpQf4NiUYfju7KvRgG7QBaIsrBJmtRCRZ1yTidsSovoOjRXBjos8Hw31gp757FmmWtyBK8Tc4R6JuxScw+NCSpP5XhOXWM16381t9x2De+0JxryPj1d21ANG89RKlk/oW8Y8Rny+aNWazhoKEeHpQL0rrHkCwZKdZP08vY6PvRKzCrpokok18ntybVZpxg/2mgxxA8ISjncnQtsZb/lX//5sNl2fibkj7rAMuceDF0jNeR2RcptaVIfbs//3CSda9poVMfE55MOb0H7Xr8IqADS3UdlA9rLER36xmo33TAi2+kbiqU+KDeFiEtRd6hLNBeY3aBaLrlGiFdSq2u4Qx+YZb+uMGdbW377stFg8gQV+9ThVzZuL6UgVzk9JhVfdjhleHcG8cGCw+rfj5GnduNjirPtZkKlywAuL2GXCZN+RHqLLL2FUm1drJ4nLpOFkmVaMrUALHW2PUCWNpehzqUjYdkW2N+17FextKmq3hdtthqrCs6m5pgYMaokKUvuTKese4urjHH35W+7xf+UAdqyF0ZrnXbMLGHx2U96iQLwj1mfXdJO1LlTecaAP7YflE5soKHZCoqtrrMbVLd3CSiIz5bL1vEjYngfvTS7c5W+rex9ZgqzVmvxTDwRLZLoWmmblfJlgWqX1LcrW768Ib3B3WBq3VJ5eix8/3OytY8GN31ExrDXFh7vT9lLw7kMMXxotq/NqnZUiZLrU6Zd3aAqVcZaraIpzkrKd1cTMo3JftNmvLPfzQVtuKolXlSRo9z7Spl1c3uTzmLllJnhdID97ZGAc+veOq/VYqrd+VnjLnBg+YbX0H5JqRRU0gxZGJ2ZG7VgWwgup1AAABAESURBVPtKHixZYdFgcqtUSikYtdDiq/hBDKjHDxLlD0DeUcvg3S1m72S/GaSUhmGaf2w56zb1GTbdUVJBXK68sTVlPmtzEmmHcjusSEdNSTdA6yVUSjEJk4xZqR3npNL8jcnY/kHwuLd9AwuPLcK3RoznEHkjIm8hcoG0foMob2wNOQd0HV8JYT3sNnDXsl+L5ZpUP6KcFTNbhaDluefM9sRdtWufgXwfX/Wsx+BGlGugUCJslEpuoVS9Vt7U4TQNUlOZ997TpYK/6uKCA5phqFS9H2eHwmp8KsZ3pkAR77JCvZOkTKpUb5Oy2XsXQjonNPJA49vnXe2S/SqWzgtnvVapYgXq1uTD0o01EF1h0+sq1w5SlXDWYDQ4JCeH+MrmmMkxw27m0gFKbzmtT/kK2eCUraodKjBYaX1sxT2ytA0iDH6QwXqA72Alg39IDBeQ+FZieIMY3+q2rYPovrdogq5fi+BDf17O7wRg7b0/lnYUCOx85ISnQLlpbWoIRqnq2fo8aU10Vi7Xa6rWs1Io7sTAUnWrIcFYVAvFrYP78qmR3w7vt/uE5XFDJSvWrTU0ojOemxLF+AYSL3RbbFveIJhy6f7zGOUDj1UsfSey37l0PmgDFHFO29yqK9QwMQuTtOXyOUZoj1obL2zxEXUP8fbvVihKdnW2J0pf+bqM3bG43/Cc2yM+6c1QM65126OMwi2OfY4GOKz7mI30Xif8hDcJVyHhKrHXb0FyQRLPA8u7MHeWoIw7KEa9jewZYzEocvqZFa5YKycuOyZQcYPTluQh1peQfFuZpO1XUM6XHxCrtz9xe4193LR1yBaXMPpy+01ZIUZzf4qnFGOJyB8ZW9lrc4PBLNgbnehEPGVa7jtgQ0dkz4l+jG6eMy09tUFg+j/1ju6e3TxZTO5S14VNJOXC7BrytGky0ib8YWPtuhDMiNXapVRbhmfEtHTXdRMAH2yPpSh35zOleqWLhPgKQV2hnLf7kuWKryQ2L0WaC9Ema5J+H+pBg+9L9ov2cuuKGGMLltII0KgFbF5LNzJ02yOqAQC/icAsqIcUvJWNAdulVFSetw/IqT3pKJ92s4zzV1t7lpD4AlFeSDQ3+BoSX0uMuv1KkoKdI8TXgvgmOL6hG8b3JfvNIHXEErQ2sE2Psdx27YLMmYE3XEWpa0XisXhIQNIgMDsgPLu8LGxGhd0M8Al3dT2nOvA0gtt6IHxopWSQYTFyezvuS42uZJ6TNp/vFUrY9jpbJuWm3mbA/lZsW92ftFSDjgrfRCD1IsrXvovW+15kz70bIscYnZB2ECCXZgXN88AgN2hlzgplfRpczyIxbeUvSeeK2v03jPJ6uli86A3zhykvO+5YLO279LNGy+8b7blVnDspVcwjPlMqSdhqQ34qMWr0Qv3GLBmw5pbd9y4xVuGmEvy7l/1irJV27WUNEYq0nXw5o2hdJ2ZRM+FD1ymldw/G3AltWOqBe5OSEG3dYY8Yle3az3JNRd48MMjNao8tRqsxv2wVTgqfWj4APWrBlEqt04UEY9cv0rbRCW/SdrhACG8EeC1Mi9RmNLFUOgk7pb74XzbA+Uay35DOvIouUO28b4Stn0BNlJuDaWGAVpOQLblhGFZpiuNisFOOEGPOAmXqt90uH92Wq5KBpYqDMM8Y/bDlsgbKFQuFLpRJZ8mljqjNx7SEbIliE/2hru1clJMytxfS2jiq8E6Csu7hLUJzDuJrJWsoFGHAgysEcFyZ1UKkGuys+WpaTJGslSGxtZsLZrV0m41Dz52Rt+IgSXNKN9YZp95M73aDe1PKfc4IqgvVUH9fb9RYWC5VrrZTX6/QYgurfTC6IGalUkWSjLHM/ZmCXVCMryPw3q4/xu/Z4+2UPbtC7VhIqUkF5fI/nb3YJsumtqW0rS1fU4muNM1q/zxjxqnnBgeTB2w9zTsmldzS2x3kZUfUjlEPxXWUyieUY42di71C0DCM0Qlv8qJUQnKBQZWqeSMSXkXIu26CK2vP8KOMBTeyX/A+I8RaJK5iYGsPjZBNTm5qgdQVJXmcVkM2t3+rzArbrg/FPhpTwrLAoqzVG3x8wDH1q6MpT1mXP8vbwLmXi0XIjY2zHwxWtfwSSiModSAtVxWUu7J9SitwDC/qKd42UVCts8v/QWW/FivhGiFOs8l2N6WlENqbZpilSENA8R5Kq7C5dz2gfVP/9u0c8rGD+seXu0srRAMg3m5w8V4RPM9NYLQk/vdMLby2UZ5uK87S7ZC5qhhfBe/eRk3KXn/T+ZT2IvsF7ytzBSI2OTGS+5Ps/lD00DRA31b2Kh6zSYe2OaedUlAOw8M/I3RD5daQON1yhS0l0o5eaQQTYolEdiZawTIVUiqMgfQQ3mUOS+OD76JOIWET0R8U6xNnZ+ikG2HV1ET1mmiyBkvbaicvkkaIqR4/teUpwyUlyZhDONRr9DGUDWAvveFOKVNYOgUZDhwGbrG3e5TMSqGaEF4qGLdcqhQLVAU7N5pBX4fmwtxh5c+1LRHJ5013/D3LngnSFNYKIa5d4JocG60gRjuExtoZktSEqM25G3KuhsQakUdubitDjFWmJOwC7zukDN9QMXFAz1LdkKmw+w9fIoRXkuJ9r7PVOhfpYoCvE3DH72BckEOUH99I9WS/Baurpd2Lug61rEM99VwTSOd6qQWyIitfcqvEZ8U1Ai11zjDhuCZxky1Ts/Uw0+cp05g1oNIgjRRT9JRqQ6RuGIW8n7tDFojxZY732SJpnQC74AIR5xTjq+hxIcKR49DN/viy3+a29TID2tis12HBV35RMS/I6uD8AkRLXYTjNYGuJMY5EV2DtIkYaXPbHb93ya63uwrOKmZCUQbvt1JYwtHmaDtd3yCDtHOb3BKsawnySq1Vdn3nlrgXDKy/Npa9Ca/BeBE93oh1af05XN9Q9tuDNE9ZqXlZdagvl1dXRzyv5qjcnCXqzKlXqdU2ZjZtnHWe0VEUzbXzQ0pj7rGSeTUcJkrRZWZwES0DPspNtY50RHnGRqVt/4VyZzvCjXEpSaFUsXT0d2HKZFkLFrpRWkH3vWhm/lwci//UfI4/sOy3YPU63e1cV1dH1B/Cqp752dTK6UWg/RlmgOR2kapQ1pEml9vjUX+wVsQJO34pjy25aLyWA702WaTN2mBzzQTr3ZnOc5RK+Uu+ijZlW0Ol6pp+tC6rAPjpu5YSlFIwfuqViLxCy1WJvITgHBEvQXgZZ/5t9F4ofPMpBL+p7Be8s927FD5T9fG4jMtmiiATbcZtRRSpsW2Vm9zOBDIxZYuYCIU5sTvZWK0tzKUVLe9znvhlGoJq36jYICgc1kZkNiXIClHWpD232D2A42cAP4WeG0OwXggN8FSvcqFt8KY1fuEFQnxhxQ+J7HyRrBSMr7LRIfPv4vlyu5XSzyn75bFmxRwulDu3S7yM6/rIzSYzmDukOaLMhOKckJuvaVMQlhmEPkBk1pWEbYVzLEtAGe3fEcLvEq3PgfaR15lFJQeOY2oDhEqce0Jk3e5W1gPBJoOylJ0NP9FebM96oe/6Wv1K8b6XShmopUojPUtzeQngAoRXJDiPs+oFCJdo4s+G0XfKniuhJ5sXepO9xnTCsr5cXbr1ZI4ZX6WufnLUdQJO0/SmPpvaD0qbXkBOOgKS2uSaqBXA55IKDd5bpXC0KmHYHMiK3I2OjTHlnPCDXNdI7WTclOIuQyDV/xuGL9rRXzBi80UOz1zYGnKRFeoNhC4s5wryMk6rS229Ttb3/q+hWXtuCjLIfLaWpA6NrBZhuVq62aRtzroy0lTiCpFWQrKiGDSFRqmIhVkW7pKkFD4tNF8JIf6hrlAbYkiwzIEPErRINialktxIH3zaBe76IRsZLybF1qFJqbh1f8qcv2zdndEJCaS/ztU1LwH5HZ7PBXSVphz5+d1fKftl3odzuEgusJj4lTRhQY0s4eISwtbfSVtKmzs060Xa9vBagCsCjq1HqcGTWEOC1tZpysk7SPxDBH+ksqn4Mbu/NGefZU/QMZy7l+Zp5aRMmpnqWDZp0LsAFjYB6MRX1Wgs7eX37P5eJxdo2aD/SYA9vgbhN0yrt1qQ9DPE/b5E9ouxJpOtffbc+irKx/W1LFfXqPw1sbWYXlgvKLCSX0uJsiSyYoMVhFaI5jJjmxkgsau3yykoFnd7n2YDsTSdOhXI8lGea6adgbRNNNT3w1ZhXo+nKkaFMX4w16eVNBqGMYUKOTNBzkHyAoBaKXWFV99D87O7lP22MeLtIiDKGaCh4rVb1Ws+imswr0BqibgWUtYdNRxp/HCN6NaidEEKXn80PBXjRwTFU/JeVJkkfoDgg+EtLTqIluas1dUPbZasNClyTZLbV2sAhSTNlGUj0wFXVdIQ2vq6aRSk/2aMekofVjfYAvZzSHgJot8xrS7i3OnM/Cnm9xdWrj2D93FcYdTPsa/Du/WCFss1eL4y68Q6u4JaGLlGpCMhuSLt+S50CQmpqx3wRgSvAR195bo74BzACxuBhbBA02gJ/2PRpEKbck1HgpQzKNDOn1yDUW8lJZTBaMQP0uio02J8v4u6PyM5pa35ewGil6jcazBfb4Ux/8KyXx5r5xsC8SThbPbeL5oKdfBwLpWAiTgRbYebOiyL1vxKo6kmqzRJgCmHpp+kAgSrdIlvUNdvBfGluUCix3AcKSmOLg2BkhvUNbdKZqnRxYV1EynpXMoXEsNvyGSnJeoJXlisT+x7/kPevRLGeyGJvZaSB7nDvjfKNx3NmuDjuasbQfQ674u26tYC1gpR5iTyXkJzldhzs1a596TW5Nlo8MJ4pCZcRImv45w+uhUq0dOw4adN+vOmn1GZcZO2NiZL3aR2ezHCE1E0mPwipbvY69+I8ArevQpT/wep8i7Xn1mu/9eQu22oFCJk6kJkOXehWUYnHynyBSH8HqNNfVJb12Dj2OVS0utGMVhkNMS4FooLy4yI0lhp1EobkOQ5pdmauXmrV3Sci2bZWYEsW7ebeVaqxoocUljmpRjpmV1dVFBusb7fUPkXsXJXpp6qvFEOSrVD7r5TV6oyjhLj+/rEvfd1BDcBTcXtNL8K9ME2r2js4snB531Rsy4JrnZwa82sr3VSzWmKP1prb53zcJpbfR8T0ymY76VFuwzGN9JY4Pg/ogA9GBf1wth8if+Bo9/g+K0cH11azlbTWE3yz5KQty/5PlrA9e7RZpxPI/u6PYO8Pja6yNgDR3NfpSCz9eOqyLl5mszcOgvWYH4NpleQsDDMRPIOZG7u/4qn1xbjI76Q6ewjKrfiy4VaVguj38WM8D+ifD+9Bf+MiHV5S7Oo3Dv5mNvV6FwY78H8/3JMULsIKpOvdUNaXXwtROuUGyYB7Jcydx8Rag3XWJMbmU4SORrlxllcD3KQgxzkIAc5yEEOcpCDHOQgBznIQQ5ykIMc5CAHOchBDnKQgxzkIAc5yEEOcpCD/OXlIAc5yEEOcpCDHOQgBznIjyIA/j+PBaTlRAZAPwAAAABJRU5ErkJggg=='
        }
        getRandom = (option) => {
            var ret, random
            switch (option) {
                case 'x':
                    ret = Math.random() * w
                    break
                case 'y':
                    ret = Math.random() * h
                    break
                case 's':
                    ret = Math.random() * 0.75 + 0.25
                    break
                case 'r':
                    ret = Math.random() * 6
                    break
                case 'fnx':
                    random = -0.5 + Math.random()
                    ret = function (x, y) {
                        return x + 3 * random
                    }
                    break
                case 'fny':
                    random = 1.6 + Math.random() * 0.8
                    ret = function (x, y) {
                        return y + random
                    }
                    break
                case 'fnr':
                    random = Math.random() * 0.03
                    ret = function (r) {
                        return r + random
                    }
                    break
            }
            return ret
        }
    }
    //leaf，银杏树叶和橘黄枫叶
    else if (t == 'leaf') {
        //银杏//https://github.com/BlackCatCj/Defoliation-animation
        {
            img2.src = 'data:image/png;base64,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'
        }
        //橘黄枫叶//https://github.com/lw308069077/maple-leaf
        {
            img3.src = 'data:image/png;base64,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'
        }
        getRandom = (option) => {
            var ret, random
            switch (option) {
                case 'x':
                    ret = Math.random() * w
                    break
                case 'y':
                    ret = Math.random() * h
                    break
                case 's':
                    ret = Math.random() * 0.75 + 0.25
                    break
                case 'r':
                    ret = Math.random() * 6
                    break
                case 'fnx':
                    random = -0.5 + Math.random()
                    ret = function (x, y) {
                        return x + 3 * random
                    }
                    break
                case 'fny':
                    random = 1.6 + Math.random() * 0.8
                    ret = function (x, y) {
                        return y + random
                    }
                    break
                case 'fnr':
                    random = Math.random() * 0.03
                    ret = function (r) {
                        return r + random
                    }
                    break
            }
            return ret
        }
    }
    //snow
    else if (t == 'snow') {
        getRandom = (option) => {
            var ret, random
            switch (option) {
                case 'x':
                    ret = Math.random() * w
                    break
                case 'y':
                    ret = Math.random() * h
                    break
                case 's':
                    ret = Math.random() * 0.75 + 0.25
                    break
                case 'r':
                    ret = Math.random() * 2.5 + 2
                    break
                case 'fnx':
                    random = -0.5 + Math.random()
                    ret = function (x, y) {
                        return x + 2 * random
                    }
                    break
                case 'fny':
                    random = 2.2 + Math.random() * 0.8
                    ret = function (x, y) {
                        return y + random
                    }
                    break
                case 'o':
                    ret = Math.random() * 0.4 + 0.6
                    if (ret > 0.8) ret = 1
                    break
            }
            return ret
        }
    }
    //rain
    else if (t == 'rain') {
        var rain_width = 2//1.5
        var drops = [], bounces = []
        var DPR = window.devicePixelRatio
        var wind_speed, wind_speed_x, wind_angle, hasBounce, maxNum, numLevel, gravity
        wind_speed = opts.wind_speed || 80
        wind_speed_x = opts.wind_speed_x || 5
        wind_angle = opts.wind_angle || 270
        hasBounce = opts.hasBounce == undefined ? true : opts.hasBounce
        maxNum = opts.maxNum || 80
        numLevel = opts.numLevel || 1
        gravity = opts.gravity || 0.163
        //将角度乘 0.017453293 （2PI/360）可转换为弧度。
        var eachAnger = 0.017453293;
        var a2 = wind_angle * eachAnger
    }


    /**
     * @param {String} t 类型，petal 花瓣，leaf 落叶，snow 雪花
     * 进行基础操作，进入循环创建
     * 利用getRandom（已被定制）定义各属性，进入if创建实例
     */
    function startFall(t) {
        //创建画布，开始渲染
        requestAnimationFrame =
            window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame
        var canvas = document.createElement('canvas'),
            ctx
        staticx = true
        canvas.height = window.innerHeight
        canvas.width = window.innerWidth
        canvas.setAttribute(
            'style',
            'position: fixed;left: 0;top: 0;pointer-events: none;z-index: 100;'
        )
        canvas.setAttribute('id', id)
        document.getElementsByTagName('body')[0].appendChild(canvas)
        ctx = canvas.getContext('2d')
        var fallingList = new FallingList()
        //每个的创建步骤
        if (t == 'petal') {
            for (var i = 0; i < 50; i++) {
                //创建50个
                var someFalling,
                    randomX,
                    randomY,
                    randomS,
                    randomR,
                    randomFnx,
                    randomFny,
                    randomFnR
                randomX = getRandom('x')
                randomY = getRandom('y')
                randomR = getRandom('r')
                randomS = getRandom('s')
                randomFnx = getRandom('fnx')
                randomFny = getRandom('fny')
                randomFnR = getRandom('fnr')
                someFalling = new Petal(randomX, randomY, randomS, randomR, {
                    x: randomFnx,
                    y: randomFny,
                    r: randomFnR
                })
                someFalling.draw(ctx)
                fallingList.push(someFalling)
            }
        } else if (t == 'leaf') {
            for (var i = 0; i < 50; i++) {
                //创建50个
                var someFalling,
                    randomX,
                    randomY,
                    randomS,
                    randomR,
                    randomFnx,
                    randomFny,
                    randomFnR
                randomX = getRandom('x')
                randomY = getRandom('y')
                randomR = getRandom('r')
                randomS = getRandom('s')
                randomFnx = getRandom('fnx')
                randomFny = getRandom('fny')
                randomFnR = getRandom('fnr')
                someFalling = new Leaf(randomX, randomY, randomS, randomR, {
                    x: randomFnx,
                    y: randomFny,
                    r: randomFnR
                }, i)
                someFalling.draw(ctx)
                fallingList.push(someFalling)
            }
        } else if (t == 'snow') {
            for (var i = 0; i < 60; i++) {
                //创建50个
                var someFalling,
                    randomX,
                    randomY,
                    randomS,
                    randomR,
                    randomFnx,
                    randomFny,
                    randomO
                randomX = getRandom('x')
                randomY = getRandom('y')
                randomR = getRandom('r')
                randomS = getRandom('s')
                randomO = getRandom('o')
                randomFnx = getRandom('fnx')
                randomFny = getRandom('fny')
                someFalling = new Snow(randomX, randomY, randomS, randomR, {
                    x: randomFnx,
                    y: randomFny
                }, randomO)
                ctx.fillStyle = "#FFF";
                someFalling.draw(ctx)
                fallingList.push(someFalling)
            }
        } else if (t == 'rain') {
            ctx.lineWidth = rain_width * DPR
            ctx.fillStyle = 'rgba(223,223,223,0.6)'
        }

        function updateRain() {
            if (drops.length < maxNum) {
                var i = 0, len = numLevel;
                for (; i < len; i++) {
                    drops.push(new Drop());
                }
            }
            var i = drops.length;
            while (i--) {
                var drop = drops[i];
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
                drop.draw(ctx);
            };
            if (hasBounce) {
                var i = bounces.length;
                while (i--) {
                    var bounce = bounces[i];
                    bounce.update();
                    bounce.draw(ctx);
                    if (bounce.y > h) bounces.splice(i, 1);
                };
            };
        }
        if (t == 'rain') {
            stop = requestAnimationFrame(asd)
            function asd() {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                updateRain()
                stop = requestAnimationFrame(asd)
            };
        }
        else {
            stop = requestAnimationFrame(asd)
            function asd() {
                //console.log(1)
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                fallingList.update()
                fallingList.draw(ctx)
                stop = requestAnimationFrame(asd)
            }
        }
    }
    startFall(t)
}
//
export const Falling = createFalling
export const FallingDestroy = destroyFalling
