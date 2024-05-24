/**
 * 子表相关hooks
 * @author WangJun 2024-05-24
 */
import { getCurrentInstance } from "vue"

const useTable = () => {
  const { proxy } = getCurrentInstance()
  /** table 转换配置 */
  const GET_TableConfig = config => {
    if (!config) return {}
    let { OTHER } = config
    let subTableConfig
    if (proxy.tableConfig.value.length == 1) {
      subTableConfig = proxy.tableConfig.value[0]
    } else {
      subTableConfig = proxy.tableConfig.value.find(el => el.BILLNO == OTHER)
    }
    return subTableConfig
  }

  /** 更新数据 */
  const UPDATA_TableData = (data) => {
    proxy.$emit("updateTableData", data);
  }

  return {
    GET_TableConfig,
    UPDATA_TableData
  }
}

export default useTable