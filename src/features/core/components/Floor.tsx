import React from 'react';
import Element from '@/features/core/components/Element';
import { Vector3D } from '@/types';
import { DEFAULT_ELEMENT_DEPTH, DEFAULT_ELEMENT_SIZE } from '@/constants';

type FloorProps = {
    position?: Vector3D;
    width?: number;
    height?: number;
    baseTextureSrc?: string;
    normalTextureSrc?: string;
};

const Floor = ({
    position,
    width,
    height,
    baseTextureSrc = '/textures/tile_wall_base.jpg',
    normalTextureSrc = '/textures/tile_wall_normal.jpg',
}: FloorProps) => {
    return (
        <Element
            position={position}
            rotation={[Math.PI / 2, 0, 0]}
            depth={0.0001}
            width={width}
            height={height}
            baseTextureSrc={baseTextureSrc}
            normalTextureSrc={normalTextureSrc}
            widthTextureDivider={DEFAULT_ELEMENT_SIZE}
            heightTextureDivider={DEFAULT_ELEMENT_SIZE}
        />
    );
};

export default Floor;
