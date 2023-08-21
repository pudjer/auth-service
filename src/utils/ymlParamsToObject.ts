export const ymlParamsToObject = (arr: Array<string>, separator: string = '=') => {
    const res = {}
    arr.forEach(str => {
        const [key, val] = str.split('=')
        res[key] = val
    })
    return res
}