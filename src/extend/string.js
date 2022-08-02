//源于@vue/shared
/**
 * 首字母大写
 * @param str
 * @returns {string}
 */
export function upperFirst(str){
    return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 转驼峰
 * @param str
 */
export function camelCase(str){
    return str.toLowerCase()
        .replace(/^[-_/\s.]+/g,'')
        .replace(/[-_/\s.]+(.)?/g,(_,c)=>c?c.toUpperCase():'');
}

/**
 * 转驼峰 首字母大写
 * @param str
 * @returns {*}
 */
export function pascalCase (str){
    return upperFirst(camelCase(str));
}


/**
 * 转下划线
 */
export function snakeCase(str){
    return kebabCase(str).replace(/-/g,'_');
}

/**
 * 转横杠
 * @param str
 * @returns {string}
 */
export function kebabCase(str){
    return str.replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_/.]+/g, '-')
        .toLowerCase();
}

/**
 * 字符串长度补足
 * @param str //原始字符串
 * @param len //补足至长度
 * @param chars  //用于补足的字符
 * @param isEnd 结尾补足，false: 前置补足
 */
export function pad(str, len, chars, isEnd){
    chars = chars?`${chars}`:' ';
    if(len > str.length){
        len -= str.length;
        const pad = chars.repeat(len/chars.length).slice(0,len);
        return isEnd?`${str}${pad}`:`${pad}${str}`;
    }else {
        return str.substring(0,len);
    }
}
