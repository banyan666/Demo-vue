<template>
  <div class="bot">
    <div class="control-panel">
      <div class="shortcuts-guide">
        <div class="shortcuts-content">
          <div class="shortcuts-grid">
            <div class="shortcuts-section">
              <div class="section-title">模式选择</div>
              <div class="shortcut-row"><span class="key">1</span><span class="desc">变换模式</span></div>
              <div class="shortcut-row"><span class="key">2</span><span class="desc">选择模式</span></div>
              <div class="shortcut-row"><span class="key">Tab</span><span class="desc">变换⟷选择</span></div>
            </div>
<!--            <div class="shortcuts-section">-->
<!--              <div class="section-title">键盘操作</div>-->
<!--              <div class="shortcut-row"><span class="key">Shift+Tab</span><span class="desc">根/子选择切换</span></div>-->
<!--              <div class="shortcut-row"><span class="key">↑/↓</span><span class="desc">子选择层级</span></div>-->
<!--              <div class="shortcut-row"><span class="key">Alt</span><span class="desc">复制选中</span></div>-->
<!--            </div>-->
            <div class="shortcuts-section">
              <div class="section-title">变换模式</div>
              <div class="shortcut-row"><span class="key">R</span><span class="desc">旋转</span></div>
              <div class="shortcut-row"><span class="key">G</span><span class="desc">平移</span></div>
              <div class="shortcut-row"><span class="key">T</span><span class="desc">缩放</span></div>
            </div>
            <div class="shortcuts-section">
              <div class="section-title">变换操作</div>
              <div class="shortcut-row"><span class="key">Q,W,E,A,S,D</span><span class="desc">XYZ轴微调</span></div>
              <div class="shortcut-row"><span class="key">Shift+X/Y/Z</span><span class="desc">轴旋转90度</span></div>
              <div class="shortcut-row"><span class="key">Z/Y</span><span class="desc">撤销/反撤销</span></div>
            </div>
            <div class="shortcuts-section">
              <div class="section-title">其他操作</div>
              <div class="shortcut-row"><span class="key">Del</span><span class="desc">删除</span></div>
              <div class="shortcut-row"><span class="key">Esc</span><span class="desc">退出操作</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="less" scoped>

.bot {
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  position: fixed;
  z-index: 100;
  pointer-events: none;
}

.control-panel {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 12px 16px;
}

.switches-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
}

.switch-item {
  transition: opacity 0.3s ease;
  pointer-events: auto;

  &.disabled {
    opacity: 0;
  }
}

.shortcuts-guide {
  transition: opacity 0.3s ease;
  border-radius: 6px;
  padding: 8px;

  &.disabled {
    opacity: 0;
  }
}

.shortcuts-content {
  font-size: 12px;
  color: #e5eaf3;
}

.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.shortcuts-section {
  .section-title {
    color: #a8d4fd;
    font-weight: 500;
    margin-bottom: 5px;
    text-align: center;
    border-bottom: 1px solid rgba(168, 212, 253, 0.3);
    padding-bottom: 3px;
  }
}

.shortcut-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 3px;
  align-items: center;
  text-align: center;

  .key {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    padding: 1px 4px;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 2px;
    min-width: 40px;
    font-size: 11px;
  }

  .desc {
    color: #cccccc;
  }
}
</style>