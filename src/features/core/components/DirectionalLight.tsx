import React from 'react';
import { DEFAULT_ELEMENT_SIZE } from '@/constants';

const DirectionalLight = () => {
    // TODO: refactor
    const halfSize = DEFAULT_ELEMENT_SIZE * 32;
    return (
        <mesh position={[1200, 800, -1200]}>
            <directionalLight
                color='white'
                intensity={0.8}
                target-position={[0, 0, 0]}
                castShadow={true}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            >
                <orthographicCamera
                    attach='shadow-camera'
                    near={1.0}
                    far={halfSize*2}
                    left={-halfSize * 0.75}
                    right={halfSize * 0.75}
                    top={halfSize * 0.5}
                    bottom={-halfSize * 0.33}
                />
            </directionalLight>
            {/* To see where the Light is */}
            <mesh scale={[50, 50, 50]}>
                <sphereGeometry args={[0.2, 30, 10]} />
                <meshStandardMaterial color='yellow' />
            </mesh>
        </mesh>
    );
};

export default DirectionalLight;
