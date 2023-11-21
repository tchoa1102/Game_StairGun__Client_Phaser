import { Character } from '..'

import faceConfig from '@/assets/configs/face.json'
import bodyConfig from '@/assets/configs/body.json'
import footConfig from '@/assets/configs/foot.json'
import weaponConfig from '@/assets/configs/weapon.json'
import { createAnimation, initKeyAnimation } from '@/util/shares'
import type { GunGame } from '@/scenes'
import { gunService } from '@/services/socket'
import type { ILocationGunGame, IUpdateLocationGunGame } from '@/util/interface/index.interface'

export const CONSTANT = {
    scene: {
        key: 'person',
    },
    textureNotFound: '__MISSING',
    sprites: {
        face: {
            key: 'face.default',
            config: 'src/assets/configs/face.json',
            img: 'src/assets/img/equips/faces/face.default.png',
        },
        body: {
            key: 'body.default',
            config: 'src/assets/configs/body.json',
            img: 'src/assets/img/equips/bodies/body.default.png',
        },
        foot: {
            key: 'foot.default',
            config: 'src/assets/configs/foot.json',
            img: 'src/assets/img/equips/foots/foot.default.png',
        },
    },
    deeps: {
        face: 3,
        body: 2,
        foot: 1,
    },
    active: 'show',
}

class Person extends Character {
    public isKeyChangeAnimation: boolean = false
    private TO_ZERO_DEG: number = -90
    private isCurPlayer: boolean
    private configs: { [key: string]: any } = {
        face: faceConfig,
        body: bodyConfig,
        foot: footConfig,
        weapon: weaponConfig,
    }
    private sprite: {
        [key: string]: Phaser.GameObjects.Sprite | undefined
        face?: Phaser.GameObjects.Sprite
        body?: Phaser.GameObjects.Sprite
        foot?: Phaser.GameObjects.Sprite
    } = { face: undefined, body: undefined, foot: undefined }
    private weaponSprite: Phaser.GameObjects.Sprite | undefined
    private sign: number = 1
    private hpBarBorder: Phaser.GameObjects.Rectangle | undefined
    private hpBar: Phaser.GameObjects.Rectangle | undefined
    public keyActivities: Record<string, string> = {
        show: 'show',
        lieRight: 'lieRight',
        lieLeft: 'lieLeft',
        throwRight: 'throwRight',
        throwLeft: 'throwLeft',
        crawlRight: 'crawlRight',
        crawlLeft: 'crawlLeft',
    }

    private locations: Array<ILocationGunGame> = []
    private indexLocation: number = 0

    constructor(
        game: any,
        index: number,
        name: string,
        x: number,
        y: number,
        config: string,
        scale: number,
    ) {
        super(game, index, name, x, y, config, scale)
        const curPlayer = this.mainStore.getMatch.players[this.index].target
        this.isCurPlayer = curPlayer._id === this.mainStore.getPlayer._id
    }
    preload(): void {
        const looks: { [key: string]: string } = this.thisPlayer.target.looks
        // console.log(
        //     this.mainStore.getMatch.players,
        //     this.thisPlayer,
        //     looks,
        // )

        const objsSpriteConfig: any = CONSTANT.sprites
        for (const type in looks) {
            if (looks.hasOwnProperty(type)) {
                if (looks[type]) {
                    console.log('Loading texture: ', this.getNameKey(type))
                    this.game.load.atlas(this.getNameKey(type), looks[type], this.configs[type])
                } else {
                    if (objsSpriteConfig.hasOwnProperty(type)) {
                        const element = objsSpriteConfig[type]
                        this.game.load.atlas(this.getNameKey(type), element.img, this.configs[type])
                    }
                }
                // console.log(element.key)
            }
        }
    }
    create(): void {
        const configs: { [key: string]: any } = this.configs
        const looks: { [key: string]: string } = this.thisPlayer.target.looks
        // #region create key animations
        for (const key in configs) {
            if (Object.prototype.hasOwnProperty.call(configs, key)) {
                const config: { [key: string]: any } = configs[key]
                // console.log(config)
                if (looks[key]) {
                    const anim = createAnimation(this.game, this.getNameKey(key), config.animations)
                    // console.log(anim)
                } else {
                    const anim = createAnimation(this.game, this.getNameKey(key), config.animations)
                    // console.log(anim)
                }
            }
        }
        // #endregion create key animations

        // #region create obj
        this.createSprite('face')
        this.createSprite('body')
        this.createSprite('foot')

        this.hpBarBorder = this.game.add
            .rectangle(this.x!, this.y!, 100, 10, 0x000, 0.7)
            .setOrigin(0)
        this.hpBar = this.game.add
            .rectangle(
                this.x!,
                this.y!,
                (this.thisPlayer.mainGame.HP / this.thisPlayer.target.HP) * 100,
                10,
                0xd00000,
            )
            .setOrigin(0)
        this.nameText = this.game.add.text(this.x!, this.y! + 12, this.name, {
            color: 'blue',
            fontSize: '14px',
            backgroundColor: '#ffffff70',
        })
        this.nameText.setDepth(1000)

        if (looks.weapon.length > 0) {
            const rotate = this.thisPlayer.mainGame.characterAngle

            const weaponKey = this.getNameKey('weapon')
            const keyAnim = initKeyAnimation(weaponKey, 'show')
            this.weaponSprite = this.game.add
                .sprite(this.x!, this.y!, weaponKey)
                .setDepth(100000)
                .setOrigin(0, 1)
                .setRotation(Phaser.Math.DegToRad(this.TO_ZERO_DEG + rotate))
            this.weaponSprite.anims.play(keyAnim)
        }
        // #endregion create obj

        // #region add event
        this.isCurPlayer && this.addEvent()
        // #endregion add event

        console.log('Create show character successfully')
    }
    update(time: any, delta: any): void {
        // #region handle key event
        this.isCurPlayer && this.handleKeyEvent()
        // #endregion handle key event
    }
    destroy(): void {
        for (const key in this.sprite) {
            if (Object.prototype.hasOwnProperty.call(this.sprite, key)) {
                const element = this.sprite[key]
                element?.destroy()
            }
        }
        this.weaponSprite?.destroy()
        this.hpBar?.destroy()
        this.hpBarBorder?.destroy()
        this.nameText?.destroy()
    }

