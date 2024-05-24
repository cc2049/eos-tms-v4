/**
 * 弹窗相关hooks
 * @author WangJun 2024-05-24
 */
import { ref } from 'vue'

const useModal = () => {
  const modalRef = ref(null)
  const modalConfig = ref(null)
  const openModal = option => {
    modalConfig.value = option
    modalRef.value.open(option)
  }
  const closeModal = () => {
    modalRef.value.close()
  }
  return {
    modalRef,
    modalConfig,
    openModal,
    closeModal
  }
}

export default useModal
