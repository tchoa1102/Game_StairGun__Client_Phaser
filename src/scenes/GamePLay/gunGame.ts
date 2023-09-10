import type GamePlay from "./gamePlay";
import { useMainStore } from "@/stores"
const tiled = JSON.stringify('')

class GunGame {
    private game: GamePlay
    private mainStore: any
    constructor(_this: any) {
        this.game = _this
        this.mainStore = useMainStore()
    }

    preload() {}

    create() {
        // this.mainStore.width * this.mainStore.zoom - 402 = 1078
        // this.mainStore.height * this.mainStore.zoom = 740
        this.game.matter.world.setBounds(401, 0, this.mainStore.width * this.mainStore.zoom - 402, this.mainStore.height * this.mainStore.zoom)

        this.game.matter.world.setGravity(undefined, 9.8)
    }

    update() {}
}

export default GunGame