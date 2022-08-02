import {formatTime, prefix} from "../utils";

export default {
    type:"session",
    check(){
        return window && window.sessionStorage;
    },
    get(key){
        try{
            const ret = JSON.parse(sessionStorage.getItem(prefix+key));
            if (ret) {
                const {v, t} = ret;
                const now = Date.now();
                if (!t || t > now) return v;
                this.delete(key);
            }
        }catch (e){
            console.error('数据没找到');
        }
        return;
    },
    set(key,value,opts={}){
        if(value){
            let data = {v: value};
            const {expires} = opts;
            if (expires) data.t = formatTime(expires).getTime();
            return sessionStorage.setItem(prefix+key, JSON.stringify(data))
        }else {
            return sessionStorage.removeItem(prefix+key);
        }
    },
    clear(key,opts){
        let i = 0;
        while (true){
            const lKey = sessionStorage.key(i++);
            if(!lKey) break;
            if(!lKey.startsWith(prefix)) continue;
            if(!key || lKey.indexOf(key)>-1) sessionStorage.removeItem(lKey);
        }
        return true;
    },
    delete(key,opts){
        this.set(key,null, opts);
    }
}
