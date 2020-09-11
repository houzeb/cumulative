### API
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 输入框大小，`large` 高度为 40px，`small` 为 24px，默认是 32px | string | "default" |
| format | 展示的日期格式，配置参考 [moment.js](http://momentjs.com/) | string | "YYYY/MM/DD" |
| showToday | 是否展示“今天”按钮 | boolean | false |
| defaultValue | 默认日期 | [moment](http://momentjs.com/) | 当前时间 |
| onChange | 时间发生变化的回调 | function(date: moment, dateString: string) | 无 |
