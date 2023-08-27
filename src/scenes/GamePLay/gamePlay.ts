import { Stick } from "@/characters"
import { useMainStore } from "@/stores"
import Phaser from "phaser"
const fileConfigCircleStick = JSON.stringify({
    "width": 231,
    "height": 882,
    "src": "src/assets/circle.stick.png",
    "frame": { "frameWidth": 33, "frameHeight": 147 },
    "animation": {
        "stand": {
            "key": "stand",
            "frames": { "start": 0, "end": 1 },
            "frameRate": 10,
            "repeat": -1
        },
        "runRight": {
            "key": "runRight",
            "frames": { "start": 7, "end": 13 },
            "frameRate": 10,
            "repeat": -1
        },
        "runLeft": {
            "key": "runLeft",
            "frames": { "start": 14, "end": 20 },
            "frameRate": 10,
            "repeat": -1
        },
        "jump": {
            "key": "jump",
            "frames": { "start": 21, "end": 25 },
            "frameRate": 100,
            "repeat": 0,
            "duration": 10000,
        },
        "jumpRight": {
            "key": "jumpRight",
            "frames": { "start": 28, "end": 28 },
            "frameRate": 10,
            "repeat": 0
        },
        "jumpLeft": {
            "key": "jumpLeft",
            "frames": { "start": 35, "end": 35 },
            "frameRate": 10,
            "repeat": 0
        }
    }
})

class GamePlay extends Phaser.Scene {
    private circleStick: Stick
    constructor() {
        super('gamePlay')
        this.circleStick = new Stick(this, 'circleStick', fileConfigCircleStick)
    }

    init() {
    }

    preload() {
        console.log('%c\nLoading...\n', 'color: yellow; font-size: 16px;');
        this.circleStick.preload()
    }
    
    create() {
        console.log('%c\nCreate...\n', 'color: red; font-size: 16px;');
        const mainStore = useMainStore()
        this.matter.world.setBounds(0, 0, mainStore.width * mainStore.zoom, mainStore.height * mainStore.zoom)
        this.circleStick.create()
    }

    update() {
        console.log('%c\nUpdating...\n', 'color: blue; font-size: 16px;');
        let isEvent = false
        this.circleStick.update()
        
    }
    
    render() {
        console.log('%c\nRendering...\n', 'color: #363; font-size: 16px;');
    }
}

export default GamePlay
