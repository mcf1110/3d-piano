import "./App.css";
import { Note } from "./Note";
import { useNotes } from "./useNotes";

import { Canvas } from "@react-three/fiber";
import { Stats, OrbitControls, Stars } from "@react-three/drei";

import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { useMemo } from "react";

const TOTAL_NOTES = 88;
const A0 = 21;
const NOTES_PER_OCTAVE = 12;
const RADIUS = 3;
const HEIGHT_FACTOR = 0.075;
const HEIGHT_OFFSET = -((A0 + TOTAL_NOTES) * HEIGHT_FACTOR) / 2;

function PianoSpiral() {
    const allNotes = useMemo(() => {
        return Array.from({ length: TOTAL_NOTES }, (_, i) => Note.fromMidiNumber(i + A0));
    }, []);
    const currentNotes = useNotes();

    return (
        <group>
            {allNotes.map((note) => {
                const angle = (note.pitchClass / NOTES_PER_OCTAVE) * (Math.PI * 2);
                const x = RADIUS * Math.cos(angle);
                const y = HEIGHT_OFFSET + note.midiNumber * HEIGHT_FACTOR;
                const z = RADIUS * Math.sin(angle);
                const rotationY = Math.atan2(x, z);
                const isOn = currentNotes.has(note.midiNumber);

                const color = note.isBlackKey() ? "black" : "white";
                const emissionColor = `hsl(${(note.pitchClass / NOTES_PER_OCTAVE) * 360}, 100%, 80%)`;
                const scale: [number, number, number] = isOn ? [1.1, 1.1, 1.1] : [1, 1, 1]; // Slight scale change when note is pressed

                return (
                    <mesh key={note.midiNumber} position={[x, y, z]} rotation={[0, rotationY, 0]} scale={scale}>
                        <boxGeometry args={[0.5, 0.2, 1.5]} />
                        <meshStandardMaterial
                            color={color}
                            emissive={emissionColor}
                            emissiveIntensity={isOn ? 5 : 0.1}
                        />
                    </mesh>
                );
            })}
        </group>
    );
}

function App() {
    return (
        <Canvas camera={{ position: [0, 40, 20], fov: 50 }} style={{ background: "#121212" }}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade />
            <ambientLight intensity={0.15} />
            <directionalLight position={[10, 10, 10]} intensity={0.15} />
            <PianoSpiral />

            <OrbitControls />
            <Stats />

            <EffectComposer>
                <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.8} intensity={1.5} />
                <Vignette eskil={false} offset={0.2} darkness={0.6} />
                <Noise opacity={0.02} />
            </EffectComposer>
        </Canvas>
    );
}

export default App;
