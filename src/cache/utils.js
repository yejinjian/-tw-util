export const prefix = '_ymd_';
export function formatTime(time) {
    let expires;
    if (time) {
        switch (time.constructor) {
            case Date:
                expires = time;
                break;
            case String:
                expires = new Date(time);
                break;
            case Number:
                const now = new Date().getTime();
                expires = new Date(now + time);
                break;
        }
    }
    return expires;
}
