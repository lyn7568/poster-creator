<template>
  <div class="editor-section">
    <h3>位置和尺寸</h3>
    <div class="position-controls">
      <div class="control-group">
        <label>X 坐标</label>
        <input 
          type="number" 
          v-model.number="position.x" 
          @input="updatePosition"
        >
      </div>
      <div class="control-group">
        <label>Y 坐标</label>
        <input 
          type="number" 
          v-model.number="position.y" 
          @input="updatePosition"
        >
      </div>
      <div class="control-group">
        <label>宽度</label>
        <input 
          type="number" 
          v-model.number="size.width" 
          @input="updateSize"
        >
      </div>
      <div class="control-group">
        <label>高度</label>
        <input 
          type="number" 
          v-model.number="size.height" 
          @input="updateSize"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  element: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])

const position = reactive({
  x: props.element.position.x,
  y: props.element.position.y
})

const size = reactive({
  width: props.element.size.width,
  height: props.element.size.height
})

watch(() => props.element.position, (newPosition) => {
  position.x = newPosition.x
  position.y = newPosition.y
}, { deep: true })

watch(() => props.element.size, (newSize) => {
  size.width = newSize.width
  size.height = newSize.height
}, { deep: true })

const updatePosition = () => {
  // 确保位置是有效的数字
  const x = parseInt(position.x) || props.element.position.x
  const y = parseInt(position.y) || props.element.position.y
  
  // 更新本地值
  position.x = x
  position.y = y
  
  // 发送更新事件
  emit('update', { 
    position: { x, y },
    elementId: props.element.id // 添加元素ID以确保只更新当前元素
  })
}

const updateSize = () => {
  // 确保尺寸是有效的数字且大于0
  const width = Math.max(1, parseInt(size.width) || props.element.size.width)
  const height = Math.max(1, parseInt(size.height) || props.element.size.height)
  
  // 更新本地值
  size.width = width
  size.height = height
  
  // 发送更新事件
  emit('update', { 
    size: { width, height },
    elementId: props.element.id // 添加元素ID以确保只更新当前元素
  })
}
</script>

<style scoped>
.editor-section {
  background: #fff;
  border-radius: 0.08rem;
  transition: all 0.2s;
  padding: 0.15rem;
}

.editor-section:hover {
  background: #f5f7fa;
}

h3 {
  color: #4080ff;
  font-size: 0.1rem;
  font-weight: 500;
  margin-bottom: 0.1rem;
  display: flex;
  align-items: center;
  gap: 0.05rem;
  padding-left: 0.05rem;
  border-left: 0.04rem solid #4080ff;
}

.position-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.075rem;
  background: #f5f7fa;
  padding: 0.1rem;
  border-radius: 0.06rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.04rem;
}

.control-group label {
  font-size: 0.085rem;
  color: #666;
  font-weight: 500;
}

input[type="number"] {
  width: 100%;
  padding: 0.05rem;
  border: 0.01rem solid #e5e7eb;
  border-radius: 0.04rem;
  background: white;
  transition: all 0.2s;
  color: #333;
}

input[type="number"]:focus {
  border-color: #4080ff;
  outline: none;
  box-shadow: 0 0 0 0.02rem rgba(64, 128, 255, 0.1);
}
</style> 