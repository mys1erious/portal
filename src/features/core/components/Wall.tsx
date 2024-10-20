import React from 'react';
import Element from '@/features/core/components/Element';
import { Vector3D } from '@/types';
import { DEFAULT_ELEMENT_DEPTH, DEFAULT_ELEMENT_SIZE, DEFAULT_WALL_HEIGHT } from '@/constants';

type WallProps = {
    position?: Vector3D;
    rotation?: Vector3D;
    width?: number;
    height?: number;
    baseTextureSrc?: string;
    normalTextureSrc?: string;
};

const Wall = ({
    position,
    rotation,
    width,
    height,
    baseTextureSrc = '/textures/single_wall_base.jpg',
    normalTextureSrc = '/textures/single_wall_normal.jpg',
}: WallProps) => {
    return (
        <Element
            baseTextureSrc={baseTextureSrc}
            normalTextureSrc={normalTextureSrc}
            depth={DEFAULT_ELEMENT_DEPTH}
            width={width}
            height={height}
            position={position}
            rotation={rotation}
            widthTextureDivider={DEFAULT_ELEMENT_SIZE * 1.2}
            heightTextureDivider={DEFAULT_WALL_HEIGHT}
        />
    );
};

export default Wall;
