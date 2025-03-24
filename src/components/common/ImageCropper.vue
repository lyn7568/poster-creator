<template>
  <div class="cropper-dialog" v-if="modelValue" @click.self="close">
    <div class="cropper-content">
      <div class="cropper-header">
        <h4>{{ title }}</h4>
        <button class="close-btn" @click="close">×</button>
      </div>
      <div class="cropper-body">
        <div v-if="!isImageLoaded" class="loading-overlay">
          <span>图片加载中...</span>
        </div>
        <div class="cropper-container" :class="{ 'avatar-cropper': isAvatar }">
          <VueCropper
            v-show="isImageLoaded"
            ref="cropperRef"
            :img="imgSrc"
            :autoCrop="true"
            :fixedBox="isFixedBox"
            :fixed="isFixed"
            :fixedNumber="aspectRatio"
            :centerBox="true"
            :info="true"
            :full="true"
            :canMove="true"
            :canMoveBox="true"
            :original="false"
            :autoCropWidth="initialWidth"
            :autoCropHeight="initialHeight"
            :outputSize="1"
            :outputType="'png'"
            :infoTrue="true"
            @realTime="realTime"
          />
        </div>
      </div>
      <div class="cropper-footer">
        <div class="cropper-controls">
          <button class="control-btn" @click="rotateLeft" :disabled="!isImageLoaded">↺ 向左旋转</button>
          <button class="control-btn" @click="rotateRight" :disabled="!isImageLoaded">↻ 向右旋转</button>
          <button class="control-btn" @click="zoomIn" :disabled="!isImageLoaded">放大</button>
          <button class="control-btn" @click="zoomOut" :disabled="!isImageLoaded">缩小</button>
        </div>
        <div class="cropper-actions">
          <button class="cancel-btn" @click="close">取消</button>
          <button class="confirm-btn" @click="confirmCrop" :disabled="!isImageLoaded">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted, computed } from 'vue'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

export default defineComponent({
  name: 'ImageCropper',
  components: {
    VueCropper
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    imgSrc: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: '图片裁剪'
    },
    isFixed: {
      type: Boolean,
      default: false
    },
    isFixedBox: {
      type: Boolean,
      default: false
    },
    aspectRatio: {
      type: Array,
      default: () => [null, null]
    },
    initialWidth: {
      type: Number,
      default: 200
    },
    initialHeight: {
      type: Number,
      default: 200
    },
    isAvatar: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const cropperRef = ref(null)
    const isImageLoaded = ref(false)

    const initCropper = () => {
      if (props.imgSrc) {
        const img = new Image()
        img.onload = () => {
          isImageLoaded.value = true
        }
        img.src = props.imgSrc
      }
    }

    onMounted(() => {
      if (props.modelValue && props.imgSrc) {
        initCropper()
      }
    })

    watch(() => props.imgSrc, (newSrc) => {
      if (newSrc) {
        isImageLoaded.value = false
        initCropper()
      }
    })

    watch(() => props.modelValue, (newVal) => {
      if (newVal && props.imgSrc) {
        initCropper()
      }
    })

    const close = () => {
      emit('update:modelValue', false)
    }

    const rotateLeft = () => {
      const cropper = cropperRef.value
      if (cropper) {
        cropper.rotateLeft()
      }
    }

    const rotateRight = () => {
      const cropper = cropperRef.value
      if (cropper) {
        cropper.rotateRight()
      }
    }

    const zoomIn = () => {
      const cropper = cropperRef.value
      if (cropper) {
        cropper.zoomIn()
      }
    }

    const zoomOut = () => {
      const cropper = cropperRef.value
      if (cropper) {
        cropper.zoomOut()
      }
    }

    const confirmCrop = () => {
      const cropper = cropperRef.value
      if (cropper) {
        cropper.getCropData((data) => {
          emit('crop', data)
          close()
        })
      }
    }

    const realTime = (data) => {
      // 实时预览回调
    }

    return {
      cropperRef,
      isImageLoaded,
      close,
      rotateLeft,
      rotateRight,
      zoomIn,
      zoomOut,
      confirmCrop,
      realTime
    }
  }
})
</script>

<style scoped>
.cropper-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.cropper-content {
  background: white;
  border-radius: 0.08rem;
  width: 90%;
  max-width: 8rem;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.cropper-header {
  padding: 0.15rem;
  border-bottom: 0.01rem solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cropper-header h4 {
  margin: 0;
  font-size: 0.14rem;
  color: #333;
}

.close-btn {
  border: none;
  background: none;
  font-size: 0.2rem;
  color: #999;
  cursor: pointer;
  padding: 0.05rem;
}

.close-btn:hover {
  color: #666;
}

.cropper-body {
  flex: 1;
  min-height: 400px;
  padding: 0.2rem;
  background: #f5f7fa;
  position: relative;
}

.cropper-container {
  width: 100%;
  height: 400px;
  background: #fff;
}

.cropper-footer {
  padding: 0.15rem;
  border-top: 0.01rem solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.cropper-controls {
  display: flex;
  gap: 0.1rem;
  flex-wrap: wrap;
}

.control-btn {
  padding: 0.06rem 0.12rem;
  border: 0.01rem solid #e5e7eb;
  border-radius: 0.04rem;
  background: white;
  color: #666;
  cursor: pointer;
  font-size: 0.12rem;
  transition: all 0.2s;
}

.control-btn:hover {
  border-color: #4080ff;
  color: #4080ff;
}

.cropper-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.1rem;
}

.cancel-btn {
  padding: 0.06rem 0.15rem;
  border: 0.01rem solid #e5e7eb;
  border-radius: 0.04rem;
  background: white;
  color: #666;
  cursor: pointer;
  font-size: 0.12rem;
  transition: all 0.2s;
}

.cancel-btn:hover {
  border-color: #666;
  color: #333;
}

.confirm-btn {
  padding: 0.06rem 0.15rem;
  border: 0.01rem solid #4080ff;
  border-radius: 0.04rem;
  background: #4080ff;
  color: white;
  cursor: pointer;
  font-size: 0.12rem;
  transition: all 0.2s;
}

.confirm-btn:hover {
  background: #3070ef;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1;
}

.loading-overlay span {
  color: #666;
  font-size: 0.14rem;
}

.control-btn:disabled,
.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

:deep(.vue-cropper) {
  height: 100% !important;
}

.avatar-cropper :deep(.cropper-view-box),
.avatar-cropper :deep(.cropper-face) {
  border-radius: 50%;
}

.avatar-cropper :deep(.cropper-view-box) {
  outline: none;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}

.avatar-cropper :deep(.cropper-dashed) {
  display: none;
}

.avatar-cropper :deep(.cropper-line) {
  background: none;
}

.avatar-cropper :deep(.cropper-point) {
  background-color: #4080ff;
  width: 8px;
  height: 8px;
  opacity: 1;
}

.avatar-cropper :deep(.point-e),
.avatar-cropper :deep(.point-n),
.avatar-cropper :deep(.point-w),
.avatar-cropper :deep(.point-s) {
  display: none;
}

.avatar-cropper :deep(.point-nw),
.avatar-cropper :deep(.point-ne),
.avatar-cropper :deep(.point-sw),
.avatar-cropper :deep(.point-se) {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
</style> 