import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { useThree } from "@react-three/fiber";

interface FieldProps {
  isSpeaking?: boolean;
}

const Field = ({ isSpeaking = false }: FieldProps) => {
  const texture = useTexture("/textures/backgroundBot.jpg");
  const viewport = useThree((state) => state.viewport);
  return (
    <>
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} />
      <Avatar position={[0, -2, 4]} scale={1.7} isSpeaking={isSpeaking} />
      <Environment preset="sunset" />
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Speaking indicator light */}
      {isSpeaking && (
        <pointLight
          position={[0, 2, 5]}
          intensity={0.5}
          color="#4ade80"
          distance={10}
        />
      )}
    </>
  );
};

export default Field;
