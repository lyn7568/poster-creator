<template>
  <div class="editor-section">
    <h3>文本编辑</h3>
    <textarea
      v-model="content"
      placeholder="输入文本内容"
      @input="updateContent"
      ref="textareaRef"
    ></textarea>
    <div class="text-controls">
      <div class="control-group">
        <label>文字大小</label>
        <select v-model="fontSize" @change="updateElement">
          <option v-for="size in [12, 14, 16, 18, 20, 24, 28, 32]" :key="size" :value="size">
            {{ size }}px
          </option>
        </select>
      </div>
      <div class="control-group">
        <label>字体粗细</label>
        <select v-model="fontWeight" @change="updateElement">
          <option value="normal">正常</option>
          <option value="bold">粗体</option>
        </select>
      </div>
      <div class="control-group">
        <label>文字颜色</label>
        <input type="color" v-model="color" @input="updateElement">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  element: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])
const textareaRef = ref(null)

// 文本内容
const content = ref(props.element.content || '')
const color = ref(props.element.color || '#000000')
const fontSize = ref(props.element.fontSize || 16)
const fontWeight = ref(props.element.fontWeight || 'normal')

// 监听属性变化
watch(() => props.element.content, (newContent) => {
  if (newContent !== content.value) {
    content.value = newContent || ''
    // 如果文本框存在，更新其滚动位置
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.scrollTop = textareaRef.value.scrollHeight
      }
    })
  }
}, { immediate: true })

watch(() => props.element.color, (newColor) => {
  color.value = newColor
}, { immediate: true })

watch(() => props.element.fontSize, (newFontSize) => {
  fontSize.value = newFontSize
}, { immediate: true })

watch(() => props.element.fontWeight, (newFontWeight) => {
  fontWeight.value = newFontWeight
}, { immediate: true })

// 更新内容
const updateContent = () => {
  emit('update', { 
    content: content.value,
    elementId: props.element.id
  })
}

// 更新元素
const updateElement = () => {
  emit('update', {
    content: content.value,
    color: color.value,
    fontSize: fontSize.value,
    fontWeight: fontWeight.value,
    elementId: props.element.id
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

textarea {
  width: 100%;
  min-height: 1rem;
  padding: 0.075rem;
  border: 0.01rem solid #e5e7eb;
  border-radius: 0.06rem;
  resize: vertical;
  font-size: 0.095rem;
  line-height: 1.5;
  transition: all 0.2s;
  color: #333;
}

textarea:focus {
  border-color: #4080ff;
  outline: none;
  box-shadow: 0 0 0 0.02rem rgba(64, 128, 255, 0.1);
}

.text-controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.1rem;
  margin-top: 0.075rem;
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

input[type="color"] {
  width: 0.4rem;
  height: 0.3rem;
  padding: 0.02rem;
  border: 0.01rem solid #e5e7eb;
  border-radius: 0.04rem;
  cursor: pointer;
}

select {
  padding: 0.05rem;
  border: 0.01rem solid #e5e7eb;
  border-radius: 0.04rem;
  background: white;
  color: #333;
  cursor: pointer;
  min-width: .8rem;
}
</style> 