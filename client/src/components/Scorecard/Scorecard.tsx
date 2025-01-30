import { useEffect, useState } from 'react';
import './Scorecard.scss';
import { GameScore, newGameScore, SCORE_FIELDS } from '../../helpers/score.helper';
import classNames from 'classnames';
import { loadState, saveState, STATE_COMPLETED_GAMES, STATE_CURRENT_GAME } from '../../helpers/state.helper';


function Scorecard({ rollScore, onScorePick, onGameCompleted }: { rollScore: GameScore | null, onScorePick: () => void, onGameCompleted: (gameScore: GameScore) => void }) {

    // start the state with an empty game score
    const [gameScore, setGameScore] = useState<GameScore>(loadState(STATE_CURRENT_GAME));

    // keep track of completed games
    const [completedGames, setCompletedGames] = useState<Array<GameScore>>(loadState(STATE_COMPLETED_GAMES));

    const pickedScore = (part: 1 | 2, scoreField: string, score: number) => {

        if (gameScore[`part${part}`].scores[scoreField] !== null) {
            // already picked this field
            throw new Error(`Score already entered for: ${scoreField}!`);
        }

        // set the game score
        gameScore[`part${part}`].scores[scoreField] = score;

        // check if part is completed
        let hasCompletedGame: boolean = false;
        let hasCompletedPart: boolean = SCORE_FIELDS[`part${part}`].every((scoreField: string) => gameScore[`part${part}`].scores[scoreField] !== null);
        if (hasCompletedPart) {

            // calculate scores for that part
            let score: number = Object.values(gameScore[`part${part}`].scores).reduce((a: number, b: number | null) => a + b!, 0);

            gameScore[`part${part}`].score = score;

            if (part === 1) {
                gameScore.part1.bonus = score >= 63 ? 35 : 0;
                gameScore.part1.total = gameScore.part1.bonus + score;
            } else {
                gameScore.part2.total = score;
            }

            // check if both parts have been completed now
            hasCompletedGame = (gameScore.part1.score !== null && gameScore.part2.score !== null);
            if (hasCompletedGame) {

                // calculate totals
                gameScore.total = gameScore.part1.score! + gameScore.part2.score!;

            }

        }

        // update state
        setGameScore({ ...gameScore });

        if (hasCompletedGame) {

            completedGames.unshift({ ...gameScore });

            setCompletedGames(completedGames)

            // end
            onGameCompleted(gameScore);

            setGameScore(newGameScore())

        }

        onScorePick();

    }

    useEffect(() => {

        // TEMP: save to storage
        saveState(STATE_COMPLETED_GAMES, completedGames);
        saveState(STATE_CURRENT_GAME, gameScore);

    }, [completedGames, gameScore]);

    return <div className="scorecard table-container">
        <table className="table is-striped is-bordered">
            <thead>
                <tr>
                    <th>Part 1</th>
                    <th>Current</th>
                    {completedGames.map((_: GameScore, idx: number) => {
                        return <th key={idx}>Game {completedGames.length - idx}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {SCORE_FIELDS.part1.map((scoreField: string) => {
                    return <tr key={scoreField}>
                        <td>{scoreField}</td>
                        <td className={classNames('score-cell', {
                            'has-background-success-light': gameScore.part1.scores[scoreField] === null && (rollScore?.part1.scores[scoreField] ?? 0) > 0,
                            'has-background-danger-light': gameScore.part1.scores[scoreField] === null && rollScore && (rollScore?.part1.scores[scoreField] ?? 0) === 0,
                        })}
                            onClick={() => gameScore.part1.scores[scoreField] === null && pickedScore(1, scoreField, rollScore?.part1.scores[scoreField] ?? 0)}>
                            {gameScore.part1.scores[scoreField] ?? rollScore?.part1.scores[scoreField] ?? ''}
                        </td>
                        {completedGames.map((completedGame: GameScore, idx: number) => {
                            return <td key={idx}>{completedGame.part1.scores[scoreField] ?? 0}</td>
                        })}
                    </tr>
                })}
            </tbody>
            <tfoot>
                <tr>
                    <th>Total Score</th>
                    <th>{gameScore.part1.score ?? ''}</th>
                    {completedGames.map((completedGame: GameScore, idx: number) => {
                        return <th key={idx}>{completedGame.part1.score ?? 0}</th>
                    })}
                </tr>
                <tr>
                    <th>Bonus (&gt;=63)</th>
                    <th>{gameScore.part1.bonus ?? ''}</th>
                    {completedGames.map((completedGame: GameScore, idx: number) => {
                        return <th key={idx}>{completedGame.part1.bonus ?? 0}</th>
                    })}
                </tr>
                <tr>
                    <th>Total</th>
                    <th>{gameScore.part1.total ?? ''}</th>
                    {completedGames.map((completedGame: GameScore, idx: number) => {
                        return <th key={idx}>{completedGame.part1.total ?? 0}</th>
                    })}
                </tr>
            </tfoot>
        </table>
        <table className="table is-striped is-bordered">
            <thead>
                <tr>
                    <th>Part 2</th>
                    <th>Current</th>
                    {completedGames.map((_: GameScore, idx: number) => {
                        return <th key={idx}>Game {completedGames.length - idx}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {SCORE_FIELDS.part2.map((scoreField: string) => {
                    return <tr key={scoreField}>
                        <td>{scoreField}</td>
                        <td className={classNames('score-cell', {
                            'has-background-success-light': gameScore.part2.scores[scoreField] === null && (rollScore?.part2.scores[scoreField] ?? 0) > 0,
                            'has-background-danger-light': gameScore.part2.scores[scoreField] === null && rollScore && (rollScore?.part2.scores[scoreField] ?? 0) === 0,
                        })}
                            onClick={() => gameScore.part2.scores[scoreField] === null && pickedScore(2, scoreField, rollScore?.part2.scores[scoreField] ?? 0)}>
                            {gameScore.part2.scores[scoreField] ?? rollScore?.part2.scores[scoreField] ?? ''}
                        </td>
                        {completedGames.map((completedGame: GameScore, idx: number) => {
                            return <td key={idx}>{completedGame.part2.scores[scoreField] ?? 0}</td>
                        })}
                    </tr>
                })}
            </tbody>
            <tfoot>
                <tr>
                    <th>Total (Part 2)</th>
                    <th>{gameScore.part2.score ?? ''}</th>
                    {completedGames.map((completedGame: GameScore, idx: number) => {
                        return <th key={idx}>{completedGame.part2.score ?? 0}</th>
                    })}
                </tr>
                <tr>
                    <th>Total (Part 1)</th>
                    <th>{gameScore.part1.total ?? ''}</th>
                    {completedGames.map((completedGame: GameScore, idx: number) => {
                        return <th key={idx}>{completedGame.part1.total ?? 0}</th>
                    })}
                </tr>
                <tr>
                    <th>Grand total</th>
                    <th>{gameScore.total ?? ''}</th>
                    {completedGames.map((completedGame: GameScore, idx: number) => {
                        return <th key={idx}>{completedGame.total ?? 0}</th>
                    })}
                </tr>
            </tfoot>
        </table>
    </div>
}

export default Scorecard;
