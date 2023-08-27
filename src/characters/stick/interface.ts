interface EventListenerITF {
    [key: string]: Phaser.Input.Keyboard.Key | undefined
}

interface AnimationITF {
    [key: string]: Phaser.Animations.Animation | boolean
}

interface frameAnimationITF {
    start: number |undefined,
    end: number |undefined,
    first: number |undefined,
    outputArray: Phaser.Types.Animations.AnimationFrame[] |undefined,
    frames: boolean | number[] | undefined,
}

interface AnimationItemITF {
    key:                string | undefined
    frames:             frameAnimationITF,
    frameRate:          number | undefined
    repeat:             number | undefined
    repeatDelay:        number | undefined
    defaultTextureKey:  string | undefined
    delay:              number | undefined
    duration:           number | undefined
    hideOnComplete:     boolean | undefined
    yoyo:               boolean | undefined
    showBeforeDelay:    boolean | undefined
    showOnStart:        boolean | undefined
    skipMissedFrames:   boolean | undefined
    sortFrames:         boolean | undefined
}

interface StickAnimationConfigITF {
    width: number,
    height: number
    src: string,
    frame: { frameWidth: number, frameHeight: number}
    animation: {
        [key: string]: AnimationItemITF
    }
}

