import { CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

export default {
    name: '3D文本标签',
    label: '文本标签',

    // 创建组件
    create: function(storage, { transformControls }) {
        // 创建根容器
        const container = document.createElement("div");
        const params = {
            text: storage?.text || "3D文本标签",
            color: storage?.color || "#ffffff",
            bold: storage?.bold || 'bold',
            fontSize: storage?.fontSize || 16,
            isOpenClick: storage?.isOpenClick || false,
        }

        // 标题文本
        const titleText = document.createElement("span");
        titleText.style.color = params.color;
        titleText.style.fontWeight = params.bold;
        titleText.textContent = params.text;
        titleText.style.fontSize = params.fontSize + "px";

        // 添加点击事件
        if (params.isOpenClick) {
            titleText.addEventListener("click", function() {
                transformControls.attach(mesh);
            });
        }

        container.appendChild(titleText);

        const mesh = new CSS3DSprite(container);
        mesh.userData.params = params;
        mesh.userData.domElement = titleText; // 保存DOM引用以便更新

        return mesh;
    },

    // 创建针对具体实例的面板
    createPanel: function(mesh, folder) {
        const params = mesh.userData.params;
        const domElement = mesh.userData.domElement;

        // 添加控件并绑定到实际DOM元素
        folder.add(params, 'text').name('文本内容').onChange(value => {
            domElement.textContent = value;
        });

        folder.add(params, 'fontSize', 8, 72, 1).name('字体大小').onChange(value => {
            domElement.style.fontSize = value + 'px';
        });

        folder.addColor(params, 'color').name('颜色').onChange(value => {
            domElement.style.color = value;
        });

        folder.add(params, 'bold', { '正常': 'normal', '粗体': 'bold' }).name('字体粗细').onChange(value => {
            domElement.style.fontWeight = value;
        });

    },

    // 获取存储数据
    getStorage: function(mesh) {
        return mesh.userData.params;
    },

    // 设置存储数据
    setStorage: function(mesh, storage) {
        Object.assign(mesh.userData.params, storage);
        const domElement = mesh.userData.domElement;

        // 更新实际DOM元素
        if (domElement) {
            domElement.textContent = storage.text || "3D文本标签";
            domElement.style.color = storage.color || "#ffffff";
            domElement.style.fontWeight = storage.bold || 'bold';
            domElement.style.fontSize = (storage.fontSize || 16) + "px";
        }
    },
}