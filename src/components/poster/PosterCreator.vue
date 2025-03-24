<template>
  <div class="poster-creator-container">
    <div class="header">
      <h1>海报设计器</h1>
      <p class="subtitle">拖拽元素自由布局，创建专属海报</p>
    </div>

    <div class="poster-creator" @click="handleBackgroundClick">
      <!-- 左侧按钮区域 -->
      <ActionPanel
        :selected-type="selectedType"
        @add-element="onAddElement"
        @reset="onResetLayout"
        @export="exportPoster"
      />

      <!-- 中间预览区域 -->
      <PreviewPanel
        :elements="elements"
        :selected-element="selectedElement"
        :canvas-size="canvasSize"
        @select-element="selectElement"
        @clear-canvas="onResetLayout"
        ref="preview"
        @click.stop
      />

      <!-- 右侧属性面板 -->
      <EditorPanel
        v-model:elements="elements"
        :selected-element="selectedElement"
        :canvas-size="canvasSize"
        @update:canvas-size="handleCanvasSizeUpdate"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { h, render } from 'vue'
import html2canvas from 'html2canvas'
import QrcodeVue from 'qrcode.vue'
import PreviewPanel from './elements/index.vue'
import ActionPanel from './actions/index.vue'
import EditorPanel from './editors/index.vue'
import DraggableElement from './elements/DraggableElement.vue'

import { handleAddElement, updateElement } from './actions/handlers'
import { DEFAULT_ELEMENTS } from './actions/index.js'

const preview = ref(null)
const selectedElement = ref(null)
const selectedType = ref('poster')

// 画布尺寸状态，使用背景元素的默认尺寸
const canvasSize = ref({
  width: DEFAULT_ELEMENTS.background.size.width,
  height: DEFAULT_ELEMENTS.background.size.height
})

// 元素列表，改为数组形式以支持多个同类型元素
const elements = ref([])

// 添加键盘事件处理
const handleKeyDown = (e) => {
  // 如果当前焦点在输入框内，不处理删除事件
  if (e.target.tagName.toLowerCase() === 'input' || 
      e.target.tagName.toLowerCase() === 'textarea') {
    return
  }

  // 如果有选中的元素，并且按下了 Delete 或 Backspace 键
  if (selectedElement.value && (e.key === 'Delete' || e.key === 'Backspace')) {
    const element = elements.value.find(el => el.id === selectedElement.value)
    // 不允许删除背景元素
    if (element && element.type !== 'background') {
      handleDeleteElement(selectedElement.value)
    }
  }
}

// 在组件挂载时添加键盘事件监听
onMounted(() => {
  // 自动添加背景元素
  const { elements: newElements, element } = handleAddElement('poster', elements.value, canvasSize.value)
  elements.value = newElements
  if (element) {
    selectedElement.value = element.id
  }
  
  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeyDown)
})

// 在组件卸载时移除键盘事件监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

// 处理画布尺寸更新
const handleCanvasSizeUpdate = (newSize) => {
  // 更新画布尺寸
  canvasSize.value = {
    width: Math.max(1, parseInt(newSize.width) || canvasSize.value.width),
    height: Math.max(1, parseInt(newSize.height) || canvasSize.value.height)
  }
  
  // 更新背景元素尺寸
  const backgroundElement = elements.value.find(el => el.type === 'background')
  if (backgroundElement) {
    elements.value = elements.value.map(el => 
      el.type === 'background' 
        ? { ...el, size: { ...canvasSize.value } }
        : el
    )
  }
}

const selectElement = (elementId) => {
  selectedElement.value = elementId
  const element = elements.value.find(el => el.id === elementId)
  if (element) {
    selectedType.value = element.type === 'background' ? 'poster' : element.type
  }
}

// 添加 handleSelectElement 函数
const handleSelectElement = (elementId) => {
  selectElement(elementId)
}

const handleBackgroundClick = () => {
  selectedElement.value = null
  selectedType.value = null
}

