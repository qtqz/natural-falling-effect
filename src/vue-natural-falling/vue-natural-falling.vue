<template>
  <div class="nf-container">
    <div class="nf-mask" @click="cancel()"></div>
    <div class="nf-button" @click="turn()" title="自然飘落效果开关">
      <img style="width: 48px;height: 48px;user-select: none;" src="./icon.png" alt="">
    </div>
    <div class="nf-main" :class="showWindow ? '' : 'hide'">
      <h2>设定</h2>
      <h3 style="width: 100%;padding: 0 1rem;">
        <div style="float: left;"><label for="ts">总开关 </label><input
            style="width: 1.3rem;height: 1.3rem;vertical-align: sub;" type="checkbox" id="ts" v-model="guestConfig.open">
        </div>
        <div style="float: right;"><label for="oc">开启自定义选项 </label><input
            style="width: 1.3rem;height: 1.3rem;vertical-align: sub;" type="checkbox" id="oc"
            v-model="guestConfig.custom"></div>
      </h3>
      <hr style="width: 80%;margin: 0 auto;">
      <br>
      <div class="option-row">
        <div class="option-mask" v-show="!guestConfig.custom || !guestConfig.open"></div>
        <div class="option-col">
          <div class="f-type"><input type="checkbox" id="ci" v-model="guestConfig.changeImg"><label for="ci">自定义图案</label>
          </div>
          <div><input type="checkbox" id="petal" value="petal" v-model="guestConfig.imgSetting" checked
              :disabled="!guestConfig.changeImg"><label for="petal">花瓣</label> <input style="width: 2.5em;" type="number"
              v-model="guestConfig.imgNumSetting[0]"
              :disabled="!guestConfig.imgSetting.includes('petal') || !guestConfig.changeImg"> 个
          </div>
          <div><input type="checkbox" id="leaf" value="leaf" v-model="guestConfig.imgSetting"
              :disabled="!guestConfig.changeImg"><label for="leaf">落叶</label> <input style="width: 2.5em;" type="number"
              v-model="guestConfig.imgNumSetting[1]"
              :disabled="!guestConfig.imgSetting.includes('leaf') || !guestConfig.changeImg"> 个
          </div>
          <div><input type="checkbox" id="snow" value="snow" v-model="guestConfig.imgSetting"
              :disabled="!guestConfig.changeImg"><label for="snow">雪花</label> <input style="width: 2.5em;" type="number"
              v-model="guestConfig.imgNumSetting[2]"
              :disabled="!guestConfig.imgSetting.includes('snow') || !guestConfig.changeImg"> 个
          </div>
          <div><input type="checkbox" id="rain" value="rain" v-model="guestConfig.imgSetting"
              :disabled="!guestConfig.changeImg"><label for="rain">雨点</label> <input style="width: 2.5em;" type="number"
              v-model="guestConfig.imgNumSetting[3]"
              :disabled="!guestConfig.imgSetting.includes('rain') || !guestConfig.changeImg"> 个
          </div>
        </div>
        <div class="option-col">
          <div class="f-show"><input type="checkbox" id="cs" v-model="guestConfig.changeShow"><label
              for="cs">自定义显示</label></div>
          <div><input type="checkbox" id="fi" v-model="guestConfig.showSetting.fadeIn"
              :disabled="!guestConfig.changeShow"><label for="fi">淡入</label>
          </div>
          <div><input type="checkbox" id="fo" v-model="guestConfig.showSetting.fadeOut"
              :disabled="!guestConfig.changeShow"><label for="fo">淡出</label>
          </div>
          <div><input style="width: 2em;" type="number" v-model="guestConfig.showSetting.time"
              :disabled="!guestConfig.changeShow || !guestConfig.showSetting.fadeOut"> 秒消失</div>
        </div>
        <div class="option-col">
          <div class="f-rain"><input type="checkbox" id="cr" v-model="guestConfig.changeRain"><label for="cr">下雨设置</label>
          </div>
          <div><input style="width: 2.5em;" type="number" v-model="guestConfig.rainSetting.wind_speed"
              :disabled="!guestConfig.changeRain"> 风力</div>
          <div><input style="width: 2.5em;" type="number" v-model="guestConfig.rainSetting.wind_angle"
              :disabled="!guestConfig.changeRain"><span title="从+x方向逆时针的角度，270为垂直向下"> 风向 ❔</span></div>
          <div><input style="width: 2.5em;" type="number" v-model="guestConfig.rainSetting.wind_speed_x"
              :disabled="!guestConfig.changeRain"> 横向风误差</div>
          <div><input type="checkbox" id="bo" v-model="guestConfig.rainSetting.hasBounce"
              :disabled="!guestConfig.changeRain"><label for="bo">落地水花</label>
          </div>
        </div>
      </div>
      <div class="text_area">
        <p v-show="false">{{ guestConfig }}</p>
        <p>每个子自定义开关如未勾选，其设置将不生效，并且以网站默认设置（你最初看到的设置）为准。若未选择图案，将根据季节自动展示。所有配置将被保存到本地。</p>
      </div>
      <div class="btn-list">
        <button @click="apply()">应用</button>
        <button @click="reset()">重置</button>
        <button @click="confirm()">确定</button>
        <button @click="cancel()">取消</button>
      </div>
      <div class="link-list">
        <div style="float: left;">
          <img style="vertical-align: middle;" src="./icon.png" alt=""><span>自然飘落效果组件 </span><span class="v">{{ myVersion
          }}</span> - <span class="v">{{ jsVersion }}</span>
        </div>
        <div style="float: right;">
          <svg style="vertical-align: middle;" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
            viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M12.001 2c-5.525 0-10 4.475-10 10a9.994 9.994 0 0 0 6.837 9.488c.5.087.688-.213.688-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.337 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.913-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.563 4.938c.363.312.676.912.676 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10Z" />
          </svg><span><a href="#" target="_blank" rel="noopener noreferrer">github-</a></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FallingCreate, FallingDestroy } from './js/naturalfalling.js';

