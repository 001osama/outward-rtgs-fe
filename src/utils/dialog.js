import { ElMessageBox } from 'element-plus';

const invokeDefaultDialog = (title, message, callback = null)=>{
  ElMessageBox.alert(
    message,
    title,
    {
      confirmButtonClass: 'mb-confirm-button',
      dangerouslyUseHTMLString: true,
      confirmButtonText: 'OK',
      showCancelButton: false,
      showClose: false,
      draggable: true,
      center: true,
      ...(callback && {callback})
    })
}


const invokeConfirmationDialog = async (message, messageType, successFn) => {
  ElMessageBox.confirm(message, messageType, {
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    showCancelButton: true,
    showClose: false,
    autofocus: false,
    center: true,
    draggable: true,
    closeOnClickModal: false,
  })
    .then(() => { successFn() })
    .catch(() => {})
}

export {invokeDefaultDialog, invokeConfirmationDialog}