import nanoKONTROL2 from '/lib/nanokontrol2.js';
import ImageEditor from './image-editor.js';

const nk = window.nk = new nanoKONTROL2();
const imageEditor = new ImageEditor();

nk.onMidiMessage = imageEditor.onData.bind(imageEditor);
