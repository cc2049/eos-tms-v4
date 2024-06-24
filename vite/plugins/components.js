/*
 * @Author: cc2049
 * @Date: 2024-06-24 15:58:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-24 15:59:26
 * @Description: 简介
 */
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import IconsResolver from 'unplugin-icons/resolver'

export default function createComponents() {
  return Components({
    resolvers: [
      ElementPlusResolver(),
      // IconsResolver({
      //   enabledCollections: ['ep'],
      // }),
    ],
    dts: false
  })
}