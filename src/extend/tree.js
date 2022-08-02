const defaultOpts = {
    strict: false, //如果严格模式：当子节点不存在数据时，没有children属性，false: children:[]
    key: 'id',
    parentKey: 'parentId',
    childrenKey: 'children',
}

function doWalk (arr, prop, cb, opts, childFormat, parent, path = [], node = []) {
    const {childrenKey, key, ctx} = opts;
    if (!Array.prototype[prop]) return;
    let paths, nodes;
    return Array.prototype[prop].call(arr, (item, index) => {
        let ret;
        paths = path.concat([item[key]]);
        nodes = node.concat([item]);
        ret = cb.call(ctx, item, index, parent, paths, nodes);
        if (prop === 'find' && ret) return true; //find比较特殊
        let children = item[childrenKey];
        let newChild = null;
        if (children) newChild = doWalk(children, prop, cb, opts, childFormat, item, paths, nodes);
        if (childFormat) {
            ret = childFormat(ret, newChild, item);
        } else {
            ret && (ret[childrenKey] = newChild);
        }
        return ret;
    }, ctx)
}


/**
 * 树搜索
 * @param tree
 * @param cb
 * @param opts
 * @returns {null}
 */
export function treeFind(tree, cb, opts) {
    opts = Object.assign({}, defaultOpts, opts);
    let find = null;
    doWalk(tree, 'find', (item, index, parent, paths, nodes) => {
        let ret = cb(item, index, parent, paths, nodes);
        if (ret) {
            find = item;
        }
        return ret;
    }, opts, (item, children) => {
        return !!children
    });
    return find;
}

/**
 * 树遍历修改值 等同map
 * @param tree
 * @param cb
 * @param opts
 * @returns {*}
 */
export function treeMap(tree, cb, opts){
    opts = Object.assign({}, defaultOpts, opts);
    const {childrenKey} = opts;
    return doWalk(tree, 'map', cb, opts, (item, children) => {
        if (item && children) {
            item[childrenKey] = children
        }
        return item;
    });
}

/**
 * 树遍历 等同forEach
 * @param tree
 * @param cb
 * @param opts
 */
export function treeEach(tree, cb,opts){
    opts = Object.assign({}, defaultOpts, opts);
    doWalk(tree, 'forEach', (item, index, parent, path, node) => {
        cb(item, index, parent, path, node);
    }, opts);
}

/**
 * 过滤出数据，todo 是否排平
 * @param tree
 * @param cb
 * @param opts
 * @returns {*[]}
 */
export function treeFilter(tree,cb, opts){
    const result = [];
    treeEach(tree,(item, index, parent, path, node) => {
        if (cb(item, index, parent, path, node)) {
            result.push(item);
        }
    }, opts);
    return result;
}


/**
 * 树添加节点
 * @param tree
 * @param pid
 * @param item
 * @param opts
 */
export function treeAdd(tree, pid, item, opts) {
    opts = Object.assign({}, defaultOpts, opts);
    const {key} = opts;
    const parentItem = treeFind(tree, (item) => {
        return item[key] === pid;
    });
    if (parentItem) {
        const {childrenKey} = opts;
        parentItem[childrenKey] ? parentItem[childrenKey].push(item) : (parentItem[childrenKey] = [item]);
    }
}

/**
 * 设置子节点
 * @param tree
 * @param pid
 * @param children
 * @param opts
 */
export function treeSet(tree, pid, data, opts){
    opts = Object.assign({}, defaultOpts, opts);
    const {key} = opts;
    let parentItem = treeFind(tree, (item) => {
        return item[key] === pid;
    });
    if (parentItem) {
        parentItem = Object.assign(parentItem, data);
    }
}

/**
 * array 转换为 tree
 * @param arr
 * @param opts
 */
export function arrToTree(arr, opts={}){
    opts = Object.assign({}, defaultOpts, opts);
    const {parentKey, key, strict, childrenKey} = opts;
    let map = {};
    let ret = [];
    if(!arr) return arr;
    doWalk(arr,'forEach',(item, index, parent, path, node)=> {
        const id = item [key];
        map[id] = item;
        if(strict){
            delete  item[childrenKey];
        }else {
            item[childrenKey] = item[childrenKey]|| [];
        }
    },opts);
    doWalk(arr,'forEach',(item, index, parent, path, node)=>{
        const ppId = parent && parent[key];
        const cpId = item[parentKey];
        if(cpId !== ppId){
            if(!cpId){
                ret.push(item);
            }else if(cpId !== ppId){
                const parentItem = map[cpId];
                if(parentItem){
                    if(parentItem[childrenKey]){
                        parentItem[childrenKey].push(item);
                    }else {
                        parentItem[childrenKey] = [item];
                    }
                }else {
                    ret.push(item);
                }
            }
        }
    },opts);
    return ret;
}

/**
 * 树排序
 * @param tree
 * @param cb
 * @param opts
 * @returns {*}
 */
export function treeSort(tree, cb, opts) {
    opts = Object.assign({}, defaultOpts, opts);
    return doWalk(tree, 'sort', cb, opts, (itemA, itemB) => {
        return cb(itemA, itemB);
    });
}