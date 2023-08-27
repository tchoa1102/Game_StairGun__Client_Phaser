import { BootGame } from "@/scenes"
import {Character} from ".."

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

const keyActivities = {
    stand: 'stand',
    runRight: 'runRight',
    runLeft: 'runLeft',
    jump: 'jump',
    jumpRight: 'jumpRight',
    jumpLeft: 'jumpLeft',
}

const initKeyAnimation = (name: string, key: string) => `animation_${name}_${key}`

class Stick extends Character {

    private stickSprite: Phaser.Physics.Matter.Sprite| null
    private stickAnimation: AnimationITF
    private eventListener: EventListenerITF
    private fileConfig: StickAnimationConfigITF

    constructor(_this: any, name: string, fileConfig: string) {
        super(_this, name)
        this.fileConfig = JSON.parse(fileConfig)
        console.log(this.fileConfig);
        
        this.stickAnimation = {}
        this.stickSprite = null
        this.eventListener = {}
    }

    preload() {
        this.game.load.spritesheet(this.name, this.fileConfig.src, {
            frameWidth: this.fileConfig.frame.frameWidth,
            frameHeight: this.fileConfig.frame.frameHeight,
        })
    }

    create() {
        console.log(`%c\nCreate ${this.name}...\n`, 'color: red; font-size: 16px;');
        // #region init animation from config json
        const animations = this.fileConfig.animation
        for(const key in animations) {
            if (animations.hasOwnProperty(key)) {
                const instance = animations[key]
                const keyAnim = initKeyAnimation(this.name, instance.key as string)
                this.stickAnimation[keyAnim]
                    = this.game.anims.create({
                        ...instance,
                        key: keyAnim,
                        frames: this.game.anims.generateFrameNumbers(
                            this.name, instance.frames
                        ),
                    })
            }
        }
        // #endregion

        // #region init sprite
        this.stickSprite = this.game.matter.add.sprite(200, 200, this.name)
        this.stickSprite.setRectangle(this.fileConfig.frame.frameWidth, this.fileConfig.frame.frameHeight)
        // this.stickSprite = this.game.physics.add.sprite(200, 200, this.name)
        // this.stickSprite.scale = 0.5
        // this.stickSprite.setBounce(0.5)
        // this.stickSprite.anims.play(initKeyAnimation(this.name, keyActivities.stand))
        // #endregion

        // #region add event
        this.eventListener.left = this.game.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        this.eventListener.right = this.game.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        this.eventListener.jumpUp = this.game.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        this.eventListener.jumpDown = this.game.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        // #endregion
    }

    update() {
        console.log(`%c\nUpdating stick ${this.name}...\n`, 'color: blue; font-size: 16px;');
        let isEvent = false
        if (this.eventListener.left?.isDown) {
            isEvent = true
            const cur = this.stickSprite?.anims.currentAnim
            const keyAnim = initKeyAnimation(this.name, keyActivities.runLeft)
            if (cur !== this.stickAnimation[keyAnim]) {
                this.stickSprite?.anims.play(keyAnim)
            }
            this.stickSprite?.setX(this.stickSprite.x - 2)
        }
        if (this.eventListener.right?.isDown) {
            isEvent = true
            const cur = this.stickSprite?.anims.currentAnim
            const keyAnim = initKeyAnimation(this.name, keyActivities.runRight)
            if (cur !== this.stickAnimation[keyAnim]) {
                this.stickSprite?.anims.play(keyAnim)
            }
            this.stickSprite?.setX(this.stickSprite.x + 2)
        }
        if (this.eventListener.jumpUp?.isDown) {
            isEvent = true
            const cur = this.stickSprite?.anims.currentAnim
            const keyAnim = initKeyAnimation(this.name, keyActivities.jump)
            if (cur !== this.stickAnimation[keyAnim]) {
                this.stickSprite?.anims.play(keyAnim)
            }
            this.stickSprite?.setY(this.stickSprite.y - 16)
        }
        if (this.eventListener.jumpDown?.isDown) {
            isEvent = true
            const cur = this.stickSprite?.anims.currentAnim
            const keyAnim = initKeyAnimation(this.name, keyActivities.jump)
            if (cur !== this.stickAnimation[keyAnim]) {
                this.stickSprite?.anims.play(keyAnim)
            }
            this.stickSprite?.setY(this.stickSprite.y + 16)
        }
        if (!isEvent) {
            const keyAnim = initKeyAnimation(this.name, keyActivities.stand)
            this.stickSprite?.anims.play(keyAnim)
        }
    }
}

export default Stick
