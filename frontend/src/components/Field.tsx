import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { useThree } from "@react-three/fiber";

interface FieldProps {
  isSpeaking?: boolean;
  emotion?: "happy" | "sad" | "thinking" | "greeting" | "idle";
}

const Field = ({ isSpeaking = false, emotion = "idle" }: FieldProps) => {
  const texture = useTexture("/textures/backgroundBot.jpg");
  const viewport = useThree((state) => state.viewport);
  return (
    <>
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} />
      <Avatar
        position={[0, -2, 4]}
        scale={1.7}
        isSpeaking={isSpeaking}
        emotion={emotion}
      />
      <Environment preset="sunset" />
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Emotional lighting */}
      {isSpeaking && (
        <pointLight
          position={[0, 2, 5]}
          intensity={0.8}
          color="#4ade80"
          distance={12}
        />
      )}

      {/* Emotion-based ambient lighting */}
      {emotion === "happy" && <ambientLight intensity={0.6} color="#fbbf24" />}
      {emotion === "sad" && <ambientLight intensity={0.3} color="#60a5fa" />}
      {emotion === "thinking" && (
        <ambientLight intensity={0.4} color="#a78bfa" />
      )}
      {emotion === "greeting" && (
        <ambientLight intensity={0.5} color="#34d399" />
      )}

      {/* Dynamic spotlight based on emotion */}
      <spotLight
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={0.5}
        intensity={emotion === "happy" ? 1.2 : emotion === "sad" ? 0.6 : 0.8}
        color={
          emotion === "happy"
            ? "#fbbf24"
            : emotion === "sad"
            ? "#60a5fa"
            : emotion === "thinking"
            ? "#a78bfa"
            : emotion === "greeting"
            ? "#34d399"
            : "#ffffff"
        }
        castShadow
      />
    </>
  );
};

export default Field;
