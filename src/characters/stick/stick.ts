import { BootGame } from '@/scenes'
import { Character } from '..'
import { useMainStore } from '@/stores'
import './interface'
import type StairGame from '@/scenes/GamePLay/stairGame'
import { stickService } from '@/services/socket'

const initKeyAnimation = (name: string, key: string) => `animation_${name}_${key}`

class Stick extends Character {
    // #region declaration
    public keyActivities: Record<string, string> = {
        stand: 'stand',
        runRight: 'runRight',
        runLeft: 'runLeft',
        jumpRight: 'jumpRight',
        jumpLeft: 'jumpLeft',
    }
    private vy = 200
    private vx = 8
    private scale: number
    private stickAnimation: IAnimation
    private eventListener: IEventListener
    private configStick: IStickAnimationConfig
    public stickSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null
    private index: number
    private mainStore: any
    private curY: number
    // #endregion

    constructor(
        _this: any,
        index: number,
        name: string,
        x: number,
        y: number,
        configStick: string,
        scale: number,
    ) {
        super(_this, name, x, y - 100)
        this.configStick = JSON.parse(configStick)
        this.curY = y
        // console.log('config stick: ', this.configStick)

        this.stickAnimation = {}
        this.stickSprite = null
        this.eventListener = {}
        this.scale = scale
        this.index = index
        this.mainStore = useMainStore()
    }

    preload() {
        console.log(`%c\Preload ${this.name}...\n`, 'color: blue; font-size: 16px;')
        const textureUrl = this.configStick.src[this.index]
        console.log('Preload: file config: ', this.configStick)

        this.game.load.atlas({
            key: this.name,
            textureURL: textureUrl,
            atlasURL: this.configStick,
        })
    }

    create() {
        console.log(`%c\nCreate ${this.name}...\n`, 'color: red; font-size: 16px;')
        const mainStore = useMainStore()
        // #region init animation from config json
        console.log('file config: ', this.configStick)

        const animations = this.configStick.animations
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
                this.stickAnimation[keyAnim] = this.game.anims.create(configAnimation)
                // console.log(this.stickAnimation[keyAnim])
                // console.groupEnd()
            }
        }
        // #endregion

        // #region init sprite
        this.stickSprite = this.game.physics.add.sprite(this.x!, this.y!, this.name)
        // this.stickSprite.setVelocityY(9.8)
        const keyDefault = initKeyAnimation(this.name, this.keyActivities.stand)
        // console.group('Start animation')
        // console.log(keyDefault)
        // console.log(this.stickAnimation[keyDefault])
        this.stickSprite.anims.play(keyDefault)
        // console.groupEnd()
        // #endregion

        // #region listeners collision
        // this.game.matter.world.on('collisionstart', (e: any) => {
        //     e.pairs.forEach((pair: any) => {
        //         const { bodyA, bodyB } = pair
        //         // if (bodyA === this.stickSprite?.body || bodyB === this.stickSprite?.body) {
        //         //     // Check collision bodyA or bodyB is world bottom
        //         //     if (
        //         //         bodyA.position.y >= this.game.MAX_HEIGHT ||
        //         //         bodyB.position.y >= this.game.MAX_HEIGHT
        //         //     ) {
        //         //     }
        //         // }
        //     })
        // })
        // #endregion
    }

    update(): void {
        if (this.y && this.y < this.curY) {
            this.setLocation({ y: this.y + 1 })
        }
        // to keep sprite stand
        this.stickSprite?.setAngle(0)
        this.updateSpriteSize()
    }

    updateData({ event, x, y }: { event?: string; x?: number; y?: number }): void {
        this.setLocation({ x, y })
        this.updateAnimation(event!)
    }

    isOldAnimation(event: string): boolean {
        const curKey = this.stickSprite?.anims.currentAnim?.key
        const key = initKeyAnimation(this.name, this.keyActivities[event])
        return curKey === key
    }

    updateAnimation(event?: string): boolean {
        const e = event || this.keyActivities.stand
        const key = initKeyAnimation(this.name, this.keyActivities[e])
        // flip
        this.stickSprite?.setFlipX(this.configStick?.animations[e]?.frames[0].flipX || false)

        if (!this.isOldAnimation(e)) {
            this.stickSprite?.anims.play(key)
            return true
        }

        return false
    }

    setLocation({ x, y }: { x?: number; y?: number }) {
        x && this.stickSprite?.setX(x)
        y && this.stickSprite?.setY(y)
        this.x = this.stickSprite?.x || 200
        this.y = this.stickSprite?.y || 200
        // console.log('location Y: ', this.stickSprite?.y)
    }

    updateSpriteSize() {
        this.stickSprite?.refreshBody()
        this.stickSprite?.setOrigin(1)
        this.stickSprite?.setScale(this.scale)
        // const curVelocity = this.stickSprite?.body?.velocity
        const curFrame = this.stickSprite?.anims.currentFrame
        const width = curFrame?.frame.width!
        const height = curFrame?.frame.height!
        // const vx = curVelocity?.x ? curVelocity.x * this.scale : 0
        // const vy = curVelocity?.y ? curVelocity.y * this.scale : 0
        this.stickSprite?.setBodySize(width, height, true)
        // this.stickSprite?.setBounce(this.x!, this.y)
        // this.stickSprite?.setPosition(this.x, this.y)
        // this.stickSprite?.setVelocity(vx, vy)

        // this.stickSprite?.setFixedRotation()
    }

    addEvent() {
        this.eventListener.left = this.game.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.eventListener.right = this.game.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.D,
        )
        this.eventListener.jump = this.game.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.eventListener.down = this.game.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    }

    async handleKeyEvent() {
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
}

export default Stick
