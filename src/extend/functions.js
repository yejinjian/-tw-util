/**
 *
 * @param cb
 * @param wait //时间间隔
 * @param immediate  前置执行
 * @param ctx  this指向
 * @returns {(function(): void)|*}
 */
export function debounce(cb, wait, immediate,  ctx) {
    let timer, last, args;
    function trigger() {
        let time = Date.now() - last;
        if (time > 0 && time < wait) {
            timer = setTimeout(() => trigger.apply(this), wait - time);
        } else {
            if(!immediate) cb.apply(this, args);
            timer = last = args = null;
        }
    }
    return function () {
        last = Date.now();
        args = arguments; //多次传入的args 不一样 取最近调用的那次
        if(timer) return;
        timer = setTimeout(()=> trigger.apply(ctx || this), wait);
        if(immediate) cb.apply(this, args);
    }
}

/**
 * 节流 节流周期一定要准确
 * @param cb
 * @param wait
 * @param ctx
 * @returns {(function(...[*]=): void)|*}
 */

export function throttle(cb, wait, ctx) {
    let timer, args, last=0;

    function trigger(){
        last = Date.now();
        cb.apply(this, args);
        timer =  args = null;
    }

    return function () {
        if (timer) return;
        args = arguments; // 触发时的参数与调用的保持一致

        const delta = Date.now()- last;
        if(delta > wait)  trigger.apply(ctx || this);
        else timer = setTimeout(trigger.bind(ctx || this), wait- delta);
    }
}
