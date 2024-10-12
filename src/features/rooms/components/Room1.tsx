import React from 'react';
import Floor from '@/features/core/components/Floor';
import Wall from '@/features/core/components/Wall';
import Mannequin from '@/features/characters/components/Mannequin';
import { DEFAULT_ELEMENT_SIZE, DEFAULT_WALL_HEIGHT } from '@/constants';
import DirectionalLight from '@/features/core/components/DirectionalLight';
import Element from '@/features/core/components/Element';

const FLOOR_WIDTH = DEFAULT_ELEMENT_SIZE * 32;
const FLOOR_HEIGHT = DEFAULT_ELEMENT_SIZE * 32;

const Room1 = () => {
    return (
        <group>
            <DirectionalLight />

            <Mannequin />

            <Floor width={FLOOR_WIDTH * 2} height={FLOOR_HEIGHT * 2} />
            <Wall
                width={FLOOR_WIDTH}
                height={DEFAULT_WALL_HEIGHT * 2}
                position={[0, DEFAULT_WALL_HEIGHT, -FLOOR_HEIGHT / 2]}
            />
            <Wall
                width={FLOOR_HEIGHT}
                height={DEFAULT_WALL_HEIGHT}
                position={[-FLOOR_WIDTH / 2, DEFAULT_WALL_HEIGHT / 2, 0]}
                rotation={[0, Math.PI / 2, 0]}
            />
            <Wall
                width={FLOOR_HEIGHT}
                height={DEFAULT_WALL_HEIGHT}
                position={[FLOOR_WIDTH / 2, DEFAULT_WALL_HEIGHT / 2, 0]}
                rotation={[0, -Math.PI / 2, 0]}
            />
            <Wall
                width={FLOOR_WIDTH}
                height={DEFAULT_WALL_HEIGHT}
                position={[0, DEFAULT_WALL_HEIGHT / 2, FLOOR_HEIGHT / 2]}
            />

            <Element
                rotation={[Math.PI / 2, 0, 0]}
                position={[-500, 10, 100]}
            />
            <Element
                rotation={[Math.PI / 2, 0, 0]}
                position={[-490, 20, 110]}
            />
            <Element
                position={[-10, 101, 500]}
                width={200}
                height={200}
                depth={200}
            />
        </group>
    );
};

export default Room1;
