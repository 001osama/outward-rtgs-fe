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

export { isNumber, dateMasking }
