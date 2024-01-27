import { Character } from '..'

import CONSTANT_HOME from '@/scenes/Home/CONSTANT'
import { createAnimation, initKeyAnimation } from '@/util/shares'
import type { GunGame } from '@/scenes'
import { gunService } from '@/services/socket'
import type {
    IGunRes,
    ILocationGunGame,
    IUpdateLocationGunGame,
} from '@/util/interface/index.interface'

export const CONSTANT = {
    size: {
        width: 90,
        height: 90,
    },
    scene: {
        key: 'person',
    },
    textureNotFound: '__MISSING',
    sprites: CONSTANT_HOME.sprites,
    deeps: CONSTANT_HOME.deeps,
    active: 'show',
}

class Person extends Character {
    public isKeyChangeAnimation: boolean = false
    private TO_ZERO_DEG: number = -90
    private isCurPlayer: boolean
    private configs: { [key: string]: any } = {
        face: CONSTANT.sprites.face.config,
        body: CONSTANT.sprites.body.config,
        foot: CONSTANT.sprites.foot.config,
        weapon: CONSTANT_HOME.weaponConfig,
    }
    private sprite: {
        [key: string]: Phaser.GameObjects.Sprite | undefined
        face?: Phaser.GameObjects.Sprite
        body?: Phaser.GameObjects.Sprite
        foot?: Phaser.GameObjects.Sprite
    } = { face: undefined, body: undefined, foot: undefined }
    private weaponSprite: Phaser.GameObjects.Sprite | undefined
    private sign: number = 1
    private isThrow: boolean = false
    private hpBarBorder: Phaser.GameObjects.Rectangle | undefined
    private hpBar: Phaser.GameObjects.Rectangle | undefined
    private skillContainer: Phaser.GameObjects.Container | undefined
    // private usedBar:
    public keyActivities: Record<string, string> = {
        show: 'show',
        lieRight: 'lieRight',
        lieLeft: 'lieLeft',
        throwRight: 'throwRight',
        throwLeft: 'throwLeft',
        crawlRight: 'crawlRight',
        crawlLeft: 'crawlLeft',
    }

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
    create(): typeof this {
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

        const isBlueTeam = this.thisPlayer.position < 3 ? 0 : 1
        const colorName = ['blue', 'red']
        this.hpBarBorder = this.game.add
            .rectangle(this.x!, this.y! + 5, 100, 10, 0x000, 0.7)
            .setOrigin(0)
        this.hpBar = this.game.add
            .rectangle(
                this.x!,
                this.y! + 5,
                (this.thisPlayer.mainGame.HP / this.thisPlayer.target.HP) * 100,
                10,
                0xd00000,
            )
            .setOrigin(0)
        this.nameText = this.game.add.text(this.x!, this.y! + 17, this.name, {
            color: colorName[isBlueTeam],
            fontSize: '14px',
            fontStyle: 'bold',
            // backgroundColor: '#ffffff70',
        })
        this.nameText.setDepth(1000)

        if (looks.weapon.length > 0) {
            const rotate = this.thisPlayer.mainGame.characterGradient

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

        if (this.x && this.y) {
            this.skillContainer = this.game.add.container(this.x, this.y - 140, [])
            this.skillContainer.x += CONSTANT.size.width / 2
        }

        return this
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
    hiddenWeapon(): void {
        this.weaponSprite && this.weaponSprite.setVisible(false)
    }
    showWeapon(): void {
        this.weaponSprite && this.weaponSprite.setVisible(true)
    }
    addItemSkillShow(id: string): void {
        if (!this.skillContainer) return
        const card = this.game.add.image(0, 0, id)
        card.scaleX = 30.5 / card.width
        card.scaleY = 44 / card.height
        card.name = id
        // const text = this.game.add.text(0, 0, 'HA', { backgroundColor: '#000' })
        const last = this.skillContainer.last
        if (last) {
            // console.log('This last: ', last)
            const data = last as Phaser.GameObjects.Image
            if (data) {
                card.x = data.x + data.width * data.scaleX + 4
            }
        }
        this.skillContainer.add(card)
        this.skillContainer.x -= (card.width * card.scaleX) / 2
    }
    clearItemsShowSkill(): void {
        if (!this.skillContainer) return
        this.skillContainer.removeAll(true)
        if (!this.x) return
        this.skillContainer.x = this.x + CONSTANT.size.width / 2
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
        const rotate = this.thisPlayer.mainGame.characterGradient
        // console.log('Rotation animation: ', rotate)
        this.sprite[type]!.setRotation(Phaser.Math.DegToRad(this.TO_ZERO_DEG + rotate))
    }

    changeAnimation(type: string = 'lie') {
        let s = 'Left'
        if (this.sign === 1) s = 'Right'
        const t = type + s
        for (const keyType in this.sprite) {
            if (Object.prototype.hasOwnProperty.call(this.sprite, keyType)) {
                const element = this.sprite[keyType]
                const key: string = this.getNameKey(keyType)
                const animationKey = initKeyAnimation(key, this.keyActivities[t])
                element?.anims.play(animationKey)
                element?.once('animationcomplete', (animation: any, frame: any) => {
                    if (animation.key === animationKey) {
                        console.log('End animation')
                        this.isThrow = false
                    }
                })
            }
        }
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
            this.updateAnimationGunGame(data.eventKey)
        })
    }
    updateHP(newHP: number) {
        if (!this.hpBar) return
        this.hpBar.width = (newHP / this.thisPlayer.target.HP) * 100
    }
    addDamageDisplay(damage: number): typeof this {
        let fz = 14
        const text = this.game.add.text(this.x + 90, this.y - 70, damage.toFixed(0), {
            fontSize: fz + 'px',
            color: 'red',
            fontStyle: 'bold',
        })
        let t = 0
        const inter = setInterval(() => {
            if (fz >= 16) {
                clearInterval(inter)
                setTimeout(() => {
                    text.destroy()
                }, 500)
            }
            fz += 0.04
            text.setFontSize(fz)
            text.setPosition(text.x + 0.1, text.y - 0.1)
            t += 5
            // console.log(t, fz)
        }, 1)
        return this
    }
    handleGun(data: IGunRes, listPerson: Array<Person>) {
        console.log(data)
        let i = 0
        this.hiddenWeapon()
        // #region create weapon
        const weaponKey = this.getNameKey('weapon')
        const keyAnim = initKeyAnimation(weaponKey, 'throw')
        const weaponSprite = this.game.add
            .sprite(this.x!, this.y!, weaponKey)
            .setDepth(100000)
            .setOrigin(0, 1)
        weaponSprite.anims.play(keyAnim)
        this.isThrow = true
        this.changeAnimation('throw')
        // #region create weapon
        const interval = setInterval(() => {
            if (i >= data.bullets.length) {
                clearInterval(interval)
                this.showWeapon()
                weaponSprite.anims.play(initKeyAnimation(weaponKey, 'explosion'))

                data.players.forEach((p) => {
                    const thisPerson = listPerson.find(
                        (person) => person.thisPlayer.target._id === p.target,
                    )
                    if (!thisPerson) return
                    p.damages.forEach((d) => thisPerson.addDamageDisplay(d))
                    thisPerson.updateHP(p.HP)
                })

                weaponSprite.on('animationcomplete', (animation: any, frame: any) => {
                    if (animation.key === initKeyAnimation(weaponKey, 'explosion')) {
                        weaponSprite.destroy()
                    }
                })

                return
            }
            weaponSprite
                .setRotation(Phaser.Math.DegToRad(-this.TO_ZERO_DEG + data.bullets[i].angle))
                .setPosition(data.bullets[i].point.x, data.bullets[i].point.y)
            i++
        }, 5)
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
        console.log('Location update: ', { x, y: y, rotate })
        if ((!x && x !== 0) || (!y && y !== 0) || (!rotate && rotate !== 0)) return
        for (const type in this.sprite) {
            if (Object.prototype.hasOwnProperty.call(this.sprite, type)) {
                const sprite = this.sprite[type]
                this.x = x
                this.y = Math.abs(y)
                sprite!.x = x
                sprite!.y = Math.abs(y)
                sprite!.setRotation(Phaser.Math.DegToRad(this.TO_ZERO_DEG + rotate))
            }
        }
        this.mainStore.getMatch.players[this.index].mainGame.characterGradient = rotate * this.sign
        this.nameText!.x = x
        this.nameText!.y = Math.abs(y) + 17
        this.hpBar!.x = x
        this.hpBar!.y = Math.abs(y) + 5
        this.hpBarBorder!.x = x
        this.hpBarBorder!.y = Math.abs(y) + 5
        this.weaponSprite!.x = x
        this.weaponSprite!.y = Math.abs(y)
        this.weaponSprite!.setRotation(Phaser.Math.DegToRad(this.TO_ZERO_DEG + rotate))
        if (!this.skillContainer) return
        this.skillContainer.x = x + CONSTANT.size.width / 2
        const last = this.skillContainer.last
        if (last) {
            console.log('This last: ', last)
            const data = last as Phaser.GameObjects.Text
            if (data) {
                this.skillContainer.x -= (data.x + data.width) / 2
            }
        }
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
            // this.updateAnimationGunGame(keyAnim)
            // this.updateLocation({ x: this.x! - 0.5, y: this.y!, rotate: 90 })
        } else if (isRightDown) {
            isKeyDown = true
            this.sign = Math.abs(this.sign)
            keyAnim = this.keyActivities.crawlRight

            const weaponKey = this.getNameKey('weapon')
            const keyAnimWeapon = initKeyAnimation(weaponKey, 'show')
            this.weaponSprite?.anims.play(keyAnimWeapon)
            // this.updateAnimationGunGame(keyAnim)
            // this.updateLocation({ x: this.x! + 0.5, y: this.y!, rotate: 90 })
        }

        if (!isKeyDown && !this.isOldAnimationGunGame(keyAnim) && !this.isThrow) {
            // console.log('lie')
            try {
                gunService.lie(keyAnim)
            } catch (e) {
                // console.log(e)
            }
        }

        if (isKeyDown) {
            // send event to server
            try {
                ;(gunService as any)[keyAnim]()
            } catch (e) {
                // console.log(e)
            }
        }
    }

    isOldAnimationGunGame(event: string): boolean {
        if (this.sprite.body) {
            const curKey = this.sprite.body!.anims.currentAnim?.key
            const key = initKeyAnimation(this.getNameKey('body'), this.keyActivities[event])
            // console.log(curKey, key, curKey === key)
            return curKey === key
        }
        return true
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
