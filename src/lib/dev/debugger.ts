export const debug = new Proxy(console, {
    get(target, p: "log"|"warn"|"error") {
        return target[p].bind(target)
    }
})