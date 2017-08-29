export default (subclass) => class MIDIAccess extends subclass {
    constructor() {
        super(...arguments);
        this.initializeMIDIAccess();
    }
    initializeMIDIAccess() {
        navigator
            .requestMIDIAccess()
            .then((access) => {
                const inputs = access.inputs.values();
                const outputs = access.outputs.values();

                access.onstatechange = (e) => {
                    console.log(e.port.name, e.port.manufacturer, e.port.state, e);
                    if (e.port.type == 'input' && e.port.state == 'connected' && e.port.onmidimessage != this.onMidiMessage) {
                        this.bindToDevice(inputs, outputs);
                    }
                };

                if (access.inputs.size > 0 || access.outputs.size > 0) this.bindToDevice(inputs, outputs);
            });
    }

    bindToDevice(inputs, outputs) {
        for (let input of inputs) {
            if (input.name == this.constructor.INPUT_IDENTIFIER)
                input.onmidimessage = this.onMidiMessage;
        }

        for (let output of outputs) {
            if (output.name == this.constructor.OUTPUT_IDENTIFIER)
                this.output = output;
        }

        this.clear();
    }
}
