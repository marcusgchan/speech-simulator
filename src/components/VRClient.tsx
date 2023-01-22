import React, { useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import {
  VRButton,
  ARButton,
  XR,
  Controllers,
  Hands,
  useXR,
  useController,
  Interactive,
} from "@react-three/xr";
import { Canvas, useFrame, type MeshProps } from "@react-three/fiber";
import { Text, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { clientEnv } from "../env/schema.mjs";
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(
  clientEnv.NEXT_PUBLIC_SPEECHLY_CLIENT_ID as string
);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

const cards: { id: string; rank: number; text: string }[] = [
  {
    id: "wait",
    rank: 1,
    text: "hello blah blah nlaj nalnln nlbalh nalnln nlbalh hello blah blah nlaj nalnln nlbalh nalnln nlbalh",
  },
  { id: "lol", rank: 2, text: "easy easy easy easy easy" },
];

const VRClient = () => {
  const [cardIndex, setCardIndex] = useState(0);
  const increment = () => {
    if (cardIndex + 1 === cards.length) {
      setCardIndex(cardIndex);
    } else {
      setCardIndex(cardIndex + 1);
    }
  };
  const decrement = () => {
    if (cardIndex === 0) {
      setCardIndex(cardIndex);
    } else {
      setCardIndex(cardIndex - 1);
    }
  };
  const isLeftPressed = useRef(false);
  const isRightPressed = useRef(false);

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    resetTranscript,
  } = useSpeechRecognition({});

  if (!browserSupportsSpeechRecognition) {
    return <span> Browser does not support speech to text.</span>;
  }

  if (!isMicrophoneAvailable) {
    return <span> Please allow access to microphone.</span>;
  }

  return (
    <>
      <div>
        <p>Microphone: {listening ? "on" : "off"}</p>
        <button
          onClick={() => SpeechRecognition.startListening({ continuous: true })}
        >
          Start
        </button>
        <button onClick={SpeechRecognition.stopListening}>Stop</button>
        <button onClick={resetTranscript}>Reset</button>
        <p>{transcript}</p>
      </div>
      <VRButton />
      <Canvas>
        <XR
          onSessionStart={() => {
            SpeechRecognition.startListening({ continuous: true });
          }}
          onSessionEnd={() => {
            SpeechRecognition.stopListening();
          }}
        >
          <Controllers />
          <PlayerController
            cardIndex={cardIndex}
            increment={increment}
            decrement={decrement}
            isLeftPressed={isLeftPressed}
            isRightPressed={isRightPressed}
          />
          <Hands />
          <Model />
          <Interactive>
            <mesh
              position={[-0.05, 1.1, 0.8]}
              scale={[1.7, 0.7, 0.01]}
              rotation={[0, 9.5, 0]}
            >
              <mesh position={[-0.49, 0.45, 0.6]}>
                <Text
                  scale={[0.1, 0.2, 0.1]}
                  fontSize={0.3}
                  color={"black"}
                  anchorX="left"
                  anchorY="top"
                  maxWidth={10}
                  whiteSpace="normal"
                >
                  {cards[cardIndex]?.text}
                </Text>
              </mesh>
              <boxGeometry />
              <meshBasicMaterial color="blue" />
            </mesh>
          </Interactive>
          <mesh position={[0, 1.1, -1]} scale={[0.6, 0.4, 0.2]}>
            <boxGeometry />
            <meshBasicMaterial color="blue" />
          </mesh>
          <LightBulb />
        </XR>
      </Canvas>
    </>
  );
};
function PlayerController({
  translationSpeed = 2,
  rotationSpeed = 2,
  cardIndex,
  increment,
  decrement,
  isLeftPressed: isLeftPressed,
  isRightPressed: isRightPressed
}: {
  translationSpeed?: number;
  rotationSpeed?: number;
  cardIndex: number;
  isLeftPressed: React.MutableRefObject<boolean>;
  isRightPressed: React.MutableRefObject<boolean>;
  increment: () => void;
  decrement: () => void;
}): null {
  const {
    // An array of connected `XRController`
    controllers,
    // Whether the XR device is presenting in an XR session
    isPresenting,
    // Whether hand tracking inputs are active
    isHandTracking,
    // A THREE.Group representing the XR viewer or player
    player,
    // The active `XRSession`
    session,
    // `XRSession` foveation. This can be configured as `foveation` on <XR>. Default is `0`
    foveation,
    // `XRSession` reference-space type. This can be configured as `referenceSpace` on <XR>. Default is `local-floor`
    referenceSpace,
  } = useXR();

  const leftController = useController("left");
  const rightController = useController("right");

  const arrowRef = useRef<THREE.ArrowHelper>();

  const yBasisVector = new THREE.Vector3(0, 1, 0);
  const zeroVector = new THREE.Vector3(0, 0, 0);

  useFrame(({ gl, scene, camera, controls, viewport, internal }, delta) => {
    if (!session) return null;

    // In the future make player body turn when the camera reaches a certain threshold

    const cameraWorldDirecitonNormalized = camera
      .getWorldDirection(new THREE.Vector3(0, 0, 0))
      .normalize();

    // Player rotation
    const rightControllerGamepad = rightController?.inputSource.gamepad;
    if (rightControllerGamepad) {
      if (rightControllerGamepad.axes[2]) {
        player.rotateY(delta * rotationSpeed * -rightControllerGamepad.axes[2]);
      }
      if (rightControllerGamepad.buttons[0]?.pressed) {
        if (!isRightPressed.current) {
          isRightPressed.current = true;
          increment();
        }
      } else {
        isRightPressed.current = false;
      }
    }

    // Player translation
    const leftControllerGamepad = leftController?.inputSource.gamepad;
    if (leftControllerGamepad) {
      if (leftControllerGamepad.axes[2]) {
        const translationDx =
          delta * translationSpeed * leftControllerGamepad.axes[2];
        player.position.add(
          new THREE.Vector3(
            cameraWorldDirecitonNormalized.clone().cross(yBasisVector).x,
            0,
            cameraWorldDirecitonNormalized.clone().cross(yBasisVector).z
          ).multiplyScalar(translationDx)
        );
      }
      if (leftControllerGamepad.axes[3]) {
        const translationDz =
          delta * translationSpeed * leftControllerGamepad.axes[3];
        player.position.add(
          new THREE.Vector3(
            -cameraWorldDirecitonNormalized.x,
            0,
            -cameraWorldDirecitonNormalized.z
          ).multiplyScalar(translationDz)
        );
      }
      if (leftControllerGamepad.buttons[0]?.pressed) {
        if (!isLeftPressed.current) {
          isLeftPressed.current = true;
          decrement();
        } else {
        isLeftPressed.current = false;
        }
      }
    }

    // Laser foar testing
    if (arrowRef.current) scene.remove(arrowRef.current);
    arrowRef.current = new THREE.ArrowHelper(
      camera.getWorldDirection(zeroVector),
      camera.getWorldPosition(zeroVector),
      100,
      Math.random() * 0xffffff
    );
    scene.add(arrowRef.current);
  });
  return null;
}

function LightBulb(props: MeshProps) {
  return (
    <mesh {...props}>
      <pointLight castShadow />
      <sphereGeometry args={[0.2, 30, 10]} />
      <meshPhongMaterial emissive={"yellow"} />
    </mesh>
  );
}

function Model() {
  const model = useGLTF("http://localhost:3000/classroom.glb");
  return (
    <primitive
      object={model.scene}
      position={[0.6, -0.3, -2.5]}
      rotation={[0, 9.5, 0]}
    />
  );
}

export default VRClient;
