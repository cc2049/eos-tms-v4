/*
 * @Author: cc2049
 * @Date: 2024-05-15 16:05:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-15 16:20:56
 * @Description: 简介
 */


const useVxModal = () => {
    const modalVisible = ref(false)
    const modalTitle = ref('');
   
    const tiggerModal = () => {
        modalVisible.value = !modalVisible.value

        console.log('tiggerModal', modalVisible.value);

    }

    return {
        modalVisible,
        modalTitle,
        tiggerModal
    }
}

export default useVxModal