import { DEFAULT_ELEMENTS } from './index.js'

// 生成唯一ID
const generateId = () => `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// 添加背景
export const addBackground = (elements, canvasSize) => {
  if (!elements.find(el => el.type === 'background')) {
    const background = {
      ...DEFAULT_ELEMENTS.background,
      id: generateId(),
      size: {
        width: canvasSize.width,
        height: canvasSize.height
      }
    }
    return {
      element: background,
      elements: [...elements, background]
    }
  }
  const background = elements.find(el => el.type === 'background')
  return {
    element: background,
    elements
  }
}

// 添加头像
export const addAvatar = (elements) => {
  const avatar = {
    ...DEFAULT_ELEMENTS.avatar,
    id: generateId()
  }
  return {
    element: avatar,
    elements: [...elements, avatar]
  }
}

// 添加文本
export const addText = (elements) => {
  const text = {
    ...DEFAULT_ELEMENTS.text,
    id: generateId()
  }
  return {
    element: text,
    elements: [...elements, text]
  }
}

// 添加二维码
export const addQRCode = (elements) => {
  const qrcode = {
    ...DEFAULT_ELEMENTS.qrcode,
    id: generateId()
  }
  return {
    element: qrcode,
    elements: [...elements, qrcode]
  }
}

// 添加普通图片
export const addImage = (elements) => {
  const image = {
    ...DEFAULT_ELEMENTS.image,
    id: generateId()
  }
  return {
    element: image,
    elements: [...elements, image]
  }
}

// 更新元素属性
export const updateElement = (elements, id, updates) => {
  return elements.map(element => 
    element.id === id ? { ...element, ...updates } : element
  )
}

// 处理添加元素
export const handleAddElement = (type, elements, canvasSize) => {
  switch (type) {
    case 'poster':
      return addBackground(elements, canvasSize)
    case 'text':
      return addText(elements)
    case 'image':
      return addImage(elements)
    case 'qrcode':
      return addQRCode(elements)
    case 'avatar':
      return addAvatar(elements)
    default:
      return { elements, element: null }
  }
} 