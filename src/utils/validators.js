const today = new Date()
const currentYear = today.getFullYear()

const validateYear = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Field is required'))
  } else if (Number(value) > currentYear) {
    callback(new Error(`Enter valid year`))
  } else {
    callback()
  }
}

const validateDate = (rule, value, callback) => {
  const currentYear = new Date().getFullYear()

  // if (!value) {
  //   callback(new Error('Field is required'))
  //   return
  // }

  const [mm, dd, yyyy] = value.split('/').map(Number)

  if (
    !dd ||
    !mm ||
    !yyyy ||
    dd < 1 ||
    dd > 31 ||
    mm < 1 ||
    mm > 12 ||
    yyyy < 2000 ||
    yyyy > currentYear
  ) {
    callback(new Error(`Date format is mm/dd/yyyy.`))
  } else {
    callback()
  }
}

export { validateYear, validateDate }
