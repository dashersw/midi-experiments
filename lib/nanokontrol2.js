import MIDIAccess from './midi-access.js';
import Mixable from './mixable.js';

export default class nanoKONTROL2 extends MIDIAccess(Mixable) {
    onMidiMessage({type, data}) {
        console.log(type, data);
    }

    clear() {}

    dumpScene() {
        this.output.send([0xf0,0x42,0x40,0x00,0x01,0x13,0x00,0x1f,0x10,0x00,0xf7]);
    }
}

nanoKONTROL2.INPUT_IDENTIFIER = 'nanoKONTROL2 SLIDER/KNOB';
nanoKONTROL2.OUTPUT_IDENTIFIER = 'nanoKONTROL2 CTRL';

window.nanoKONTROL2 = nanoKONTROL2;
