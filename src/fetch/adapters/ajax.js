import {CONTENT_TYPE, isFormData, buildURL, createError, stringify} from '../utils';

export default function (options) {
    return new Promise((resolve, reject) => {
        let {
            url,
            data,
            timeout,
            signal,
            onDownloadProgress,
            onUploadProgress,
            method,
            headers,
            dataType,
            credentials
        } = options||{};

        let xhr = new XMLHttpRequest();
        if (method === 'get') {
            url = buildURL(url, data);
        }

        xhr.open(method, url);
        if (credentials !== undefined) {
            xhr.withCredentials = !!credentials
        }

        function onloadend() {
            if (!xhr) return;
            try {
                let ret;
                if (dataType === 'json') {
                    ret = xhr.responseText === '' ? null : JSON.parse(xhr.responseText);
                } else {
                    ret = xhr.responseText;
                }
                resolve(ret);
            } catch (err) {
                reject(createError(err));//todo 待完善
            }
        }

        if ('onloadend' in xhr) {
            xhr.onloadend = onloadend;
        } else {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    xhr.onreadystatechange = () => {

                    };
                    onloadend();
                }
            }
        }

        xhr.onerror = function (err) {
            reject(createError(err, 0));
            xhr = null;
        };

        xhr.ontimeout = function (e) {
            e.message = 'timeout of ' + timeout + 'ms exceeded';
            // todo
            reject(createError(e, 0));
            xhr = null;
        };

        if (typeof onDownloadProgress === 'function') {
            xhr.addEventListener('progress', onDownloadProgress);
        }

        if (typeof onUploadProgress === 'function' && xhr.upload) {
            xhr.upload.addEventListener('progress', onUploadProgress);
        }
        //设置超时
        timeout && (xhr.timeout = timeout);
        //支持AbortController
        if (signal && signal instanceof EventTarget) {
            signal.addEventListener('abort', () => {
                if (!xhr) return;
                xhr.abort();
                xhr = null;
            });
        }

        xhr.onabort = function handleAbort() {
            if (!xhr) return;
            reject(createError('aborted!', 0, true));
            xhr = null;
        };

        try {
            if (isFormData(data)) {
                delete headers['content-type'];
            }

            Object.keys(headers).forEach(function (name) {
                xhr.setRequestHeader(name, headers[name]);
            });

            if (data) {
                if (isFormData(data)) {
                    xhr.send(data);
                } else if (headers['content-type'].indexOf(CONTENT_TYPE.json) >= 0) {
                    xhr.send(JSON.stringify(data));
                } else {
                    xhr.send(stringify(data));
                }
            } else {
                xhr.send(null);
            }
        } catch (err) {
            reject(createError(err, 0));
        }
    });
}
