import { Character } from '..'
import { useMainStore } from '@/stores'
import { stickService } from '@/services/socket'
import { initKeyAnimation } from '@/util/shares'

export default class Stick extends Character {
    // #region declaration
    public keyActivities: Record<string, string> = {
        stand: 'stand',
        runRight: 'runRight',
        runLeft: 'runLeft',
        jumpRight: 'jumpRight',
        jumpLeft: 'jumpLeft',
    }
    private vy = 10
    private vx = 8
    // private scale: number
    // private characterAnimation: IAnimation = {}
    // private eventListener: IEventListener = {}
    // private configCharacter: IStickAnimationConfig
    private curY: number
    private curT: number = 0
    // #endregion

    constructor(
        _this: any,
        index: number,
        name: string,
        x: number,
        y: number,
        configCharacter: string,
        scale: number,
    ) {
        super(_this, index, name, x, y - 100, configCharacter, scale)
        this.curY = y
    }

    preload() {
        console.log(`%c\Preload ${this.name}...\n`, 'color: blue; font-size: 16px;')
        const textureUrl = this.configCharacter!.src[this.index]
        // console.log('Preload: file config: ', this.configCharacter)

        this.game.load.atlas({
            key: this.name,
            textureURL: textureUrl,
            atlasURL: this.configCharacter!,
        })
    }

    create() {
        console.log(`%c\nCreate ${this.name}...\n`, 'color: red; font-size: 16px;')
        const mainStore = useMainStore()
        // #region init animation from config json
        // console.log('file config: ', this.configCharacter)

        const animations = this.configCharacter!.animations
        for (const key in animations) {
            if (animations.hasOwnProperty(key)) {
                const instance: IAnimationItem = animations[key]
                const keyAnim: string = initKeyAnimation(this.name, instance.key as string)

                // init animation
                // console.group('Animation: ' + key)
                // console.log('instance: ', instance)
                const configAnimation: Phaser.Types.Animations.Animation = {
                    ...instance,
                    defaultTextureKey: this.name,
                    frames: instance.frames as Array<Phaser.Types.Animations.AnimationFrame>,
                    duration: 1,
                    key: keyAnim,
                }
                this.characterAnimation[keyAnim] = this.game.anims.create(configAnimation)
                // console.log(this.characterAnimation[keyAnim])
                // console.groupEnd()
            }
        }
        // #endregion

        // #region init sprite
        const isBlueTeam = this.index < 3 ? 0 : 1
        const colorName = ['blue', 'red']
        this.character = this.game.physics.add.sprite(this.x!, this.y!, this.name)
        this.nameTextObject = this.game.add
            .text(this.x!, this.y! + 100, this.name, {
                color: colorName[isBlueTeam],
                fontSize: '16px',
                fontStyle: 'bold',
                // backgroundColor: '#ffffff70',
            })
            .setOrigin(0.5)
        // this.character.setVelocityY(9.8)
        const keyDefault = initKeyAnimation(this.name, this.keyActivities.stand)
        // console.group('Start animation')
        // console.log(keyDefault)
        // console.log(this.characterAnimation[keyDefault])
        this.character.anims.play(keyDefault)
        // console.groupEnd()
        // #endregion

        // this.updateSpriteSize()
        // this.character?.setAngle(0)
    }

    update(time: any, delta: any): void {
        // console.log(time - this.curT)
        // this.curT = time

        if (this.y && this.y < this.curY) {
            this.setLocation({ y: this.y + this.vy })
        }

        if (this.y && this.y > this.curY) {
            this.setLocation({ y: this.y - this.vy })
        }
        // to keep sprite stand
        this.character?.setAngle(0)
        this.updateSpriteSize()
    }

    updateData({ event, x, y }: { event?: string; x?: number; y?: number }): void {
        if (y) this.curY = y
        // this.setLocation({ x, y })
        this.setLocation({ x })
        event && this.updateAnimation(event!)
    }

    addEvent() {
        this.eventListener.left = this.game.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.eventListener.right = this.game.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.D,
        )
        this.eventListener.jump = this.game.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.eventListener.down = this.game.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    }

    handleKeyEvent() {
        // console.log(`%c\nUpdating stick ${this.name}...\n`, 'color: blue; font-size: 16px;')
        let isEventKeyDown = false
        // key animation default
        let keyAnim = this.keyActivities.stand
        const isLeftDown = this.eventListener.left?.isDown || false
        const isRightDown = this.eventListener.right?.isDown || false
        const isJumpDown = this.eventListener.jump?.isDown || false

        if (isJumpDown && isLeftDown) {
            isEventKeyDown = true
            keyAnim = this.keyActivities.jumpLeft
        } else if (isJumpDown && isRightDown) {
            isEventKeyDown = true
            keyAnim = this.keyActivities.jumpRight
        } else if (isLeftDown) {
            isEventKeyDown = true
            keyAnim = this.keyActivities.runLeft
        } else if (isRightDown) {
            isEventKeyDown = true
            keyAnim = this.keyActivities.runRight
            // console.log('right')
        }

        // check key up and animation isn't stand
        if (!isEventKeyDown && !this.isOldAnimation(keyAnim)) {
            // console.log('stand')
            stickService.stand(keyAnim)
        }

        if (isEventKeyDown) {
            // send event to api
            this.sendEvent(keyAnim)
        }

        // recovery animation
        // this.updateAnimation(keyAnim)
    }

    sendEvent(keyEvent: string) {
        if (typeof stickService[keyEvent as keyof typeof stickService] === 'function') {
            stickService[keyEvent as keyof typeof stickService](keyEvent as any)
        }
    }

    // isOldAnimation(event: string): boolean {
    //     const curKey = this.character?.anims.currentAnim?.key
    //     const key = initKeyAnimation(this.name, this.keyActivities[event])
    //     return curKey === key
    // }

    // updateAnimation(event?: string): boolean {
    //     const e = this.keyActivities.hasOwnProperty(event!) ? event! : this.keyActivities.stand
    //     const key = initKeyAnimation(this.name, this.keyActivities[e])
    //     // flip
    //     this.character?.setFlipX(this.configCharacter?.animations[e]?.frames[0].flipX || false)

    //     if (!this.isOldAnimation(e)) {
    //         this.character?.anims.play(key)
    //         return true
    //     }

    //     return false
    // }

    // setLocation({ x, y }: { x?: number; y?: number }) {
    //     // console.log(x, y)
    //     x && this.character!.setX(x)
    //     y && this.character!.setY(y)
    //     this.x = this.character!.x
    //     this.y = this.character!.y
    //     // console.log('location Y: ', this.character?.y)
    // }

    // updateSpriteSize() {
    //     this.character?.refreshBody()
    //     this.character?.setOrigin(1)
    //     this.character?.setScale(this.scale)
    //     // const curVelocity = this.character?.body?.velocity
    //     const curFrame = this.character?.anims.currentFrame
    //     const width = curFrame?.frame.width!
    //     const height = curFrame?.frame.height!
    //     // const vx = curVelocity?.x ? curVelocity.x * this.scale : 0
    //     // const vy = curVelocity?.y ? curVelocity.y * this.scale : 0
    //     this.character?.setBodySize(width, height, true)
    //     // this.character?.setBounce(this.x!, this.y)
    //     // this.character?.setPosition(this.x, this.y)
    //     // this.character?.setVelocity(vx, vy)

    //     // this.character?.setFixedRotation()
    // }
}
