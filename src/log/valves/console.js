const typeColorMap ={
    error:'#c0392b' ,
    warn: '#f39c12',
    log: '#00BCD4',
    info: '#19bb64',
    trace: '#4a31b4',
    debug: '#000000',
}

/**
 * 输出格式；[origin][alias|type][message][date]
 * @param ctx
 * @param next
 * @returns {Promise<*>}
 */
export default async(ctx, next)=>{
    const {args, date, origin, extra, type, alias} = ctx;

    const color = typeColorMap[type] || '#7f8c8d';
    const style = `
      background: ${color};
      border-radius: 0.5em;
      color: white;
      font-weight: bold;
      padding: 2px 0.5em;
    `
    const showType = [origin, (alias||type||'').toUpperCase()].filter(Boolean).join(':');
    if(console[type]){
        console[type](`%c${showType}`,style,`[${date}]`, ...args);
    }

    return await next(ctx);
}
