/*
 * @Author: cc2049
 * @Date: 2024-07-11 16:22:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-11 17:12:26
 * @Description: 简介
 */

const useModalStore = defineStore(
  'modal',
  {
    state: () => ({
      showModal: false,
      title: '',
      menuID: '',
      config: {}

    }),
    actions: {
      setModal(data) {
        this.showModal = true
        this.title = data.title
        this.config = data.config
      },
      close() {
        this.showModal = false
      }
    }
  })

export default useModalStore
