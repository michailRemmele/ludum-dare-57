import { useContext, useMemo } from 'react';
import type { FC } from 'react';
import { LoadScene } from 'dacha/events';

import { Button } from '../../../../components';
import { EngineContext } from '../../../../providers';
import { LEVELS } from '../../../../../consts/game';
import { GAME_ID } from '../../../../../consts/scenes';
import { MAIN_MENU } from '../../consts';

import './style.css';

interface LevelSelectProps {
  openMenu: (menu: string) => void
}

export const LevelSelect: FC<LevelSelectProps> = ({ openMenu }) => {
  const { scene } = useContext(EngineContext);

  const levels = useMemo(() => {
    return LEVELS.slice(0, (window.saveState?.completedLevels.length ?? 0) + 1);
  }, []);

  const handlePlay = (levelId: string): void => {
    scene.dispatchEvent(LoadScene, {
      sceneId: GAME_ID,
      levelId,
      clean: true,
      loaderId: null,
    });
  };

  const handleBack = (): void => openMenu(MAIN_MENU);

  return (
    <div className="level-select-menu">
      <div className="level-select-menu__levels">
        {levels.map((level) => (
          <div className="level-select-menu__level">
            <Button
              className="level-select-menu__button"
              onClick={() => handlePlay(level.id)}
            >
              {level.title}
            </Button>
          </div>
        ))}
      </div>
      <Button className="level-select-menu__button" onClick={handleBack}>Back</Button>
    </div>
  );
};
