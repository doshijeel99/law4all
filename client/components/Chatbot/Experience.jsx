"use client";
import {
  CameraControls,
  Environment,
  Gltf,
  Html,
  useProgress,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Chatbot from "./ChatbotUser";
import { degToRad } from "three/src/math/MathUtils";
import { Suspense, useState } from "react";
import { TypingBox } from "./TypingBox";
import MessageBox from "./MessageBox";
import { useLanguage } from "@/context/LanguageContext";
import { Thinking } from "@/public/images";
import Image from "next/image";
import { useChatbot } from "@/context/ChatbotContext";

const CameraManager = () => {
  return (
    <CameraControls
      minZoom={1}
      maxZoom={2}
      polarRotateSpeed={-0.3}
      azimuthRotateSpeed={-0.3}
      mouseButtons={{
        left: 1,
        wheel: 16,
      }}
      touches={{
        one: 32,
        two: 512,
      }}
      minAzimuthAngle={degToRad(-10)}
      maxAzimuthAngle={degToRad(10)}
      minPolarAngle={degToRad(90)}
      maxPolarAngle={degToRad(100)}
    />
  );
};

const Loader = ({ progress }) => {
  const { dict } = useLanguage();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-4 space-y-4 w-72">
        <p className="text-xl font-semibold">{dict?.chatbot?.loading}</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500">{Math.round(progress)}%</p>
      </div>
    </Html>
  );
};

const Experience = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [animationNumber, seblueimationNumber] = useState(6);
  const { progress } = useProgress();
  const { currentBot } = useChatbot();

  return (
    <div className="rounded-xl bg-center h-full w-full relative overflow-hidden">
      <div
        className={`z-10 md:justify-center absolute bottom-4 left-4 right-4 flex gap-3 flex-wrap justify-stretch ${
          Math.round(progress) !== 100 ? "hidden" : ""
        }`}
      >
        <TypingBox
          setMessage={setMessage}
          loading={loading}
          setLoading={setLoading}
          seblueimationNumber={seblueimationNumber}
          currentBot={currentBot}
        />
      </div>
      <div
        className={`z-10 md:justify-center absolute top-10 right-12 ${
          Math.round(progress) !== 100 ? "hidden" : ""
        }`}
      >
        <MessageBox message={message} />
      </div>
      <div
        className={`z-10 md:justify-center absolute top-3 left-48 flex flex-wrap justify-stretch ${
          Math.round(progress) !== 100 ? "hidden" : ""
        }`}
      >
        {loading && (
          <Image src={Thinking} alt="thinking" className="h-20 w-auto" />
        )}
      </div>
      <Canvas
        camera={{
          position: [0, 0, 3],
          fov: 50,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Environment preset="sunset" />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} intensity={0.5} />
        <Suspense fallback={<Loader progress={progress} />}>
          <Gltf
            src="/models/office.glb"
            position={[-0.5, -0.5, -1]} // Centered, slightly above the ground
            rotation-y={degToRad(140)} // Rotated for a better view
            scale={0.7}
          />

          <Chatbot
            position={[-0.99, -0.5, 1.2]} // Adjusted for the scene and lawyer placement
            scale={0.6}
            rotation-x={degToRad(0)} // Facing forward (adjust!)
            rotation-y={degToRad(35)}
            rotation-z={degToRad(0)}
            animationNumber={animationNumber}
            name="lawyer"
          />
        </Suspense>
        <CameraManager />
      </Canvas>
    </div>
  );
};

export default Experience;
