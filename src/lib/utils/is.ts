import { pathLike } from "./reg"

export const isPath = (i: string) => !!pathLike(i)