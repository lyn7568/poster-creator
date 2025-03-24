<template>
  <div
    class="draggable-element"
    :class="{ 'is-selected': isSelected, [`element-${elementId}`]: true }"
    :style="elementStyle"
    @mousedown="startDrag"
  >
    <slot></slot>
    <div v-if="isSelected" class="resize-handles">
      <div class="resize-handle tl" @mousedown.stop="startResize('tl', $event)"></div>
      <div class="resize-handle tr" @mousedown.stop="startResize('tr', $event)"></div>
      <div class="resize-handle bl" @mousedown.stop="startResize('bl', $event)"></div>
      <div class="resize-handle br" @mousedown.stop="startResize('br', $event)"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  position: {
    type: Object,
    required: true
  },
  size: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  canvasSize: {
    type: Object,
    default: () => ({ width: 800, height: 450 })
  },
  isBackground: {
    type: Boolean,
    default: false
  },
  elementId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:position', 'update:size', 'select', 'delete'])

const elementStyle = computed(() => {
  return {
    transform: `translate(${props.position.x}px, ${props.position.y}px)`,
    width: props.size.width + 'px',
    height: props.size.height + 'px'
  }
})

let isDragging = false
let startX = 0
let startY = 0
let startPos = { x: 0, y: 0 }

const constrainPosition = (pos) => {
  return {
    x: Math.max(0, Math.min(pos.x, props.canvasSize.width - props.size.width)),
    y: Math.max(0, Math.min(pos.y, props.canvasSize.height - props.size.height))
  }
}

const constrainSize = (size, position) => {
  return {
    width: Math.max(20, Math.min(size.width, props.canvasSize.width - position.x)),
    height: Math.max(20, Math.min(size.height, props.canvasSize.height - position.y))
  }
}

const startDrag = (e) => {
  isDragging = true
  startX = e.clientX
  startY = e.clientY
  startPos = { ...props.position }
  
  emit('select')

  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY
    
    const newPos = constrainPosition({
      x: startPos.x + deltaX,
      y: startPos.y + deltaY
    })
    
    emit('update:position', newPos)
  }

  const handleMouseUp = () => {
    isDragging = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const startResize = (handle, e) => {
  const startSize = { ...props.size }
  const startPos = { ...props.position }
  startX = e.clientX
  startY = e.clientY
  
  const handleMouseMove = (e) => {
    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY
    
    let newSize = { ...startSize }
    let newPos = { ...startPos }
    
    switch (handle) {
      case 'br':
        newSize.width = startSize.width + deltaX
        newSize.height = startSize.height + deltaY
        break
      case 'bl':
        newSize.width = startSize.width - deltaX
        newSize.height = startSize.height + deltaY
        newPos.x = startPos.x + deltaX
        break
      case 'tr':
        newSize.width = startSize.width + deltaX
        newSize.height = startSize.height - deltaY
        newPos.y = startPos.y + deltaY
        break
      case 'tl':
        newSize.width = startSize.width - deltaX
        newSize.height = startSize.height - deltaY
        newPos.x = startPos.x + deltaX
        newPos.y = startPos.y + deltaY
        break
    }
    
    // 约束尺寸和位置
    newSize = constrainSize(newSize, newPos)
    newPos = constrainPosition(newPos)
    
    emit('update:size', newSize)
    emit('update:position', newPos)
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<style scoped>
.draggable-element {
  position: absolute;
  cursor: move;
  user-select: none;
  touch-action: none;
}

.is-selected {
  outline: 2px solid #4080ff;
}

.resize-handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #4080ff;
  border: 1px solid white;
  pointer-events: auto;
  border-radius: 4px;
}

.tl { top: -4px; left: -4px; cursor: nw-resize; }
.tr { top: -4px; right: -4px; cursor: ne-resize; }
.bl { bottom: -4px; left: -4px; cursor: sw-resize; }
.br { bottom: -4px; right: -4px; cursor: se-resize; }

/* 添加触摸设备支持 */
@media (hover: none) and (pointer: coarse) {
  .resize-handle {
    width: 16px;
    height: 16px;
  }
  
  .tl { top: -8px; left: -8px; }
  .tr { top: -8px; right: -8px; }
  .bl { bottom: -8px; left: -8px; }
  .br { bottom: -8px; right: -8px; }
}
</style> 