import type { IPlayer } from './state.main.interface'

export type { default as IIndicator } from './init.interface'

export type { default as IState } from './state.main.interface'

export interface IMatchRes {
    _id: string
    stairs: Array<{
        x: string
        y: string
        width: string
        height: string
        img: string
        _id: string
    }>
    turner: string // objectid
    timeStart: string
    players: Array<IPlayerOnMatch>
    cards: Array<ICardOnMatch>
    backgroundStairGame: string
    stickConfig: IStickAnimationConfig | string
    objects: Array<IObject>
    // mapDataJSON: { [name: string]: any }
    cardsPickUp: { [k: string]: number }
    backgroundGunGame: string
}

export interface IObject {
    location: { x: number; y: number }
    data: IDataObjectMatch
}

export interface IDataObjectMatch {
    _id: string
    name: string
    points: Array<{ x: string; y: string }>
    src: string
    canBeDestroyed: boolean
}

export interface IStair {
    x: string
    y: string
    width: string
    height: string
    img: string
    _id: string
}

export interface ICard {
    _id: string
    name: string
    type: string
    src: string
}

export interface ICardOnMatch {
    data: any
    x: string
    y: string
    isEnable: boolean
    owner: string
    _id: string
}

export interface ICardRes {
    time: string
    owner: string
    _id: string
    card: ICard
}

export interface IPlayerOnMatch {
    target: {
        _id: string
        name: string
        level: number
        looks: Record<string, string>
        HP: number
        STA: number
    }
    position: number
    mainGame: {
        bottomLeft: { x: number; y: number }
        characterAngle: number
        HP: number
        STA: number
        ATK: number
        DEF: number
        LUK: number
        AGI: number
        power_point: number
        stateEffects: Array<{
            data: { [key: string]: any }
            turnReturn: number
        }>
    }
    stairGame: {
        x: string
        y: string
    }
}

export interface IChangePosition {
    player: string
    position: number
}

export interface IChatReceiveMessage {
    sender: { _id: string; name: string }
    receiver: { _id: string; name?: string }
    message: string
}

export interface IUpdateLocationGunGame {
    _id: string
    data: Array<ILocationGunGame>
    isLive: boolean
}

export interface ILocationGunGame {
    x: number
    y: number
    angle: number
    time: number
}

export interface IUseCardRes {
    _id: string // card's id
    owner: string // player use
    turner: string // turn player :>
}

export interface IChangeTurn {
    _id: string // idMatch
    turner: string
}
