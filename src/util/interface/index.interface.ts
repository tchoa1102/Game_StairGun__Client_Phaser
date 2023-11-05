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
    location: { x: string; y: string }
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
    target: IPlayer
    position: number
    mainGame: {
        x: string
        y: string
        hp: string
        sta: number
        atk: string
        def: string
        luk: string
        agi: string
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
