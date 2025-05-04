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

export { amountMaskingDirective, dateMaskingDirective }
