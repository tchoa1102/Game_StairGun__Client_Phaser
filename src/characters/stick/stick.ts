import { BootGame } from "@/scenes"
import {Character} from ".."
import { useMainStore } from "@/stores"
import './interface'

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
    // #region declaration
    private stickSprite: Phaser.Physics.Matter.Sprite | null
    private stickAnimation: AnimationITF
    private eventListener: EventListenerITF
    private fileConfig: StickAnimationConfigITF
    // #endregion

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
        this.stickSprite.setRectangle(this.fileConfig.frame.frameWidth * 0.5, this.fileConfig.frame.frameHeight * 0.5)
        this.stickSprite.scale = 0.5
        this.stickSprite.setBounce(0)
        this.stickSprite.anims.play(initKeyAnimation(this.name, keyActivities.stand))
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
        const cur = this.stickSprite?.anims.currentAnim
        if (this.eventListener.left?.isDown) {
            isEvent = true
            const keyAnim = initKeyAnimation(this.name, keyActivities.runLeft)
            if (cur !== this.stickAnimation[keyAnim]) {
                this.stickSprite?.anims.play(keyAnim)
            }
            this.stickSprite?.setX(this.stickSprite.x - 8)
        }
        if (this.eventListener.right?.isDown) {
            isEvent = true
            const keyAnim = initKeyAnimation(this.name, keyActivities.runRight)
            if (cur !== this.stickAnimation[keyAnim]) {
                this.stickSprite?.anims.play(keyAnim)
            }
            this.stickSprite?.setX(this.stickSprite.x + 8)
        }
        if (this.eventListener.jumpUp?.isDown) {
            isEvent = true
            const keyAnim = initKeyAnimation(this.name, keyActivities.jump)
            if (cur !== this.stickAnimation[keyAnim]) {
                this.stickSprite?.anims.play(keyAnim)
            }
            this.stickSprite?.setY(this.stickSprite.y - 50)
        }
        if (this.eventListener.jumpDown?.isDown) {
            isEvent = true
            const keyAnim = initKeyAnimation(this.name, keyActivities.jump)
            if (cur !== this.stickAnimation[keyAnim]) {
                this.stickSprite?.anims.play(keyAnim)
            }
            this.stickSprite?.setY(this.stickSprite.y + 50)
        }

        // recovery animation
        const keyAnim = initKeyAnimation(this.name, keyActivities.stand)
        if (!isEvent && cur !== this.stickAnimation[keyAnim]) {
            this.stickSprite?.anims.play(keyAnim)
        }
    }
}

export default Stick
