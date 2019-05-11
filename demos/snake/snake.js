import Launchpad from '/lib/launchpad.js';

const lp = window.lp = new Launchpad();

class SnakeGame {
    constructor() {
        this.grid = Array.from(Array(64));
        this.setPlayer([20, 21, 22]);
        this.setBait();
        this.elongate = 0;
        this.elongateLimit = 3;
        this.interval = 500;

        this.direction = SnakeGame.Directions.LEFT;
        this.newDirection = this.direction;

        this.startGame();

        const origOnMidiMessage = lp.onMidiMessage.bind(lp);

        lp.onMidiMessage = ({type, data}) => {
            if (data[0] != 176) return origOnMidiMessage({type, data});
            if (data[1] != SnakeGame.Moves.LEFT && data[1] != SnakeGame.Moves.RIGHT) return;
            if (data[2] == 0) return;

            this.newDirection = SnakeGame.DirectionsMap[data[1]][this.direction];
        }
    }

    startGame() {
        this.interval = setInterval(() => this.onInterval(), this.interval * 0.7);
    }

    gameOver() {
        lp.clear();
        lp.intervalLength = 100;
        lp.defaultColor = Launchpad.Colors.RED;
        lp.scrollMessage('fail!'.repeat(100));
        clearInterval(this.interval);
    }

    setPlayer(player) {
        this.player && this.player.forEach(c => this.grid[c] = 'empty');
        this.player = player;
        this.player.forEach(c => this.grid[c] = 'player');
    }

    setBait() {
        this.bait = Math.floor(Math.random() * 64);
        if (this.player.indexOf(this.bait) > -1) return this.setBait();

        this.grid[this.bait] = 'bait';
    }

    onInterval() {
        const player = Array.from(this.player);
        this.direction = this.newDirection;
        const newPosition = player[0] + this.direction;

        if (player[0] % 8 == 0 && newPosition % 8 == 7 ||
            player[0] % 8 == 7 && newPosition % 8 == 0 ||
            newPosition < 0 || newPosition > 63)
            return this.gameOver();

        if (newPosition == this.bait) {
            this.elongate = this.elongateLimit;
            this.setBait();
        }
        if (this.elongate == 0) player.pop();
        if (player.indexOf(newPosition) > -1) return this.gameOver();

        if (this.elongate > 0) this.elongate--;

        player.unshift(newPosition);
        this.setPlayer(player);
        this.updateGrid();
        // this.directionTile = null;
    }

    updateGrid() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const index = row * 8 + col;
                const cell = this.grid[index];
                const color = SnakeGame.Colors[cell] || Launchpad.Colors.OFF;

                lp.setLED(row, col, color);
            }
        }
    }
}

SnakeGame.Directions = {
    UP: -8,
    LEFT: -1,
    DOWN: 8,
    RIGHT: 1,
}

SnakeGame.Moves = {
    LEFT: 104,
    RIGHT: 105,
}

SnakeGame.Colors = {
    player: Launchpad.Colors.AMBER,
    bait: Launchpad.Colors.GREEN,
}

SnakeGame.DirectionsMap = {
    [SnakeGame.Moves.LEFT]: {
        [SnakeGame.Directions.UP]: SnakeGame.Directions.LEFT,
        [SnakeGame.Directions.LEFT]: SnakeGame.Directions.DOWN,
        [SnakeGame.Directions.DOWN]: SnakeGame.Directions.RIGHT,
        [SnakeGame.Directions.RIGHT]: SnakeGame.Directions.UP,
    },
    [SnakeGame.Moves.RIGHT]: {
        [SnakeGame.Directions.UP]: SnakeGame.Directions.RIGHT,
        [SnakeGame.Directions.LEFT]: SnakeGame.Directions.UP,
        [SnakeGame.Directions.DOWN]: SnakeGame.Directions.LEFT,
        [SnakeGame.Directions.RIGHT]: SnakeGame.Directions.DOWN,
    },
}

new SnakeGame();
