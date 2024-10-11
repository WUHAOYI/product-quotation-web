import { ElNotification } from 'element-plus'

export function notifySuccess(title, message, type = 'success') {
  ElNotification({
    title,
    message,
    type,
    duration: 2000,
  })
}

export function notifyError(title, message, type = 'error') {
  ElNotification({
    title,
    message,
    type,
    duration: 2000,
  })
}

export function notifyWarning(title, message, type = 'warning') {
  ElNotification({
    title,
    message,
    type,
    duration: 2000,
  })
}
