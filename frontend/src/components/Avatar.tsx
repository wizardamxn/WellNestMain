import * as React from "react";
import { Group } from "three";
import { useGraph } from "@react-three/fiber";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

type ModelProps = JSX.IntrinsicElements["group"] & {
  isSpeaking?: boolean;
  emotion?: "happy" | "sad" | "thinking" | "greeting" | "idle";
};

export function Avatar(props: ModelProps) {
  const { isSpeaking, emotion = "idle", ...groupProps } = props;
  const { animations: idleAnimation } = useFBX("/animations/BreathingIdle.fbx");
  const { animations: nodAnimation } = useFBX(
    "/animations/ThoughtfulHeadNod.fbx"
  );
  const { animations: talkingAnimation } = useFBX("/animations/Talking.fbx");
  const { animations: laughingAnimation } = useFBX("/animations/Laughing.fbx");
  const { animations: greetingAnimation } = useFBX(
    "/animations/StandingGreeting.fbx"
  );
  const { scene } = useGLTF("/models/68c93d677a525019305e2cce.glb");
  const clone = React.useMemo(
    () => SkeletonUtils.clone(scene) as Group,
    [scene]
  );
  const { nodes, materials } = useGraph(clone);
  idleAnimation[0].name = "Idle";
  nodAnimation[0].name = "Nod";
  talkingAnimation[0].name = "Talking";
  greetingAnimation[0].name = "Greeting";
  laughingAnimation[0].name = "Laughing";

  const [animation, setAnimation] = React.useState("Idle");

  const group = React.useRef<THREE.Group>(null!);
  const { actions } = useAnimations(
    [
      idleAnimation[0],
      nodAnimation[0],
      talkingAnimation[0],
      laughingAnimation[0],
      greetingAnimation[0],
    ],
    group
  );

  // Handle speaking and emotion animations
  React.useEffect(() => {
    if (isSpeaking) {
      setAnimation("Talking");
    } else {
      switch (emotion) {
        case "happy":
          setAnimation("Laughing");
          break;
        case "sad":
          setAnimation("Nod");
          break;
        case "thinking":
          setAnimation("Nod");
          break;
        case "greeting":
          setAnimation("Greeting");
          break;
        default:
          setAnimation("Idle");
      }
    }
  }, [isSpeaking, emotion]);

  React.useEffect(() => {
    actions[animation]?.reset().fadeIn(0.5).play();
    return () => actions[animation]?.fadeOut(0.5);
  }, [animation]);

  return (
    <group {...groupProps} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload("/models/68c93d677a525019305e2cce.glb");
