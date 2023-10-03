const gameboard = (() => {
    const _cells = ['', '', '', '', '', '', '', '', ''];

    const setPosition = (index, player1, player2) => {
        if (player1.turn) {
            _cells[index] = player1.marker;
        } else {
            _cells[index] = player2.marker;
        }
    };

    const getPositions = () => {
        return _cells;
    };

    const _resetCells = () => {
        for (let i = 0; i < _cells.length; i++) {
            _cells[i] = '';
        }
    };
    const reset = () => {
        _resetCells();
    };

    return {
        getPositions,
        setPosition,
        reset,
    };
})();



const displayController = (() => {
    const _winnerWrapper = document.getElementById('show-winner');
    const _cells = document.querySelectorAll('.cell');
    const _playAgainBtn = document.getElementById('play-again');

    const _enableCells = (cell) => {
        cell.disabled = false;
    }
    const renderCellsData = () => {
        const cells = gameboard.getPositions();
        for (let i = 0; i < cells.length; i++) {
            _cells[i].textContent = cells[i];
            _enableCells(_cells[i]);
        }
    };

    const _showTurnText = (player) => {
        _winnerWrapper.textContent = `${player.name}'s turn!`
    }

    const _disableCells = () => {
        _cells.forEach((cell) => {
            cell.setAttribute('disabled', true);
        });
    };

    const showPlayAgainBtn = () => {
        _playAgainBtn.style.display = 'block';
    };

    const hidePlayAgainBtn = () => {
        _playAgainBtn.style.display = 'none';
    }


    const _showTurnBg = (player) => {
        const element = document.getElementById(player.id);
        element.classList.add('player-turn');
        _showTurnText(player);
    };

    const _hideTurnBg = (player) => {
        const element = document.getElementById(player.id);
        element.classList.remove('player-turn');

    }

    const switchTurn = (player1, player2) => {
        if (player1.turn) {
            _showTurnBg(player1);
            _hideTurnBg(player2);
        } else {
            _showTurnBg(player2);
            _hideTurnBg(player1);
        }
    }

    const showTurn = (player) => {
        _showTurnBg(player);
    }

    const showWinner = (player1, player2) => {
        let winner, loser;
        if(player1.win) {
            winner = player1;
            loser = player2;
        } else if(player2.win) {
            winner = player2;
            loser = player1;
        }
        _winnerWrapper.textContent = `${winner.name} wins the game!`;
        _disableCells();
        _hideTurnBg(loser);
        showPlayAgainBtn();

    }

    const showTie = (tie, player1, player2) => {
        if (tie) {
            _winnerWrapper.textContent = `Tie! no one win the game.`
            showPlayAgainBtn();
            _hideTurnBg(player1);
            _hideTurnBg(player2);
        }
    };

    const showMarker = (pos) => {
        const id = `cell-${pos + 1}`;
        const cell = document.getElementById(id);
        cell.textContent = gameboard.getPositions()[pos];
        cell.setAttribute('disabled', true);
    };


    return {
        showMarker,
        showWinner,
        showTie,
        showTurn,
        showPlayAgainBtn,
        hidePlayAgainBtn,
        switchTurn,
        renderCellsData,
    }
})();

const Player = (marker, name, id, turn, win) => {
    const positions = [];
    
    const setPlayerPos = (pos) => {
        positions.push(pos);
    }

    const getPlayerPos = () => {
       return positions;
    }

    return { marker, name, id, turn, win, setPlayerPos, getPlayerPos};
}







// Game winner check module
const check = (() => {
    const _gameBoardArr = gameboard.getPositions();
    const winningPattern = [[0, 2, 1], [3, 5, 1], [6, 8, 1], [0, 6, 3], [1, 7, 3], [2, 8, 3], [0, 8, 4], [2, 6, 2]]; // THESE ARE THE START, END POSITION AND DIFFERECE BETWEEN POSITION FOR WINNER CHECK LOOP

    const _winnerCheck = (start, end, difference) => {
        let _count = 0;
        const mark = _gameBoardArr[start];
        for (let i = start; i <= end; i += difference) {
            if (_gameBoardArr[i] !== '') {
                if (_gameBoardArr[i] === mark) {
                    _count++;
                }
            } else {
                _count = 0;
            }
        }
        if (_count > 2) {
            if (mark === game.player1.marker) {
                game.player1.win = true;
            } else {
                game.player2.win = true;
            }
        }
    }

    const winner = () => {
        const winPatLen = winningPattern.length;
        for(let i = 0; i < winPatLen; i++) {
            _winnerCheck(winningPattern[i][0], winningPattern[i][1], winningPattern[i][2]);
        }
    };
    
    const tie = () => {
        for (const element of _gameBoardArr) {
            if (element === '') return false;
        }
        return true;
    };
    return {
        winner,
        tie,
    }
})();

const game = (() => {

    const player1 = Player('X', 'Player1', 'player-1', true, false);
    const player2 = Player('O', 'Player2', 'player-2', false, false);

    const _switchTurn = () => {
        if (player1.turn) {
            player1.turn = false;
            player2.turn = true;
        } else {
            player1.turn = true
            player2.turn = false;
        }
    }


    displayController.switchTurn(player1, player2);

    const play = (event) => {
        const pos = event.target.dataset.pos - 1;
        gameboard.setPosition(pos, player1, player2);
        if (player1.turn) {
            player1.setPlayerPos(pos);
        } else if (player2) {
            player2.setPlayerPos(pos);
        }

        displayController.showMarker(pos);
        _switchTurn();
        displayController.switchTurn(player1, player2);
        check.winner();
        if (game.player1.win || game.player2.win) {
            displayController.showWinner(game.player1, game.player2); // .showWinner(winner, loser)
        } else if (check.tie) {
            displayController.showTie(check.tie(), player1, player2);
        }
    }

    const reset = () => {
        gameboard.reset();
        displayController.renderCellsData();
        player1.turn = true;
        player2.turn = false;
        player1.win = false;
        player2.win = false
        displayController.hidePlayAgainBtn();
        displayController.showTurn(game.player1);

    };
    return {
        player1,
        player2,
        play,
        reset,
    }
})();



const eventListener = (() => {
    const _playAgainBtn = document.getElementById('play-again');
    const _boardPos = document.querySelectorAll('.cell');
    _boardPos.forEach((cell) => cell.addEventListener('click', game.play));
    _playAgainBtn.addEventListener('click', game.reset)
})();