// 处理添加元素
const onAddElement = (type) => {
  selectedType.value = type
  const { elements: newElements, element } = handleAddElement(type, elements.value, canvasSize.value)
  elements.value = newElements
  if (element) {
    selectedElement.value = element.id
  }
}

// 清空画布
const onResetLayout = () => {
  if (confirm('确定要清空画布吗？此操作不可恢复。')) {
    // 保留背景元素，清空其他所有元素
    const backgroundElement = elements.value.find(el => el.type === 'background')
    if (backgroundElement) {
      // 重置背景元素的属性
      elements.value = [{
        ...backgroundElement,
        backgroundColor: '#ffffff',
        src: '',
        objectFit: 'contain'
      }]
    } else {
      elements.value = []
    }
    // 清除选中状态
    selectedElement.value = null
    selectedType.value = null
  }
}

// 删除元素
const handleDeleteElement = (elementId) => {
  elements.value = elements.value.filter(el => el.id !== elementId)
  // 如果删除的是当前选中的元素，清除选中状态
  if (selectedElement.value === elementId) {
    selectedElement.value = null
  }
}

// 导出海报
const exportPoster = async () => {
  if (!preview.value?.poster) {
    return
  }

  try {
    
    // 1. 创建临时容器
    const container = document.createElement('div')
    container.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: ${canvasSize.value.width}px;
      height: ${canvasSize.value.height}px;
      background: white;
      overflow: visible;
      transform-origin: top left;
      transform: translateX(100vw);
      pointer-events: none;
      z-index: -9999;
    `
    document.body.appendChild(container)

    // 2. 创建新的内容容器
    const contentContainer = document.createElement('div')
    contentContainer.style.cssText = `
      width: ${canvasSize.value.width}px;
      height: ${canvasSize.value.height}px;
      position: relative;
      background: white;
      overflow: visible;
      pointer-events: none;
    `
    container.appendChild(contentContainer)

    // 3. 处理背景
    const backgroundElement = elements.value.find(el => el.type === 'background')

    if (backgroundElement) {
      const backgroundDiv = document.createElement('div')
      backgroundDiv.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: ${canvasSize.value.width}px;
        height: ${canvasSize.value.height}px;
        background-color: ${backgroundElement.backgroundColor || '#ffffff'};
      `
      if (backgroundElement.src) {
        const backgroundImg = document.createElement('img')
        backgroundImg.src = backgroundElement.src
        backgroundImg.style.cssText = `
          width: 100%;
          height: 100%;
          object-fit: ${backgroundElement.objectFit || 'cover'};
          display: block;
        `
        backgroundDiv.appendChild(backgroundImg)
      }
      contentContainer.appendChild(backgroundDiv)
    }

    // 4. 处理其他元素
    const loadPromises = []
    
    // 按照z-index排序元素
    const sortedElements = elements.value
      .filter(el => el.type !== 'background')
      .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))

    for (const elementData of sortedElements) {
      const elementContainer = document.createElement('div')
      elementContainer.style.cssText = `
        position: absolute;
        left: ${elementData.position.x}px;
        top: ${elementData.position.y}px;
        width: ${elementData.size.width}px;
        height: ${elementData.size.height}px;
        transform: none;
        z-index: ${elementData.zIndex || 1};
        overflow: visible;
      `

      switch (elementData.type) {
        case 'text':
          const textDiv = document.createElement('div')
          const fontSize = (elementData.fontSize || 16)
          textDiv.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${elementData.color || '#000000'};
            font-size: ${fontSize}px;
            font-weight: ${elementData.fontWeight || 'normal'};
            white-space: pre-wrap;
            word-break: break-word;
            overflow: visible;
          `
          textDiv.textContent = elementData.content || ''
          elementContainer.appendChild(textDiv)
          break

        case 'image':
        case 'avatar':
          const img = document.createElement('img')
          img.src = elementData.src
          img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: ${elementData.objectFit || 'cover'};
            display: block;
            ${elementData.type === 'avatar' ? 'border-radius: 50%;' : ''}
          `
          elementContainer.appendChild(img)
          loadPromises.push(new Promise((resolve, reject) => {
            if (img.complete) {
              resolve()
            } else {
              img.onload = resolve
              img.onerror = reject
            }
          }))
          break

        case 'qrcode':
          const qrDiv = document.createElement('div')
          qrDiv.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            padding: 8px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: visible;
          `
          elementContainer.appendChild(qrDiv)

          const qrWrapper = document.createElement('div')
          qrWrapper.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
          `
          qrDiv.appendChild(qrWrapper)

          const size = Math.min(elementData.size.width - 16, elementData.size.height - 16)
          const tempDiv = document.createElement('div')
          tempDiv.style.cssText = `
            position: absolute;
            left: -9999px;
            top: -9999px;
          `
          document.body.appendChild(tempDiv)

          const qrcode = h(QrcodeVue, {
            value: elementData.value || '',
            size: size,
            level: 'H',
            renderAs: 'svg',
            margin: 0,
            color: {
              dark: '#000000',
              light: '#ffffff'
            }
          })
          render(qrcode, tempDiv)

          loadPromises.push(new Promise(resolve => {
            const checkQR = () => {
              const svg = tempDiv.querySelector('svg')
              if (svg) {
                const clonedSvg = svg.cloneNode(true)
                clonedSvg.style.cssText = `
                  width: ${size}px;
                  height: ${size}px;
                  display: block;
                `
                qrWrapper.appendChild(clonedSvg)
                document.body.removeChild(tempDiv)
                resolve()
              } else {
                requestAnimationFrame(checkQR)
              }
            }
            checkQR()
          }))
          break
      }

      contentContainer.appendChild(elementContainer)
    }

    // 5. 等待所有资源加载完成
    if (loadPromises.length > 0) {
      await Promise.all(loadPromises)
    }

    // 6. 等待渲染完成
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 7. 导出为图片

    // 临时移回视口内进行渲染
    container.style.transform = 'none'
    
    const canvas = await html2canvas(container, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: 'white',
      scale: 2,
      width: canvasSize.value.width,
      height: canvasSize.value.height,
      logging: true,
      foreignObjectRendering: true,
      onclone: (clonedDoc) => {
        const clonedContainer = clonedDoc.querySelector('div')
        if (clonedContainer) {
          // 确保克隆的容器在视口内
          clonedContainer.style.transform = 'none'
        }
      }
    })

    // 立即移出视口
    container.style.transform = 'translateX(100vw)'

    // 8. 清理临时容器
    document.body.removeChild(container)

    // 9. 下载图片
    const link = document.createElement('a')
    link.download = 'poster.png'
    link.href = canvas.toDataURL('image/png')
    link.click()

  } catch (error) {
    console.error('Export failed:', error)
    // 直接移除临时容器，不再显示它
    const containers = document.querySelectorAll('div[style*="-9999px"]')
    containers.forEach(c => {
      document.body.removeChild(c)
    })
  }
}
</script>

<style scoped>
.poster-creator-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.1rem 0.2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(0.1rem);
  z-index: 1000;
  box-shadow: 0 0.02rem 0.08rem rgba(0, 0, 0, 0.1);
  border-bottom: 0.01rem solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 0.15rem;
}

.header h1 {
  color: #4080ff;
  font-size: 0.175rem;
  font-weight: 600;
  margin: 0;
}

.subtitle {
  color: #666;
  font-size: 0.095rem;
  margin: 0;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0.1rem;
    gap: 0.05rem;
  }

  .header h1 {
    font-size: 0.15rem;
  }

  .subtitle {
    font-size: 0.09rem;
  }
}

.poster-creator {
  height: 100vh;
  background: #f5f7fa;
}

/* 导出时隐藏网格背景 */
:deep(.no-grid)::before {
  display: none !important;
}
</style> 