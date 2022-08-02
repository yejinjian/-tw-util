let loginPromise = null;
/**
 * 登录触发
 * @param ctx
 * @param next
 * @returns {*}
 */
export default function (ctx, next) {
    return next(ctx).then((res)=>{
        const {req} = ctx;
        const {onLoginHandler} = req;
        if(onLoginHandler){
            const {code, msg} = res.data||{};
            if((code === '1' && msg && msg.indexOf('未登录') > -1)){
                if(!loginPromise) {
                    loginPromise = Promise.resolve(onLoginHandler(res)).finally(()=>{
                        loginPromise = null;
                    });
                }
                // todo 优化出错处理
                const err  = new Error(msg);
                err.code = code;
                throw err;
            }
        }
        return res;
    });
}