    getNameKey(type: string): string {
        return this.name + type
    }

    createSprite(type: string) {
        if (!!this.sprite[type]) this.sprite[type]!.destroy()
        const key: string = this.getNameKey(type)
        this.sprite[type] = this.game.add.sprite(this.x!, this.y!, key).setOrigin(0, 1)
        const deeps: Record<string, number> = CONSTANT.deeps
        if (!this.sprite[type]) return
        this.sprite[type]!.setDepth(deeps[type])
        console.log(type)
        const keyAnim = initKeyAnimation(key, this.keyActivities.lieRight)
        // console.log('Key animation: ', keyAnim)
        this.sprite[type]!.anims.play(keyAnim)
        const rotate = this.thisPlayer.mainGame.characterAngle
        // console.log('Rotation animation: ', rotate)
        this.sprite[type]!.setRotation(Phaser.Math.DegToRad(this.TO_ZERO_DEG + rotate))
    }

    updateData(data: IUpdateLocationGunGame): void {
        if (data._id !== this.thisPlayer.target._id) return
        data.data.forEach((locationInfo: ILocationGunGame) => {
            this.updateLocation({
                x: locationInfo.x,
                y: locationInfo.y,
                rotate: locationInfo.angle,
            })
            // setTimeout(() => {
            // }, locationInfo.time)
        })
    }
    addEvent(): void {
        this.eventListener.left = this.game.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.LEFT,
        )
        this.eventListener.right = this.game.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.RIGHT,
        )
    }
    updateLocation({ x, y, rotate }: { x: number; y: number; rotate: number }) {
        for (const type in this.sprite) {
            if (Object.prototype.hasOwnProperty.call(this.sprite, type)) {
                const sprite = this.sprite[type]
                this.x = x
                this.y = y
                sprite!.x = x
                sprite!.y = y
                sprite!.setRotation(Phaser.Math.DegToRad(this.TO_ZERO_DEG + rotate))
            }
        }
        this.mainStore.getMatch.players[this.index].mainGame.characterAngle = rotate * this.sign
        this.nameText!.x = x
        this.nameText!.y = y + 10
        this.hpBar!.x = x
        this.hpBar!.y = y
        this.hpBarBorder!.x = x
        this.hpBarBorder!.y = y
        this.weaponSprite!.x = x
        this.weaponSprite!.y = y
        this.weaponSprite!.setRotation(Phaser.Math.DegToRad(this.TO_ZERO_DEG + rotate))
    }
    handleKeyEvent(): void {
        let isKeyDown: boolean = false
        let keyAnim: string =
            this.sign > 0 ? this.keyActivities.lieRight : this.keyActivities.lieLeft
        const isLeftDown = this.eventListener.left && this.eventListener.left.isDown
        const isRightDown = this.eventListener.right && this.eventListener.right.isDown

        if (isLeftDown) {
            isKeyDown = true
            this.sign = -Math.abs(this.sign)
            keyAnim = this.keyActivities.crawlLeft

            const weaponKey = this.getNameKey('weapon')
            const keyAnimWeapon = initKeyAnimation(weaponKey, 'showLeft')
            this.weaponSprite?.anims.play(keyAnimWeapon)
            this.updateAnimationGunGame(keyAnim)
            // this.updateLocation({ x: this.x! - 0.5, y: this.y!, rotate: 90 })
        } else if (isRightDown) {
            isKeyDown = true
            this.sign = Math.abs(this.sign)
            keyAnim = this.keyActivities.crawlRight

            const weaponKey = this.getNameKey('weapon')
            const keyAnimWeapon = initKeyAnimation(weaponKey, 'show')
            this.weaponSprite?.anims.play(keyAnimWeapon)
            this.updateAnimationGunGame(keyAnim)
            // this.updateLocation({ x: this.x! + 0.5, y: this.y!, rotate: 90 })
        }

        if (!this.isKeyChangeAnimation && !isKeyDown && !this.isOldAnimationGunGame(keyAnim)) {
            this.updateAnimationGunGame(keyAnim)
        }

        if (!this.isKeyChangeAnimation && isKeyDown) {
            // send event to server
            try {
                ;(gunService as any)[keyAnim]()
            } catch (e) {
                // console.log(e)
            }
        }
    }

    isOldAnimationGunGame(event: string): boolean {
        const curKey = this.sprite.body!.anims.currentAnim?.key
        const key = initKeyAnimation(this.getNameKey('body'), this.keyActivities[event])
        return curKey === key
    }

    updateAnimationGunGame(event: string): boolean {
        if (!this.isOldAnimationGunGame(event)) {
            for (const type in this.sprite) {
                if (Object.prototype.hasOwnProperty.call(this.sprite, type)) {
                    const sprite = this.sprite[type]
                    const key = initKeyAnimation(this.getNameKey(type), this.keyActivities[event])
                    sprite?.anims.play(key)
                }
            }
            return true
        }

        return false
    }
}

export default Person
