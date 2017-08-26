import Launchpad from './launchpad.js';

const lp = window.lp = new Launchpad();

document.querySelector('#container').insertAdjacentHTML('afterEnd', '<div id="prompt">Write a message</div>');

document.querySelector('#prompt').addEventListener('click', () => {
    const message = prompt('What do you want to write?');
    lp.scrollMessage(message);
});
