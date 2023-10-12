type AllSettle<T> = { value: T, status: string }

type ResponseWrapper<Data> = {
    errcode: number,
    errmsg: string,
    data: Data
}

type GroupData = {
    type: string,
    _id: number,
    group_name: string,
    group_desc?: string,
    uid: number,
    add_time: number,
    up_time: number,
    role: string
}

type ProjectData = {
    list:{
        name: string,
        project_type: string
        _id: number,
        uid: number,
        pid: number
    }[]
} 
