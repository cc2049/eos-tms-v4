/*
 * @Author: cc2049
 * @Date: 2024-07-05 15:20:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-08 17:36:57
 * @Description: 简介 页面传参数
 * activePath 当前激活的菜单路径
 * pageBillNo 菜单页面表格 下的Billno数组
 */

const usePageParamsStore = defineStore(
  'pageParams',
  {
    state: () => ({
      activePath: '',
      pageBillNo: { },
    }),
    persist: {
      enabled: true, // 开启存储
    },
    actions: {
      setActivePath(data) {
        this.activePath = data
      },
      setPageBillNo(data) {
        this.pageBillNo[data.menuPath] = data.menuParams
      }
    }
  })

export default usePageParamsStore
