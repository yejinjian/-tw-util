import {Pipeline} from "../index";
import {deepAssign, buildURL} from './utils';

const getMethods = ['delete', 'get', 'head', 'options'];
const postMethods = ['post', 'put', 'patch'];
const reqKey = Symbol('request');

export default class App extends Pipeline {
    constructor(config) {
        super();
        this.init(config);
        [...getMethods, ...postMethods].forEach((method) => {
            this[method] = (url, data, config) => {
                return this.request.apply(this, {
                    ...config,
                    url,
                    data,
                    method,
                })
            }
        })
    }

    /**
     * 初始化
     * @param opts
     */
    init(opts) {
        const {request = {}, adapter, middlewares} = opts || {};
        adapter && (this.adapter = adapter);
        this[reqKey] = deepAssign(this[reqKey] || {}, request);
        middlewares && this.clearValve().use(...middlewares);
    }

    /**
     *
     * @param req
     * @returns {*}
     */
    request(req) {
        if (typeof req === 'string') {
            req = arguments[1] || {};
            req.url = arguments[0];
        } else {
            req = req || {};
        }
        req = deepAssign(this[reqKey], req);

        //method 转小写
        req.method && (req.method = req.method.toLowerCase());
        //
        return this.invoke({app: this, req}, function (ctx) {
            const {app, req} = ctx;
            return app.adapter(req);
        });
    }

    /**
     *
     * @param config
     * @returns {*}
     */
    getUri(config = {}) {
        const {url, method, data} = deepAssign({}, this[reqKey], config);
        const params = getMethods.includes(method) ? {} : data;
        return buildURL(url, params);
    }

    /**
     * 设置请求header
     * @param key
     * @param value
     */
    setHeader(key, value) {
        let header = {};
        if (typeof key === 'string' && value !== undefined) {
            header[key] = value;
        }
        if (typeof key === 'object') {
            header = key;
        }
        const {headers = {}} = this[reqKey];
        this[reqKey].headers = {
            ...headers,
            ...header,
        };
    }

    /**
     * 设置默认请求参数
     * @param val
     */
    setData(val) {
        const {request} = this[reqKey];
        let {data = {}} = request;
        request.data = deepAssign(data, val || {});
    }


    use() {
        return super.addValve(...arguments)
    }
}
