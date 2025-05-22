<template>
  <div class="preview-panel">
    <!-- 添加缩放控制器 -->
    <div class="zoom-controls">
      <button class="zoom-btn" @click="decreaseZoom" :disabled="zoomLevel <= MIN_ZOOM">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M19 13H5v-2h14v2z"/>
        </svg>
      </button>
      <span class="zoom-level">{{ Math.round(zoomLevel * 100) }}%</span>
      <button class="zoom-btn" @click="increaseZoom" :disabled="zoomLevel >= MAX_ZOOM">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      </button>
    </div>

    <div 
      class="preview-container"
      @mousedown="startPanPreview"
      :style="previewContainerStyle"
    >
      <!-- 添加清空画布按钮 -->
      <button 
        class="clear-canvas-btn" 
        @click.stop="$emit('clear-canvas')"
        title="清空画布"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
        清空画布
      </button>

      <div class="canvas-wrapper" :style="canvasStyle">
        <div class="preview-area">
          <div class="poster" ref="poster">
            <!-- 背景 -->
            <div class="background-wrapper" v-if="backgroundElement">
              <img
                v-if="backgroundElement.src"
                :src="backgroundElement.src"
                :style="{
                  width: '100%',
                  height: '100%',
                  objectFit: backgroundElement.objectFit || 'cover',
                  backgroundColor: backgroundElement.backgroundColor
                }"
                alt="背景图片"
              />
              <div v-else class="empty-background"></div>
            </div>
            
            <!-- 元素列表 -->
            <template v-for="element in elements" :key="element.id">
              <!-- 跳过背景元素，因为已经在上面处理了 -->
              <template v-if="element.type !== 'background'">
                <!-- 普通图片 -->
                <ImageElement
                  v-if="element.type === 'image'"
                  v-model:position="element.position"
                  v-model:size="element.size"
                  :src="element.src"
                  :element-id="element.id"
                  :is-selected="selectedElement === element.id"
                  :canvas-size="canvasSize"
                  @select="$emit('select-element', element.id)"
                />

                <!-- 头像 -->
                <ImageElement
                  v-if="element.type === 'avatar'"
                  v-model:position="element.position"
                  v-model:size="element.size"
                  :src="element.src"
                  :element-id="element.id"
                  :is-avatar="true"
                  :is-selected="selectedElement === element.id"
                  :canvas-size="canvasSize"
                  @select="$emit('select-element', element.id)"
                />

                <!-- 文本 -->
                <TextElement
                  v-if="element.type === 'text'"
                  v-model:position="element.position"
                  v-model:size="element.size"
                  :text="element.content"
                  :color="element.color"
                  :font-size="element.fontSize"
                  :font-weight="element.fontWeight"
                  :element-id="element.id"
                  :is-selected="selectedElement === element.id"
                  :canvas-size="canvasSize"
                  @select="$emit('select-element', element.id)"
                />

                <!-- 二维码 -->
                <QRCodeElement
                  v-if="element.type === 'qrcode'"
                  v-model:position="element.position"
                  v-model:size="element.size"
                  :value="element.value"
                  :element-id="element.id"
                  :is-selected="selectedElement === element.id"
                  :canvas-size="canvasSize"
                  @select="$emit('select-element', element.id)"
                />
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import ImageElement from './ImageElement.vue'
import TextElement from './TextElement.vue'
import QRCodeElement from './QRCodeElement.vue'

const props = defineProps({
  elements: {
    type: Array,
    required: true
  },
  selectedElement: {
    type: String,
    default: null
  },
  canvasSize: {
    type: Object,
    required: true,
    default: () => ({
      width: 0,
      height: 0
    })
  }
})

const hasBackground = computed(() => 
  props.elements.some(element => element.type === 'background' && element.src)
)

const emit = defineEmits(['select-element', 'clear-canvas'])
const poster = ref(null)

// 窗口尺寸状态
const windowSize = ref({
  width: typeof window !== 'undefined' ? window.innerWidth : 1920,
  height: typeof window !== 'undefined' ? window.innerHeight : 1080
})

// 修改缩放相关的代码
const zoomLevel = ref(1)
const MIN_ZOOM = 0.1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.1

// 计算默认缩放比例
const calculateDefaultZoom = () => {
  const maxWidth = windowSize.value.width - 380 // 减去左侧面板60px和右侧面板320px
  const maxHeight = windowSize.value.height - 120 // 减去头部80px和上下边距40px
  
  const zoom = Math.min(
    maxWidth / props.canvasSize.width,
    maxHeight / props.canvasSize.height
  )
  
  // 确保缩放比例在合理范围内
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom))
}

// 监听画布尺寸变化，重新计算缩放比例
watch(() => props.canvasSize, () => {
  zoomLevel.value = calculateDefaultZoom()
}, { deep: true })

