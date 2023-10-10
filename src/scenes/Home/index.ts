import BoardListRoom from '@/components/boards/listRoom.board'
import { siteService } from '@/services/socket'
import PrepareDuel from '../BootGame/prepareDuel'
import BaseScene from '../baseScene'
import BtnFunc from '@/components/btnFunc'
import CONSTANT_HOME from './CONSTANT'
import { useMainStore } from '@/stores'
import FETCH from '@/services/fetchConfig.service'
import { createAnimation, initKeyAnimation, toast } from '@/util/shares'
import matchService from '@/services/socket/match.service'
import type { IMatchRes } from '@/util/interface/index.interface'
import GamePlay from '../GamePLay'

const dRaw = {
    _id: '6524e41260f8d49b7c1c464c',
    stairs: [
        {
            x: 471.4174885316667,
            y: 3258.671727511827,
            width: 394.30696459340544,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4616',
        },
        {
            x: 268.72711514422883,
            y: 882.1443381719884,
            width: 476.35123929060074,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4617',
        },
        {
            x: 165.60866091606547,
            y: 314.42944690753876,
            width: 309.8490706766214,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4618',
        },
        {
            x: 110.88534145119353,
            y: 974.6175690275737,
            width: 231.35073076764883,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4619',
        },
        {
            x: 494.122543364859,
            y: 3294.019813469646,
            width: 244.22142400180036,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c461a',
        },
        {
            x: 362.09213632198015,
            y: 1578.054625646785,
            width: 417.8376064832299,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c461b',
        },
        {
            x: 64.62987243301457,
            y: 2953.6326217839505,
            width: 270.4447461092685,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c461c',
        },
        {
            x: 574.923188984212,
            y: 2288.606494348548,
            width: 403.8562868524459,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c461d',
        },
        {
            x: 416.21460731518584,
            y: 588.7626465709477,
            width: 323.66278266820433,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c461e',
        },
        {
            x: 223.8659267654807,
            y: 2211.031388340483,
            width: 320.03664413147635,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c461f',
        },
        {
            x: 559.5742403363388,
            y: 302.2041760196145,
            width: 421.47084791500794,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4620',
        },
        {
            x: 352.7226973282126,
            y: 416.87345157350524,
            width: 385.6203633990407,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4621',
        },
        {
            x: 856.2376874945384,
            y: 1896.6429177974273,
            width: 232.0956336624553,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4622',
        },
        {
            x: 672.2587275178112,
            y: 1760.9572424519367,
            width: 215.75261087179058,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4623',
        },
        {
            x: 278.2203874281791,
            y: 1638.686949323012,
            width: 408.3680642362088,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4624',
        },
        {
            x: 576.0775188413635,
            y: 1881.4098061780992,
            width: 281.26157330896206,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4625',
        },
        {
            x: 780.9933661507648,
            y: 3242.7097072505226,
            width: 347.17634825469236,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4626',
        },
        {
            x: 582.3361230316481,
            y: 2612.6697010880175,
            width: 224.33454592874264,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4627',
        },
        {
            x: 866.3103442891532,
            y: 1814.2020762253342,
            width: 333.5672359032794,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4628',
        },
        {
            x: 869.9430238915045,
            y: 3063.840358171625,
            width: 442.5057732332173,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4629',
        },
        {
            x: 313.9377838790796,
            y: 736.0771018887662,
            width: 314.04011628331307,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c462a',
        },
        {
            x: 624.8954205614274,
            y: 3157.1375659895693,
            width: 469.0050393950757,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c462b',
        },
        {
            x: 694.129783994178,
            y: 2811.424059616343,
            width: 381.52398883586113,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c462c',
        },
        {
            x: 547.5022008991666,
            y: 2754.3444155183015,
            width: 169.72552531062092,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c462d',
        },
        {
            x: 840.2443503563906,
            y: 2654.461272691268,
            width: 406.7377356083406,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c462e',
        },
        {
            x: 330.4029003623605,
            y: 3251.699517217718,
            width: 365.1737001486961,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c462f',
        },
        {
            x: 278.66171235447166,
            y: 615.2276986824136,
            width: 446.47595801299536,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4630',
        },
        {
            x: 236.39293892326123,
            y: 2907.0868331799766,
            width: 392.16556238937636,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4631',
        },
        {
            x: 869.6585948109622,
            y: 2022.6114902828374,
            width: 378.31216740583284,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4632',
        },
        {
            x: 493.63965236863226,
            y: 1143.7735370558516,
            width: 131.36236401316106,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4633',
        },
        {
            x: 210.63361886514394,
            y: 759.8035594227346,
            width: 469.8692874737326,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4634',
        },
        {
            x: 512.8449522962483,
            y: 3275.3164182956007,
            width: 449.9760991262838,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4635',
        },
        {
            x: 173.45158819306988,
            y: 832.1331623760026,
            width: 185.677402246555,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4636',
        },
        {
            x: 478.706766523336,
            y: 1951.7671943585026,
            width: 427.7118111980376,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4637',
        },
        {
            x: 255.57632887447213,
            y: 687.9671051610219,
            width: 423.08968494051726,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4638',
        },
        {
            x: 239.49787805635268,
            y: 3090.8008560738576,
            width: 252.37560424487117,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4639',
        },
        {
            x: 603.710789981921,
            y: 2632.4226974035328,
            width: 494.18356219313955,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c463a',
        },
        {
            x: 561.0334247160857,
            y: 2352.172041065751,
            width: 449.3007040096668,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c463b',
        },
        {
            x: 352.136613594976,
            y: 2275.000318069791,
            width: 467.6891259568124,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c463c',
        },
        {
            x: 16.17440166659023,
            y: 1302.339950758435,
            width: 483.93632044972605,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c463d',
        },
        {
            x: 679.4860679100898,
            y: 1143.948197734286,
            width: 390.94342797013917,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c463e',
        },
        {
            x: 861.9969161080762,
            y: 1720.828929893199,
            width: 163.34837112246356,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c463f',
        },
        {
            x: 627.3693727792968,
            y: 1708.931630022779,
            width: 368.38184144371604,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4640',
        },
        {
            x: 605.2273543911651,
            y: 706.968204654083,
            width: 141.97548936651458,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4641',
        },
        {
            x: 213.21065839622145,
            y: 560.9848097838469,
            width: 201.82651574001056,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4642',
        },
        {
            x: 577.2156900321986,
            y: 2207.3458658371956,
            width: 347.3306992400195,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4643',
        },
        {
            x: 133.12174850209792,
            y: 3001.1360733775946,
            width: 161.82766584447688,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4644',
        },
        {
            x: 727.2476813634304,
            y: 907.080987727953,
            width: 311.1093172329274,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4645',
        },
        {
            x: 673.169401320031,
            y: 1451.957190939258,
            width: 140.42753666778617,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4646',
        },
        {
            x: 798.6694570662587,
            y: 3130.3711806422184,
            width: 255.9398053178124,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            _id: '6524e41260f8d49b7c1c4647',
        },
    ],
    players: [
        {
            target: { _id: '115421543287322673156111' },
            position: 0,
            mainGame: {
                x: '10',
                y: '10',
                hp: '0',
                sta: 0,
                atk: '0',
                def: '0',
                luk: '0',
                agi: '0',
                power_point: 0,
                stateEffects: [],
                _id: '6524e41260f8d49b7c1c4680',
            },
            stairGame: {
                x: '836.3327146006292',
                y: '3200',
                vx: '0',
                vy: '0',
                _id: '6524e41260f8d49b7c1c4681',
            },
            _id: '6524e41260f8d49b7c1c467f',
        },
        {
            target: { _id: '103339144746729860355111' },
            position: 3,
            mainGame: {
                x: '10',
                y: '10',
                hp: '0',
                sta: 0,
                atk: '0',
                def: '0',
                luk: '0',
                agi: '0',
                power_point: 0,
                stateEffects: [],
                _id: '6524e41260f8d49b7c1c4683',
            },
            stairGame: { x: '850', y: '3200', vx: '0', vy: '0', _id: '6524e41260f8d49b7c1c4684' },
            _id: '6524e41260f8d49b7c1c4682',
        },
    ],
    cards: [],
    stickConfig:
        'https://res.cloudinary.com/dyhfvkzag/raw/upload/v1/StairGunGame/stairGame/sticks/circleStickAtlas.json',
    tiledMapConfig:
        'https://res.cloudinary.com/dyhfvkzag/raw/upload/v1694914832/StairGunGame/gunGame/map/gift-box/jad4fknwl65zxihqzyav.json',
}
const dataRes: IMatchRes = JSON.parse(JSON.stringify(dRaw))

