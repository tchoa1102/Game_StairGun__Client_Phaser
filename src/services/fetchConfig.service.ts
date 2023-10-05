export default async function FETCH(url: string) {
    const res = await fetch(url, {
        referrerPolicy: 'strict-origin-when-cross-origin',
        method: 'GET',
    })
    const data = await res.json()
    console.log('FETCH DATA: ', data)

    return data
}
