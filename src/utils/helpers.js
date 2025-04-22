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

export { isNumber }
