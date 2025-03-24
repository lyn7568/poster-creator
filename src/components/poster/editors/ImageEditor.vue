<template>
  <div class="editor-section">
    <h3>图片设置</h3>
    <div class="upload-section">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileUpload"
        accept="image/*"
        style="display: none"
      >
      <div v-if="!element.src" class="upload-content" @click="triggerFileInput">
        <div class="upload-icon">+</div>
        <div class="upload-text">{{ element.isAvatar ? '点击上传头像' : '点击上传图片' }}</div>
      </div>
      <div v-else class="preview-thumbnail" :class="{ 'avatar-preview': element.isAvatar }">
        <img :src="element.src" :alt="element.isAvatar ? '头像预览' : '图片预览'">
        <div class="preview-actions">
          <button class="action-btn" @click="triggerFileInput">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            重新上传
          </button>
        </div>
      </div>
    </div>

    <ImageCropper
      v-model="showCropper"
      :img-src="tempImageUrl"
      :title="element.isAvatar ? '头像裁剪' : '图片裁剪'"
      :is-fixed="element.isAvatar"
      :is-fixed-box="element.isAvatar"
      :aspect-ratio="element.isAvatar ? [1, 1] : [null, null]"
      :initial-width="element.size?.width || 200"
      :initial-height="element.size?.height || 200"
      :is-avatar="element.isAvatar"
      @crop="handleCrop"
    />

    <div class="image-controls" v-if="!element.isAvatar">
      <div class="control-group">
        <label>填充方式</label>
        <select v-model="objectFit" @change="updateElement">
          <option value="cover">填充</option>
          <option value="contain">适应</option>
          <option value="fill">拉伸</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ImageCropper from '@/components/common/ImageCropper.vue'

const props = defineProps({
  element: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])

const fileInput = ref(null)
const objectFit = ref(props.element.objectFit || 'cover')
const showCropper = ref(false)
const tempImageUrl = ref('')

// 监听 objectFit 变化
watch(() => props.element.objectFit, (newValue) => {
  if (newValue !== objectFit.value) {
    objectFit.value = newValue
  }
})

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
      tempImageUrl.value = e.target.result
      showCropper.value = true
    }
    reader.readAsDataURL(file)
  }
}

const handleCrop = (data) => {
  const updates = { src: data }
  
  // 如果是头像，保持原有尺寸
  if (!props.element.isAvatar) {
    const img = new Image()
    img.onload = () => {
      updates.size = {
        width: img.width,
        height: img.height
      }
      emit('update', updates)
    }
    img.src = data
  } else {
    emit('update', updates)
  }
}

const updateElement = () => {
  emit('update', { objectFit: objectFit.value })
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

.upload-section {
  display: block;
  padding: 0.15rem;
  border: 0.02rem dashed #e5e7eb;
  border-radius: 0.08rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-section:hover {
  border-color: #4080ff;
  background: rgba(64, 128, 255, 0.05);
}

.upload-icon {
  font-size: 0.2rem;
  color: #4080ff;
  margin-bottom: 0.05rem;
}

.upload-text {
  color: #666;
  font-size: 0.09rem;
}

.preview-thumbnail {
  margin-top: 0.1rem;
  width: 100%;
  height: 1.2rem;
  overflow: hidden;
  border-radius: 0.08rem;
  border: 0.01rem solid #e5e7eb;
  transition: all 0.2s;
  position: relative;
}

.preview-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-preview {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  margin: 0 auto;
}

.image-controls {
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

select {
  padding: 0.05rem;
  border: 0.01rem solid #e5e7eb;
  border-radius: 0.04rem;
  background: white;
  color: #333;
  cursor: pointer;
  min-width: 1rem;
}

.preview-actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.preview-thumbnail:hover .preview-actions {
  opacity: 1;
}

.action-btn {
  padding: 0.06rem 0.12rem;
  border: none;
  border-radius: 0.04rem;
  background: white;
  color: #333;
  cursor: pointer;
  font-size: 0.12rem;
  display: flex;
  align-items: center;
  gap: 0.04rem;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f5f7fa;
}
</style> 