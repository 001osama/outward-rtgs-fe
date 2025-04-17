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


export {invokeDefaultDialog}