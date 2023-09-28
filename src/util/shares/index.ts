export function regexResponse(res: any) {
    if (res.status < 400) {
        return res.data
    }
    return null
}

export function toast({ type, message }: { type?: string; message?: string }) {
    const toast: { [key: string]: any } = {
        info: {
            message: message || 'Thành công!',
        },
        warn: {
            message: message || 'Có lỗi xảy ra! Vui lòng thử lại.',
        },
        error: {
            message: message || 'Có lỗi xảy ra! Vui longf thử lại.',
        },
    }

    const defaultType = type || 'error'
    const toastDOM = createToast({ type: defaultType, message: toast[defaultType].message })
    // setTimeout(() => {
    //     toastDOM.remove()
    // }, 20000)
}
function createToast({ type, message }: { type: string; message: string }): HTMLElement {
    const section = document.createElement('section')
    section.classList.add(`toast-item`)
    section.classList.add(`toast-${type}`)
    const textSys = document.createElement('div')
    textSys.innerText = `[Hệ thống]`
    textSys.style.color = '#d30'
    textSys.style.minWidth = '90px'
    const text = document.createElement('div')
    text.innerText = `${message}`
    text.style.marginLeft = '4px'
    section.append(textSys, text)
    document.querySelector('.toast-component')?.append(section)

    return section
}
