/**
 * 生成随机色值
 */
export const randomRGB = () => {
  const r = Math.floor(Math.random() * 257)
  const g = Math.floor(Math.random() * 257)
  const b = Math.floor(Math.random() * 257)
  return `rgb(${r}, ${g}, ${b})`
}
