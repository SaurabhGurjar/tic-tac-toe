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
        if(player1.turn) {
            _showTurnBg(player2);
            _hideTurnBg(player1);
        } else {
            _showTurnBg(player1);
            _hideTurnBg(player2);
        }
    }

    const showTurn = (player) => {
        _showTurnBg(player);
    }

    const showWinner = (winner, loser) => {
        _winnerWrapper.textContent = `${winner.name} wins the game!`;
        _disableCells();
        _hideTurnBg(loser);
        showPlayAgainBtn();

    }

    const showTie = (tie, player1, player2) => {
        if(tie) {
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
    return {marker, name, id, turn, win};
}




const game = (() => {
    const _boardPos = document.querySelectorAll('.cell');

    const player1 = Player('X', 'Player1', 'player-1', false, false);
    const player2 = Player('O', 'Player2', 'player-2', true, false);

    const _switchTurn = () => {
        if(player1.turn) {
            player1.turn = false;
            player2.turn = true;
        } else {
            player1.turn = true
            player2.turn = false;
        }
    }

    // Definition of get board position function 
    const _getBoardPos = (callback) => {
        _boardPos.forEach(element => element.addEventListener('click', (e) => {
            callback(e.target.dataset.pos);
        }));
    };

    // Call get board position function and define callback function
    displayController.switchTurn(player1, player2);
    _getBoardPos((position) => {
        const pos = position - 1;
        _switchTurn();
        gameboard.setPosition(pos, player1, player2);
        displayController.showMarker(pos);
        displayController.switchTurn(player1, player2);;
        displayController.showTie(gameWinner.checkForTie(), player1, player2);
        gameWinner.checkForWinner();
    });

    return {
        player1,
        player2,
    }
})();



// Game winner check module
const gameWinner = (() => {
    const _gameBoardArr = gameboard.getPositions();

    const checkForWinner = () => {

        const _check = (start, end, difference) => {
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
                    displayController.showWinner(game.player1, game.player2); // .showWinner(winner, loser)
                } else {
                    game.player2.win = true;
                    displayController.showWinner(game.player2, game.player1); 
                }
                return;
            }
        }
        const _rowCheck = () => {
            if(_gameBoardArr[0] !== '' && _gameBoardArr[2] !== '') _check(0, 2, 1);
            if(_gameBoardArr[3] !== '' && _gameBoardArr[5] !== '') _check(3, 5, 1);
            if(_gameBoardArr[6] !== '' && _gameBoardArr[8] !== '') _check(6, 8, 1);
        };

        const _columnCheck = () => {
            if (_gameBoardArr[0] !== '' && _gameBoardArr[6] !== '') _check(0, 6, 3);
            if (_gameBoardArr[1] !== '' && _gameBoardArr[7] !== '') _check(1, 7, 3);
            if (_gameBoardArr[2] !== '' && _gameBoardArr[8] !== '') _check(2, 8, 3);
        }
        const _diagonalCheck = () => {
            if (_gameBoardArr[0] !== '' && _gameBoardArr[8] !== '') _check(0, 8, 4);
            if (_gameBoardArr[2] !== '' && _gameBoardArr[6] !== '') _check(2, 6, 2);
        }
        _columnCheck();
        _rowCheck();
        _diagonalCheck();
    }
    
    const checkForTie = () => {
        for (const element of _gameBoardArr) {
            if(element === '') return false;
        }
        return true;
    };
    return {
        checkForWinner,
        checkForTie,
    }
})();



const resetDisplay = (() => {
    const _playAgainBtn = document.getElementById('play-again');
    _playAgainBtn.addEventListener('click', () => {
        gameboard.reset();
        displayController.renderCellsData();
        game.player1.turn = false;
        game.player2.turn = true;
        displayController.hidePlayAgainBtn();
        displayController.showTurn(game.player1);

    });
})();
