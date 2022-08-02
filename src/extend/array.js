/**
 * 数据去重
 * @param arr
 * @returns {any[]}
 */
export function uniq(arr) {
    return [...new Set(arr)];
}

/**
 * 数组合并去重
 * @param arr
 * @returns {*[]}
 */
export function union(...arr){
    return uniq(arr.reduce((a,b)=> a.concat(b),[]))
}
