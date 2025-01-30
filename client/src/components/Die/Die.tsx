import classNames from "classnames";
import './Die.scss';

export interface IDieState {
    index: number;
    value?: number;
    isLocked?: boolean;
}

function Die({ value, isLocked = false, isRolling = false, onClick }: { value: number, isLocked: boolean, isRolling: boolean, onClick: () => void }) {

    return (
        <div className={classNames('die', (value % 2 === 0 ? 'is--even' : 'is--odd'), {
            'is--locked': isLocked,
            'is--rolling': isRolling,
        })} onClick={onClick}>
            <div className="face">
                {[...Array(value ?? 1)].map((_: null, idx: number) => {
                    return <div key={idx} className={classNames('dot', `dot-${idx + 1}`)}></div>
                })}
            </div>
        </div>
    );

}

export default Die;
