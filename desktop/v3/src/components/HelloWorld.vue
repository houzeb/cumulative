<template>
  <div class="">
    这是一个数字
    {{ count }}
    <button @click="add">增加</button>
    <button @click="delWatch">去除监听</button>
  </div>
  <div class="">
    双倍的数量
    {{ state.doubleCount }}
  </div>
  <div class="">
    <input v-model="text" />
    {{ text }}
  </div>
</template>

<script>
import {
  h, ref, reactive, watchEffect, computed, readonly,
  toRef, toRefs, isRef, isProxy, isReactive, isReadonly,
  customRef,
} from 'vue'

function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      },
    }
  })
}


export default {
  name: 'HelloWorld',
  props: {
    type: {
      type: String,
      default: '123'
    }
  },
  setup(props) {
    console.log(props)
    const count = ref(0)
    const state = reactive({
      count,
      foo: 1,
      bar: 1,
      doubleCount: computed(()=>{
        return count.value * 2
      })
    })
    const readonlyS = readonly(state)
    console.log('isProxy', isProxy(state))
    console.log('isReactive', isReactive(state))
    console.log('isReadonly', isReadonly(readonlyS))

    let foo = toRef(state, 'foo')
    foo.value++
    console.log(foo.value, state.foo)

    let { bar } = toRefs(state)
    bar.value++
    console.log(state.bar)

    function add () {
      count.value++
    }
    const watchStop = watchEffect(() => {
      console.log(count.value)
    })
    function delWatch () {
      watchStop()
    }
    const stateDom = h('div', null, [
      '双倍的数量',
      state.doubleCount
    ])
    return {
      count,
      add,
      state,
      delWatch,
      stateDom,
      text: useDebouncedRef('hello')
    }
  },
  // render (ctx) {
  //   return h('div', null, [
  //     '这里是个数字',
  //     `${ ctx.count }`,
  //     h('button', {
  //       onClick: ctx.add
  //     }, '增加')
  //   ])
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
