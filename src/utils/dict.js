/*
 * @Author: cc2049
 * @Date: 2024-04-19 09:01:33
 * @LastEditors: PiPin 33947354+p1Master@users.noreply.github.com
 * @LastEditTime: 2024-05-18 15:59:05
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
          res.value[dictType] = resp.RESULT
          useDictStore().setDict(dictType, res.value[dictType]);
        })
      }
    })
    return toRefs(res.value);
  })()
}