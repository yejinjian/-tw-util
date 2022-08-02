import {isFormData} from "../utils";

/**
 * 请求参数支持formData
 * @param ctx
 * @param next
 * @returns {*}
 */
export default function (ctx, next) {
    const {req} = ctx;
    const {jsonData, method, data, headers} = req;
    if(!jsonData && method === 'post' && !isFormData(data)){
        let form = new FormData();
        Object.keys(data).forEach((key)=>{
            form.append(key,data[key]);
        });
        req.data = form;
        headers["Content-Type"] =  "multipart/form-data";
    }
    return next(ctx);
}
