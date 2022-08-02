import {pick, omit} from '../extend/object';
import Pipeline from "../pipeline";

const LOG_KEYS = ['date', 'origin', 'extra', 'message', 'level', 'type', 'alias'];
const LogTypes = {
    error: 1,
    warn: 2,
    log: 3,
    info: 4,
    debug: 5,
    trace: 6,
}

/**
 * 日志格式示例：[origin|name][alias|type][date][message]
 */
export default class Log extends Pipeline {
    constructor(opts = {}) {
        super(opts.adapters || []);
        this.init(opts);
        Object.keys(LogTypes).reduce((a, type) => {
            let level = LogTypes[type];
            a[type] = (...args) => {
                return this.wrapLog(args, {type, level});
            }
            return a;
        }, this);
    }

    init(opts){
        const {level, adapters, ...others} = opts;
        this.level = level || 3; //日志等级，
        this._defaultOpts = Object.assign({}, others); //其他配置
    }

    /**
     *
     * @param opts
     * @param args
     * @returns {boolean}
     */
    wrapLog(args, opts) {
        const {type, ...others} = opts;
        opts = {
            ...this._defaultOpts,
            ...this._defaultOpts[type]||{},
            date: Date.now(),
            ...others,
            ...others[type]||{},
            type
        };
        const params = pick(opts, LOG_KEYS);
        const extra = omit(opts, LOG_KEYS);


        // 过滤level等级
        if (params.level > this.level) {
            return;
        }
        // extra 继承
        if(extra){
            params.extra = params.extra?Object.assign(params.extra, extra):extra;
        }

        return this.invoke({
            args,
            ...params
        });
    }

    /**
     * 添加实现
     */
    use() {
        this.addValve(...arguments);
        return this;
    }
}
