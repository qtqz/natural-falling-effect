<template>
  <Teleport to="body">
    <div class="nf-button" @click="turn()" title="自然飘落效果开关" :class="hide ? 'hide' : ''">
      <img style="width: 48px;height: 48px;user-select: none;" src="./icon.png" alt="">
    </div>
    <Transition name="nf">
      <div class="nf-container" v-show="showWindow">
        <div class="nf-main">
          <h2>设定</h2>
          <h3>
            <div style="float: left;"><label>总开关 <input type="checkbox" v-model="guestConfig.open"></label>
            </div>
            <div style="float: right;"><label>开启自定义选项 <input type="checkbox" v-model="customSwitch"
                  :disabled="!guestConfig.open"></label></div>
          </h3>
          <hr style="width: 96%;margin: 0 auto;">
          <div class="nf-option-grid" :style="!customSwitch ? 'cursor: not-allowed;' : ''">
            <div class="nf-option-group">
              <div class="nf-section">
                <span class="nf-emj">⛅</span><span>自定义图案</span>
              </div>
              <div><label><input type="checkbox" value="petal" v-model="guestConfig.imgSetting"
                    :disabled="!customSwitch">花瓣</label> <input type="number" v-model="guestConfig.imgNumSetting[0]"
                  :disabled="!guestConfig.imgSetting.includes('petal') || !customSwitch"> 个
              </div>
              <div><label><input type="checkbox" value="leaf" v-model="guestConfig.imgSetting"
                    :disabled="!customSwitch">落叶</label> <input type="number" v-model="guestConfig.imgNumSetting[1]"
                  :disabled="!guestConfig.imgSetting.includes('leaf') || !customSwitch"> 个
              </div>
              <div><label><input type="checkbox" value="snow" v-model="guestConfig.imgSetting"
                    :disabled="!customSwitch">雪花</label> <input type="number" v-model="guestConfig.imgNumSetting[2]"
                  :disabled="!guestConfig.imgSetting.includes('snow') || !customSwitch"> 个
              </div>
              <div><label><input type="checkbox" value="rain" v-model="guestConfig.imgSetting"
                    :disabled="!customSwitch">雨点</label> <input type="number" v-model="guestConfig.imgNumSetting[3]"
                  :disabled="!guestConfig.imgSetting.includes('rain') || !customSwitch"> 个
              </div>
            </div>
            <div class="nf-option-group">
              <div class="nf-section"><span class="nf-emj">⏱️</span><span>自定义显示</span></div>
              <div><input type="checkbox" id="fi" v-model="guestConfig.fadeIn" :disabled="!customSwitch"><label
                  for="fi">淡入</label>
              </div>
              <div><input type="checkbox" id="fo" v-model="guestConfig.fadeOut" :disabled="!customSwitch"><label
                  for="fo">淡出</label>
              </div>
              <div><input type="number" v-model="guestConfig.fadeOut_time"
                  :disabled="!customSwitch || !guestConfig.fadeOut"> 秒消失</div>
              <div title="除下雨以外的风力，建议留空或填“-50”"><input type="number" v-model="guestConfig.wind_x"
                  :disabled="!customSwitch"> 风力 ❔</div>
            </div>
            <div class="nf-option-group">
              <div class="nf-section"><span class="nf-emj">🌧️</span><span>下雨设置</span>
              </div>
              <div><input type="number" v-model="guestConfig.rain_speed" :disabled="!customSwitch">
                下雨风力
              </div>
              <div><input type="number" v-model="guestConfig.rain_angle" :disabled="!customSwitch"><span
                  title="从+x方向逆时针的角度，270为垂直向下"> 下雨风向 ❔</span></div>
              <div><label><input type="checkbox" v-model="guestConfig.rain_hasBounce"
                    :disabled="!customSwitch">落地水花</label>
              </div>
            </div>
          </div>
          <div class="nf-btn-group">
            <button class="nf-btn" @click="apply()">应用</button>
            <button class="nf-btn" @click="reset()">重置</button>
            <button class="nf-btn" @click="confirm()">确定</button>
            <button class="nf-btn" @click="cancel()">取消</button>
          </div>
          <div class="nf-link-list">
            <div style="float: left;">
              <img src="./icon.png" alt=""><span>自然飘落特效 </span><span class="v" title="GUI版本">{{ myVersion
              }}</span> - <span class="v" title="核心js版本" style="color: #FF9800;">{{ jsVersion }}</span>
            </div>
            <div style="float: right;">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M12.001 2c-5.525 0-10 4.475-10 10a9.994 9.994 0 0 0 6.837 9.488c.5.087.688-.213.688-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.337 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.913-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.563 4.938c.363.312.676.912.676 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10Z" />
              </svg><span><a href="https://github.com/qtqz/natural-falling-effect"
                  target="_blank">qtqz/natural-falling-effect</a></span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { fallingCreate, version, defaultConfig } from 'natural-falling-js'

