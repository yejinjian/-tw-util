/**
 * event emitter
 */
export default class Events {
    #events = Object.create(null);

    on(event, fn, preapend) {
        if (Array.isArray(event)) {
            for (let i = 0, l = event.length; i < l; i++) {
                this.on(event[i], fn)
            }
        } else {
            this.#events[event] || (this.#events[event] = []);
            if (preapend) {
                this.#events[event].unshift(fn);
            } else {
                this.#events[event].push(fn);
            }
        }
        return this;
    }

    once(event, fn) {
        const vm = this;

        function on() {
            vm.off(event, on);
            fn.apply(vm, arguments)
        }

        on.fn = fn
        this.on(event, on);
        return this;
    }

    emit(event, ...args) {
        let cbs = this.#events[event] || [];
        if (cbs) {
            for (let i = 0, l = cbs.length; i < l; i++) {
                if (cbs[i]) {
                    cbs[i].apply(this, args);
                }
            }
        }
        return this
    }

    off(event, fn) {
        if (!arguments.length) {
            this.#events = Object.create(null);
            return this
        }
        if (Array.isArray(event)) {
            event.forEach(e => this.off(event[e], fn));
            return this
        }
        const cbs = this.#events[event];
        if (!cbs) {
            return this;
        }
        if (!fn) {
            this.#events[event] = null;
            return this
        }
        let cb;
        let i = cbs.length;
        while (i--) {
            cb = cbs[i];
            if (cb === fn || cb.fn === fn) {
                cbs.splice(i, 1);
                break
            }
        }
        return this;
    }
}
