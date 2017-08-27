const gridFont = `
     A  BB   CC DD  EEE FFF GGG H H III   J K K L   M M N N  O  PPP  O  RRR SSS TTT U U V V W W X X Y Y ZZZ !   ???    .
    A A B B C   D D E   F   G   H H  I    J K K L   MMM NNN O O P P O O R R S    T  U U V V W W X X Y Y   Z !     ?    .
    AAA BB  C   D D EEE FFF G G HHH  I    J KK  L   M M NNN O O PPP O O RR  SSS  T  U U V V W W  X  YYY  Z  !    ??    .
    A A B B C   D D E   F   G G H H  I    J K K L   M M N N O O P    O  R R   S  T  U U V V WWW X X  Y  Z              .
    A A BB   CC DD  EEE F   GGG H H III JJ  K K LLL M M N N  O  P     O R R SSS  T  UUU  V  W W X X  Y  ZZZ !    ?     .
`.slice(1).replace(/\n/g, '');

const alphabet = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ!?';

const letters = {};
alphabet.split('').forEach((letter, index) => {
    const rv = [];
    const alphabetLength = alphabet.length;

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 4; col++) {
            rv.push(gridFont[row * (alphabetLength + 1) * 4 + index * 4 + col] == ' ' ? undefined : 1);
        }
    }
    letters[letter] = rv;
});

export default letters;