class Home extends BaseScene {
    // #region declarations
    public DOMElement: {
        boardListRoom: BoardListRoom | undefined
    }
    public gamePlay: GamePlay | undefined

    private configDefault: Array<any>
    private statesScreen: Array<string>
    private section: Phaser.GameObjects.DOMElement | undefined
    private duelBuilding: Phaser.GameObjects.Polygon | undefined
    private shoppingBuilding: Phaser.GameObjects.Polygon | undefined
    // #endregion declarations
    constructor() {
        super(CONSTANT_HOME.key.home)
        this.statesScreen = []
        this.DOMElement = {
            boardListRoom: undefined,
        }
        this.configDefault = []
    }

    async preload() {
        const mainStore: any = useMainStore()
        this.load.image(CONSTANT_HOME.background.key, CONSTANT_HOME.background.src)

        // #region load skin
        const looks: { [key: string]: string } = mainStore.getPlayer.looks
        for (const key in looks) {
            if (looks.hasOwnProperty(key)) {
                const srcConfig = looks[key]
                const config: any = await FETCH(srcConfig)
                this.configDefault.push(config)
                localStorage.setItem(config.meta.name, JSON.stringify(config))

                this.load.atlas(config.meta.name, config.src[0], config)
            }
        }
        // #endregion load skin
    }

