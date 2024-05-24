/**
 * 弹窗相关hooks
 * @author WangJun 2024-05-24
 */
import { ref } from 'vue'

const useModal = () => {
  const modalRef = ref(null)
  const modalConfig = ref(null)
  const openModal = option => {
    console.log("🚀 ~ openModal ~ option:", option)
    modalConfig.value = option
    modalRef.value.open(option)
  }
  return {
    modalRef,
    modalConfig,
    openModal
  }
}

export default useModal
