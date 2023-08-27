import Phaser from "phaser"

interface EventListenerITF {
    [key: string]: Phaser.Input.Keyboard.Key | undefined
}

class BootGame extends Phaser.Scene {
    private circleStickAnimation: Array<Phaser.Animations.Animation | boolean>
    private circleStickSprite: Phaser.GameObjects.Sprite | null
    private eventListener: EventListenerITF
    constructor() {
        super('bootGame')
        this.circleStickAnimation = []
        this.circleStickSprite = null
        this.eventListener = {}
    }

    init() {
    }

    preload() {
        console.log('%c\nLoading...\n', 'color: yellow; font-size: 16px;');
        this.load.spritesheet('circleStick', 'src/assets/circle.stick.png', {
            frameWidth: 33,
            frameHeight: 147,
        })
    }
    
    create() {
        // this.textBase = this.add.text(20,20, 'Hello Phaser!', { color: '#fff'})
        // this.textBase.setPosition(0, 0)
        console.log('%c\nCreate...\n', 'color: red; font-size: 16px;');
        interface spriteITF {
            [key: string]: {
                start: number,
                end: number
            }
        }
        const sprite:spriteITF = {
            stand: {
                start: 0,
                end: 1
            },
            runRight: {
                start: 7,
                end: 13
            },
            runLeft: {
                start: 14,
                end: 20
            },
            jump: {
                start: 21,
                end: 25,
            },
        }
        let i = 0
        for(const key in sprite) {
            if (sprite.hasOwnProperty(key)) {
                const instance = sprite[key]
                this.circleStickAnimation[i++] = this.anims.create({
                    key: `animation_circleStick_${key}`,
                    frames: this.anims.generateFrameNumbers('circleStick', instance),
                    frameRate: 10,
                    repeat: -1,
                })
            }
        }
 
        this.circleStickSprite = this.add.sprite(200, 200, 'circleStick')
        this.circleStickSprite.scale = 0.5
        this.circleStickSprite.anims.play('animation_circleStick_stand')

        // add event
        this.eventListener.left = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        this.eventListener.right = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        this.eventListener.jumpUp = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        this.eventListener.jumpDown = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    }

    // update() {
    //     console.log('%c\nUpdating...\n', 'color: blue; font-size: 16px;');
    //     let isEvent = false
    //     if (this.eventListener.left?.isDown) {
    //         isEvent = true
    //         const cur = this.circleStickSprite?.anims.currentAnim
    //         if (cur !== this.circleStickAnimation[2]) {
    //             this.circleStickSprite?.anims.play('animation_circleStick_runLeft')
    //         }
    //         this.circleStickSprite?.setX(this.circleStickSprite.x - 2)
    //     }
    //     if (this.eventListener.right?.isDown) {
    //         isEvent = true
    //         const cur = this.circleStickSprite?.anims.currentAnim
    //         if (cur !== this.circleStickAnimation[1]) {
    //             this.circleStickSprite?.anims.play('animation_circleStick_runRight')
    //         }
    //         this.circleStickSprite?.setX(this.circleStickSprite.x + 2)
    //     }
    //     if (this.eventListener.jumpUp?.isUp) {
    //         isEvent = true
    //         const cur = this.circleStickSprite?.anims.currentAnim
    //         if (cur !== this.circleStickAnimation[3]) {
    //             this.circleStickSprite?.anims.play('animation_circleStick_jump')
    //         }
    //         this.circleStickSprite?.setY(this.circleStickSprite.y - 8)
    //     }
    //     if (this.eventListener.jumpDown?.isUp) {
    //         isEvent = true
    //         const cur = this.circleStickSprite?.anims.currentAnim
    //         if (cur !== this.circleStickAnimation[3]) {
    //             this.circleStickSprite?.anims.play('animation_circleStick_jump')
    //         }
    //         this.circleStickSprite?.setY(this.circleStickSprite.y + 8)
    //     }
    //     if (!isEvent) {
    //         this.circleStickSprite?.anims.play('animation_circleStick_stand')
    //     }
    // }
    
    render() {
        console.log('%c\nRendering...\n', 'color: #363; font-size: 16px;');
    }
}

export default BootGame
