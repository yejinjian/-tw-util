import {union} from './extend/array';

const defGo = (ctx, next) => next(ctx);
/**
 * 类似koa-compose方法
 * @param tasks
 * @param dispatch
 * @param context
 * @returns {*}
 */
export const compose = (tasks, dispatch = defGo, context) =>{
    return tasks.reduce((stack,valve) => async (ctx,next)=> await valve(ctx, stack.bind(context,ctx,next)), dispatch);
}

/**
 * 管道模式
 */
export default class Pipeline {
    #valves = [] //中间件
    #basic = (e) => e
    #go = defGo

    constructor(valves = []) {
        this.addValve(...valves);
    }

    /**
     * 最终执行函数
     * @param basic
     */
    setBasic(basic) {
        if (typeof basic !== 'function') {
            throw new Error('basic must be a function');
        }
        this.#basic = basic;
        return this;
    }

    /**
     * 添加阀门
     * @param valves
     * @returns {boolean}
     */
    addValve(...valves) {
        //合并去重
        valves = valves.filter((valve) => typeof valve === 'function');
        this.#valves = union(this.#valves, valves);
        this.#go = compose(valves, this.#go);
        return this;
    }

    /**
     * 删除valves
     */
    clearValve(){
        this.#go = defGo;
        this.#valves = [];
        return this;
    }

    /**
     * 删除阀门
     * @param valves
     */
    removeValve(...valves){
        this.#valves = this.#valves.filter((valve)=> !valves.includes(valve));
        this.#go = compose(this.#valves, defGo);
        return this;
    }

    /**
     * 执行管道中的内容
     * @param params
     * @param basic
     * @returns {*}
     */
    invoke(params, basic) {
        if(basic  && typeof basic === 'function'){
            this.#basic = basic;
        }
        return this.#go(params, this.#basic);
    }
}
