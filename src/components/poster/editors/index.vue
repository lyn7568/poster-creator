<template>
  <div class="editor-panel">
    <!-- 当前选中元素的编辑区域 -->
    <template v-if="currentElement">
      <!-- 背景图片编辑 -->
      <div v-if="currentElement.type === 'background'" class="editor-section">
        <BackgroundEditor
          :canvas-size="canvasSize"
          v-model:background-color="backgroundColor"
          :has-background="!!currentElement.src"
          :object-fit="currentElement.objectFit || 'cover'"
          @update="updateElement"
          @update:canvas-size="updateCanvasSize"
        />
      </div>

      <!-- 头像编辑 -->
      <div v-if="currentElement.type === 'avatar'" class="editor-section">
        <ImageEditor
          :element="{ ...currentElement, isAvatar: true }"
          @update="updateElement"
        />
      </div>

      <!-- 文本编辑 -->
      <div v-if="currentElement.type === 'text'" class="editor-section">
        <TextEditor
          :element="currentElement"
          @update="updateElement"
        />
      </div>

      <!-- 二维码编辑 -->
      <div v-if="currentElement.type === 'qrcode'" class="editor-section">
        <QRCodeEditor
          :element="currentElement"
          @update="updateElement"
        />
      </div>

      <!-- 普通图片编辑 -->
      <div v-if="currentElement.type === 'image'" class="editor-section">
        <ImageEditor
          :element="currentElement"
          @update="updateElement"
        />
      </div>

      <!-- 通用位置和尺寸控制 -->
      <PositionEditor
        v-if="currentElement.type !== 'background'"
        :element="currentElement"
        @update="updateElement"
      />
    </template>

    <div v-else class="no-selection">
      <p>请选择一个元素进行编辑</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import QrcodeVue from 'qrcode.vue'
import BackgroundEditor from './BackgroundEditor.vue'
import TextEditor from './TextEditor.vue'
import ImageEditor from './ImageEditor.vue'
import QRCodeEditor from './QRCodeEditor.vue'
import PositionEditor from './PositionEditor.vue'

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
    required: true
  }
})

const emit = defineEmits(['update:elements', 'update:canvas-size'])

// 获取当前选中的元素
const currentElement = computed(() => {
  return props.elements.find(el => el.id === props.selectedElement)
})

// 更新元素
const updateElement = (updates) => {
  if (currentElement.value) {
    const updatedElement = { ...currentElement.value, ...updates }
    const updatedElements = props.elements.map(el => 
      el.id === currentElement.value.id ? updatedElement : el
    )
    emit('update:elements', updatedElements)
  }
}

const backgroundColor = ref('#ffffff')

// 更新画布尺寸
const updateCanvasSize = (newSize) => {
  // 确保尺寸是有效的数字
  const width = Math.max(1, parseInt(newSize.width) || props.canvasSize.width)
  const height = Math.max(1, parseInt(newSize.height) || props.canvasSize.height)
  
  // 发出画布尺寸更新事件
  emit('update:canvas-size', { width, height })
  
  // 如果当前选中的是背景元素，同步更新其尺寸
  if (currentElement.value?.type === 'background') {
    updateElement({
      size: { width, height }
    })
  }
}

// 监听背景色变化
watch(backgroundColor, (newColor) => {
  if (currentElement.value?.type === 'background') {
    updateElement({
      backgroundColor: newColor
    })
  }
})

// 删除背景图片
const removeBackground = () => {
  if (currentElement.value?.type === 'background') {
    updateElement({
      src: ''
    })
  }
}

// 处理背景图片上传
const handleBackgroundUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64Image = e.target.result
      updateElement({
        src: base64Image
      })
    }
    reader.readAsDataURL(file)
  }
}

// 处理切换填充方式
const handleObjectFitChange = (newFit) => {
  if (currentElement.value?.type === 'background') {
    updateElement({
      objectFit: newFit
    })
  }
}

</script>

<style scoped>
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

.no-selection {
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.1rem;
  text-align: center;
  background: #f5f7fa;
  border-radius: 0.08rem;
  padding: 0.2rem;
}

/* 优化滚动条样式 */
.editor-panel::-webkit-scrollbar {
  width: 4px;
}

.editor-panel::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

.editor-panel::-webkit-scrollbar-thumb:hover {
  background: #bbb;
}

.editor-item select {
  width: 100%;
  padding: 0.08rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 0.14rem;
}

.editor-item select:focus {
  outline: none;
  border-color: #4080ff;
}
</style> 