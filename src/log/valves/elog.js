import UAParser from 'ua-parser-js';
import request from '@/fetch';
import cache from "../../cache";
const LogIdKey = '_logId_';

function getUUid(){
    return crypto && crypto.randomUUID ? crypto.randomUUID(): (
        [1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,
        c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

let logId = cache.get(LogIdKey) || 0;


function getUrl(url = location.href) {
    url = new URL(url);
    return `${url.pathname}${url.search}${url.hash}`
}


let _base = null;
function getBaseData(){
    if(_base) return _base;

    const parser = new UAParser();
    let did = cache.get('deviceId');
    if (!did) {
        did = getUUid();
        cache.set('deviceId', did);
    }
    return _base = {
        did,
        browser:parser.getBrowser(),
        os: parser.getOS()
    }
}

/**
 *
 * @param ctx
 * @param next
 * @returns {Promise<*>}
 */
export default (ctx,next)=>{
    const {args, level, date, origin, extra={}, type, alias} = ctx;
    const isDev = extra?.env === 'development';
    if(isDev) return next(); //开发环境不上报

    const logUrl  =  'https://api.hzbit.cn:4443/ymd/mq-service/mqtt2';
    logId++ && cache.set(LogIdKey, logId); //日志
    const base = getBaseData();

    const data = args.map((item) => {
        if (item instanceof Error) {
            return item.stack;
        } else if (item instanceof Function) {
            return item.toString();
        } else if (item instanceof Object) {
            return JSON.stringify(item)
        } else {
            return item;
        }
    });

    const logData = {
        id: logId, //前端算法生成的日志id
        module: origin||'', //模块
        type: level,
        channel:extra.channel||'4',
        userId: extra.uid||'',
        operTime: date,
        clientIp: '',
        msg: JSON.stringify({
            id:logId,
            type: alias||type,
            ...base,
            ...extra,
            url: getUrl(),
            refer: document.referrer && getUrl(document.referrer),//前一个页面链接地址 todo 这种类型无法保存hash
            data,
        })
    }

    return request.post(logUrl, {
        topic: '/logs',
        qos: 1,
        msg: JSON.stringify(logData)
    }).then(()=> {
        return next(ctx)
    });
}