// 监听窗口尺寸变化
const handleResize = () => {
  windowSize.value = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  // 更新缩放比例以适应新的窗口大小
  zoomLevel.value = calculateDefaultZoom()
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  // 初始化时设置默认缩放
  zoomLevel.value = calculateDefaultZoom()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 计算画布样式，使用缩放状态
const canvasStyle = computed(() => {
  return {
    width: `${props.canvasSize.width}px`,
    height: `${props.canvasSize.height}px`,
    transform: `scale(${zoomLevel.value})`,
    transformOrigin: 'center center',
    background: 'white',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    overflow: 'hidden'
  }
})

// 添加预览区域拖动相关的状态
const previewOffset = ref({ x: 0, y: 0 })
const isDraggingPreview = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// 计算预览容器的样式
const previewContainerStyle = computed(() => ({
  transform: `translate(${previewOffset.value.x}px, ${previewOffset.value.y}px)`,
  cursor: isDraggingPreview.value ? 'grabbing' : 'grab'
}))

// 开始拖动预览区域
const startPanPreview = (e) => {
  // 如果点击的是画布内的元素，不启动拖动
  if (e.target.closest('.canvas-wrapper')) {
    return
  }
  
  isDraggingPreview.value = true
  dragStart.value = {
    x: e.clientX - previewOffset.value.x,
    y: e.clientY - previewOffset.value.y
  }

  const handleMouseMove = (e) => {
    if (!isDraggingPreview.value) return
    
    previewOffset.value = {
      x: e.clientX - dragStart.value.x,
      y: e.clientY - dragStart.value.y
    }
  }

  const handleMouseUp = () => {
    isDraggingPreview.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// 增加和减少缩放
const increaseZoom = () => {
  const newZoom = Math.min(MAX_ZOOM, zoomLevel.value + ZOOM_STEP)
  zoomLevel.value = Number(newZoom.toFixed(1))
}

const decreaseZoom = () => {
  const newZoom = Math.max(MIN_ZOOM, zoomLevel.value - ZOOM_STEP)
  zoomLevel.value = Number(newZoom.toFixed(1))
}

// 在 script setup 部分添加 backgroundElement 计算属性
const backgroundElement = computed(() => 
  props.elements.find(element => element.type === 'background')
)

defineExpose({
  poster
})
</script>

<style scoped>
.preview-panel {
  position: fixed;
  left: 0.6rem;
  right: 3.2rem;
  top: 0.6rem;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background: #f5f7fa;
  padding: 0.2rem;
}

.preview-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  user-select: none;
  will-change: transform;
}

.canvas-wrapper {
  position: relative;
  background: white;
  transition: transform 0.2s ease;
  transform-origin: center center;
  will-change: transform;
  box-shadow: 0 0.04rem 0.2rem rgba(0, 0, 0, 0.1);
}

.preview-panel .poster {
  transition: transform 0.2s ease;
  will-change: transform;
  cursor: default;
}

.preview-panel::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.preview-panel::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.preview-panel::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.preview-panel::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.preview-container:active {
  cursor: grabbing;
}

.preview-area {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.poster {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  overflow: hidden;
}

.empty-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #999;
  font-size: 0.12rem;
  user-select: none;
}

/* 添加网格背景 */
.poster::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
  background-size: 0.2rem 0.2rem;
  pointer-events: none;
}

.zoom-controls {
  position: fixed;
  bottom: 0.2rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.1rem;
  background: white;
  padding: 0.06rem;
  border-radius: 0.04rem;
  box-shadow: 0 0.02rem 0.08rem rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.24rem;
  height: 0.24rem;
  border: none;
  background: #f5f7fa;
  color: #666;
  border-radius: 0.04rem;
  cursor: pointer;
  transition: all 0.2s;
}

.zoom-btn:hover:not(:disabled) {
  background: #e5e7eb;
  color: #333;
}

.zoom-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zoom-level {
  min-width: 0.5rem;
  text-align: center;
  font-size: 0.12rem;
  color: #333;
  user-select: none;
}

/* 右侧属性面板 */
.editor-panel {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 3.2rem;
  background: white;
  box-shadow: -0.02rem 0 0.1rem rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 100;
  padding-top: 0.8rem; /* header 高度 */
  display: flex;
  flex-direction: column;
  height: 100%;
}

.background-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.empty-background {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}

.poster {
  position: relative;
  width: 100%;
  height: 100%;
}

.clear-canvas-btn {
  position: absolute;
  top: 0.6rem;
  right: 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.04rem;
  padding: 0.06rem 0.12rem;
  border: 0.01rem solid rgba(0, 0, 0, 0.05);
  border-radius: 0.04rem;
  background: rgba(255, 255, 255, 0.8);
  color: #999;
  font-size: 0.085rem;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0;
  z-index: 100;
  backdrop-filter: blur(0.04rem);
}

.preview-container:hover .clear-canvas-btn {
  opacity: 0.8;
}

.clear-canvas-btn:hover {
  opacity: 1 !important;
  background: #fff;
  color: #ff4d4f;
  border-color: rgba(255, 77, 79, 0.2);
  transform: translateY(-0.01rem);
  box-shadow: 0 0.02rem 0.06rem rgba(0, 0, 0, 0.05);
}
</style> 