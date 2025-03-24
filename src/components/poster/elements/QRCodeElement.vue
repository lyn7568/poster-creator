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
    <div class="qr-wrapper">
      <qrcode-vue
        :value="value"
        :size="Math.min(size.width - 20, size.height - 20)"
        level="H"
      ></qrcode-vue>
    </div>
  </DraggableElement>
</template>

<script setup>
import { computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
import DraggableElement from './DraggableElement.vue'

const props = defineProps({
  value: {
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
  elementId: {
    type: String,
    required: true
  }
})

defineEmits(['update:position', 'update:size', 'select'])
</script>

<style scoped>
.qr-wrapper {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style> 