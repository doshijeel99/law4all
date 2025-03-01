import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { AnimationMixer, LoopOnce } from "three";
import { useFrame } from "@react-three/fiber";

const Chatbot = ({ animationNumber, name, ...props }) => {
  const { scene, animations } = useGLTF(`/models/${name}.glb`);
  const mixer = useRef(null);
  const actionRef = useRef(null);

  useEffect(() => {
    if (animations.length) {
      if (!mixer.current) {
        mixer.current = new AnimationMixer(scene);
      }

      if (actionRef.current) {
        actionRef.current.fadeOut(0.2);
      }

      const action = mixer.current.clipAction(animations[animationNumber]);
      action.reset().fadeIn(0.2).play();
      actionRef.current = action;

      if (name === "person") {
        action.setLoop(LoopOnce, 1);
        action.clampWhenFinished = true;
      }
    }
  }, [animationNumber, animations, scene, name]);

  useFrame((state, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  );
};

export default Chatbot;
