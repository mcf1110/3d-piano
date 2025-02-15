import { useState, useEffect } from "react";

export function useNotes(): Set<number> {
    const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());

    useEffect(() => {
        let midiAccess: MIDIAccess | null = null;

        const handleMIDIMessage = (event: MIDIMessageEvent) => {
            if (event.data?.length !== 3) {
                return;
            }
            const [status, note, velocity] = event.data.values();
            const isNoteOn = status === 144 && velocity > 0;
            const isNoteOff = status === 128 || (status === 144 && velocity === 0);

            if (!isNoteOn && !isNoteOff) {
                return;
            }

            setActiveNotes((prevNotes: Set<number>) => {
                const newNotes = new Set(prevNotes);
                if (isNoteOn) {
                    newNotes.add(note);
                } else if (isNoteOff) {
                    newNotes.delete(note);
                }
                return newNotes;
            });
        };

        const startMIDI = async () => {
            try {
                midiAccess = await navigator.requestMIDIAccess();
                for (const input of midiAccess.inputs.values()) {
                    input.addEventListener("midimessage", handleMIDIMessage);
                }
            } catch (error) {
                console.error("Error accessing MIDI devices: ", error);
            }
        };

        startMIDI();

        return () => {
            if (midiAccess) {
                for (const input of midiAccess.inputs.values()) {
                    input.removeEventListener("midimessage", handleMIDIMessage);
                }
            }
        };
    }, []);

    return activeNotes;
}
