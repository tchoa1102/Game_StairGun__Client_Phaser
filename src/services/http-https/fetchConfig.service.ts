export default async function FETCH(url: string) {
    const res = await fetch(url, {
        referrerPolicy: 'strict-origin-when-cross-origin',
        method: 'GET',
    })
    const data = await res.json()
    console.group('%cFETCH DATA: ', 'color: orange; font-size: 16px;')
    console.log(data)
    console.groupEnd()

    return JSON.stringify(data)
}
