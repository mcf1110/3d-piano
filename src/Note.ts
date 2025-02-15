// Mapping from pitch class (0-11) to note names.
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

export class Note {
    public readonly midiNumber: number;
    public readonly pitchClass: number;
    public readonly octave: number;

    // Private constructor; use the smart constructor below.
    private constructor(midiNumber: number) {
        this.midiNumber = midiNumber;
        this.pitchClass = midiNumber % 12;
        // Using the common convention where MIDI note 0 is C-1.
        this.octave = Math.floor(midiNumber / 12) - 1;
    }

    /**
     * Smart constructor to create a Note instance from a MIDI number.
     * @param midiNumber - A MIDI note number (0-127)
     * @throws {RangeError} if midiNumber is out of the 0-127 range.
     */
    public static fromMidiNumber(midiNumber: number): Note {
        if (midiNumber < 0 || midiNumber > 127) {
            throw new RangeError("MIDI number must be between 0 and 127");
        }
        return new Note(midiNumber);
    }

    /** Returns the full note name (e.g., "C4", "F#3"). */
    public getNoteName(): `${(typeof NOTE_NAMES)[number]}${number}` {
        return `${NOTE_NAMES[this.pitchClass]}${this.octave}`;
    }

    /** Returns true if the note is a black key (e.g., C#, D#, F#, etc.). */
    public isBlackKey(): boolean {
        return NOTE_NAMES[this.pitchClass].includes("#");
    }
}
