// @blur="() => {
//   if (!validateDate(rtgsForm.chequeDate)) {
//     rtgsForm.chequeDate = ''
//   }
// }"

const isNumber = (event) => {
  const allowedKeys = [
    'Backspace',
    'Tab',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Delete',
    'Home',
    'End',
    'Escape',
  ]

  if (event.ctrlKey || event.metaKey) return

  if (allowedKeys.includes(event.key)) return

  if (event.key.length === 1 && !/^\d$/.test(event.key)) {
    event.preventDefault()
  }
}

const dateMasking = (event) => {
  const allowedKeys = [
    'Backspace',
    'Tab',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Delete',
    'Home',
    'End',
    'Escape',
  ]

  if (event.ctrlKey || event.metaKey || allowedKeys.includes(event.key)) return

  if (!/^\d$/.test(event.key)) {
    event.preventDefault()
    return
  }

  let val = event.target.value.replace(/\D/g, '')

  if (val.length >= 8) {
    event.preventDefault()
    return
  }

  setTimeout(() => {
    let cleaned = event.target.value.replace(/\D/g, '')
    let formatted = ''
    if (cleaned.length > 0) formatted += cleaned.substring(0, 2)
    if (cleaned.length > 2) formatted += '/' + cleaned.substring(2, 4)
    if (cleaned.length > 4) formatted += '/' + cleaned.substring(4, 8)
    event.target.value = formatted
  }, 0)
}

const downloadBase64Report = (base64Data) => {
  const base64Excel = base64Data

  const byteCharacters = atob(base64Excel)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'report.xlsx'
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

export { isNumber, dateMasking, downloadBase64Report }
