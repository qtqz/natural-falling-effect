<template>
  <div class="mask" @click="setting()"></div>
  <div class="main">
    <button @click="start('petal')">落花</button>
    <button @click="start('leaf')">落叶</button>
    <button @click="start('snow')">下雪</button>
    <button @click="start('rain', globalConfig.rainSetting)">下雨</button>
    <button @click="stop()">停止</button>
    <button @click="setting2()">选项</button>
    <div class="cotainer" v-show="openSetting">
      <h2>设定</h2>
      <h3 style="width: 100%;padding: 0 1rem;">
        <div style="float: left;"><label for="ts">总开关 </label><input
            style="width: 1.3rem;height: 1.3rem;vertical-align: sub;" type="checkbox" id="ts"
            v-model="globalConfig.open"></div>
        <div style="float: right;"><label for="oc">开启自定义选项 </label><input
            style="width: 1.3rem;height: 1.3rem;vertical-align: sub;" type="checkbox" id="oc"
            v-model="globalConfig.custom"></div>
      </h3>
      <hr style="width: 80%;margin: 0 auto;">
      <br>
      <div class="option-row">
        <div class="option-mask" v-show="!globalConfig.custom || !globalConfig.open"></div>
        <div class="option-col">
          <div class="f-type"><input type="checkbox" id="ci" v-model="globalConfig.changeImg"><label
              for="ci">自定义图案</label></div>
          <div><input type="checkbox" id="petal" value="petal" v-model="globalConfig.imgSetting" checked
              :disabled="!globalConfig.changeImg"><label for="petal">花瓣</label> <input style="width: 2.5em;"
              type="number" v-model="globalConfig.imgNumSetting[0]"
              :disabled="!globalConfig.imgSetting.includes('petal') || !globalConfig.changeImg"> 个
          </div>
          <div><input type="checkbox" id="leaf" value="leaf" v-model="globalConfig.imgSetting"
              :disabled="!globalConfig.changeImg"><label for="leaf">落叶</label> <input style="width: 2.5em;" type="number"
              v-model="globalConfig.imgNumSetting[1]"
              :disabled="!globalConfig.imgSetting.includes('leaf') || !globalConfig.changeImg"> 个
          </div>
          <div><input type="checkbox" id="snow" value="snow" v-model="globalConfig.imgSetting"
              :disabled="!globalConfig.changeImg"><label for="snow">雪花</label> <input style="width: 2.5em;" type="number"
              v-model="globalConfig.imgNumSetting[2]"
              :disabled="!globalConfig.imgSetting.includes('snow') || !globalConfig.changeImg"> 个
          </div>
          <div><input type="checkbox" id="rain" value="rain" v-model="globalConfig.imgSetting"
              :disabled="!globalConfig.changeImg"><label for="rain">雨点</label> <input style="width: 2.5em;" type="number"
              v-model="globalConfig.imgNumSetting[3]"
              :disabled="!globalConfig.imgSetting.includes('rain') || !globalConfig.changeImg"> 个
          </div>
        </div>
        <div class="option-col">
          <div class="f-show"><input type="checkbox" id="cs" v-model="globalConfig.changeShow"><label
              for="cs">自定义显示</label></div>
          <div><input type="checkbox" id="fi" v-model="globalConfig.showSetting.fadeIn"
              :disabled="!globalConfig.changeShow"><label for="fi">淡入</label>
          </div>
          <div><input type="checkbox" id="fo" v-model="globalConfig.showSetting.fadeOut"
              :disabled="!globalConfig.changeShow"><label for="fo">淡出</label>
          </div>
          <div><input style="width: 2em;" type="number" v-model="globalConfig.showSetting.time"
              :disabled="!globalConfig.changeShow || !globalConfig.showSetting.fadeOut"> 秒消失</div>
        </div>
        <div class="option-col">
          <div class="f-rain"><input type="checkbox" id="cr" v-model="globalConfig.changeRain"><label
              for="cr">下雨设置</label></div>
          <div><input style="width: 2.5em;" type="number" v-model="globalConfig.rainSetting.wind_speed"
              :disabled="!globalConfig.changeRain"> 风力</div>
          <div><input style="width: 2.5em;" type="number" v-model="globalConfig.rainSetting.wind_angle"
              :disabled="!globalConfig.changeRain"><span title="从+x方向逆时针的角度，270为垂直向下"> 风向 ❔</span></div>
          <div><input style="width: 2.5em;" type="number" v-model="globalConfig.rainSetting.wind_speed_x"
              :disabled="!globalConfig.changeRain"> 横向风误差</div>
          <div><input type="checkbox" id="bo" v-model="globalConfig.rainSetting.hasBounce"
              :disabled="!globalConfig.changeRain"><label for="bo">落地水花</label>
          </div>
        </div><!--
        <div class="option-col">
          <div class="f-test">测试</div>
        </div>-->
      </div>
      <div class="text_area">
        <p>{{ globalConfig }}</p>
        <p>每个子自定义开关如未勾选，其设置将不生效，并且以网站默认设置（你最初看到的设置）为准。若未选择图案，将根据季节自动展示。</p>
      </div>
      <div class="btn-list">
        <button @click="apply()">应用</button>
        <button @click="reset()">重置</button>
        <button @click="confirm()">确定</button>
        <button @click="cancel()">取消</button>
        <button @click="start(globalConfig, masterConfig)">测试</button>
      </div>
      <div class="link-list">
        <div></div>
        <div style="float: right;">
          <svg style="vertical-align: sub;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M12.001 2c-5.525 0-10 4.475-10 10a9.994 9.994 0 0 0 6.837 9.488c.5.087.688-.213.688-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.337 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.913-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.563 4.938c.363.312.676.912.676 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10Z" />
          </svg><a href="#" target="_blank" rel="noopener noreferrer">github-</a>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { Falling2, Falling, FallingDestroy } from './naturalfalling.js';

