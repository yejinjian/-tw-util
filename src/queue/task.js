import {SYNC, HIGH, NORMAL, LOW} from './priorities';
import {nextIdle, nextTask, nextTick, syncTask} from "./scheduling";


export default class Task {
    #controller
    #priority
    #signal
    #fn

    constructor(fn, opts) {
        const {priority, abortController = new AbortController()} = opts || {};
        this.#controller = abortController;
        this.#priority = priority;
        this.#signal = abortController.signal;
        this.#fn = fn;
    }

    get priority() {
        return this.#priority;
    }

    run() {
        return new Promise((resolve, reject) => {
            //已经取消
            if (this.#signal.aborted) {
                return reject('abort');
            }
            //todo 超时
            //任务执行
            if (this.priority === SYNC) {
                return syncTask(this.#fn).then(resolve, reject);
            } else if (this.priority === HIGH) {
                return nextTick(this.#fn).then(resolve, reject);
            } else if (this.priority === NORMAL) {
                return nextTask(this.#fn).then(resolve, reject);
            } else {
                return nextIdle(this.#fn).then(resolve, reject);
            }
        })
    }

    abort() {
        this.#controller.abort();
    }

    onError(cb) {

    }
}