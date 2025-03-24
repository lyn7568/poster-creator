// 元素操作按钮组
export const actionButtons = [
  {
    type: 'poster',
    label: '海报布局',
    icon: 'D'
  },
  {
    type: 'text',
    label: '文本',
    icon: 'T'
  },
  {
    type: 'image',
    label: '图片',
    icon: 'P'
  },
  {
    type: 'qrcode',
    label: '二维码',
    icon: 'Q'
  },
  {
    type: 'avatar',
    label: '头像',
    icon: 'A'
  }
]
// 操作按钮组
export const operationButtons = [
  {
    type: 'export',
    label: '导出海报',
    icon: `<svg class="icon-download" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
    </svg>`,
    btnType: 'success'
  }
] 

// 默认元素配置
export const DEFAULT_ELEMENTS = {
  background: {
    type: 'background',
    position: { x: 0, y: 0 },
    size: { width: 450, height: 800 },
    src: '',
    backgroundColor: '#ffffff',
    objectFit: 'contain'
  },
  image: {
    type: 'image',
    position: { x: 20, y: 200 },
    size: { width: 200, height: 200 },
    src: '',
    objectFit: 'cover'
  },
  avatar: {
    type: 'avatar',
    position: { x: 20, y: 20 },
    size: { width: 100, height: 100 },
    src: '',
    isAvatar: true,
    objectFit: 'cover'
  },
  text: {
    type: 'text',
    content: '点击编辑文本',
    color: '#000000',
    fontSize: 16,
    fontWeight: 'normal',
    position: { x: 200, y: 20 },
    size: { width: 200, height: 100 }
  },
  qrcode: {
    type: 'qrcode',
    value: 'https://example.com',
    position: { x: 300, y: 600 },
    size: { width: 120, height: 120 }
  }
}
 