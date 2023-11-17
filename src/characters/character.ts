import type { StairGame, GamePlay, GunGame } from '@/scenes'
import { initKeyAnimation } from '@/util/shares'
import './interface'
import { useMainStore } from '@/stores'
import type { IPlayerOnMatch } from '@/util/interface/index.interface'

export default abstract class Character {
    public x: number | undefined = undefined
    public y: number | undefined = undefined
    public index: number
    public name: string
    public keyActivities: Record<string, string> = {}
    public character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null = null
    protected nameTextObject: Phaser.GameObjects.Text | undefined

    protected game: GamePlay | StairGame | GunGame
    protected mainStore: any
    public thisPlayer: IPlayerOnMatch
    protected configCharacter: IStickAnimationConfig | null = null
    protected characterAnimation: IAnimation = {}
    protected scale: number = 1
    protected eventListener: IEventListener = {}
    protected nameText: Phaser.GameObjects.Text | undefined

    abstract preload(): void
    abstract create(): void
    abstract update(time: any, delta: any): void
    abstract updateData(data: { [key: string]: any }): void
    abstract addEvent(): void
    abstract handleKeyEvent(): void

    constructor(
        _this: any,
        index: number,
        name: string,
        x: number | undefined,
        y: number | undefined,
        config: string,
        scale: number,
    ) {
        this.game = _this
        this.index = index
        this.name = name
        this.x = x
        this.y = y
        this.configCharacter = JSON.parse(config)
        this.scale = scale
        this.mainStore = useMainStore()
        this.thisPlayer = this.mainStore.getMatch.players[this.index]
    }

    isOldAnimation(event: string): boolean {
        const curKey = this.character?.anims.currentAnim?.key
        const key = initKeyAnimation(this.name, this.keyActivities[event])
        return curKey === key
    }

    updateAnimation(event?: string): boolean {
        const e = this.keyActivities.hasOwnProperty(event!) ? event! : this.keyActivities.stand
        const key = initKeyAnimation(this.name, this.keyActivities[e])
        // flip
        this.character?.setFlipX(this.configCharacter!.animations[e]?.frames[0].flipX || false)

        if (!this.isOldAnimation(e)) {
            this.character?.anims.play(key)
            return true
        }

        return false
    }

    setLocation({ x, y }: { x?: number; y?: number }) {
        // console.log(x, y)
        x && this.character!.setX(x)
        y && this.character!.setY(y)
        this.x = this.character!.x
        this.y = this.character!.y
        x && this.nameTextObject!.setX(x)
        y && this.nameTextObject!.setY(y)
        // console.log('location Y: ', this.character?.y)
    }

    updateSpriteSize() {
        this.character?.refreshBody()
        this.character?.setOrigin(1)
        this.character?.setScale(this.scale)
        // const curVelocity = this.character?.body?.velocity
        const curFrame = this.character?.anims.currentFrame
        const width = curFrame?.frame.width!
        const height = curFrame?.frame.height!
        // const vx = curVelocity?.x ? curVelocity.x * this.scale : 0
        // const vy = curVelocity?.y ? curVelocity.y * this.scale : 0
        this.character?.setBodySize(width, height, true)
        // this.character?.setBounce(this.x!, this.y)
        // this.character?.setPosition(this.x, this.y)
        // this.character?.setVelocity(vx, vy)

        // this.character?.setFixedRotation()
    }
}
