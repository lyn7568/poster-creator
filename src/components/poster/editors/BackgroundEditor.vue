<template>
  <div class="editor-section">
    <h3>海报设置</h3>
    <!-- 基本信息 -->
    <div class="setting-group">
      <div class="form-item">
        <label>UUID</label>
        <input type="text" v-model="uuid" readonly class="form-input" />
      </div>
      
      <div class="form-item">
        <label>名称</label>
        <input type="text" v-model="name" placeholder="未命名" class="form-input" />
      </div>
    </div>

    <!-- 海报尺寸 -->
    <h3>海报尺寸</h3>
    <div class="setting-group">
      <div class="size-inputs">
        <div class="control-group">
          <label>宽度</label>
          <input 
            type="number" 
            v-model.number="width" 
            @change="updateSize"
            @blur="updateSize"
            class="form-input"
          />
        </div>
        <div class="control-group">
          <label>高度</label>
          <input 
            type="number" 
            v-model.number="height" 
            @change="updateSize"
            @blur="updateSize"
            class="form-input"
          />
        </div>
      </div>
    </div>

    <!-- 背景设置 -->
    <h3>背景</h3>
    <div class="setting-group">
      <div class="form-item">
        <label>背景色</label>
        <div class="color-picker">
          <div class="color-preview" :style="{ backgroundColor: backgroundColor }" @click="openColorPicker"></div>
          <input type="color" v-model="backgroundColor" @input="updateBackground" class="color-input" ref="colorInput" />
        </div>
      </div>
      
      <div class="form-item">
        <label>背景图</label>
        <div class="background-actions">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileUpload"
            accept="image/*"
            style="display: none"
          >
          <button class="upload-btn" @click="triggerFileInput">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            上传
          </button>
          <button class="delete-btn" @click="removeBackground" :disabled="!hasBackground">
            删除背景图
          </button>
        </div>
      </div>
      <!-- 背景适配方式 -->
      <div class="form-item">
        <label>适配方式</label>
        <select v-model="backgroundObjectFit" @change="updateBackgroundFit">
          <option value="cover">填充（cover）</option>
          <option value="contain">适应（contain）</option>
          <option value="fill">拉伸（stretch）</option>
          <option value="none">原始大小（none）</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  canvasSize: {
    type: Object,
    required: true
  },
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  objectFit: {
    type: String,
    default: 'cover',
  },
  hasBackground: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update', 'update:canvas-size', 'update:background-color'])

// 基本信息
const uuid = ref(generateUUID())
const name = ref('未命名')

// 尺寸控制
const width = ref(props.canvasSize.width)
const height = ref(props.canvasSize.height)
const backgroundColor = ref(props.backgroundColor)

// 文件上传相关
const fileInput = ref(null)
const backgroundObjectFit = ref(props.objectFit)

// 生成UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 监听属性变化
watch(() => props.canvasSize, (newSize) => {
  width.value = newSize.width
  height.value = newSize.height
}, { deep: true })

watch(() => props.backgroundColor, (newColor) => {
  backgroundColor.value = newColor
})

watch(() => props.objectFit, (newFit) => {
  backgroundObjectFit.value = newFit
})

// 更新尺寸
const updateSize = () => {
  // 确保值是有效的数字且大于0
  const newWidth = Math.max(1, parseInt(width.value) || props.canvasSize.width)
  const newHeight = Math.max(1, parseInt(height.value) || props.canvasSize.height)
  
  // 更新本地值
  width.value = newWidth
  height.value = newHeight
  
  // 发送更新事件
  const newSize = { width: newWidth, height: newHeight }
  emit('update:canvas-size', newSize)
  
  // 注意：不需要同时发送 update 事件，因为 canvas-size 的更新会触发背景元素的更新
  // emit('update', { size: newSize })
}

// 更新背景
const updateBackground = () => {
  emit('update', { backgroundColor: backgroundColor.value })
}

// 删除背景图
const removeBackground = () => {
  emit('update', { src: '' })
}

// 颜色选择器相关
const colorInput = ref(null)
const openColorPicker = () => {
  colorInput.value?.click()
}

// 文件上传相关
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.value = '' // 清空 input 的值，确保同一文件可以重复选择
    fileInput.value.click()
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      // 创建一个临时的 Image 对象来获取图片尺寸
      const img = new Image()
      img.onload = () => {
        // 更新画布尺寸
        emit('update', {
          src: e.target.result,
          size: {
            width: img.width,
            height: img.height
          }
        })
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 更新背景适配方式
const updateBackgroundFit = () => {
  emit('update', { objectFit: backgroundObjectFit.value })
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

.setting-group {
  background: #f5f7fa;
  border-radius: 0.06rem;
  padding: 0.15rem;
  margin-bottom: 0.15rem;
}

.form-item {
  margin-bottom: 0.15rem;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-item label {
  display: block;
  color: #666;
  font-size: 0.085rem;
  font-weight: 500;
  margin-bottom: 0.08rem;
}

.form-input {
  width: 100%;
  padding: 0.08rem;
  border: 0.01rem solid #e5e7eb;
  border-radius: 0.04rem;
  font-size: 0.12rem;
  background: white;
  transition: all 0.2s;
}

.form-input:focus {
  border-color: #4080ff;
  outline: none;
  box-shadow: 0 0 0 0.02rem rgba(64, 128, 255, 0.1);
}

.form-input[readonly] {
  background: #f5f7fa;
  color: #999;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.05rem;
  cursor: pointer;
  font-size: 0.12rem;
  color: #666;
}

.size-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.1rem;
  margin-top: 0.1rem;
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

.color-picker {
  display: flex;
  align-items: center;
  gap: 0.1rem;
}

.color-preview {
  width: 0.24rem;
  height: 0.24rem;
  border: 0.01rem solid #e5e7eb;
  border-radius: 0.04rem;
  cursor: pointer;
  transition: all 0.2s;
}

.color-preview:hover {
  border-color: #4080ff;
  transform: scale(1.05);
}

.color-input {
  display: none;
}

.background-actions {
  display: flex;
  gap: 0.1rem;
}

select {
  padding: 0.05rem;
  border: 0.01rem solid #e5e7eb;
  border-radius: 0.04rem;
  background: white;
  color: #333;
  cursor: pointer;
  width: 100%;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.05rem;
  padding: 0.08rem 0.15rem;
  border: 0.01rem solid #4080ff;
  border-radius: 0.04rem;
  background: #4080ff;
  color: white;
  cursor: pointer;
  font-size: 0.12rem;
  transition: all 0.2s;
}

.upload-btn:hover {
  background: #3070ef;
  transform: translateY(-0.01rem);
}

.delete-btn {
  flex: 1;
  padding: 0.08rem 0.15rem;
  border: 0.01rem solid #e5e7eb;
  border-radius: 0.04rem;
  background: white;
  color: #666;
  cursor: pointer;
  font-size: 0.12rem;
  transition: all 0.2s;
}

.delete-btn:hover:not(:disabled) {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 