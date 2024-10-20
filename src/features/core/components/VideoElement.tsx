import { useEffect, useRef } from 'react';
import { Mesh, MeshBasicMaterial, VideoTexture } from 'three';
import { Vector3D } from '@/types';

type VideoElementProps = {
    position: Vector3D;
    width?: number;
    height?: number;
    url: string;
};

const VideoElement = ({ url, position, width, height }: VideoElementProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const textureRef = useRef<VideoTexture | null>(null);
    const meshRef = useRef<Mesh | null>(null);

    useEffect(() => {
        // Create a video element
        const video = document.createElement('video');
        video.src = url;
        video.crossOrigin = 'anonymous'; // Ensure cross-origin compatibility if needed
        video.loop = true; // Set the video to loop
        video.muted = true; // Mute the video (optional)
        video.play(); // Autoplay the video

        videoRef.current = video;

        // Create a video texture from the video element
        const videoTexture = new VideoTexture(video);
        textureRef.current = videoTexture;

        // Apply the video texture to the material of the mesh
        if (meshRef.current) {
            const material = new MeshBasicMaterial({ map: videoTexture });
            meshRef.current.material = material;
        }

        return () => {
            // Clean up resources
            video.pause();
            video.src = ''; // Stop the video and release the source
            videoTexture.dispose(); // Dispose of the texture
        };
    }, [url]);

    // Render a plane that will display the video texture
    return (
        <mesh ref={meshRef} position={position}>
            <planeGeometry args={[width, height]} />
            {/* Plane size */}
        </mesh>
    );
};

export default VideoElement;
