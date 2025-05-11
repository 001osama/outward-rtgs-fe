import Cleave from 'cleave.js'

const amountConfig = {
  numeral: true,
  numeralThousandsGroupStyle: 'thousand',
  numeralDecimalMark: '.',
  delimiter: ',',
  numeralDecimalScale: 2,
}

const dateConfig = {
  date: true,
  datePattern: ['d', 'm', 'Y'],
}

const amountMaskingDirective = {
  mounted(el, binding) {
    const inputElement = el.querySelector('input')
    console.log('Element is ', el)
    console.log('Binded value is ', binding)

    const modelRef = binding?.value
    // el.cleave = new Cleave(inputElement, {
    //   amountConfig,
    //   onValueChanged: (e) => {
    //     console.log('value changed is detected', e)
    //     if (modelRef) {
    //       modelRef.value = e.target.rawValue
    //     }
    //   },
    // })
    el.cleave = new Cleave(inputElement, amountConfig)
  },

  updated(el, binding) {
    debugger
    const modelValue = binding?.value?.model?.value
    const cleave = el.cleave
    console.log('updated function is working', el)
    // if (cleave && cleave.getRawValue() !== modelValue) {
    //   cleave.setRawValue(modelValue)
    // }
  },

  unmounted(el) {
    if (el.cleave) {
      el.cleave.destroy()
      delete el.cleave
    }
  },
}

const dateMaskingDirective = {
  mounted(el, binding) {
    const inputElement = el.querySelector('input')
    el.cleave = new Cleave(inputElement, dateConfig)
  },
  unmounted(el) {
    if (el.cleave) el.cleave.destroy()
  },
}

const customAmount = {
  mounted(el, binding, vnode) {
    const formatValue = (value) => {
      const number = parseFloat(value.toString().replace(/,/g, ''))
      if (isNaN(number)) return ''
      return number.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    }

    const getRawValue = (val) => {
      const num = parseFloat(val.replace(/,/g, ''))
      return isNaN(num) ? '' : num.toFixed(2)
    }

    const updateModel = (raw) => {
      const ctx = binding.instance
      const prop = binding.expression
      if (ctx && prop) {
        ctx[prop] = raw
      }
    }

    const onInput = (e) => {
      const raw = getRawValue(e.target.value)
      const formatted = formatValue(raw)
      e.target.value = formatted
      updateModel(raw)
    }

    el.addEventListener('input', onInput)

    // Initial format from value
    const initialRaw = getRawValue(binding.value ?? '')
    el.value = formatValue(initialRaw)
    updateModel(initialRaw)
  },
}

export { amountMaskingDirective, dateMaskingDirective, customAmount }