export default {
  name: 'vue-natural-falling',
  data() {
    return {
      showWindow: true,
      guestConfig: {},
      masterConfig: {
        open: true,
        custom: true,
        changeImg: true,
        changeShow: true,
        changeRain: true,
        imgSetting: [],
        imgNumSetting: [40, 40, 80, 60],
        showSetting: {
          fadeIn: true,
          fadeOut: false,
          time: 20
        },
        rainSetting: {
          wind_speed: 75,
          wind_speed_x: 4,
          wind_angle: 255,
          hasBounce: true,
          maxNum: 80,
          numLevel: 0.03,
          gravity: 0.163
        },
        zIndex: 100,
        imgSize: [40, 40, 2.5]
      },
      myVersion: '1.0.0',
      jsVersion: '0.1.0',
    }
  },
  methods: {
    apply() {
      localStorage.setItem("guestConfig", JSON.stringify(this.guestConfig))
      localStorage.setItem("guestConfigVersion", 1)
      this.stop()
      setTimeout(() => {
        this.start(this.masterConfig, this.guestConfig)
      }, 1000)
    },
    reset() {
      this.guestConfig = JSON.parse(JSON.stringify(this.masterConfig))
      localStorage.removeItem("guestConfig")
      localStorage.removeItem("guestConfigVersion")
    },
    confirm() {
      this.showWindow = false
      this.apply()
    },
    cancel() {
      this.showWindow = false
    },
    turn() {
      this.showWindow = !this.showWindow
    },
    start(ms, s) {
      FallingCreate(ms, s)
    },
    stop() {
      for (let i = 0; i < 4; i++) FallingDestroy()
    },
  },
  created() {
    this.guestConfig = JSON.parse(JSON.stringify(this.masterConfig))
  },
  mounted() {
    console.log(`The initial.`)
    let hc = localStorage.getItem("guestConfigVersion") == 1 ? this.guestConfig = JSON.parse(localStorage.getItem("guestConfig")) : this.reset()
    if (hc == null) {
      this.guestConfig.custom = false
      this.guestConfig.changeImg = false
      this.guestConfig.changeShow = false
      this.guestConfig.changeRain = false
    }
    this.start(this.masterConfig, this.guestConfig)
    /**
     * 
     * TO DO
     * 简洁模式（仅允许用户总开关）
     * 适配移动端
     * 
     */
  },
}
</script>
  
