<template>
  <div class="nf-container">
    <!--<div class="nf-mask" @click="cancel()"></div>-->
    <div class="nf-button" @click="turn()" title="自然飘落效果开关" v-if="!buttonClass">
      <img style="width: 48px;height: 48px;user-select: none;" src="./icon.png" alt="">
    </div>
    <div class="nf-main" :class="showWindow ? '' : 'hide'">
      <h2>设定</h2>
      <h3 style="width: 100%;padding: 0 1rem;">
        <div style="float: left;"><label for="ts">总开关 </label><input
            style="width: 1.3rem;height: 1.3rem;vertical-align: sub;" type="checkbox" id="ts"
            v-model="guestConfig.open">
        </div>
        <div style="float: right;"><label for="oc">开启自定义选项 </label><input
            style="width: 1.3rem;height: 1.3rem;vertical-align: sub;" type="checkbox" id="oc" v-model="customSwitch"
            :disabled="!guestConfig.open"></div>
      </h3>
      <hr style="width: 96%;margin: 0 auto;">
      <br>
      <div class="option-row">
        <div class="option-mask" v-show="!customSwitch || !guestConfig.open"></div>
        <div class="option-col">
          <div class="f-type"><!-- <input type="checkbox" id="ci" v-model="customSwitch.changeImg"> --><label for="ci">
              自定义图案</label>
          </div>
          <div><input type="checkbox" id="petal" value="petal" v-model="guestConfig.imgSetting"
              :disabled="!customSwitch"><label for="petal">花瓣</label> <input style="width: 3em;" type="number"
              v-model="guestConfig.imgNumSetting[0]"
              :disabled="!guestConfig.imgSetting.includes('petal') || !customSwitch"> 个
          </div>
          <div><input type="checkbox" id="leaf" value="leaf" v-model="guestConfig.imgSetting"
              :disabled="!customSwitch"><label for="leaf">落叶</label> <input style="width: 3em;" type="number"
              v-model="guestConfig.imgNumSetting[1]"
              :disabled="!guestConfig.imgSetting.includes('leaf') || !customSwitch"> 个
          </div>
          <div><input type="checkbox" id="snow" value="snow" v-model="guestConfig.imgSetting"
              :disabled="!customSwitch"><label for="snow">雪花</label> <input style="width: 3em;" type="number"
              v-model="guestConfig.imgNumSetting[2]"
              :disabled="!guestConfig.imgSetting.includes('snow') || !customSwitch"> 个
          </div>
          <div><input type="checkbox" id="rain" value="rain" v-model="guestConfig.imgSetting"
              :disabled="!customSwitch"><label for="rain">雨点</label> <input style="width: 3em;" type="number"
              v-model="guestConfig.imgNumSetting[3]"
              :disabled="!guestConfig.imgSetting.includes('rain') || !customSwitch"> 个
          </div>
        </div>
        <div class="option-col">
          <div class="f-show"><!-- <input type="checkbox" id="cs" v-model="customSwitch.changeShow"> --><label for="cs">
              自定义显示</label></div>
          <div><input type="checkbox" id="fi" v-model="guestConfig.fadeIn" :disabled="!customSwitch"><label
              for="fi">淡入</label>
          </div>
          <div><input type="checkbox" id="fo" v-model="guestConfig.fadeOut" :disabled="!customSwitch"><label
              for="fo">淡出</label>
          </div>
          <div><input style="width: 2.5em;" type="number" v-model="guestConfig.fadeOut_time"
              :disabled="!customSwitch || !guestConfig.fadeOut"> 秒消失</div>
          <div title="除下雨以外的风力，建议留空或填“-50”"><input style="width: 2.5em;" type="number" v-model="guestConfig.wind_x"
              :disabled="!customSwitch"> 风力 ❔</div>
        </div>
        <div class="option-col">
          <div class="f-rain"><!-- <input type="checkbox" id="cr" v-model="customSwitch.changeRain"> --><label for="cr">
              下雨设置</label>
          </div>
          <div><input style="width: 3em;" type="number" v-model="guestConfig.rain_speed" :disabled="!customSwitch"> 下雨风力
          </div>
          <div><input style="width: 3em;" type="number" v-model="guestConfig.rain_angle" :disabled="!customSwitch"><span
              title="从+x方向逆时针的角度，270为垂直向下"> 下雨风向 ❔</span></div>
          <!-- v-show="false"<div><input style="width: 3em;" type="number" v-model="guestConfig.rainSetting.wind_deviation"
              :disabled="!customSwitch.changeRain"> 横向风误差</div>-->
          <div><input type="checkbox" id="bo" v-model="guestConfig.rain_hasBounce" :disabled="!customSwitch"><label
              for="bo">落地水花</label>
          </div>
        </div>
      </div>
      <div class="nf-text" style="display: none;">
        <p>{{ guestConfig }}</p>
        <p>每个子自定义开关如未勾选，其设置将不生效，并且以网站默认设置为准。若未选择图案，将根据季节自动展示。</p>
        <p>所有配置会保存到本地缓存，当网站配置或程序更新后，用户配置将被重置。</p>
      </div>
      <div class="btn-list">
        <button @click="apply()">应用</button>
        <button @click="reset()">重置</button>
        <button @click="confirm()">确定</button>
        <button @click="cancel()">取消</button>
      </div>
      <div class="link-list">
        <div style="float: left;">
          <img style="vertical-align: middle;" src="./icon.png" alt=""><span>自然飘落特效 </span><span class="v"
            title="GUI版本">{{ myVersion
            }}</span> - <span class="v" title="核心js版本" style="color: #FF9800;">{{ jsVersion }}</span>
        </div>
        <div style="float: right;">
          <svg style="vertical-align: middle;" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
            viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M12.001 2c-5.525 0-10 4.475-10 10a9.994 9.994 0 0 0 6.837 9.488c.5.087.688-.213.688-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.337 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.913-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.563 4.938c.363.312.676.912.676 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10Z" />
          </svg><span><a href="https://github.com/qtqz/natural-falling-effect"
              target="_blank">qtqz/natural-falling-effect</a></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fallingCreate, version, defaultConfig } from '../core/naturalfalling'

