/**
 * 判断是否是object
 * @param obj
 * @returns {boolean}
 */
export function isObject(obj) {
    return (obj && typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Object]');
}

/**
 * 对象根据keys筛选
 * @param obj
 * @param keys
 * @returns {*}
 */
export function pick(obj, keys) {
    return keys.reduce((a, b) => {
        if(obj[b]) a[b] = obj[b];
        return a
    }, {});
}

/**
 * 对象根据keys剔除
 * @param obj
 * @param keys
 * @returns {*}
 */
export function omit(obj, keys) {
    if (!keys || !keys.length) return obj;
    if (typeof keys === "string") keys = [keys];
    return keys.reduce((a,b) =>{
        const {[b]:omitted, ...rest} = a;
        return rest;
    },obj);
}

/**
 * 深度继承 不考虑Array拼接
 * @param target
 * @param sources
 * @returns {*}
 */
export function deepAssign(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
    if (isObject(source) && isObject(target)) {
        Object.entries(source).forEach(([key, val], index) => {
            if (target[key] &&  isObject(val)) {
                deepAssign(target[key], val);
            } else if(isObject(val)) {
                target[key] = deepAssign({}, val);
            } else if(Array.isArray(val)){
                target[key] = val.slice(); //用新的覆盖老的，先不考虑合并
            }else {
                target[key] = val;
            }
        });
    }
    return deepAssign(target, ...sources);
}

/**
 * 深度拷贝
 * @param obj
 * @returns {*}
 */
export function clone(obj) {
    if(Array.isArray(obj)){
        let cloned = [];
        obj.forEach((val,index)=>{
            cloned[index] = clone(val);
        })
        return cloned;
    }else if(obj instanceof Date){
        return new Date(obj.valueOf());
    }else if(isObject(obj)){
        let cloned = {};
        Object.entries(obj).forEach(([key,val])=>{
            cloned[key] = clone(val);
        })
        return cloned;
    }
    return obj
}
