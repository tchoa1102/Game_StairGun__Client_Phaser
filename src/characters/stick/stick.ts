import { BootGame } from '@/scenes'
import { Character } from '..'
import { useMainStore } from '@/stores'
import './interface'
import type StairGame from '@/scenes/GamePLay/stairGame'

const keyActivities: Record<string, string> = {
    stand: 'stand',
    runRight: 'runRight',
    runLeft: 'runLeft',
    jumpRight: 'jumpRight',
    jumpLeft: 'jumpLeft',
}

const initKeyAnimation = (name: string, key: string) => `animation_${name}_${key}`

class Stick extends Character {
    // #region declaration
    private locationX = 0
    private locationY = 0
    private vy = 200
    private vx = 8
    private scale: number
    private stickAnimation: IAnimation
    private eventListener: IEventListener
    private fileConfig: IStickAnimationConfig
    public stickSprite: Phaser.Physics.Matter.Sprite | null
    private index: number
    // #endregion

    constructor(
        _this: any,
        index: number,
        name: string,
        x: number,
        y: number,
        fileConfig: string,
        scale: number,
    ) {
        super(_this, name, x, y)
        this.fileConfig = JSON.parse(fileConfig)
        // console.log(this.fileConfig)

        this.stickAnimation = {}
        this.stickSprite = null
        this.eventListener = {}
        this.scale = scale
        this.index = index
    }

    preload() {
        this.game.load.atlas(this.name, this.fileConfig.src[this.index], this.fileConfig)
    }

    create() {
        console.log(`%c\nCreate ${this.name}...\n`, 'color: red; font-size: 16px;')
        const mainStore = useMainStore()
        // #region init animation from config json
        const animations = this.fileConfig.animations
        for (const key in animations) {
            if (animations.hasOwnProperty(key)) {
                const instance = animations[key]
                const keyAnim = initKeyAnimation(this.name, instance.key as string)

                // init animation
                // console.group('Animation: ' + key)
                // console.log('instance: ', instance)
                this.stickAnimation[keyAnim] = this.game.anims.create({
                    ...instance,
                    defaultTextureKey: this.name,
                    key: keyAnim,
                    frames: instance.frames,
                })
                // console.log(this.stickAnimation[keyAnim])
                // console.groupEnd()
            }
        }
        // #endregion

        // #region init sprite
        this.stickSprite = this.game.matter.add.sprite(this.x!, this.y!, this.name)
        // this.stickSprite = this.game.matter.add.gameObject(
        //     this.game.add.sprite(0, 600, this.name),
        // ) as Phaser.Physics.Matter.Sprite
        this.stickSprite.setVelocityY(9.8)
        this.stickSprite.anims.play(initKeyAnimation(this.name, keyActivities.stand))
        // #endregion

        // #region add event
        this.eventListener.left = this.game.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.eventListener.right = this.game.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.D,
        )
        this.eventListener.jumpUp = this.game.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.W,
        )
        this.eventListener.jumpDown = this.game.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.S,
        )
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

    update(event?: string, x?: number, y?: number): void {
        this.setLocation({ x, y })
        // to keep sprite stand
        this.stickSprite?.setAngle(0)
        this.updateSpriteSize()
    }

    handleEvent(isEvent: boolean) {
        // console.log(`%c\nUpdating stick ${this.name}...\n`, 'color: blue; font-size: 16px;');
        const isLeftDown = this.eventListener.left?.isDown || false
        const isRightDown = this.eventListener.right?.isDown || false
        const isJumpUp = this.eventListener.jumpUp?.isDown || false

        if (isJumpUp && isLeftDown) {
            // console.log('jumpUp and left')
            isEvent = true

            if (this.updateAnimation('jumpLeft')) {
                // this.stickSprite?.setVelocityY(-this.vy)
                this.stickSprite?.setY(this.stickSprite.y - 100)
            }
        } else if (isJumpUp && isRightDown) {
            // console.log('jumpUp and right')
            isEvent = true
            if (this.updateAnimation('jumpRight')) {
                // this.stickSprite?.setVelocityY(-this.vy)
                this.stickSprite?.setY(this.stickSprite.y - 100)
            }
        } else if (isLeftDown || isRightDown) {
            let keyAnim = 'runLeft'
            if (isLeftDown) {
                isEvent = true
            }
            if (isRightDown) {
                isEvent = true
                keyAnim = 'runRight'
            }
            this.updateAnimation(keyAnim)
        }

        // moving
        if (this.eventListener.left?.isDown) {
            // this.stickSprite?.setVelocityX(-this.vx)
            // this.stickSprite?.setX(this.stickSprite.x - 8)
        }

        if (this.eventListener.right?.isDown) {
            // this.stickSprite?.setVelocityX(this.vx)
            // this.stickSprite?.setX(this.stickSprite.x + 8)
        }

        // recovery animation
        !isEvent && this.updateAnimation('stand')
    }

    setLocation({ x, y }: { x?: number; y?: number }) {
        x && this.stickSprite?.setX(x)
        y && this.stickSprite?.setY(y)
        this.locationX = this.stickSprite?.x || 200
        this.locationY = this.stickSprite?.y || 200
    }

    updateSpriteSize() {
        const curVelocity = this.stickSprite?.body?.velocity
        const curFrame = this.stickSprite?.anims.currentFrame
        const width = curFrame?.frame.width ? curFrame?.frame.width * this.scale : 0
        const height = curFrame?.frame.height ? curFrame?.frame.height * this.scale : 0
        const vx = curVelocity?.x ? curVelocity.x * this.scale : 0
        const vy = curVelocity?.y ? curVelocity.y * this.scale : 0
        // this.stickSprite?.setSize(width, height)
        // this.stickSprite?.setRectangle(width, height)
        this.stickSprite?.setBody({
            type: 'rectangle',
            width,
            height,
        })
        this.stickSprite?.setPosition(this.locationX, this.locationY)
        // this.stickSprite?.setOriginFromFrame()
        // this.stickSprite?.setExistingBody(this.stickSprite.body as MatterJS.BodyType)
        this.stickSprite?.setScale(this.scale)
        this.stickSprite?.setVelocity(vx, vy)

        // this.stickSprite?.setFixedRotation()
    }

    updateAnimation(event: string) {
        const cur = this.stickSprite?.anims.currentAnim
        const key = initKeyAnimation(this.name, keyActivities[event])

        if (cur !== this.stickAnimation[key]) {
            this.stickSprite?.anims.play(key)
            return true
        }
        // flip
        this.stickSprite?.setFlipX(this.fileConfig?.animations[event]?.frames[0].flipX || false)
        return false
    }
}

export default Stick
