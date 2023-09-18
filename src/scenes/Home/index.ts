import BootDuel from '../BootGame/bootDuel'

class Home extends Phaser.Scene {
    private statesScreen: Array<string>
    constructor() {
        super('home')
        this.statesScreen = []
    }

    preload() {
        this.load.image('home-background', 'src/assets/home-1480x740.png')
    }

    create() {
        const background = this.add.image(0, 0, 'home-background')
        background.setOrigin(0)
        this.physics.pause()

        // #region create polygon building
        const duelBuilding = this.add.polygon(
            0,
            0,
            [
                890, 191, 964, 166, 1026, 170, 1106, 192, 1127, 297, 1104, 346, 898, 349, 861, 293,
                867, 202,
            ],
            // 0xfff0,
        )
        duelBuilding.setOrigin(0)
        const shoppingBuilding = this.add.polygon(
            0,
            0,
            [
                296, 211, 357, 187, 395, 247, 430, 170, 470, 226, 514, 241, 521, 264, 569, 182, 529,
                156, 504, 120, 507, 91, 542, 67, 623, 86, 643, 122, 615, 168, 574, 173, 598, 201,
                636, 201, 617, 241, 699, 297, 734, 347, 451, 458, 209, 350, 236, 302, 312, 245, 298,
                210,
            ],
            // 0xfff0,
        )
        shoppingBuilding.setOrigin(0)
        // #endregion

        // #region add event
        var zone = this.add.zone(0, 0, 2960, 1480)
        zone.setInteractive()
        zone.on('pointerdown', (pointer: any) => {
            var x = pointer.x
            var y = pointer.y
            // console.log(x, y)
            if (
                this.statesScreen.length === 0 &&
                Phaser.Geom.Polygon.Contains(duelBuilding.geom, x, y)
            ) {
                console.log('Duel building clicked!')

                this.openScene('bootDuel')
            }
            if (
                this.statesScreen.length === 0 &&
                Phaser.Geom.Polygon.Contains(shoppingBuilding.geom, x, y)
            ) {
                console.log('Shopping building clicked!')
            }
        })
        // #endregion
    }

    update() {
        // console.log('a')
    }

    openScene(key: string) {
        let sceneConfig: any = null
        switch (key) {
            case 'bootDuel': {
                sceneConfig = BootDuel
                break
            }
        }
        if (sceneConfig) {
            this.statesScreen.push(key)
            try {
                this.scene.add(key, sceneConfig, true)
            } catch (error) {
                console.log(error)

                this.scene.setVisible(true, key)
            }
            // this.scene.bringToTop(key)
        }
    }

    visibleScene(key: string) {
        console.log(key)

        this.statesScreen.pop()
        this.scene.setVisible(false, key)
    }
}

export default Home
