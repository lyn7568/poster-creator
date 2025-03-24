<template>
  <div class="action-panel">
    <!-- 元素按钮组 -->
    <div class="action-group">
      <h3>元素</h3>
      <button 
        v-for="item in actionButtons" 
        :key="item.type"
        class="action-btn"
        :class="{ 'is-selected': selectedType === item.type }"
        @click.stop="handleAction(item.type)"
      >
        <span class="btn-icon" v-html="item.icon"></span>
        {{ item.label }}
      </button>
    </div>

    <!-- 操作按钮组 -->
    <div class="action-group">
      <h3>操作</h3>
      <button 
        v-for="item in operationButtons"
        :key="item.type"
        class="action-btn"
        :class="item.btnType"
        @click.stop="handleOperation(item.type)"
      >
        <span class="btn-icon" v-html="item.icon"></span>
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { actionButtons, operationButtons } from './index.js'

const props = defineProps({
  selectedType: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['add-element', 'reset', 'export'])

const handleAction = (type) => {
  emit('add-element', type)
}

const handleOperation = (type) => {
  emit(type)
}
</script>

<style scoped>
.action-panel {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: .6rem;
  background: white;
  box-shadow: 0.02rem 0 0.1rem rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  overflow-y: auto;
  z-index: 100;
  padding-top: 0.8rem; /* header 高度 */
}

.action-group {
  display: flex;
  flex-direction: column;
}

.action-group h3 {
  color: #333;
  font-size: 0.1rem;
  font-weight: 500;
  margin-bottom: 0.15rem;
  padding-left: 0.05rem;
  border-left: 0.05rem solid #4080ff;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.05rem;
  border: none;
  color: #333;
  background: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.09rem;
  width: 100%;
  padding: 0.08rem 0;
}

.action-btn:hover {
  background: rgba(64, 128, 255, 0.1);
  color: #4080ff;
}

.action-btn.is-selected {
  background: rgba(64, 128, 255, 0.15);
  color: #4080ff;
}

.action-btn.is-selected .btn-icon {
  background-color: #4080ff;
  transform: scale(1.1);
}

.action-btn.danger .btn-icon {
  background-color: #f00;
}

.action-btn.success .btn-icon {
  background-color: #00ab00;
}


.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.32rem;
  height: 0.32rem;
  border-radius: 50%;
  background-color: #acacac;
  color: #fff;
  padding: 0.02rem;
  font-size: 0.14rem;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-icon.danger {
  background-color: #f00;
}

.btn-icon.success {
  background-color: #00ab00;
}

.action-btn:hover .btn-icon {
  background-color: #4080ff;
  transform: scale(1.05);
}

.action-btn.danger:hover .btn-icon {
  background-color: #f00;
}
.action-btn.danger:hover {
  color: #f00;
}

.action-btn.success:hover .btn-icon {
  background-color: #00ab00;
}
.action-btn.success:hover {
  color: #00ab00;
}



/* 优化滚动条样式 */
.action-panel::-webkit-scrollbar {
  width: 0.04rem;
}

.action-panel::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 0.02rem;
}

.action-panel::-webkit-scrollbar-thumb:hover {
  background: #bbb;
}

.icon-refresh,
.icon-download {
  width: 0.16rem;
  height: 0.16rem;
}

</style> 