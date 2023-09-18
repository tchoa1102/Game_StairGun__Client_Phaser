import { useMainStore } from '@/stores'
import Phaser from 'phaser'

const CONSTANTS = {
    goOut: 'src/assets/bye.png',
    background:
        'https://res.cloudinary.com/dyhfvkzag/image/upload/v1694967915/StairGunGame/gunGame/boot/bootDuel-background.png',
}

class BootDuel extends Phaser.Scene {
    public MAX_WIDTH: number
    public MAX_HEIGHT: number

    private section: Phaser.GameObjects.DOMElement | undefined
    constructor() {
        super('bootDuel')
        const mainStore: any = useMainStore()
        this.MAX_WIDTH = mainStore.getWidth * mainStore.zoom
        this.MAX_HEIGHT = mainStore.getHeight * mainStore.zoom
    }

    init() {}

    preload() {
        console.log('%c\nLoading...\n', 'color: yellow; font-size: 16px;')
        this.load.image('bootDuel-background', CONSTANTS.background)
    }

    create() {
        console.log('%c\nCreate...\n', 'color: red; font-size: 16px;')
        this.physics.world.setBounds(0, 0, this.MAX_WIDTH, this.MAX_HEIGHT)
        this.physics.pause()

        const background = this.add.image(0, 0, 'bootDuel-background')
        background.setOrigin(0)

        this.section = this.add.dom(0, 0, 'section')
        const backButton = this.add
            .dom(300, 400, 'div', {
                width: '50px',
                height: '50px',
                // background: 'red',
                'background-image': `url(${CONSTANTS.goOut})`,
                color: '#fff',
                'font-size': '16px Arial',
            })
            .addListener('click')
            .on('click', () => {
                this.section!.node.classList.add('d-none')
                ;(this.scene.get('home') as any).visibleScene('bootDuel')
            })
        this.section.node.appendChild(backButton.node)
    }

    update() {
        // console.log('bootGame')
        if (this.scene.isVisible('bootDuel') && this.section!.node.className.includes('d-none')) {
            this.section!.node.classList.remove('d-none')
        }
    }

    render() {
        console.log('%c\nRendering...\n', 'color: #363; font-size: 16px;')
    }
}

export default BootDuel
