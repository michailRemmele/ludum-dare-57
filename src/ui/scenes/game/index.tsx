import {
  useContext,
  useEffect,
  useState,
} from 'react';
import type { FC } from 'react';
import { LoadScene } from 'dacha/events';

import * as EventType from '../../../game/events';
import { EngineContext } from '../../providers';
import {
  FpsMeter,
  Button,
} from '../../components';
import { GAME_ID, MAIN_MENU_ID } from '../../../consts/scenes';
import { isTouchDevice } from '../../../utils/is-touch-device';

import {
  MoveControl,
} from './components';
import './style.css';

export const Game: FC = () => {
  const { scene } = useContext(EngineContext);

  const [isGameOver, setIsGameOver] = useState(false);

  const handleRestart = (): void => {
    scene.dispatchEvent(LoadScene, {
      sceneId: GAME_ID,
      loaderId: null,
      levelId: null,
      unloadCurrent: true,
      clean: true,
    });
  };

  const handleMainMenu = (): void => {
    scene.dispatchEvent(LoadScene, {
      sceneId: MAIN_MENU_ID,
      clean: true,
      loaderId: null,
      levelId: null,
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

  useEffect(() => {
    const handleGameOver = (): void => {
      setIsGameOver(true);
    };

    scene.addEventListener(EventType.GameOver, handleGameOver);

    return (): void => {
      scene.removeEventListener(EventType.GameOver, handleGameOver);
    };
  }, [scene]);

  return (
    <div className="game">
      <header className="game__header">
        <div className="header__left" />
      </header>
      {process.env.NODE_ENV === 'development' && <FpsMeter />}

      {isTouchDevice() && (
        <MoveControl className="game__move-control" />
      )}

      {isGameOver && (
        <div className="game-over__overlay">
          <div className="game-over__content">
            <h1 className="game-over__title">
              Game Over
            </h1>
            <Button className="game-over__button" onClick={handleRestart}>Restart</Button>
            <Button className="game-over__button" onClick={handleMainMenu}>Main Menu</Button>
          </div>
        </div>
      )}
    </div>
  );
};
