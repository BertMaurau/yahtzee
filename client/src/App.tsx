import { useEffect, useState } from 'react';
import Die, { IDieState } from './components/Die/Die';
import Scorecard from './components/Scorecard/Scorecard';
import classNames from 'classnames';
import { calculateScores, GameScore, newDiceState } from './helpers/score.helper';
import { loadState, saveState, STATE_CURRENT_ROLL, STATE_DICE_STATE, STATE_ROLL_COUNT } from './helpers/state.helper';

export const DICE_COUNT: number = 5 as const;
export const MAX_ROLLS: number = 3 as const;

function App() {

  const [rollCount, setRollCount] = useState<number>(loadState(STATE_ROLL_COUNT));
  const [rollScore, setRollScore] = useState<GameScore | null>(loadState(STATE_CURRENT_ROLL));

  const [isRolling, setIsRolling] = useState<boolean>(false);

  const [diceState, setDiceState] = useState<Array<IDieState>>(loadState(STATE_DICE_STATE));

  const rollDice = () => {

    if (rollCount === MAX_ROLLS) {
      return;
    }

    setRollCount(rollCount + 1);

    setIsRolling(true);

    let rollingInterval = setInterval(() => {

      let newDiceState = diceState.map((dieState: IDieState) => {

        if (!dieState.isLocked) {
          dieState.value = Math.floor(Math.random() * 6) + 1;
        }

        return dieState;
      });

      setDiceState(newDiceState);

    }, 50);

    setTimeout(() => {
      clearInterval(rollingInterval);
      setIsRolling(false);

      // call parent
      setRollScore(calculateScores(diceState.map((dieState: IDieState) => dieState.value!)));

    }, 810);
  }

  const updateDieLockedState = (dieState: IDieState) => {

    if (dieState.value === undefined) {
      // not yet rolled
      return;
    }

    let newDiceState = [...diceState];
    newDiceState[dieState.index] = {
      ...diceState[dieState.index],
      isLocked: !diceState[dieState.index].isLocked,
    };

    setDiceState(newDiceState);

  }

  const startNewRound = () => {
    setRollCount(0);
    setRollScore(null);
    setDiceState(newDiceState(DICE_COUNT));
  }

  useEffect(() => {
    // TEMP: Save state to storage
    saveState(STATE_CURRENT_ROLL, rollScore);
    saveState(STATE_ROLL_COUNT, rollCount);
    saveState(STATE_DICE_STATE, diceState);
  }, [rollCount, rollScore, diceState])

  return <>

    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand"></div>
      <a className="navbar-item" href="/">
        Yahtzee
      </a>
    </nav>

    <main className="container is-flex is-flex-direction-row is-flex-gap-6">
      <div className="dice-roller">

        <div className="dice">
          {diceState.map((dieState: any, index: number) => {
            return <Die
              key={index}
              value={dieState.value}
              isLocked={dieState.isLocked}
              isRolling={isRolling}
              onClick={() => updateDieLockedState(dieState)} />
          })}
        </div>

        <div className="controls">

          <span className="subtitle">{rollCount} / {MAX_ROLLS}</span>

          <button type="button"
            disabled={rollCount === MAX_ROLLS}
            onClick={rollDice}
            className={classNames("button is-primary", {
              'is-loading': isRolling,
            })}
          >
            Roll
          </button>

        </div>

      </div>

      <Scorecard rollScore={rollScore}
        onScorePick={() => {
          // reset roll-state (start a new roll option)
          startNewRound();
        }}
        onGameCompleted={(gameScore: GameScore) => {
          // show something...
        }} />

    </main>


  </>

}

export default App;
