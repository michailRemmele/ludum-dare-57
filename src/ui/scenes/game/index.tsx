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
  // FpsMeter,
  Button,
} from '../../components';
import { GAME_ID, MAIN_MENU_ID, LOADER_ID } from '../../../consts/scenes';
import { LEVELS } from '../../../consts/game';
import { isTouchDevice } from '../../../utils/is-touch-device';
import type { GameOverEvent } from '../../../game/events';

import {
  MoveControl,
  ScoreBar,
  ExpBar,
} from './components';
import './style.css';

export const Game: FC = () => {
  const { scene } = useContext(EngineContext);

  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);

  const handleRestart = (): void => {
    scene.dispatchEvent(LoadScene, {
      sceneId: GAME_ID,
      levelId: LEVELS[levelIndex].id,
      loaderId: LOADER_ID,
      unloadCurrent: true,
      clean: true,
    });
  };

  const handleContinue = (): void => {
    scene.dispatchEvent(LoadScene, {
      sceneId: GAME_ID,
      levelId: LEVELS[levelIndex + 1].id,
      loaderId: LOADER_ID,
      unloadCurrent: true,
      clean: true,
    });
  };

  const handleMainMenu = (): void => {
    scene.dispatchEvent(LoadScene, {
      sceneId: MAIN_MENU_ID,
      clean: true,
      loaderId: LOADER_ID,
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
    const handleGameOver = (event: GameOverEvent): void => {
      setIsGameOver(true);
      setIsWin(event.isWin);
      setLevelIndex(event.levelIndex);
    };

    scene.addEventListener(EventType.GameOver, handleGameOver);

    return (): void => {
      scene.removeEventListener(EventType.GameOver, handleGameOver);
    };
  }, [scene]);

  return (
    <div className="game">
      <header className="game__header">
        <ExpBar />
        <div className="header__right">
          <ScoreBar />
        </div>
      </header>
      {/* {process.env.NODE_ENV === 'development' && <FpsMeter />} */}

      {isTouchDevice() && (
        <MoveControl className="game__move-control" />
      )}

      {isGameOver && (
        <div className="game-over__overlay">
          <div className="game-over__content">
            <h1 className="game-over__title">
              {isWin && levelIndex === LEVELS.length - 1 && 'Game Complete'}
              {isWin && levelIndex !== LEVELS.length - 1 && 'Level Complete'}
              {!isWin && 'Game Over'}
            </h1>
            {!isWin && (
              <Button className="game-over__button" onClick={handleRestart}>Restart</Button>
            )}
            {isWin && levelIndex !== LEVELS.length - 1 && (
              <Button className="game-over__button" onClick={handleContinue}>Continue</Button>
            )}
            <Button className="game-over__button" onClick={handleMainMenu}>Main Menu</Button>
          </div>
        </div>
      )}
    </div>
  );
};
