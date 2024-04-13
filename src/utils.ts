import { useLoader } from '@react-three/fiber';
import {
    AnimationAction,
    AnimationMixer,
    Group,
    Mesh,
    Object3DEventMap,
    RepeatWrapping,
    Texture,
    TextureLoader,
} from 'three';
import { DEFAULT_ELEMENT_SIZE } from '@/constants';

export const getTexture = (
    width: number,
    height: number,
    textureSrc: string,
    anisotropy: number = 1,
    widthTextureDivider: number = DEFAULT_ELEMENT_SIZE,
    heightTextureDivider: number = DEFAULT_ELEMENT_SIZE
): Texture => {
    let texture = useLoader(TextureLoader, textureSrc);
    texture = texture.clone();
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(
        width / widthTextureDivider,
        height / heightTextureDivider
    );
    texture.anisotropy = anisotropy;
    return texture;
};

export const setModelShadow = (model: Group<Object3DEventMap>): void => {
    model.traverse((child) => {
        if (child instanceof Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
};

export const getActionFromAnimation = (
    mixer: AnimationMixer,
    animation: Group,
    model: Group
): AnimationAction => {
    return mixer.clipAction(animation.animations[0], model);
};
