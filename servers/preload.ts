
const headers = require("./headers").default

(function preload () {
    return fetch("http://yapi.3pvr.com/api/group/list", {
        method: 'GET',
        headers 
    }).then((response) => response.json<ResponseWrapper<GroupData[]>>())
    .then(handleResponse)
    .then(batchQuery)
    .then(batchQueryAPI)
})()

function handleResponse (raw: ResponseWrapper<GroupData[]>) {
    if (raw.errcode) return Promise.reject()
    return raw.data
}
/**
 * @name 批量请求`Project` 
 * @param {GroupData[]} list Project Group
 * @returns 
 */
function batchQuery (list: GroupData[]) {
    const queue: any[] = [];
    for(let i = 0; i < list.length; i ++ ) {
        if (list[i].type !== "public" || list[i].group_name.includes("B端")) continue
        queue.push(fetch(`http://yapi.3pvr.com/api/project/list?group_id=${list[i]._id}&page=1&limit=10`, {
            method: "GET",
            headers,
        }).then(response => response.json<ResponseWrapper<ProjectData>>())
        .then((response) => {
            if (response.errcode) return Promise.reject()
            return response.data.list
        })
        )
    }
    return (<AllSettle<ProjectData["list"]>[]><unknown> 
        Promise.allSettled(queue))
        .reduce<ProjectData["list"]>(
            (prev, next ) => {
                if (next.status !== "fulfilled") return prev
                return [...prev, ...next.value.filter(({ name }) => !name.includes("B端")) ]
            } ,[]
        )
}

function batchQueryAPI(list: ProjectData["list"]) {

}

