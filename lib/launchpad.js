import LaunchpadWriter from './launchpad-writer.js';
import DOMMirror from './dom-mirror.js';
import MIDIAccess from './midi-access.js';
import Mixable from './mixable.js';

export default class Launchpad extends LaunchpadWriter(MIDIAccess(DOMMirror(Mixable))) {
    constructor() {
        super(...arguments);

        this.initializeGrid();
        this.mode = 'momentary';
        this.defaultColor = Launchpad.Colors.AMBER;
    }

    setLED(row = 0, col = 0, color = this.defaultColor) {
        const ledIndex = row * 8 + col;
        const led = Launchpad.LAUNCHPAD_GRID_LEDS[ledIndex];

        this.grid[ledIndex].color = color;

        super.setLED(...arguments);

        this.output.send([0x90, led, color]);
    }

    initializeGrid() {
        this.grid = Array.from(Array(64)).map(() => ({color: Launchpad.Colors.OFF}));
    }

    clear() {
        super.clear();
        this.output.send([0xB0, 0, 0]);
    }

    onMidiMessage({ type, data }) {
        console.log(type, data);

        if (data[0] != 144) return;

        const row = Math.floor(data[1] / 16);
        const col = Math.floor(data[1] % 8);
        let color = data[2] == 0 ? Launchpad.Colors.OFF : this.defaultColor;

        if (data[1] > row * 16 + col) return console.log('control key', 'ABCDEFGH'[row]);

        const ledIndex = row * 8 + col;

        if (this.mode == 'toggle' && data[2] == 0) return;
        if (this.mode == 'toggle' && data[2] == 127) {
            const cellIndex = row * 8 + col;
            const cellColor = this.grid[cellIndex].color;
            color = cellColor == Launchpad.Colors.OFF ? this.defaultColor : Launchpad.Colors.OFF;
        }

        this.setLED(row, col, color);
    }
}

Launchpad.INPUT_IDENTIFIER = 'Launchpad Mini';
Launchpad.OUTPUT_IDENTIFIER = 'Launchpad Mini';

Launchpad.LAUNCHPAD_GRID_LEDS = [
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17,
    0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27,
    0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37,
    0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47,
    0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57,
    0x60, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67,
    0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77,
];

Launchpad.Colors = {
    GREEN: 0x38,
    YELLOW: 0x3A,
    AMBER: 0x3B,
    RED: 0x0B,
    OFF: 0x0C,
}

window.Launchpad = Launchpad;
