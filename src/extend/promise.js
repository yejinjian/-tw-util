/**
 * promise finally polyfill
 */
if (!Promise.prototype.finally) {
    Promise.prototype.finally = function (callback) {
        if (typeof callback !== 'function') {
            return this.then(callback, callback);
        }
        const P = this.constructor || Promise;
        return this.then(
            value => P.resolve(callback()).then(() => value),
            err => P.resolve(callback()).then(() => {
                throw err;
            })
        );
    };
}

/**
 *  async/await 的输出优化，方便判断处理
 * @param promise
 * @returns {Promise<[null,unknown] | [any,null]>}
 */
export function awaitWrap(promise) {
    return Promise.resolve(promise).then(data => [null, data], error => [error, null]);
}

/**
 * 串行执行
 * @param tasks
 * @param fn
 * @returns {*}
 */
export function serial(tasks, fn) {
    return tasks.reduce((promise, task) => promise.then(preResult => fn(task, preResult)), Promise.resolve(null));
}

/**
 * 并行执行
 * @param tasks
 * @param fn
 * @returns {Promise<unknown[]>}
 */
export function parallel(tasks, fn) {
    return Promise.all(tasks.map(task => Promise.resolve(fn(task))));
}
