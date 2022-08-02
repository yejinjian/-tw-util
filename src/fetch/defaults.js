import Ajax from './adapters/ajax'
import unique from "./middleware/unique";

export default {
    request:{
        baseUrl: '/',
        method: 'get',
        headers: {
            'Accept': 'application/json, text/plain, */*',
        },
        timeout: 0, // 超时时间
    },
    adapter: Ajax, // 适配器
    middlewares: [unique], // 中间件
}
