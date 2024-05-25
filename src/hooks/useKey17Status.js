/*
 * @Author: cc2049
 * @Date: 2024-05-15 16:05:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-25 10:58:20
 * @Description: 监听键盘按键
 */


const useKey17Status = () => {
    const key17Status = ref(false);
    onMounted(() => {
        watchKeyEvent();
    });
    const watchKeyEvent = () => {
        const setKeyStatus = (keyCode, status) => {
            switch (keyCode) {
                case 17:
                    if (key17Status.value === status) return;
                    key17Status.value = status;
                    // console.log("ctrl", status ? "按下" : "抬起", key17Status.value);
                    break;
            }
        };
        document.onkeydown = (e) => {
            setKeyStatus(e.keyCode, true);
        };
        document.onkeyup = (e) => {
            setKeyStatus(e.keyCode, false);
        };
    };
    return {
        key17Status
    }
}

export default useKey17Status