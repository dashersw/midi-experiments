export default (subclass) => class LaunchpadWriter extends subclass {
    constructor() {
        super(...arguments);
        this.initializeMIDIAccess();
        this.onMidiMessage = this.onMidiMessage.bind(this);
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

                if (access.inputs.size == 1) this.bindToDevice(inputs, outputs);
            });
    }

    bindToDevice(inputs, outputs) {
        for (let input of inputs) {
            input.onmidimessage = this.onMidiMessage;
        }

        for (let output of outputs) {
            this.output = output;
        }

        this.clear();
    }
}