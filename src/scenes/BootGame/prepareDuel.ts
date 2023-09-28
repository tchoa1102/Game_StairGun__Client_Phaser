import { useMainStore } from '@/stores'
import Phaser from 'phaser'

const CONSTANTS = {
    keyScene: 'prepareDuel',
    goOut: 'src/assets/bye.png',
    background:
        'https://res.cloudinary.com/dyhfvkzag/image/upload/v1694967915/StairGunGame/gunGame/boot/bootDuel-background-2.png',
}

class PrepareDuel extends Phaser.Scene {
    public MAX_WIDTH: number
    public MAX_HEIGHT: number

    private section: Phaser.GameObjects.DOMElement | undefined
    constructor() {
        super(CONSTANTS.keyScene)
        const mainStore: any = useMainStore()
        this.MAX_WIDTH = mainStore.getWidth * mainStore.zoom
        this.MAX_HEIGHT = mainStore.getHeight * mainStore.zoom
    }

    init() {}

    preload() {
        console.log('%c\nLoading...\n', 'color: yellow; font-size: 16px;')
        this.load.image(`${CONSTANTS.keyScene}-background`, CONSTANTS.background)
    }

    create() {
        console.log('%c\nCreate...\n', 'color: red; font-size: 16px;')
        this.physics.world.setBounds(0, 0, this.MAX_WIDTH, this.MAX_HEIGHT)
        this.physics.pause()

        // const background = this.add.image(0, 0, `${CONSTANTS.keyScene}-background`).setOrigin(0)

        // #region dom
        this.section = this.add.dom(0, 0, 'section').setOrigin(0)
        this.createInterfaceDOM()
        // #endregion dom
        // #region create button functionality
        const sectionFuncBottomRight = this.add
            .dom(1480, 700, 'section', {
                'padding-right': '50px',
            })
            .setOrigin(1) // render from bottom-right to left
        const backButton = this.add
            .dom(0, -55, 'div', {
                width: '50px',
                height: '50px',
                'background-image': `url(${CONSTANTS.goOut})`,
            })
            .addListener('click')
            .on('click', () => {
                this.section!.node.classList.add('d-none')
                ;(this.scene.get('home') as any).visibleScene(`${CONSTANTS.keyScene}`)
            })
        sectionFuncBottomRight.node.appendChild(backButton.node)
        this.section.node.appendChild(sectionFuncBottomRight.node)
        // #endregion create button functionality
    }

    update() {
        // console.log('bootGame')
        if (
            this.scene.isVisible(`${CONSTANTS.keyScene}`) &&
            this.section!.node.className.includes('d-none')
        ) {
            this.section!.node.classList.remove('d-none')
        }
    }

    createInterfaceDOM() {
        const section = this.add
            .dom(0, 0, 'section', {
                width: '1480px',
                height: '740px',
                background: 'linear-gradient(180deg, #63390F 0%, #4E2905 8%)',
                border: '4px #A87123 solid',
            })
            .setOrigin(0)
        const createPlayerDom = () => {}
        const divBackground = this.add
            .dom(0, 0, 'div', {
                width: '1460px',
                height: '720px',
                margin: 'calc(10px - 4px)', // subtract border section
                background: 'linear-gradient(0deg, #424D73 0%, #424D73 100%)',
                'box-shadow': '0px 0px 50px rgba(0, 0, 0, 0.90) inset',
                'border-radius': '10px',
            })
            .setOrigin(0)
        const content = this.add
            .dom(0, 0, 'div', {
                width: '1460px',
                height: '720px',
            })
            .setOrigin(0)
        const listPlayerContainer = this.add
            .dom(0, 0, 'div', {
                background: '#986641',
            })
            .setOrigin(0)
        listPlayerContainer.node.classList.add('listPlayer')
        listPlayerContainer.node.classList.add('position-relative')
        listPlayerContainer.node.classList.add('d-flex')
        const teamA = this.createTeamDOM('rgba(255, 0, 0, 0.50)')
        const teamB = this.createTeamDOM('rgba(0, 132.60, 255, 0.50)')

        for (let i of [1, 2, 3]) {
            const player = this.createPlayerDOM()
            teamA.node.append(player.node)
        }

        listPlayerContainer.node.append(teamA.node, teamB.node)
        content.node.appendChild(listPlayerContainer.node)
        divBackground.node.appendChild(content.node)
        section.node.appendChild(divBackground.node)
        this.section?.node.append(section.node)
    }

    // #region create DOM
    createTeamDOM(background: string) {
        const team = this.add
            .dom(0, 0, 'div', {
                background,
            })
            .setOrigin(0)
        team.node.classList.add('listPlayer__team')
        team.node.classList.add('position-relative')
        team.node.classList.add('d-flex')
        return team
    }

    createPlayerDOM() {
        const player = this.add
            .dom(0, 0, 'div', {
                background:
                    'linear-gradient(180deg, rgba(254.79, 211.58, 58.39, 0.50) 0%, #9A7B2B 97%)',
            })
            .setOrigin(0)
        player.node.classList.add('d-flex')
        player.node.classList.add('player')
        player.node.classList.add('position-relative')

        const header = this.add.dom(0, 0, 'div').setOrigin(0)
        header.node.classList.add('player__header')
        const playerName = this.add.dom(0, 0, 'div', {}, 'ABCBABA')
        playerName.node.classList.add('player__header-name')

        const body = this.add.dom(0, 0, 'div', {
            width: '204px',
            height: '190px',
            position: 'relative',
            background: '#F7E7C9',
            'border-radius': '10px',
        })

        player.node.append(header.node, body.node)
        return player
    }
    // #endregion create DOM

    render() {
        console.log('%c\nRendering...\n', 'color: #363; font-size: 16px;')
    }
}

export default PrepareDuel
