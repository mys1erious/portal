import React from 'react';
import Floor from '@/features/core/components/Floor';
import Wall from '@/features/core/components/Wall';
import Character from '@/features/characters/components/Character';
import {
    DEFAULT_ELEMENT_DEPTH,
    DEFAULT_ELEMENT_SIZE,
    DEFAULT_WALL_HEIGHT,
} from '@/constants';
import DirectionalLight from '@/features/core/components/DirectionalLight';
import Element from '@/features/core/components/Element';
import Mirror from '@/features/core/components/Mirror';
import VideoElement from '@/features/core/components/VideoElement';

const FLOOR_WIDTH = DEFAULT_ELEMENT_SIZE * 32;
const FLOOR_HEIGHT = DEFAULT_ELEMENT_SIZE * 32;

const Room1 = () => {
    return (
        <group>
            <DirectionalLight />

            <Character />

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
                position={[5, DEFAULT_ELEMENT_DEPTH, 1]}
            />
            <Element
                rotation={[Math.PI / 2, 0, 0]}
                position={[4.8, DEFAULT_ELEMENT_DEPTH * 2, 0.8]}
            />
            <Element position={[1, 0.5, 8]} width={3} height={3} depth={3} />
            <Element
                rotation={[Math.PI / 4, 0, 0]}
                position={[3, DEFAULT_ELEMENT_DEPTH * 2, 0.8]}
                height={2}
            />

            <Mirror
                height={DEFAULT_WALL_HEIGHT}
                width={4}
                position={[-2, DEFAULT_WALL_HEIGHT / 2, 3]}
                rotation={[0, -Math.PI / 2, 0]}
            />

            <VideoElement url={'/videos/infinite_stars.mp4'} position={[0, 3, -10]}/>
        </group>
    );
};

export default Room1;
