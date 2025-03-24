<template>
  <DraggableElement
    :position="position"
    :size="size"
    :is-selected="isSelected"
    :element-id="elementId"
    @update:position="$emit('update:position', $event)"
    @update:size="$emit('update:size', $event)"
    @select="$emit('select')"
  >
    <div 
      class="text-content" 
      :style="textStyle"
      :contenteditable="isSelected"
      @input="onTextInput"
      @keydown.enter.prevent="$event.target.blur()"
      ref="textContentRef"
    ></div>
  </DraggableElement>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import DraggableElement from './DraggableElement.vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  elementId: {
    type: String,
    required: true
  },
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
  color: {
    type: String,
    default: '#000000'
  },
  fontSize: {
    type: Number,
    default: 16
  },
  fontWeight: {
    type: String,
    default: 'normal'
  }
})

const emit = defineEmits(['update:position', 'update:size', 'select', 'update'])

const textStyle = computed(() => {
  return {
    color: props.color,
    fontSize: props.fontSize / 100 + 'rem',
    fontWeight: props.fontWeight,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    textAlign: 'center',
    outline: 'none'
  }
})

const textContentRef = ref(null)

// 监听文本变化并更新显示
watch(() => props.text, (newText) => {
  if (textContentRef.value && textContentRef.value.textContent !== newText) {
    textContentRef.value.textContent = newText || ''
  }
}, { immediate: true })

// 初始化文本内容
onMounted(() => {
  if (textContentRef.value) {
    textContentRef.value.textContent = props.text || ''
  }
})

const onTextInput = (event) => {
  const newText = event.target.textContent
  // 实时发送更新
  emit('update', { 
    content: newText,
    elementId: props.elementId
  })
}
</script>

<style scoped>
.text-content {
  line-height: 1.5;
  min-width: 0;
  min-height: 0;
  cursor: default;
}

.text-content[contenteditable="true"] {
  cursor: text;
  user-select: text;
}

.text-content[contenteditable="true"]:focus {
  outline: none;
}
</style> 