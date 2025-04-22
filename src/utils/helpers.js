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

  if (event.ctrlKey || event.metaKey) return

  if (allowedKeys.includes(event.key)) return

  if (event.key.length === 1 && !/^\d$/.test(event.key)) {
    event.preventDefault()
  }
  const input = event.target.value.replace(/\D/g, '')
  if (input.length === 2 || input.length === 4) {
    event.target.value += '/'
  }

  if (event.target.value >= 10) {
    event.preventDefault()
  }
}

export { isNumber, dateMasking }
