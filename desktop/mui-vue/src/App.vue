<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <input type="text" v-model="pickerDate" readonly class="mui-input-password" @click="openPicker" placeholder="请选择时间">

    <button @click="alertClick">点击alert</button>
    <div class="">
      <router-link :to="'/form'" style="margin: 0 20px;">form</router-link>
      <router-link :to="'/display'" style="margin: 0 20px;">display</router-link>
      <router-link :to="'/table-render'" style="margin: 0 20px;">table-render</router-link>
      <router-link :to="'/table-slot'" style="margin: 0 20px;">table-slot</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'app',
  components: {
    HelloWorld,
  },
  data() {
    return {
      pickerDate: '',
      dtpicker: null,
    }
  },
  mounted() {
    this.initPicker();
  },
  methods: {
    alertClick () {
      this.$Alert.info({ content: '这个消息' })
    },
    initPicker() {
      this.dtPicker = new mui.DtPicker();
    },
    openPicker() {
      this.dtPicker.show( (item) => {
        this.pickerDate = item.value
      });
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
