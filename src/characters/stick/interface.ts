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
    width: number
    height: number
    src: string
    frame: { frameWidth: number; frameHeight: number }
    animation: {
        [key: string]: IAnimationItem
    }
}
