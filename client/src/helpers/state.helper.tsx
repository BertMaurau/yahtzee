import { DICE_COUNT } from "../App";
import { newDiceState, newGameScore } from "./score.helper";

export const STATE_CURRENT_GAME: string = 'currentGame' as const;
export const STATE_CURRENT_ROLL: string = 'currentRoll' as const;
export const STATE_COMPLETED_GAMES: string = 'completedGames' as const;
export const STATE_ROLL_COUNT: string = 'rollCount' as const;
export const STATE_DICE_STATE: string = 'diceState' as const;

export function loadState(state: string) {
    let savedState: any = window.localStorage.getItem(state);
    if (savedState) {
        return JSON.parse(savedState);
    }

    switch (state) {
        case STATE_CURRENT_GAME:
            return newGameScore();
        case STATE_COMPLETED_GAMES:
            return [];
        case STATE_CURRENT_ROLL:
            return null;
        case STATE_ROLL_COUNT:
            return 0;
        case STATE_DICE_STATE:
            return newDiceState(DICE_COUNT);
        default:
            break;
    }
}

export function saveState(state: string, value: any) {
    window.localStorage.setItem(state, JSON.stringify(value));
}