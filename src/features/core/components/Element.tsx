import React from 'react';
import {
    CuboidCollider,
    RigidBody,
    RigidBodyTypeString,
} from '@react-three/rapier';
import { DEFAULT_ELEMENT_DEPTH, DEFAULT_ELEMENT_SIZE } from '@/constants';
import { getTexture } from '@/utils';
import { Vector3D } from '@/types';


type ElementProps = {
    position?: Vector3D;
    rotation?: Vector3D;
    width?: number;
    height?: number;
    depth?: number;
    widthTextureDivider?: number;
    heightTextureDivider?: number;
    anisotropy?: number;
    baseTextureSrc?: string;
    normalTextureSrc?: string;
    castShadow?: boolean;
    receiveShadow?: boolean;
    rigidBodyType?: RigidBodyTypeString;
};

const Element = ({
    position,
    rotation,
    width = DEFAULT_ELEMENT_SIZE,
    height = DEFAULT_ELEMENT_SIZE,
    depth = DEFAULT_ELEMENT_DEPTH,
    widthTextureDivider,
    heightTextureDivider,
    anisotropy = 16,
    baseTextureSrc,
    normalTextureSrc,
    castShadow = true,
    receiveShadow = true,
    rigidBodyType = 'fixed',
}: ElementProps) => {
    const textureBase = baseTextureSrc
        ? getTexture(
              width,
              height,
              baseTextureSrc,
              anisotropy,
              widthTextureDivider,
              heightTextureDivider
          )
        : null;
    const textureNormal = normalTextureSrc
        ? getTexture(
              width,
              height,
              normalTextureSrc,
              anisotropy,
              widthTextureDivider,
              heightTextureDivider
          )
        : null;

    return (
        <RigidBody position={position} rotation={rotation} type={rigidBodyType}>
            <CuboidCollider args={[width / 2, height / 2, depth / 2]} />
            <mesh castShadow={castShadow} receiveShadow={receiveShadow}>
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial
                    map={textureBase}
                    normalMap={textureNormal}
                />
            </mesh>
        </RigidBody>
    );
};

export default Element;
