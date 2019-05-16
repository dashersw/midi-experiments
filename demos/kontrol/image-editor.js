export default class ImageEditor {
    constructor() {
        this.filters = {
            blur: null,
            brightness: null,
            contrast: null,
            grayscale: null,
            'hue-rotate': null,
            saturate: null,
            sepia: null,
        };

        this.transforms = {
            x: 0,
            y: 0,
            z: 0,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 0.5,
        }

        this.initializeImage();
    }

    initializeImage() {
        this.image = document.querySelector('img');
        this.image.addEventListener('mousedown', () => {
            this.image.filterBackup = this.image.style.filter;
            this.image.style.filter = '';
        });
        this.image.addEventListener('mouseup', () => {
            this.image.style.filter = this.image.filterBackup || '';
        });

        this.applyFilters();
    }

    onData({ data }) {
        console.log(data)
        if (data[1] == 7)
            document.body.style.fontSize = data[2] / 127 + 0.3 + 'em';

        const filterName = ImageEditor.FiltersMap[data[1]];
        if (filterName) {
            const filterVal = ImageEditor.Filters[filterName](data[2]);
            this.filters[filterName] = filterVal;
        }

        const transformName = ImageEditor.TransformsMap[data[1]];
        if (transformName) {
            const transformVal = ImageEditor.Transforms[transformName](data[2]);
            this.transforms[transformName] = transformVal;
        }

        this.applyFilters();
    }

    applyFilters() {
        const filterNames = Object.keys(this.filters);
        const filterVal = filterNames.map(f => this.filters[f] != null ? `${f}(${this.filters[f]})` : '').join(' ');

        const transformNames = Object.keys(this.transforms);
        const transformVal = `translate3d(${this.transforms.x}px, ${this.transforms.y}px, ${this.transforms.z}px) rotateX(${this.transforms.rotateX}deg) rotateY(${this.transforms.rotateY}deg) rotateZ(${this.transforms.rotateZ}deg) scale(${this.transforms.scale})`;

        console.log('filter', filterVal);
        console.log('transform', transformVal);

        this.image.style.filter = filterVal;
        this.image.style.transform = transformVal;

        this.updateControlsDOM();
    }

    updateControlsDOM() {
        const filterNames = Object.keys(this.filters);

        filterNames.forEach(f => {
            document.querySelector(`[filter-name="${f}"]`).innerText = this.filters[f] != null ? this.filters[f] : 'default';
        });
    }
}


ImageEditor.Filters = {
    brightness: val => val / 20,
    contrast: val => val / 20,
    grayscale: val => `${(val * 100 / 127).toFixed(2)}%`,
    saturate: val => val / 20,
    'hue-rotate': val => `${Math.round(val / 127 * 360)}deg`,
    blur: val => `${Math.round(val * 50 / 127)}px`,
    sepia: val => `${(val * 100 / 127).toFixed(2)}%`,
}

ImageEditor.Transforms = {
    x: val => (val - 64) * 10,
    y: val => (val - 64) * 10,
    z: val => (val - 64) * 10,
    rotateX: val => Math.round((val - 64) / 127 * 360),
    rotateY: val => Math.round((val - 64) / 127 * 360),
    rotateZ: val => Math.round((val - 64) / 127 * 360),
    scale: val => (val) / 127 * 3,
}

ImageEditor.FiltersMap = {
    0: 'brightness',
    1: 'contrast',
    2: 'saturate',
    3: 'hue-rotate',
    4: 'grayscale',
    5: 'sepia',
    6: 'blur',
}

ImageEditor.TransformsMap = {
    16: 'x',
    17: 'y',
    18: 'z',
    19: 'rotateX',
    20: 'rotateY',
    21: 'rotateZ',
    22: 'scale',
}
