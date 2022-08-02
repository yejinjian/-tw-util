import {buildURL} from '../utils';

function insertScript(script) {
    const head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(script);
}

function removeScript(script) {
    if (script.parentNode) {
        script.parentNode.removeChild(script);
    }
}

let id = 0;
function getNextID(index) {
    return `${index}_${id++}`;
}

export default function (options) {
    return new Promise((resolve, reject) => {
        let {cache, data, signal, url, jsonpCallback, timeout} = options;
        const cbName = jsonpCallback || getNextID('httpCb');
        let script;

        function cleanup() {
            removeScript(script);
            script = null;
            try {
                delete window[cbName];
            } catch (err) {
                window[cbName] = undefined;
            }
        }

        if (timeout > 0) {
            setTimeout(() => {
                if (!script) return;
                reject(new Error('timeout'));
                cleanup();
            }, timeout);
        }

        window[cbName] = (data) => {
            resolve(data);
            cleanup();
        }

        const jsonpParams = {callback: cbName};
        !cache && (jsonpParams._ = Date.now());

        url = buildURL(url, Object.assign({}, data, jsonpParams));

        function eventHandler(event) {
            if ((event && event.type === 'error')) {
                cleanup();
                reject(new Error());
            }
        }

        //支持AbortController
        if (signal && signal instanceof EventTarget) {
            signal.addEventListener('abort', () => {
                if (!script) return;
                cleanup();
                reject('aborted!');
            });
        }

        script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';
        script.async = true;

        script.onload = script.onerror = eventHandler;
        insertScript(script);
    })
}
