import {CONTENT_TYPE, isFormData, isSameOrigin,buildURL, stringify} from '../utils';

function Timeout(time){
    const controller = new AbortController();
    setTimeout(controller.abort,time);
    return controller;
}

export default function (options) {
    let {data, method, url, timeout, signal, dataType, headers, credentials} = options;
    let fetchOptions = {
        method,
        signal,
        headers,
        credentials
    };

    if (method === 'GET') {
        url = buildURL(url, data);
    } else {
        if (data) {
            if (isFormData(data)) {
                fetchOptions.body = data;
                delete fetchOptions.headers['content-type'];
            } else if (headers['content-type'].indexOf(CONTENT_TYPE.json) >= 0) {
                fetchOptions.body = JSON.stringify(data);
            } else {
                fetchOptions.body = stringify(data);
            }
        }
    }

    if (!isSameOrigin(url)) {
        fetchOptions.mode = 'cors';
    }

    if(timeout) fetchOptions.signal =  Timeout(timeout).signal;

    return fetch(url, fetchOptions).then(function (resp) {
        switch (dataType) {
            case 'json':
                return resp.json();
            case 'text':
            default:
                return resp.text();
        }
    });
}
