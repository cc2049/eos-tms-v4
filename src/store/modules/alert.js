/*
 * @Author: cc2049
 * @Date: 2024-07-02 14:13:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-03 14:04:41
 * @Description: 简介
 */

const useAlertStore = defineStore(
  'alert',
  {
    state: () => ({
      show: false,
      title: '',
      type: 'error',
      description: '',
      closable: false
    }),
    actions: {
      setAlert(data) {
        this.show = true
        this.title = data.title
        this.type = data.type || 'error'
        this.description = data.description
      },
      close() {
        this.show = false
      }
    }
  })

export default useAlertStore
