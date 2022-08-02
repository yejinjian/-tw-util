/**
 * Parse query string.
 * @param string
 * @param [shouldDecode=true]
 */
export function parse(string, shouldDecode = true) {
    const query = {};
    if (!string) {
        return query;
    }
    string = string.trim().replace(/^[\?|#]/, '');
    let _t = string.split("&");
    let params = {};
    _t.forEach(function (vi) {
        let [key, val] = vi.split("=");
        if (!key || !val) {
            return;
        }
        params[key] = shouldDecode ? decodeURIComponent(val) : val;
    })
    return params;
}

/**
 * Stringify a query object.
 * @param query
 * @param [shouldEncode=true]
 */
export function stringify(query, shouldEncode = true) {
    if (!query) {
        return '';
    }
    return Object.keys(query).map(function (key) {
        const val = query[key] || '';
        return `${key}=${shouldEncode ? encodeURIComponent(val) : val}`;
    }).filter(Boolean).join("&");
}

export function buildURL(url, params) {
    if (params) {
        const [path, qs] = url.split('?');
        if (qs) {
            params = Object.assign(parse(qs), params);
        }
        const string = stringify(params);

        if (string) {
            url = path + "?" + string;
        }
    }
    return url;
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
