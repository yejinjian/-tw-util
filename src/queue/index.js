import EventEmitter from '../emitter';
import {SYNC, HIGH, NORMAL, LOW} from './priorities';
import Task from './task';

export const priority = {
    SYNC, HIGH, NORMAL, LOW
}

export default class Queue extends EventEmitter {
    #queue = []
    #pendingCount = 0 //执行数量
    #options = {}
    #isPaused = false

    constructor(opts={}) {
        super();
        const options = {
            // timeout: null,
            autoStart: true,
            concurrency: Number.POSITIVE_INFINITY, //并发数
            priority: NORMAL, //默认优先级
            ...opts
        }
        this.#isPaused = options.autoStart === false; //如果自动启动则
        this.#options = options
    }

    get concurrency() {
        return this.#options.concurrency;
    }

    get size() {
        return this.#queue.length;
    }

    onIdle(cb){
        if(this.#pendingCount === 0 && this.size === 0){
            cb();
        }
        this.on('idle', cb);
    }

    add(fn, opts = {}) {
        opts = Object.assign({}, this.#options, opts);
        const task = new Task(fn, opts);
        this.#enqueue(task);
        this.#process();
        this.emit('add');
        return task;
    }

    addAll(tasks, opts) {
        return Promise.all(tasks.map(async (task) => this.add(task, opts)));
    }

    start() {
        this.#isPaused = false;
        this.#process();
        return this;
    }

    pause() {
        this.#isPaused = true;
        return this;
    }

    clear() {
        this.#isPaused = [];
    }

    #process() {
        if (this.#isPaused) return;
        if(this.size === 0 ){
            //任务完成, 因为队列不会终止所以 这里用idle 代替empty
            this.#pendingCount === 0 && this.emit('idle');
        }
        while (this.size > 0 && this.#pendingCount < this.concurrency) {
            const task = this.#dequeue();
            if (!task) return false;
            this.#pendingCount++;
            task.run().finally(() => {
                this.#next();
            })
        }
    }

    #next() {
        this.#pendingCount--;
        this.emit('next');
        this.#process();
    }

    #enqueue(task) {
        const {priority} = task;
        let index = 0;
        for (; index < this.#queue.length; index++) {
            const curPriority = this.#queue[index].priority;
            if (curPriority > priority) {
                break;
            }
        }
        this.#queue.splice(index, 0, task);
    }

    #dequeue() {
        return this.#queue.shift();
    }
}