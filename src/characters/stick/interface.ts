interface IEventListener {
    [key: string]: Phaser.Input.Keyboard.Key | undefined
}

interface IAnimation {
    [key: string]: Phaser.Animations.Animation | boolean
}

interface IAnimationItem {
    key: string | undefined
    frames: Phaser.Types.Animations.AnimationFrame[]
    frameRate: number | undefined
    repeat: number | undefined
    repeatDelay: number | undefined
    defaultTextureKey: string | undefined
    delay: number | undefined
    duration: number | undefined
    hideOnComplete: boolean | undefined
    yoyo: boolean | undefined
    showBeforeDelay: boolean | undefined
    showOnStart: boolean | undefined
    skipMissedFrames: boolean | undefined
    sortFrames: boolean | undefined
}

interface IStickAnimationConfig {
    meta: {
        app: string
        version: string
        image: string
        format: string
        size: { w: number; h: number }
        scale: string
    }
    src: string
    frames: {
        [key: string]: {
            frame: { x: number; y: number; w: number; h: number }
            rotated: boolean | false
            trimmed: boolean | false
            spriteSourceSize: { x: number; y: number; w: number; h: number }
            sourceSize: { x: number; y: number }
        }
    }
    animation: {
        [key: string]: IAnimationItem
    }
}
