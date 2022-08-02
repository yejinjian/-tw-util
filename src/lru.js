export default class LruMap extends Map{

    #max;
    #sizeCalculation;

    constructor(opts={}) {
        super();
        this.#max = opts.max || 0;
        this.#sizeCalculation = opts.sizeCalculation;
    }

    get max(){
        return this.#max
    }

    get(key){
        var val = super.get(key);
        if(val === undefined) return ;
        super.delete(key);
        super.set(key, val);
        return val;
    }

    set(key,val){
        // 有出现重复的情况就把之前的删除 再增加一个
        super.delete(key);
        super.set(key, val);
        // 当长度超出，删除最早的节点
        if(this.#max > 0 && this.size > this.#max){
           const [key, val]= this.shift();
           this.#sizeCalculation && this.#sizeCalculation(key, val);
        }
        return this;
    }

    shift(){
        const firstKey = super.keys().next().value;
        const val = super.get(firstKey);
        super.delete(firstKey);
        return [firstKey, val];
    }
}
