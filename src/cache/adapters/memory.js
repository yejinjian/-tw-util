import {formatTime} from "../utils";
let _Data= {};
export default {
    type:"memory",
    check(){
        return true;
    },
    get(key){
        try{
            const ret = _Data[key];
            if (ret) {
                const {v, t} = ret;
                const now = Date.now();
                if (!t || t > now) return v;
                this.delete(key);
            }
        }catch (e){
            console.error('数据没找到');
        }
        return ;
    },
    set(key,value,opts={}){
        if(value){
            let data = {v: value};
            const {expires} = opts;
            if (expires) data.t = formatTime(expires).getTime();
            _Data[key] = data;
        }else {
            delete _Data[key];
        }
        return true;
    },
    clear(key,opts){
        if(!key) {
            _Data = {};
        }else {
            Object.keys(_Data).forEach((lKey)=>{
                if(lKey.indexOf(key)>-1) delete _Data[lKey];
            });
        }
        return true;
    },
    delete(key,opts){
        this.set(key,null, opts);
    },
}
