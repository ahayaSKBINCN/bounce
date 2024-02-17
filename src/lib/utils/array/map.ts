export const map = <T extends Array<any> = Array<any>>(collect: T, mapper: (item: ArrayItem<T>, index: number, collect: T) => unknown ) => {
    const newArray = new Array(collect.length)
    for (let i =0; i < collect.length; i ++) {
        newArray[i] = mapper(collect[i], i, collect)
    }
    return newArray
}

type ArrayItem<T> = T extends Array<infer P> ? P : never 