<style scoped>
.v {
  border: 2px rgba(205, 205, 205, 0.5) solid;
  border-radius: 4px;
  font-family: 'Times New Roman', Times, serif;
  border: 2px rgba(205, 205, 205, 0.6) solid;
  font-family: 'Times New Roman', Times, serif;
  font-style: italic;
  padding: 0 0.3em !important;
}

.dark .nf-button {
  background-color: rgba(255, 255, 255, 0.7);
}

.dark .nf-main {
  background-color: rgb(37, 45, 56);
  box-shadow: 2px 2px 15px #111;
  color: rgba(255, 255, 255, 0.86);
}

.dark .option-row {
  background-color: rgb(37, 45, 56);
  box-shadow: 2px 2px 15px #111;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.dark .text_area {
  border: 1px solid rgba(0, 0, 0, 0.7);
}

.dark .option-col:after {
  border-left: 2px solid rgba(255, 255, 255, 0.5);
}

.nf-button {
  box-sizing: content-box;
  position: fixed;
  bottom: 10vh;
  right: 2.5vw;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.3);
  /* background-color: #fcfcfc; */
  border-radius: 50%;
  padding: 10px;
  z-index: 10;
  box-shadow: inset 10px 7px 8px 4px rgba(162, 217, 255, 0.5);
  border: 1px rgb(255, 255, 255) solid;
  cursor: pointer;
}

.nf-button:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 5px 4px 8px 3px rgba(150, 150, 150, 0.2);
  border: 1px rgb(255, 255, 255) solid;
}

.nf-button:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: inset -3px -4px 13px 3px rgba(255, 255, 255, 0.5);
  border: 1px rgb(255, 255, 255) solid;
}

.link-list>div>span {
  padding-left: 0.5em;
}

a {
  text-decoration: none;
  color: dodgerblue;
}

.link-list {
  margin-top: 2em;
  width: 100%;
}

.option-mask {
  width: 100%;
  height: 180px;
  position: absolute;
  top: 0;
  z-index: 2;
  cursor: not-allowed;
}

.option-col>div {
  padding-left: 1.3em;
}

.option-col>div:first-child {
  padding-left: 0;
  margin-bottom: 10px;
}

.text_area {
  font-size: 14px;
  border: 1px #ccc solid;
  border-radius: 6px;
  width: 100%;
  padding: 1rem;
  margin: 1rem 0;
}

.f-type::before {
  content: '⛅';
}

.f-show::before {
  content: '⏱️';
}

.f-test::before {
  content: '🔨';
}

.f-rain::before {
  content: '🌧️';
}

.nf-container {
  position: relative;
}

.nf-main {
  position: fixed;
  box-sizing: border-box;
  width: 800px;
  width: 780px;
  min-height: 600px;
  top: 60px;
  left: 50vw;
  top: 50vh;
  transform: translate(-50%, -50%);
  /* margin: 0 auto 0 auto; */
  padding: 2em 4em 3em 4em;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  box-shadow: 2px 2px 15px #aaaaaa;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: opacity 0.2s;
  opacity: 1;
  z-index: 11;
}

.hide {
  display: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.nf-main>* {
  box-sizing: border-box;
}

.btn-list {
  display: flex;
  justify-content: space-around;
  width: 250px;
  margin: 0.5em auto;
  line-height: 1.7em;
  text-align: center;
}

.nf-mask {
  display: none;
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.7);
  transition: opacity 0.5s;
}

.option-row {
  position: relative;
  min-height: 150px;
  width: 100%;
  padding-top: 1.5em;
  margin: 1em 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: space-around;
  background-color: #ffff;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, .8);
  box-shadow: 1px 1px 10px #ccc;
}

.option-col {
  min-height: 150px;
  width: 23%;
  margin: 4px 0;
  box-sizing: border-box;
  position: relative;
}

.option-col:after {
  content: "";
  position: absolute;
  right: -18%;
  top: 8%;
  height: 70%;
  width: 1px;
  border-left: 2px solid rgba(0, 0, 0, .2);
}

.option-col:last-child:after {
  content: unset;
}
</style>
  