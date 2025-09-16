import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { useThree } from "@react-three/fiber";

const Field = () => {
  const texture = useTexture("/textures/backgroundBot.jpg");
  const viewport = useThree((state) => state.viewport)
  return (
    <>
      <OrbitControls />
      <Avatar position={[0, -2, 4]} scale={1.7} />
      <Environment preset="sunset" />
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
};

export default Field;
