import {
  useContext,
  useEffect,
} from 'react';
import type { FC } from 'react';
import { LoadScene } from 'dacha/events';

import * as EventType from '../../../game/events';
import { EngineContext } from '../../providers';
import {
  FpsMeter,
  Button,
} from '../../components';
import { GAME_ID } from '../../../consts/scenes';
import { isTouchDevice } from '../../../utils/is-touch-device';

import {
  MoveControl,
} from './components';
import './style.css';

export const Game: FC = () => {
  const { scene } = useContext(EngineContext);

  const handleRestart = (): void => {
    scene.dispatchEvent(LoadScene, {
      sceneId: GAME_ID,
      loaderId: null,
      levelId: null,
      unloadCurrent: true,
      clean: true,
    });
  };

  useEffect(() => {
    scene.dispatchEvent(EventType.SendAnalytics, {
      name: 'screen_show',
      payload: {
        screenName: 'game',
      },
    });
  }, []);

  return (
    <div className="game">
      <header className="game__header">
        <div className="header__left" />
      </header>
      {process.env.NODE_ENV === 'development' && <FpsMeter />}

      {isTouchDevice() && (
        <MoveControl className="game__move-control" />
      )}

      <div className="game-over__overlay">
        <div className="game-over__content">
          <h1 className="game-over__title">
            Game Over
          </h1>
          <Button onClick={handleRestart}>Restart</Button>
        </div>
      </div>
    </div>
  );
};
