const adapterKeys = ['local','session','memory','cookie'];

export default class Cache {
    #adapter = null;
    #adapters = {};

    constructor(opts) {
        this.init(opts);
    }

    init(opts) {
        const {adapters, ...others} = opts || {};
        this.defaultOpts = others; // 其他配置
        this.#adapters = adapters; // 适配器
        this.check(adapters);
    }

    /**
     * 检查适配
     */
    check(adapters) {
        const currentKey = adapterKeys.find((key) => {
            const adapter = adapters[key];
            return !!adapter && adapter.check();
        });
        if (!currentKey) throw new Error('适配器不合法!'); //todo 完善报错处理
        this.#adapter = adapters[currentKey]; // 默认适配器
    }

    /**
     * 转发适配器
     * @param method
     * @param opts
     * @param args
     * @returns {*}
     */
    #do(method, opts={}, ...args) {
        let adapter = this.#adapter;
        const {type} = opts;
        if (type && this.#adapters[type] && this.#adapters[type].check()) {
            adapter = this.#adapters[type];
        }
        opts = Object.assign({}, this.defaultOpts, opts);
        if (!adapter || !adapter[method]) throw new Error('适配器不合法'); //todo 完善报错处理
        return adapter[method].apply(adapter, [...args, opts]);
    }

    /**
     * 设置缓存
     * @param key
     * @param value
     * @param opts
     * @returns {*}
     */
    set(key, value, opts) {
        return this.#do('set', opts, key, value);
    }

    /**
     * 获取 缓存
     * @param key
     * @param opts
     * @returns {*}
     */
    get(key, opts) {
        return this.#do('get', opts, key);
    }

    /**
     * 清楚所有缓存
     * @param key
     * @param opts
     * @returns {*}
     */
    clear(key, opts) {
        return this.#do('clear', opts, key);
    }

    /**
     * 删除
     * @param key
     * @param opts
     * @returns {*}
     */
    delete(key, opts) {
        return this.#do('delete', opts, key);
    }
}
