import { useContext, useState, useEffect } from 'react';
import type { FC } from 'react';

import Score from '../../../../../game/components/score/score.component';
import { EngineContext } from '../../../../providers';
import { MAIN_CAMERA_NAME } from '../../../../../consts/actors';
import * as EventType from '../../../../../game/events';
import type { IncreaseScorePointsEvent } from '../../../../../game/events';

import './style.css';

export const ScoreBar: FC = () => {
  const { scene } = useContext(EngineContext);

  const [value, setValue] = useState(() => {
    const mainCamera = scene?.findChildByName(MAIN_CAMERA_NAME);
    const score = mainCamera?.getComponent(Score);
    return score?.value ?? 0;
  });

  useEffect(() => {
    if (!scene) {
      return (): void => {};
    }

    const handleIncreaseScorePoints = (event: IncreaseScorePointsEvent): void => {
      setValue((prev) => prev + event.points);
    };

    scene.addEventListener(EventType.IncreaseScorePoints, handleIncreaseScorePoints);

    return (): void => {
      scene.removeEventListener(EventType.IncreaseScorePoints, handleIncreaseScorePoints);
    };
  }, [scene]);

  return (
    <div className="score-bar">
      <div className="score-bar__inner">
        <span className="money-bar__value">{`Score: ${value}`}</span>
      </div>
    </div>
  );
};