export default {
  name: 'vue-natural-falling',
  props: {
    masterConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    hide: {
      type: Boolean,
      default: false
    },
    easyMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showWindow: false,
      guestConfig: {},//是一个基于masterConfig_full修改的完整配置
      masterConfig_full: {},//必须要有，因为要在面板中显示默认值，并且作为备份用于重置
      customSwitch: false,
      myVersion: '0.8.7',
      jsVersion: version,
      easyModeFallingFlag: true,
      f: null
    }
  },
  methods: {
    apply() {
      localStorage.setItem("nf_guestConfig", JSON.stringify(this.guestConfig))
      this.stop()
      setTimeout(() => {
        if (this.customSwitch == false && (this.guestConfig.open == this.masterConfig_full.open)) {
          this.reset()
        } else this.guestConfig.custom = true//用于记忆到缓存
        this.start(/* this.masterConfig ,*/ this.guestConfig)
      }, 1000)
      console.log(this.guestConfig);

    },
    reset() {
      this.guestConfig = JSON.parse(JSON.stringify(this.masterConfig_full))
      localStorage.removeItem("nf_guestConfig")
      localStorage.removeItem("nf_configVersion")
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
    let oldVersion = localStorage.getItem("nf_configVersion")
    let newVersion = this.jsVersion + JSON.stringify(this.masterConfig)
    let old = JSON.parse(localStorage.getItem("nf_guestConfig"))
    localStorage.setItem("nf_configVersion", newVersion)

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
    console.log(old, this.guestConfig);
  },
  unmounted() {
    this.stop()
  }
}
</script>

<style lang="css">
.nf-container {
  position: fixed;
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  top: 0;
  z-index: 20;
  pointer-events: none;
}

.nf-enter-from {
  opacity: 0;
  transform: scale(1.05);
}

.nf-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.nf-button.hide {
  opacity: 0;
  user-select: none;
  pointer-events: none;
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

.nf-link-list {
  margin-top: 1em;
  width: 100%;
  vertical-align: middle;
}

.nf-link-list .v {
  border-radius: 4px;
  border: 2px rgba(205, 205, 205, 0.6) solid;
  font-family: 'Times New Roman', Times, serif;
  font-style: italic;
  padding: 0 0.3em !important;
}

.nf-link-list a {
  text-decoration: none;
  color: dodgerblue;
}

.nf-link-list img,
.nf-link-list svg {
  display: inline-block;
}

.nf-link-list>div>span {
  padding-left: 0.5em;
}

.nf-section {
  vertical-align: middle;
  line-height: 1.5;
}

.nf-emj {
  display: inline-block;
  left: -1.5em;
  font-size: 1.5rem;
}

.nf-main {
  position: relative;
  box-sizing: border-box;
  width: 750px;
  /* min-height: 600px; */
  padding: 2em 3em 3em;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  box-shadow: 2px 2px 15px #aaaaaa;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: opacity 0.2s;
  opacity: 1;
  pointer-events: initial;
}

.nf-main h2 {
  font-size: 1.5rem;
}

.nf-main h3 {
  font-size: 1.25rem;
  width: 100%;
  padding: 0 1rem;
}

.nf-main h3 input {
  width: 1.25rem;
  height: 1.25rem;
  vertical-align: middle;
}

.nf-main>* {
  box-sizing: border-box;
}

/* 紧凑布局网格 */
.nf-option-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10%;
  position: relative;
  width: 100%;
  margin: 2em 0 1em;
  background-color: #ffff;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, .8);
  box-shadow: 1px 1px 10px #ccc;
  padding: 1rem 2rem 0;
}

