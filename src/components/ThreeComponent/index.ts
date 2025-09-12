// index.ts
import type { App } from 'vue'
import HThree from './HThreeD'


// 所有组件列表
const components = [
    HThree
]

// 定义 install 方法
const install = (app: App): void => {
    // 遍历注册所有组件
    components.forEach(component => app.component(component.__name as string, component))
}

export {
    HThree
}

const HComponents = {
    install
}

export default HComponents
