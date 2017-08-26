import gridFont from './grid-font.js';

export default (subclass) => class LaunchpadWriter extends subclass {
    constructor() {
        super(...arguments);

        this.intervalLength = 300;
    }
    drawLetter(letter, offset = 0, color = this.defaultColor) {
        if (!letter) return;

        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 4; col++) {
                if (col + offset < 0) continue;
                if (col + offset > 7) continue;

                const val = letter[row * 4 + col];
                this.setLED(row, col + offset, val ? color : Launchpad.Colors.OFF);
            }
        }
    }

    setMessage(message) {
        message = message.toUpperCase();

        this.message = message;
        this.encodedMessage = this.message.split('').map(letter => gridFont[letter] || gridFont['?']);

        this.stopScroll();
        this.clear();
        this.scrollIteration = 0;
    }

    scrollMessage(message) {
        if (message) this.setMessage(`  ${message}`);
        if (!this.encodedMessage) return;

        this.advanceScroll();

        this.scrollInterval = setInterval(() => {
            const index = Math.floor(this.scrollIteration / 4);
            if (index > this.encodedMessage.length) return this.stopScroll();

            this.advanceScroll();
        }, this.intervalLength);
    }

    stopScroll() {
        clearInterval(this.scrollInterval);
    }

    advanceScroll() {
        const index = Math.floor(this.scrollIteration / 4);
        const offset = -this.scrollIteration % 4;

        if (index > this.encodedMessage.length) return;

        this.drawLetter(this.encodedMessage[index], offset);
        this.drawLetter(this.encodedMessage[index + 1], offset + 4);
        this.drawLetter(this.encodedMessage[index + 2], offset % 4 + 8);
        this.scrollIteration++;
    }
}
