/*
 * @Author: cc2049
 * @Date: 2024-04-19 09:01:33
 * @LastEditors: 
 * @LastEditTime: 2024-05-17 14:19:05
 * @Description: 简介
 */
import useDictStore from '@/store/modules/dict'
import { getDicts } from '@/api/system/dict'

/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res = ref({});
  return (() => {
    args.forEach((dictType, index) => {
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts;
      } else {
        getDicts(dictType).then(resp => {
          res.value[dictType] = resp.data.map(p => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass, elTagClass: p.cssClass }))
          useDictStore().setDict(dictType, res.value[dictType]);
        })
      }
    })
    return toRefs(res.value);
  })()
}