.nf-option-group {
  min-height: 150px;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nf-option-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-right: 4px;
}

.nf-option-group input[type="number"] {
  margin-left: 3px;
  width: 3.125em;
  border-width: 1px;
  padding: 0 2px;
  height: 1.5em;
  border-color: light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
  background-color: field;
  border-radius: 4px;
}

.nf-option-group input:disabled {
  cursor: not-allowed;
  background-color: light-dark(rgba(239, 239, 239, 0.3), rgba(59, 59, 59, 0.3));
  color: light-dark(rgb(84, 84, 84), rgb(170, 170, 170));
  border-color: rgba(118, 118, 118, 0.3);
}

.nf-option-group label {
  cursor: inherit;
}

.nf-option-group>div {
  position: relative;
}

.nf-option-group:after {
  content: "";
  position: absolute;
  right: -30px;
  top: 32%;
  height: 60%;
  width: 1px;
  border-left: 2px solid rgba(0, 0, 0, .2);
}

.nf-option-group:last-child:after {
  content: unset;
}

/* 输入框基础样式 */
.nf-main input {
  height: 32px;
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.nf-main input:hover {
  border-color: #c0c4cc;
}

.nf-main input:focus {
  border-color: #409eff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 按钮样式 */
.nf-btn {
  height: 34px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  background-color: #fffa;
  border: 1px solid #dcdfe6;
  color: #606266;
}

.nf-btn:hover {
  border-color: #409eff;
  color: #409eff;
  background-color: initial;
}

/* 按钮组 */
.nf-btn-group {
  display: flex;
  gap: 16px;
  margin: 1.5em auto;
}

/* 表单分组标题 */
.nf-section {
  font-size: 16px;
  font-weight: 600;
  /**/
  color: #303133;
  margin: 0 0 10px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
  line-height: 1.5em;
}

.dark .nf-button {
  background-color: rgba(255, 255, 255, 0.7);
}

.dark .nf-main {
  background-color: rgb(37, 45, 56);
  box-shadow: 2px 2px 15px #111;
  color: #ffffffdb;
}

.dark .nf-section {
  color: #ffffffdb;
}

.dark .nf-btn {
  color: #000;
}

.dark .nf-option-grid {
  background-color: rgb(37, 45, 56);
  box-shadow: 2px 2px 15px #111;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.dark .nf-option-group:after {
  border-left: 2px solid rgba(255, 255, 255, 0.5);
}

@media screen and (max-width: 600px) {
  .nf-main {
    width: 376px;
    padding: 0.5em 1.5em;
    max-height: 100%;
    overflow-y: scroll;
  }

  .nf-option-grid {
    padding: 1.5em 0.5em 0;
    margin: 1em 0;
    gap: 0 8px;
    grid-template-columns: unset;
    justify-content: center;
    justify-items: center;
    grid-template-areas:
      ". ."
      "h h";
  }

  .nf-option-group:nth-child(3) {
    grid-area: h;
  }

  .nf-option-group:after {
    display: none;
  }

  .nf-link-list {
    margin-top: 1em;
  }

  .nf-link-list>div {
    float: unset !important;
    margin-top: 4px;
  }

  .nf-btn-group {
    margin: 0 2em;
    flex-wrap: wrap;
    justify-content: center;
  }

  .nf-btn {
    height: 32px;
    font-size: 14px;
  }
}
</style>