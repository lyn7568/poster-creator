<template>
  <div class="editor-section">
    <h3>二维码设置</h3>
    <input
      type="text"
      v-model="qrValue"
      placeholder="输入链接生成二维码"
      @input="updateValue"
      @keydown.stop
      class="qr-input"
    >
    <div class="qr-preview" v-if="qrValue">
      <qrcode-vue :value="qrValue || ' '" :size="120" level="H"></qrcode-vue>
    </div>
    <div class="qr-placeholder" v-else>
      <div class="placeholder-text">请输入链接生成二维码</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import QrcodeVue from 'qrcode.vue'

const props = defineProps({
  element: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])

const qrValue = ref(props.element.value || '')

watch(() => props.element.value, (newValue) => {
  qrValue.value = newValue || ''
})

const updateValue = () => {
  emit('update', { value: qrValue.value })
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

.qr-input {
  width: 100%;
  padding: 0.08rem;
  border: 0.01rem solid #e5e7eb;
  border-radius: 0.04rem;
  font-size: 0.12rem;
  margin-bottom: 0.15rem;
  transition: all 0.2s;
}

.qr-input:focus {
  border-color: #4080ff;
  outline: none;
  box-shadow: 0 0 0 0.02rem rgba(64, 128, 255, 0.1);
}

.qr-preview {
  display: flex;
  justify-content: center;
  padding: 0.15rem;
  background: #f5f7fa;
  border-radius: 0.06rem;
}

.qr-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.5rem;
  background: #f5f7fa;
  border-radius: 0.06rem;
}

.placeholder-text {
  color: #999;
  font-size: 0.12rem;
}
</style> 