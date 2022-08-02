import {formatTime, prefix} from '../utils';

const splitCode = '; ';
const cookieKeys = ['expires', 'max-age', 'path', 'domain', 'secure'];
const defaultCookieOpts = {
    path: '/',
    domain: location && location.host
}

export default {
    type:"cookie",
    check(){
        return !!document && !!document.cookie;
    },
    set(key,value, opts){
        let {expires} = opts;
        if (expires) expires = formatTime(expires).toUTCString();

        opts = {
            ...defaultCookieOpts,
            ...opts,
            expires
        };
        const optString = Object.keys(opts).map((key) => {
            return (opts[key] && cookieKeys.includes(key)) ? `${key}=${opts[key]}` : '';
        }).filter(Boolean).join(splitCode);
        document.cookie = `${prefix+key}=${value}; ${optString}`;
        return true;
    },
    get(key){
        const cookies = document.cookie.match(new RegExp("(?:^|;\\s)" + prefix+key + "=(.*?)(?:;\\s|$)"));
        return cookies ? decodeURIComponent(cookies[1]) : '';
    },
    clear(key){
        const cookies = document.cookie.split(splitCode);
        document.cookie =  cookies.filter((cookie)=>{
            const [cKey] = cookie.split('=');
            if(!cKey.startsWith(prefix)) return true; //过滤其他cookie
            return key || cKey.indexOf(key) < 0; //todo 后期考虑支持正则 忽略大小写
        }).join(splitCode);
        return true;
    },
    delete(key, opts){
        return this.set(key, '', {
            ...opts,
            expires: -1
        });
    }
}
