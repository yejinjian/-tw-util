import md5 from "md5";
let reqChain = {};
let tokenKey = '_reqToken_';

/**
 * 生成去重
 * @param data
 * @param except
 * @returns {*}
 */
function getUid(data, except = []) {
    return md5(Object.keys(data).sort().map((key) => {
        if (except.indexOf(key) > -1) return
        if (typeof data[key] !== 'string') {
            data[key] = JSON.stringify(data[key])
        }
        return `${key}=${data[key]}`;
    }).join('&'));
}

/**
 * 合并请求
 * @param ctx
 * @param next
 * @returns {*}
 */
export default function (ctx, next) {
    const {req} = ctx;
    const {unique, url, method, data, headers, exceptKeys=[],} = req;
    if (unique === false) {return next(ctx);}
    const signKey = headers[tokenKey] || getUid({url, method, data, headers}, exceptKeys);
    if (reqChain[signKey]) return reqChain[signKey];
    headers[tokenKey] = signKey; //保存到header里方便定位
    return reqChain[signKey] = next(ctx).finally(() => {
        delete reqChain[signKey];
    })
}
