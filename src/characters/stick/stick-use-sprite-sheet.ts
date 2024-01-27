// import { BootGame } from '@/scenes'
// import { Character } from '..'
// import { useMainStore } from '@/stores'
// import '../interface'

// const keyActivities = {
//     stand: 'stand',
//     runRight: 'runRight',
//     runLeft: 'runLeft',
//     jumpRight: 'jumpRight',
//     jumpLeft: 'jumpLeft',
// }

// const initKeyAnimation = (name: string, key: string) => `animation_${name}_${key}`

// class Stick extends Character {
//     // #region declaration
//     private stickSprite: Phaser.Physics.Matter.Sprite | null
//     private stickAnimation: IAnimation
//     private eventListener: IEventListener
//     private fileConfig: IStickAnimationConfig
//     // #endregion

//     constructor(_this: any, name: string, fileConfig: string) {
//         super(_this, name)
//         this.fileConfig = JSON.parse(fileConfig)
//         console.log(this.fileConfig)

//         this.stickAnimation = {}
//         this.stickSprite = null
//         this.eventListener = {}
//     }

//     preload() {
//         this.game.load.spritesheet(this.name, this.fileConfig.src)
//     }

//     create() {
//         console.log(`%c\nCreate ${this.name}...\n`, 'color: red; font-size: 16px;')
//         const mainStore = useMainStore()
//         // #region init animation from config json
//         const animations = this.fileConfig.animation
//         for (const key in animations) {
//             if (animations.hasOwnProperty(key)) {
//                 const instance = animations[key]
//                 const keyAnim = initKeyAnimation(this.name, instance.key as string)
//                 this.stickAnimation[keyAnim] = this.game.anims.create({
//                     ...instance,
//                     key: keyAnim,
//                     frames: this.game.anims.generateFrameNumbers(this.name, instance.frames),
//                 })
//                 console.log(this.stickAnimation[keyAnim])
//             }
//         }
//         // #endregion

//         // #region init sprite
//         this.stickSprite = this.game.matter.add.sprite(200, 600, this.name)
//         this.stickSprite.setRectangle(
//             this.fileConfig.frame.frameWidth * 0.5,
//             this.fileConfig.frame.frameHeight * 0.5,
//         )
//         this.stickSprite.scale = 0.5
//         this.stickSprite.setBounce(0)
//         this.stickSprite.setVelocityY(1)
//         this.stickSprite.anims.play(initKeyAnimation(this.name, keyActivities.stand))
//         // #endregion

//         // #region add event
//         this.eventListener.left = this.game.input.keyboard?.addKey(
//             Phaser.Input.Keyboard.KeyCodes.LEFT,
//         )
//         this.eventListener.right = this.game.input.keyboard?.addKey(
//             Phaser.Input.Keyboard.KeyCodes.RIGHT,
//         )
//         this.eventListener.jumpUp = this.game.input.keyboard?.addKey(
//             Phaser.Input.Keyboard.KeyCodes.UP,
//         )
//         this.eventListener.jumpDown = this.game.input.keyboard?.addKey(
//             Phaser.Input.Keyboard.KeyCodes.DOWN,
//         )
//         // #endregion
//     }

//     update() {
//         // console.log(`%c\nUpdating stick ${this.name}...\n`, 'color: blue; font-size: 16px;');
//         let isEvent = false
//         const cur = this.stickSprite?.anims.currentAnim

//         if (this.eventListener.jumpUp?.isDown && this.eventListener.left?.isDown) {
//             console.log('jumpUp and left')
//             isEvent = true
//             const keyJumpLeft = initKeyAnimation(this.name, keyActivities.jumpLeft)

//             if (cur !== this.stickAnimation[keyJumpLeft]) {
//                 this.stickSprite?.setY(this.stickSprite.y - 100)
//                 this.stickSprite?.anims.play(keyJumpLeft)
//             }
//         } else if (this.eventListener.jumpUp?.isDown && this.eventListener.right?.isDown) {
//             console.log('jumpUp and right')
//             isEvent = true
//             const keyJumpRight = initKeyAnimation(this.name, keyActivities.jumpRight)

//             if (cur !== this.stickAnimation[keyJumpRight]) {
//                 this.stickSprite?.setY(this.stickSprite.y - 100)
//                 this.stickSprite?.anims.play(keyJumpRight)
//             }
//         } else {
//             if (this.eventListener.left?.isDown) {
//                 isEvent = true
//                 console.log('left')
//                 const keyAnim = initKeyAnimation(this.name, keyActivities.runLeft)
//                 if (cur !== this.stickAnimation[keyAnim]) {
//                     this.stickSprite?.anims.play(keyAnim)
//                 }
//             }
//             if (this.eventListener.right?.isDown) {
//                 isEvent = true
//                 console.log('right')
//                 const keyAnim = initKeyAnimation(this.name, keyActivities.runRight)
//                 if (cur !== this.stickAnimation[keyAnim]) {
//                     this.stickSprite?.anims.play(keyAnim)
//                 }
//             }
//         }

//         // moving
//         if (this.eventListener.left?.isDown) {
//             this.stickSprite?.setX(this.stickSprite.x - 8)
//         }

//         if (this.eventListener.right?.isDown) {
//             this.stickSprite?.setX(this.stickSprite.x + 8)
//         }

//         // recovery animation
//         const keyAnim = initKeyAnimation(this.name, keyActivities.stand)
//         if (!isEvent && cur !== this.stickAnimation[keyAnim]) {
//             this.stickSprite?.anims.play(keyAnim)
//         }
//         // to keep sprite stand
//         this.stickSprite?.setAngle(0)
//     }
// }

// export default Stick
