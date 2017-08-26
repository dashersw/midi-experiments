function getCellEl(index) {
    return document.querySelector(`#cell_${index}`);
}

export default (subclass) => class LaunchpadWriter extends subclass {
    constructor() {
        super(...arguments);
        this.initialize();
    }

    initialize() {
        this.container = document.querySelector('#container');

        this.container.innerHTML = Array
            .from(Array(64))
            .map((el, i) => `<cell id="cell_${i}" class="color_12" index="${i}"></cell>`)
            .join('');

        const onPointerDown = (e) => {
            if (e.target.tagName != 'CELL') return;

            const cellIndex = e.target.getAttribute('index');
            const cellColor = this.grid[cellIndex].color;

            this.setLED(Math.floor(cellIndex / 8), cellIndex % 8, cellColor == Launchpad.Colors.OFF ? this.defaultColor : Launchpad.Colors.OFF);
        }

        const onPointerUp = (e) => {
            if (e.target.tagName != 'CELL') return;
            if (this.mode == 'toggle') return;

            const cellIndex = e.target.getAttribute('index');

            this.setLED(Math.floor(cellIndex / 8), cellIndex % 8, Launchpad.Colors.OFF);
        }

        this.container.addEventListener('mousedown', onPointerDown);
        this.container.addEventListener('touchstart', onPointerDown);
        this.container.addEventListener('mouseup', onPointerUp);
        this.container.addEventListener('touchend', onPointerUp);
    }

    setLED(row = 0, col = 0, color = this.defaultColor) {
        const ledIndex = row * 8 + col;

        getCellEl(ledIndex).className = `color_${color}`;
    }

    clear() {
        [...document.querySelectorAll('cell')].forEach(cell => cell.className = 'color_12');
    }
}
