/*
 * @Author: cc2049
 * @Date: 2024-07-01 11:25:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-01 12:52:49
 * @Description: 简介
 */

import axios from 'axios'
import { ElMessageBox } from 'element-plus'


let versionTag = null; // 版本标识
let timer = undefined;


function updateNotice() {
    ElMessageBox.confirm('检测到新版本，建议立即更新以确保平台正常使用。', '更新提示', {
        confirmButtonText: '确认更新',
        cancelButtonText: '稍后更新',
        showCancelButton: true,
        closeOnClickModal: false,
        showClose: false,
        type: 'warning'
    }
    ).then(() => {
        window.location.reload();
    }).catch(() => {

    });
}



/**
 * 获取首页的 ETag 或 Last-Modified 值，作为当前版本标识
 * @returns {Promise<string|null>} 返回 ETag 或 Last-Modified 值
 */
const getVersionTag = async () => {
    const response = await axios('/', {
        cache: 'no-cache',
    });
    return response.headers.etag
};


/**
 * 比较当前的 ETag 或 Last-Modified 值与最新获取的值
 */
const compareTag = async () => {
    const newVersionTag = await getVersionTag();
    if (versionTag === null) {
        // 初次运行时，存储当前的 ETag 或 Last-Modified 值
        versionTag = newVersionTag;
    } else if (versionTag !== newVersionTag) {
        // 清除定时器
        clearInterval(timer);
        // 提示用户更新
        updateNotice();
    } else {
        // 没有更新
        // console.info('没更新', {
        //     oldVersionTag: versionTag,
        //     newVersionTag: newVersionTag,
        // });
    }
};


export function updateVersion() {
    timer = setInterval(compareTag, 60000);
}

// 每60秒检查一次是否有新的 ETag 或 Last-Modified 值
