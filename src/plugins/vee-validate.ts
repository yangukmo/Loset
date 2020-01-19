import { extend } from 'vee-validate'

extend('maxLength', {
  validate(value, { length }): boolean {
    return value.length <= +length
  },
  message: 'Please enter less than {length} characters.',
  params: ['length'],
})

extend('port', {
  validate(value) {
    return (+value > 0) && (+value <= 65535)
  },
  message: 'Please enter a port number between 1 and 65535.',
})

extend('interval', {
  validate(value) {
    return (+value >= 5000) && (+value <= 60000)
  },
  message: 'Please enter an interval between 5000 and 60000. (ms)',
})

extend('path', {
  validate(value) {
    return /^\/([^?\/]+)/g.test(value)
  },
  message: 'Please enter a valid path starting with \'/\'.',
})

extend('required', {
  validate(value) {
    return {
      required: true,
      valid: !['', null, undefined].includes(value),
    }
  },
  computesRequired: true,
  message: 'Please enter a {_field_}.',
})
