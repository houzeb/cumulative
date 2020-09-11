var app = new Vue({
  el: "#app",
  data: {
    timeNow: (new Date()).getTime(),
    timeBefore: (new Date("2017-04-07 00:00:00")).getTime()
  }
})
