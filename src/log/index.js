import Log from './log';
import elog from './valves/elog';
import console from './valves/console';

export default new Log({
    adapters:[
        console,
        elog
    ]
})
