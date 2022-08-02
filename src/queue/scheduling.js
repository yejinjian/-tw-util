const idleRequest =
    requestIdleCallback ||
    function(cb) {
        let start = Date.now();
        return setTimeout(function() {
            cb({
                didTimeout: false,
                timeRemaining: function() {
                    return Math.max(0, 50 - (Date.now() - start));
                },
            });
        }, 1);
    };

const idleCancel =
    cancelIdleCallback ||
    function(id) {
        clearTimeout(id);
    };


/**
 * 同步执行
 * @param task
 * @returns {Promise<unknown>}
 */
export function syncTask(task){
    return Promise.resolve(task());
}

/**
 * 下次微任务时触发
 * @param task
 * @returns {Promise<unknown>}
 */
export function nextTick(task){
    return Promise.resolve().then(task);
}

/**
 * 下次宏任务时触发
 * @param task
 * @returns {Promise<unknown>}
 */
export function nextTask(task){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            syncTask(task).then(resolve, reject);
        })
    })
}

/**
 * 浏览器空闲时
 * @param task
 * @returns {Promise<unknown>}
 */
export function nextIdle(task){
    return new Promise((resolve, reject)=>{
        idleRequest(()=>{
            syncTask(task).then(resolve, reject);
        })
    });
}