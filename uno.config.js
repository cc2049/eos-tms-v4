/*
 * @Author: cc2049
 * @Date: 2024-05-14 13:07:08
 * @LastEditors: 
 * @LastEditTime: 2024-05-14 14:06:11
 * @Description: 简介
 */
import { defineConfig, presetAttributify, presetUno } from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetRemToPx({
      baseFontSize: 4,
    }),
  ],
})
