// @blur="() => {
//   if (!validateDate(rtgsForm.chequeDate)) {
//     rtgsForm.chequeDate = ''
//   }
// }"
import dayjs from './dayjs'

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

const downloadBase64ReportExcel = (base64Data) => {
  const base64Excel = base64Data

  try {
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
  } catch (error) {
    console.error('Error downloading Excel:', error)
  }
}

const downloadBase64ReportPdf = (base64Data) => {
  const base64Pdf = base64Data

  try {
    const byteCharacters = atob(base64Pdf)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], {
      type: 'application/pdf',
    })

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'report.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading PDF:', error)
  }
}

// const convertToIsoFormat = (dateStr) => {
//   if (typeof dateStr !== 'string' || !dateStr.trim()) {
//     return null
//   }

//   const trimmed = dateStr.trim()
//   const datePattern = /^\d{2}\/\d{2}\/\d{4}$/

//   if (!datePattern.test(trimmed)) {
//     return null
//   }

//   const [day, month, year] = trimmed.split('/')
//   return `${year}-${month}-${day}`
// }

// const convertDateFormat = (dateStr) => {
//   if (typeof dateStr !== 'string' || !dateStr.trim()) {
//     return null
//   }

//   const trimmed = dateStr.trim()

//   const datePattern = /^\d{4}-\d{2}-\d{2}$/
//   if (!datePattern.test(trimmed)) {
//     return null
//   }

//   const [year, month, day] = trimmed.split('-')
//   return `${day}/${month}/${year}`
// }

const convertToIsoFormat = (dateStr) => {
  if (typeof dateStr !== 'string' || !dateStr.trim()) {
    return null
  }

  const trimmed = dateStr.trim()
  const parsed = dayjs(trimmed, 'DD/MM/YYYY', true)

  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null
}

const convertDateFormat = (dateStr) => {
  if (typeof dateStr !== 'string' || !dateStr.trim()) {
    return null
  }

  const trimmed = dateStr.trim()
  const parsed = dayjs(trimmed, 'YYYY-MM-DD', true)

  return parsed.isValid() ? parsed.format('DD/MM/YYYY') : null
}

const isWithin60Days = (dateStr) => {
  const [month, day, year] = dateStr.split('/')
  const inputDate = new Date(`${year}-${month}-${day}`)
  const today = new Date()

  inputDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const diffTime = today - inputDate
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  return diffDays <= 60
}

const removeValidationRule = (validationRules, fieldName, ruleProperty) => {
  if (validationRules[fieldName]) {
    const indexToRemove = validationRules[fieldName].findIndex(
      (rule) => rule[ruleProperty] !== undefined,
    )
    if (indexToRemove > -1) {
      validationRules[fieldName].splice(indexToRemove, 1)
      return true
    }
  }
  return false
}

const addValidationRule = (validationRules, fieldName, newRule) => {
  if (validationRules[fieldName]) {
    const alreadyExists = validationRules[fieldName].some((existingRule) => {
      return Object.entries(newRule).every(([key, value]) => existingRule[key] === value)
    })

    if (!alreadyExists) {
      validationRules[fieldName].push(newRule)
      return true
    }
  }
  return false
}

const handleMultiLineTextboxKeyPress = (event) => {
  console.log(event)
  const value = event.target.value
  const caretPos = event.target.selectionStart
  const lines = value.split('\n')

  if (event.key === 'Enter' && lines.length >= 3) {
    event.preventDefault()
    return
  }

  const beforeCaret = value.slice(0, caretPos)
  const currentLineIndex = beforeCaret.split('\n').length - 1
  const currentLine = lines[currentLineIndex] || ''

  const navigationKeys = [
    'Backspace',
    'Enter',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ]
  if (currentLine.length >= 35 && !navigationKeys.includes(event.key)) {
    event.preventDefault()
  }
}

const handleMultiLineTextboxPaste = (event) => {
  console.log('Pasting function working')
  const clipboardData = event.clipboardData || window.clipboardData
  const pastedText = clipboardData.getData('text')

  const value = event.target.value
  const caretPos = event.target.selectionStart
  const beforeCaret = value.slice(0, caretPos)
  const afterCaret = value.slice(caretPos)

  const newValue = beforeCaret + pastedText + afterCaret
  const newLines = newValue.split('\n')

  if (newLines.length > 3) {
    event.preventDefault()
    return
  }

  const lineTooLong = newLines.some((line) => line.length > 35)
  if (lineTooLong) {
    event.preventDefault()
    return
  }
}

const isAlphaNumeric = (event) => {
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
  console.log('event working')
  if (event.ctrlKey || event.metaKey || allowedKeys.includes(event.key)) return

  if (event.key.length === 1 && !/^[a-zA-Z0-9]$/.test(event.key)) {
    event.preventDefault()
  }
}

const formatAmount = (value) => {
  console.log("Before formatting value", value);
  if (!value) return value
  if(typeof(value) != 'number') value = parseInt(value);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const parseFormattedAmount = (formattedValue) => {
  console.log("Before parsing value", formattedValue);
  if (!formattedValue || typeof(formattedValue) != 'string') return formattedValue
  return parseFloat(formattedValue.replace(/,/g, ''))
}

export {
  isNumber,
  dateMasking,
  downloadBase64ReportExcel,
  downloadBase64ReportPdf,
  convertDateFormat,
  isWithin60Days,
  convertToIsoFormat,
  removeValidationRule,
  addValidationRule,
  handleMultiLineTextboxPaste,
  handleMultiLineTextboxKeyPress,
  isAlphaNumeric,
  formatAmount,
  parseFormattedAmount,
}
