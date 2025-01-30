import { IDieState } from "../components/Die/Die";

// Part 1
export const SCORE_FIELD_TOTAL_SCORE_DIE_FACE_1: string = 'Aces' as const;
export const SCORE_FIELD_TOTAL_SCORE_DIE_FACE_2: string = 'Twos' as const;
export const SCORE_FIELD_TOTAL_SCORE_DIE_FACE_3: string = 'Threes' as const;
export const SCORE_FIELD_TOTAL_SCORE_DIE_FACE_4: string = 'Fours' as const;
export const SCORE_FIELD_TOTAL_SCORE_DIE_FACE_5: string = 'Fives' as const;
export const SCORE_FIELD_TOTAL_SCORE_DIE_FACE_6: string = 'Sixes' as const;
// Part 2
export const SCORE_FIELD_THREE_OF_A_KIND: string = 'Three of a Kind' as const;
export const SCORE_FIELD_FOUR_OF_A_KIND: string = 'Four of a Kind' as const;
export const SCORE_FIELD_FULL_HOUSE: string = 'Full House' as const;
export const SCORE_FIELD_SMALL_STRAIGHT: string = 'Small Straight' as const;
export const SCORE_FIELD_LARGE_STRAIGHT: string = 'Large Straight' as const;
export const SCORE_FIELD_YAHTZEE: string = 'Yahtzee' as const;
export const SCORE_FIELD_CHANCE: string = 'Chance' as const;

export const SCORE_FIELDS: {
    part1: Array<string>,
    part2: Array<string>,
} = {
    part1: [
        SCORE_FIELD_TOTAL_SCORE_DIE_FACE_1,
        SCORE_FIELD_TOTAL_SCORE_DIE_FACE_2,
        SCORE_FIELD_TOTAL_SCORE_DIE_FACE_3,
        SCORE_FIELD_TOTAL_SCORE_DIE_FACE_4,
        SCORE_FIELD_TOTAL_SCORE_DIE_FACE_5,
        SCORE_FIELD_TOTAL_SCORE_DIE_FACE_6,
    ],
    part2: [
        SCORE_FIELD_THREE_OF_A_KIND,
        SCORE_FIELD_FOUR_OF_A_KIND,
        SCORE_FIELD_FULL_HOUSE,
        SCORE_FIELD_SMALL_STRAIGHT,
        SCORE_FIELD_LARGE_STRAIGHT,
        SCORE_FIELD_YAHTZEE,
        SCORE_FIELD_CHANCE,
    ]
}

export type GameScore = {

    part1: {

        scores: {
            [key: string]: number | null;
        }

        score: number | null;
        bonus: number | null;
        total: number | null;
    }

    part2: {

        scores: {
            [key: string]: number | null;
        }

        score: number | null;
        total: number | null;

    }

    total: number | null;
}

export function newDiceState(dice: number): Array<IDieState> {
    return [...Array(dice)].map((_: null, index: number) => {
        return { index };
    })
}
export function newGameScore(): GameScore {
    let gameScore: GameScore = {

        part1: {

            scores: {

            },

            score: null,
            bonus: null,
            total: null,
        },

        part2: {

            scores: {

            },

            score: null,
            total: null,

        },

        total: null,
    }

    SCORE_FIELDS.part1.forEach((scoreField: string) => {
        gameScore.part1.scores[scoreField] = null;
    })
    SCORE_FIELDS.part2.forEach((scoreField: string) => {
        gameScore.part2.scores[scoreField] = null;
    })

    return gameScore;
}

export function calculateScores(values: Array<number>): GameScore {

    const gameScore: GameScore = newGameScore();

    // Helper: Group / count occurrences of each die value
    const dieCount: { [key: number]: number } = values.reduce((prev: any, curr: number) => {
        prev[curr] ? (prev[curr] += 1) : (prev[curr] = 1)
        return prev;
    }, {} as any);
    const uniqueDice: Array<number> = [...new Set(values)].sort((a: number, b: number) => a - b);

    // Part 1: Simple scores per die
    // --------------------------------------------------
    SCORE_FIELDS.part1.forEach((scoreField: string, idx: number) => {

        // no need to re-filter and calculate, since we have the helper

        let dieFace: number = idx + 1;
        let total: number = dieFace * (dieCount[dieFace] ?? 0);

        gameScore.part1.scores[scoreField] = total;

        gameScore.part2.scores[SCORE_FIELD_CHANCE] = (gameScore.part2.scores[SCORE_FIELD_CHANCE] ?? 0) + total;

    })

    // Part 2: The more "complex" scores
    // --------------------------------------------------
    // 1. Three of a Kind (check for a die with 3 occurrences, if so, sum of all dice)
    gameScore.part2.scores[SCORE_FIELD_THREE_OF_A_KIND] = Object.values(dieCount).some((count: number) => count >= 3)
        ? values.reduce((prev: any, curr: number) => prev + curr, 0)
        : 0;

    // 2. Four of a Kind (check for a die with 4 occurrences, if so, sum of all dice)
    gameScore.part2.scores[SCORE_FIELD_FOUR_OF_A_KIND] = Object.values(dieCount).some((count: number) => count >= 4)
        ? values.reduce((prev: any, curr: number) => prev + curr, 0)
        : 0;

    // 3. Full House (check for a die with 3 occurrences, and one with 2 occurrences)
    gameScore.part2.scores[SCORE_FIELD_FULL_HOUSE] = Object.values(dieCount).includes(3) && Object.values(dieCount).includes(2) ? 25 : 0;

    // 4. Small Straight (check for 4 consecutive numbers)
    const smallStraights: Array<Array<number>> = [
        [1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6], // simpler this way since we only have 3 possible options
    ];
    gameScore.part2.scores[SCORE_FIELD_SMALL_STRAIGHT] = smallStraights.some((straight: Array<number>) =>
        straight.every((num: number) => uniqueDice.includes(num))
    ) ? 30 : 0;

    // 5. Large Straight (check for 5 consecutive numbers)
    const largeStraights = [
        [1, 2, 3, 4, 5], [2, 3, 4, 5, 6], // same as three of a kind, but now only 2 possible options
    ];
    gameScore.part2.scores[SCORE_FIELD_LARGE_STRAIGHT] = largeStraights.some((straight: Array<number>) =>
        straight.every((num: number) => uniqueDice.includes(num))
    ) ? 40 : 0;

    // 6. Yahtzee (check for a die with 5 occurrences)
    gameScore.part2.scores[SCORE_FIELD_YAHTZEE] = Object.values(dieCount).some((count: number) => count === 5) ? 50 : 0;

    // 7. Chance (just the sum of all dice)
    // (is calculated at the start since we already iterate there...)

    return gameScore;

}