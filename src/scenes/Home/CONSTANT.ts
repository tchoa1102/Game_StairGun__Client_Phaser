import faceConfig from '@/configs/face.json'
import bodyConfig from '@/configs/body.json'
import footConfig from '@/configs/foot.json'
import weaponConfig from '@/configs/weapon.json'
import imgFaceDefault from '@/assets/img/equips/faces/face.default.png'
import imgBodyDefault from '@/assets/img/equips/bodies/body.default.png'
import imgFootDefault from '@/assets/img/equips/foots/foot.default.png'
console.log('Image', imgFaceDefault, imgFootDefault)

import backgroundHome from '@/assets/home-1480x740.png'

const CONSTANT_HOME = {
    key: {
        home: 'home-scene',
        prepareDuel: 'prepare-duel-scene',
        stairGame: 'stair-game-scene',
        gunGame: 'gun-game-scene',
    },
    background: {
        key: 'home-background',
        src: backgroundHome,
    },
    loading: {
        key: 'loading',
        src: 'src/assets/loading.png',
    },
    building: {
        duel: [
            890, 191, 964, 166, 1026, 170, 1106, 192, 1127, 297, 1104, 346, 898, 349, 861, 293, 867,
            202,
        ],
        shopping: [
            296, 211, 357, 187, 395, 247, 430, 170, 470, 226, 514, 241, 521, 264, 569, 182, 529,
            156, 504, 120, 507, 91, 542, 67, 623, 86, 643, 122, 615, 168, 574, 173, 598, 201, 636,
            201, 617, 241, 699, 297, 734, 347, 451, 458, 209, 350, 236, 302, 312, 245, 298, 210,
        ],
    },
    sprites: {
        face: {
            key: 'face.default',
            config: faceConfig,
            img: imgFaceDefault,
        },
        body: {
            key: 'body.default',
            config: bodyConfig,
            img: imgBodyDefault,
        },
        foot: {
            key: 'foot.default',
            config: footConfig,
            img: imgFootDefault,
        },
    },
    weaponConfig,
    deeps: {
        face: 3,
        body: 2,
        foot: 1,
    },
}

export default CONSTANT_HOME