export default {
  name: 'vue-natural-falling',
  props: ['openSetting'],
  emits: ['setting'],
  data() {
    return {
      globalConfig: {},
      globalConfigBackup: {},
      masterConfig: {
        open: true,
        custom: true,
        changeImg: true,
        changeShow: true,
        changeRain: true,
        imgSetting: [],
        imgNumSetting: [50, 50, 80, 80],
        showSetting: {
          fadeIn: true,
          fadeOut: true,
          time: 10
        },
        rainSetting: {
          wind_speed: 80,//风力
          wind_speed_x: 5,//横向风力误差
          wind_angle: 255,//从+x方向逆时针角度，270为垂直向下
          hasBounce: true,//落地溅水花
          maxNum: 80,//雨滴数量
          numLevel: 0.04,//淡入速度
          gravity: 0.163//重力
        },
        zIndex: 100,
        imgSize: [40, 40, 2.5]
      },
    }
  },
  methods: {
    apply() {

    },
    reset() {
      this.globalSetting = JSON.parse(JSON.stringify(this.globalConfigBackup))
    },
    confirm() {
      this.setting2()
    },
    cancel() {
      this.setting2()
    },
    setting2() {
      this.$emit('setting')
    },
    start(s, ms) {
      Falling2(s, ms)
    },
    stop() {
      FallingDestroy()
    },
  },
  created() {
    this.globalConfig = JSON.parse(JSON.stringify(this.masterConfig))
    this.globalConfigBackup = JSON.parse(JSON.stringify(this.globalConfig))
  },
  mounted() {
    console.log(`The initial.`)
    /**
     * 
     * TO DO
     * GUI可用
     * 容错
     * 记忆到本地
     * 总开关
     * 支持暗黑模式
     * 
     */
  },
}
</script>
  
<style scoped>
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

.main {
  background-image: url('./background.png');
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.cotainer {
  /*position: absolute;*/
  box-sizing: border-box;
  width: 800px;
  width: 780px;
  min-height: 600px;
  margin: 70px auto;
  padding: 2em 4em;
  background-color: rgb(255, 255, 255);
  border-radius: 8px;
  box-shadow: 2px 2px 15px #aaaaaa;
  transition: box-shadow 0.5s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  /*justify-content: center;*/
}

.cotainer>* {
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

.mask {
  display: none;
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
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
  background-color: #fff9;
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
  