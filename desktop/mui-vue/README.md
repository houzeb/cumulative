# mui-vue

## Project setup
```
yarn install
```

###
```
MUI 在 vue-cli3 的使用
参考 https://www.jianshu.com/p/029dd5f395ef

一、引入mui.js/css 之后在其下方 引入
import '@/assets/MUI/js/mui.picker.all.js'
import '@/assets/MUI/css/mui.picker.all.css'

二、babel.config.js 中 配置 ignore
由于用到的datepicker 因此需要加入 mui.picker.all.js

package.json 中的 eslineIgnore 同样如此

注意 自己项目中的 eslint 是否开启  若开启 ignore [] 中不要以,结束
```


### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```
