import { useContext } from 'react';
import type { FC } from 'react';
import { LoadScene } from 'dacha/events';

import { Button } from '../../../../components';
import { EngineContext } from '../../../../providers';
import { GAME_ID } from '../../../../../consts/scenes';
import { SETTINGS_MENU } from '../../consts';

import './style.css';

interface MainProps {
  openMenu: (menu: string) => void
}

export const Main: FC<MainProps> = ({ openMenu }) => {
  const { scene } = useContext(EngineContext);

  const handlePlay = (): void => {
    scene.dispatchEvent(LoadScene, {
      sceneId: GAME_ID,
      clean: true,
      loaderId: null,
      levelId: null,
    });
  };

  const handleOpenSettings = (): void => openMenu(SETTINGS_MENU);

  return (
    <div className="main-menu">
      <Button className="main-menu__button" onClick={handlePlay}>Play</Button>
      <Button className="main-menu__button" onClick={handleOpenSettings}>Settings</Button>
    </div>
  );
};
