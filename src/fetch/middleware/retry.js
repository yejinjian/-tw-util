/**
 * 请求重试
 * @param ctx
 * @param next
 * @returns {*}
 */
export default function (ctx, next){
    return next(ctx).catch((err)=>{
        const {req, app} = ctx;
        if(req.times && !err.aborted) { //取消请求不会自动重试
            req.times--;
            return app.request(req);
        }
        return err;
    })
}
