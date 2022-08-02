export {buildURL, stringify, deepAssign} from '../index';

export const CONTENT_TYPE = {
    'text': 'text/plain',
    'form': 'application/x-www-form-urlencoded',
    'json': 'application/json'
};

export function isFormData(val) {
    return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

export function isSameOrigin(url) {
    try {
        const a = document.createElement('a');
        a.href = url;
        return a.protocol === location.protocol && a.hostname === location.hostname && a.port === location.port;
    } catch (err) {
        return true;
    }
}

export function createError(msg, code, aborted){
    const error = msg && msg instanceof Error?msg: new Error(msg);
    error.msg = error.message;
    code !== undefined && (error.code = code);
    error.abortd = aborted;
    return error;
}
