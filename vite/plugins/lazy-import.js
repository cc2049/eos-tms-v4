/*
 * @Author: cc2049
 * @Date: 2024-06-27 14:49:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-27 14:50:09
 * @Description: 简介
 */

import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import'

export default function createLazyImport() {
    return lazyImport({
        resolvers: [
            VxeResolver({
                libraryName: 'vxe-table'
            }),
            VxeResolver({
                libraryName: 'vxe-pc-ui'
            })
        ]
    })
}
