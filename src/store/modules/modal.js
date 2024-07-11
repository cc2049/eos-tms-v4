/*
 * @Author: cc2049
 * @Date: 2024-07-11 16:22:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-11 18:49:24
 * @Description: 简介
 */

const useModalStore = defineStore(
  'modal',
  {
    state: () => ({
      showModal: false,
      title: '',
      type:'',
      menuID: '',
      config: {}

    }),
    actions: {
      setModal(data) {
        console.log('setModal');
        this.showModal = true
        this.title = data.title
        this.config = data.config
        this.type = data.type
        this.menuID = data.menuID
      },
      close() {
        this.showModal = false
      }
    }
  })

export default useModalStore