    create() {
        const background = this.add.image(0, 0, CONSTANT_HOME.background.key)
        background.setOrigin(0)
        this.physics.pause()

        // #region listening socket
        this.listeningSocket()
        // #endregion listening socket

        // #region create body default
        this.configDefault.forEach((config) => {
            createAnimation(this, config.meta.name, config.animations)
        })
        // #endregion create body default

        // #region DOM
        this.section = this.createContainer('section', {}).setOrigin(0)
        this.section.node.classList.remove('d-flex')
        this.section.node.classList.add('home')

        // #region create board
        this.DOMElement.boardListRoom = new BoardListRoom(this)
        this.DOMElement.boardListRoom.setCallbackExit(() =>
            this.closeBoard(this.DOMElement.boardListRoom),
        )
        this.DOMElement.boardListRoom.hidden()
        // #endregion create board

        // #region create button functionality
        const sectionFuncBottomRight = new BtnFunc(this).createFuncMain()
        this.section.node.appendChild(sectionFuncBottomRight.node)
        // #endregion create button functionality
        // #endregion DOM

        // #region create polygon building
        this.duelBuilding = this.add.polygon(0, 0, CONSTANT_HOME.building.duel).setOrigin(0)
        this.shoppingBuilding = this.add.polygon(0, 0, CONSTANT_HOME.building.shopping).setOrigin(0)
        // #endregion

        // #region add event
        var zone = this.add.zone(0, 0, 2960, 1480)
        zone.setInteractive()
        zone.on('pointerdown', this.handleClickBuilding.bind(this))
        // #endregion

        // const prepareDuelScene = this.scene.add(CONSTANT_HOME.key.prepareDuel, PrepareDuel, true)
        // if (prepareDuelScene) {
        //     this.visibleScene(prepareDuelScene.scene.key)
        // }

        const section = this.createContainer('section', {})
        section.node.setAttribute('id', 'game-container')
        section.node.classList.add('position-absolute')
        const main = document.querySelector('#game')
        main?.append(section.node)
        const mainStore: any = useMainStore()
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: mainStore.getWidth * mainStore.zoom,
            height: mainStore.getHeight * mainStore.zoom,
            parent: section.node as HTMLElement,
            // transparent: true,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: true,
                },
            },
        }
        const game = new Phaser.Game(config)
        this.gamePlay = game.scene.add('game-play-scene', GamePlay, true, {
            data: dataRes,
        }) as GamePlay
    }

    update() {
        // console.log(this.statesScreen)
        if (this.statesScreen.length === 0) {
            this.section?.node.classList.remove('d-none')
            for (let dom in this.DOMElement) {
                if (this.DOMElement.hasOwnProperty(dom)) {
                    ;(this.DOMElement as any)[dom].update()
                }
            }
        }
    }

    openBoard(board: any) {
        board.show()
        this.statesScreen.push(board.name)
    }

    closeBoard(board: any) {
        board.hidden()
        this.statesScreen = this.statesScreen.filter(
            (state: string, index: number) => state !== board.name,
        )
    }

    openScene(key: string) {
        console.log(this.scene.get(key).scene.isVisible(key))

        if (this.scene.get(key).scene.isVisible(key)!) return
        let sceneConfig: any = null
        switch (key) {
            case CONSTANT_HOME.key.prepareDuel: {
                sceneConfig = PrepareDuel
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
        }
    }

    visibleScene(key: string) {
        console.log(key)

        this.statesScreen.pop()
        this.scene.setVisible(false, key)
    }

    // #region listening socket
    listeningSocket() {
        siteService.listeningError(({ status, message }: { status: number; message: string }) => {
            toast({ message, status })
        })

        matchService.listeningCreateMatch((data: IMatchRes) => {
            console.log(JSON.stringify(data))

            // const section = this.createContainer('section', {})
            // section.node.setAttribute('id', 'game-container')
            // section.node.classList.add('position-absolute')
            // const main = document.querySelector('#game')
            // main?.append(section.node)
            // const mainStore: any = useMainStore()
            // const config: Phaser.Types.Core.GameConfig = {
            //     type: Phaser.AUTO,
            //     width: mainStore.getWidth * mainStore.zoom,
            //     height: mainStore.getHeight * mainStore.zoom,
            //     parent: section.node as HTMLElement,
            //     // transparent: true,
            //     physics: {
            //         default: 'arcade',
            //         arcade: {
            //             debug: true,
            //         },
            //     },
            // }
            // const game = new Phaser.Game(config)
            // this.gamePlay = game.scene.add('game-play-scene', GamePlay, true, {
            //     data,
            // }) as GamePlay
            // console.log('Game play')
        })
    }
    // #endregion listening socket

    // #region handle events
    handleClickBuilding(pointer: any) {
        var x = pointer.x
        var y = pointer.y
        // console.log(x, y)
        if (
            this.statesScreen.length === 0 &&
            Phaser.Geom.Polygon.Contains(this.duelBuilding!.geom, x, y)
        ) {
            console.log('Duel building clicked!')
            this.openBoard(this.DOMElement.boardListRoom)
        }
        if (
            this.statesScreen.length === 0 &&
            Phaser.Geom.Polygon.Contains(this.shoppingBuilding!.geom, x, y)
        ) {
            console.log('Shopping building clicked!')
        }
    }
    // #endregion handle events
}

export default Home
