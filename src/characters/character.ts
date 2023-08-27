import type { BootGame, GamePlay } from '@/scenes'

export default class Character {
    protected game: BootGame | GamePlay
    protected name: string

    constructor(_this: any, name: string) {
        this.game = _this
        this.name = name
    }
}