<template>
  <DraggableElement
    :position="position"
    :size="size"
    :is-selected="isSelected"
    :element-id="elementId"
    @update:position="$emit('update:position', $event)"
    @update:size="$emit('update:size', $event)"
    @select="$emit('select')"
    :data-object-fit="objectFit"
  >
    <div class="image-wrapper" :class="{ 'is-avatar': isAvatar }">
      <template v-if="src">
        <img :src="src" :style="imageStyle" :alt="alt">
      </template>
      <template v-else-if="!isBackground">
        <!-- 头像占位图 -->
        <div v-if="isAvatar" class="placeholder avatar-placeholder">
          <svg viewBox="0 0 24 24" width="60" height="60" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <!-- 普通图片占位图 -->
        <div v-else class="placeholder image-placeholder">
          <svg viewBox="0 0 24 24" width="100" height="100" fill="currentColor">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        </div>
      </template>
    </div>
  </DraggableElement>
</template>

<script setup>
import { computed } from 'vue'
import DraggableElement from './DraggableElement.vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  elementId: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
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
  objectFit: {
    type: String,
    default: 'cover'
  },
  isAvatar: {
    type: Boolean,
    default: false
  },
  isBackground: {
    type: Boolean,
    default: false
  }
})

const imageStyle = computed(() => ({
  width: '100%',
  height: '100%',
  objectFit: props.objectFit,
  borderRadius: props.isAvatar ? '50%' : '0',
  border: props.isAvatar ? '3px solid white' : 'none',
  boxShadow: props.isAvatar ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none'
}))

defineEmits(['update:position', 'update:size', 'select'])
</script>

<style scoped>
.image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.image-wrapper.is-avatar {
  border-radius: 50%;
}

img {
  display: block;
  max-width: 100%;
  max-height: 100%;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  color: #999;
  gap: 0.08rem;
  transition: all 0.2s;
  cursor: default;
}

.placeholder:hover {
  background: #f5f7fa;
  color: #666;
}

.placeholder span {
  font-size: 0.12rem;
  text-align: center;
}

.avatar-placeholder {
  border-radius: 50%;
  border: 0.03rem dashed #e5e7eb;
}

.image-placeholder {
  border: 0.03rem dashed #e5e7eb;
  border-radius: 0.08rem;
}

.image-wrapper.is-avatar img {
  border-radius: 50%;
  border: 0.03rem solid white;
  box-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.2);
}
</style> 