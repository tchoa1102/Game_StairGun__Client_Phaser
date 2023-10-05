export function regexResponse(res: any) {
    if (res.status < 400) {
        return res.data
    }
    return null
}

export const initKeyAnimation = (name: string, key: string) => `animation_${name}_${key}`
export function createAnimation(game: any, name: string, animations: any) {
    const animationsInstances: IAnimation = {}
    for (const key in animations) {
        if (animations.hasOwnProperty(key)) {
            const instance = animations[key]
            const keyAnim = initKeyAnimation(name, instance.key as string)

            // init animation
            // console.group('Animation: ' + key)
            // console.log('instance: ', instance)
            animationsInstances[keyAnim] = game.anims.create({
                ...instance,
                // defaultTextureKey: game.name,
                key: keyAnim,
                frames: instance.frames,
            })
            // console.groupEnd()
        }
    }

    return animationsInstances
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
