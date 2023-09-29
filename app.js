const gameboard = (() => {
    const arr = ['', '', '', '', '', '', '', '', ''];

    const setPosition = (pos, marker) => {
        arr[pos] = marker;
    }

    const getPositions = () => {
        return arr;
    }

    return {
        getPositions,
        setPosition,
    };
})();

const displayController = (() => {
    const game = gameboard.getPositions();
    const showMarker = (pos) => {
        const id = `cell-${pos + 1}`;
        const cell = document.getElementById(id);
        cell.textContent = game[pos];
        cell.setAttribute('disabled', true);
    }
    return {
        showMarker,
    }
})();

const Player = (mark) => {
    const marker = mark;
    const positions = [];

    const setPosition = (pos) => {
        positions.push(pos);
    }

    const getPosition = () => {
        return positions;
    }
    return { marker, setPosition, getPosition };
}


const game = (() => {
    const boardPos = document.querySelectorAll('.cell');
    const player1 = Player('X');
    const player2 = Player('O');

    let playCount = 1;
    const getTurn = () => {
        let turn = '';
        if (playCount % 2 === 0) {
            turn = player2.marker;
            playCount++;
        } else {
            turn = player1.marker;
            playCount++;
        }
        return turn;
    }

    // Definition of get board position function 
    const getBoardPos = (callback) => {
        const cell = boardPos.forEach(element => element.addEventListener('click', (e) => {
            callback(e.target.dataset.pos);
        }));
    };

    // Call get board position function and define callback function
    getBoardPos((position) => {
        const pos = position - 1;
        const turn = getTurn();
        gameboard.setPosition(pos, turn);
        if (turn === 'X') {
            player1.setPosition(pos);
            // gameWinner.sort();
        } else {
            player2.setPosition(pos);
            // gameWinner.sort();
        }
        displayController.showMarker(pos);
        gameWinner.checkForWinner();
    });

    return {
        player1,
        player2,
    }
})();

const gameWinner = (() => {

    const checkForWinner = () => {
        const gameBoardArr = gameboard.getPositions();

        const check = (start, end, difference) => {
            let count = 0;
            const mark = gameBoardArr[start];
            for (let i = start; i <= end; i += difference) {
                if (gameBoardArr[i] !== '') {
                    if (gameBoardArr[i] === mark) {
                        count++;
                    }
                } else {
                    count = 0;
                }
            }
            if (count > 2) {
                return console.log(`${mark} wins!`);

            }
        }
        const callRowCheck = () => {
            if(gameBoardArr[0] !== '' && gameBoardArr[2] !== '') check(0, 2, 1);
            if(gameBoardArr[3] !== '' && gameBoardArr[5] !== '') check(3, 5, 1);
            if(gameBoardArr[6] !== '' && gameBoardArr[8] !== '') check(6, 8, 1);
            
        };

        const callColumnCheck = () => {
            if (gameBoardArr[0] !== '' && gameBoardArr[6] !== '') check(0, 6, 3);
            if (gameBoardArr[1] !== '' && gameBoardArr[7] !== '') check(1, 7, 3);
            if (gameBoardArr[2] !== '' && gameBoardArr[8] !== '') check(2, 8, 3);
        }
        const callDiagonalCheck = () => {
            if (gameBoardArr[0] !== '' && gameBoardArr[8] !== '') check(0, 8, 4);
            if (gameBoardArr[2] !== '' && gameBoardArr[6] !== '') check(2, 6, 2);
        }


        callColumnCheck();
        callRowCheck();
        callDiagonalCheck();
    }

    return {
        // sort,
        checkForWinner,
    }
})();
