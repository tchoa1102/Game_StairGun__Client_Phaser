import type { BootGame, GamePlay } from '@/scenes'
import type StairGame from '@/scenes/GamePLay/stairGame'

export default class Character {
    protected game: GamePlay | StairGame
    protected name: string
    public x: number | undefined
    public y: number | undefined

    constructor(_this: any, name: string, x: number | undefined, y: number | undefined) {
        this.game = _this
        this.name = name
        this.x = x
        this.y = y
    }
}
