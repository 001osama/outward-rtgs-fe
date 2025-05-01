import dayjs from './dayjs'
import { getToken } from './jwtDecoder'

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

// const validateDate = (rule, value, callback) => {
//   const currentYear = new Date().getFullYear()

//   if (!value) {
//     callback(new Error('Field is required'))
//     return
//   }

//   const [dd, mm, yyyy] = value.split('/').map(Number)

//   if (
//     !dd ||
//     !mm ||
//     !yyyy ||
//     dd < 1 ||
//     dd > 31 ||
//     mm < 1 ||
//     mm > 12 ||
//     yyyy < 2000 ||
//     yyyy > currentYear
//   ) {
//     callback(new Error(`Date format is dd/mm/yyyy.`))
//   } else {
//     callback()
//   }
// }

const validateDate = (rule, value, callback) => {
  const currentYear = new Date().getFullYear()

  if (!value) {
    return callback(new Error('Field is required'))
  }

  const parsedDate = dayjs(value, 'DD/MM/YYYY', true)
  const year = parsedDate.year()

  if (!parsedDate.isValid() || year > currentYear) {
    return callback(new Error('Date format is dd/mm/yyyy.'))
  }

  const userInfo = getToken()
  let today = userInfo?.currentLoggedInDate
    ? dayjs(userInfo.currentLoggedInDate, 'DD/MM/YYYY')
    : dayjs()
  const sixMonthsAgo = today.subtract(6, 'month')

  if (parsedDate.isBefore(sixMonthsAgo)) return callback(new Error('Cheque is expired'))
  if (parsedDate.isAfter(today)) return callback(new Error('Date is in the future'))

  if (year < currentYear - 1) {
    return callback(new Error(`Cheque is expired`))
  }

  callback()
}

export { validateYear, validateDate }
