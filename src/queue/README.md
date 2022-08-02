## feature:
- 任务队列 支持同步任务与异步任务
- 支持任务优先级，
- 支持abortController 外部取消任务
- 支持并发个数限制
- 支持中断 暂停，恢复，清空任务
- 支持空闲调度任务的低优先级任务



```javascript

import Queue from './queue'
let myQueue = new Queue();
const abort = myQueue.add(()=>{
    console.log('111');
},{priorit: 1});
abort();
```

```javascript

import Queue from './queue'

class combineAjax {
    constructor() {
        this._queue = new Queue();
        this._promises = {};
        this._keys = new Set();
        this._queue.onIdle(()=>{
            // 队列执行完毕后
            const keys = Array.from(this._keys);
            this._keys.clear();
            doRequest('xxxx',{keys}).then((data)=>{
                // 处理返回数据
                (keys || []).forEach(key => {
                    const callbacks = this._promise[key];
                    if (callbacks) {
                        callbacks.forEach(({resolve}) => {
                            resolve && resolve(data[key] || false);
                        });
                        delete this._promise[key];
                    }
                })
            })
        })
    }
    get(key){
        this.queue.add(()=>{this._keys.add(key)});
        return new Promise((resolve, reject)=>{
            this._promise[key] = (this._promise[key] || []).concat({
                resolve,
                reject
            });
        });
    }
}


```