export default {
  name: 'vue-natural-falling',
  props: {
    masterConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    buttonClass: {
      type: String
    },
    easyMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //showWindow: true,
      showWindow: false,
      guestConfig: {},
      masterConfig_full: {},//必须要有，因为要在面板中显示默认值，并且作为备份用于重置
      customSwitch: false,
      myVersion: '0.8.0',
      jsVersion: version,
      easyModeFallingFlag: true,
      f: null
    }
  },
  methods: {
    apply() {
      localStorage.setItem("guestConfig", JSON.stringify(this.guestConfig))
      this.stop()
      setTimeout(() => {
        if (this.customSwitch == false) {
          this.reset()
        } else this.guestConfig.custom = true//用于记忆到缓存
        this.start(/* this.masterConfig ,*/ this.guestConfig)
      }, 1000)
    },
    reset() {
      this.guestConfig = JSON.parse(JSON.stringify(this.masterConfig_full))
      localStorage.removeItem("guestConfig")
      localStorage.removeItem("configVersion")
      this.customSwitch = false
    },
    confirm() {
      this.showWindow = false
      this.apply()
    },
    cancel() {
      this.showWindow = false
    },
    turn() {
      if (this.easyMode) {
        if (this.easyModeFallingFlag) this.stop()
        else this.start(/* this.masterConfig,  */this.guestConfig)
        this.easyModeFallingFlag = !this.easyModeFallingFlag
      }
      else this.showWindow = !this.showWindow
    },
    start(s) {
      //core
      try {
        this.f = fallingCreate(s)
      } catch (e) {
        alert(e)
        console.error(e)
      }
    },
    stop() {
      //core
      try {
        this.f.destroy()
      } catch (e) {
        alert(e)
        console.error(e)
      }
    },
  },
  created() {
    this.masterConfig_full = {
      ...defaultConfig,
      ...this.masterConfig
    }
    this.guestConfig = JSON.parse(JSON.stringify(this.masterConfig_full))
  },
  mounted() {
    console.log(`The initial.`)
    if (this.buttonClass) {
      document.querySelector('.' + this.buttonClass).addEventListener('click', () => {
        this.turn()
      })
    }
    let oldVersion = localStorage.getItem("configVersion")
    let newVersion = this.jsVersion + JSON.stringify(this.masterConfig)
    let old = JSON.parse(localStorage.getItem("guestConfig"))
    localStorage.setItem("configVersion", newVersion)

    if (oldVersion == newVersion && old) {
      this.guestConfig = old
      if (this.guestConfig.custom == true) {
        this.customSwitch = true
      }
    } else if (oldVersion != newVersion && oldVersion) {
      console.log('updated')
      this.reset()
    }
    this.easyModeFallingFlag = this.guestConfig.open
    this.start(this.guestConfig)
    /**
     * 
     * TO DO
     * 简洁模式（仅允许用户总开关）*
     * 自定义外部按钮*
     * 适配移动端*
     * 可以配置风的方向*
     * 窗口隐藏动画
     * 潜在问题：自定义会把所有项都定死，无法被动随主人更改
     */
  },
  unmounted() {
    this.stop()
  }
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

.dark .nf-text {
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
  margin-top: 1em;
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

.nf-text {
  font-size: 14px;
  border: 1px #ccc solid;
  border-radius: 6px;
  width: 100%;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
}

.f-type::before {
  content: '⛅';
}

.f-show::before {
  content: '⏱️';
}

.f-rain::before {
  content: '🌧️';
}

.f-type::before,
.f-show::before,
.f-rain::before {
  position: absolute;
  left: -1.5em;
  font-size: 1.5rem;
}

.nf-container {
  position: relative;
}

.nf-main {
  position: fixed;
  box-sizing: border-box;
  width: 750px;
  /* min-height: 600px; */
  left: 50vw;
  top: 50vh;
  transform: translate(-50%, -50%);
  /* margin: 0 auto 0 auto; */
  padding: 2em 3em 3em;
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
  width: 280px;
  margin: 1.5em auto;
  line-height: 1.7em;
  text-align: center;
}

.btn-list button{
  font-size: 1rem;
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
  width: 26%;
  margin: 4px 0;
  box-sizing: border-box;
  position: relative;
  padding-left: 1.4em;
}

.option-col>div {
  padding-left: 3px;
  position: relative;
}

.option-col>div:first-child {
  /* padding-left: 0; */
  margin-bottom: 10px;
  line-height: 1.5em;
}

.option-col:after {
  content: "";
  position: absolute;
  right: -16px;
  top: 24%;
  height: 56%;
  width: 1px;
  border-left: 2px solid rgba(0, 0, 0, .2);
}

.option-col:last-child:after {
  content: unset;
}

input[type="number"] {
  margin-left: 3px;
}

@media screen and (max-width: 600px) {
  .nf-main {
    width: 376px;
    padding: 0.5em 1.5em;
    max-height: 100%;
    overflow-y: scroll;
  }

  .option-row {
    padding: 1.5em 0.5em 0;
  }

  .option-col {
    width: 50%;
    flex-grow: 1;
    max-width: 60%;
  }

  .option-col:after {
    display: none;
  }

  .link-list {
    margin-top: 1em;
  }

  .link-list>div {
    float: none !important;
    margin-top: 4px;
  }

  br {
    display: none;
  }
}
</style>