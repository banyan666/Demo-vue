// index.ts
import type { App } from 'vue'
import HThreeD from "./index.vue"

// 使用install方法，在app.use挂载
HThreeD.install = (app: App) => {
    app.component(HThreeD.__name as string, HThreeD) //注册组件
}

export default HThreeD