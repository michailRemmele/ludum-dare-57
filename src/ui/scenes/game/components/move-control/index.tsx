import {
  useContext,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import type { FC } from 'react';

import * as EventType from '../../../../../game/events';
import { EngineContext } from '../../../../providers';
import { ThumbStick } from '../../../../components';
import { PLAYER_ACTOR_NAME } from '../../../../../consts/actors';

const THRESHOLD = 0.20;

export interface MoveControlProps {
  className: string
}

export const MoveControl: FC<MoveControlProps> = ({ className }) => {
  const { scene, gameStateObserver } = useContext(EngineContext);

  const pointerRef = useRef({ x: 0, y: 0 });

  const handleMove = useCallback((x: number, y: number): void => {
    pointerRef.current.x = x;
    pointerRef.current.y = y;
  }, []);

  useEffect(() => {
    const handleUpdate = (): void => {
      const { x, y } = pointerRef.current;
      if (!x && !y) {
        return;
      }

      if (Math.abs(x) < THRESHOLD && Math.abs(y) < THRESHOLD) {
        return;
      }

      const player = scene.getEntityByName(PLAYER_ACTOR_NAME);
      player?.dispatchEvent(EventType.Movement, { x, y });
    };

    gameStateObserver.subscribe(handleUpdate);
    return (): void => gameStateObserver.unsubscribe(handleUpdate);
  }, []);

  return (
    <ThumbStick className={className} onMove={handleMove} sticky />
  );
};
