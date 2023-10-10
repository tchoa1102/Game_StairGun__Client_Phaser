import type { IPlayer } from './state.main.interface'

export type { default as IIndicator } from './init.interface'

export type { default as IState } from './state.main.interface'

export interface IMatchRes {
    _id: string
    stairs: Array<{
        x: string
        y: string
        width: string
    }>
    timeStart: string
    players: Array<IPlayerOnMatch>
    cards: Array<{}>
    backgroundStairGame: string
    stickConfig: string
    tiledMapConfig: string
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
