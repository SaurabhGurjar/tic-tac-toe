const templates = (() => {
    const gameboard = () => {
        return `
        <div class="main">
            <div class="game-info">
                <div class="show-winner-wrapper">
                    <h3 id="show-winner"></h3>
                </div>

            </div>
            <div class="game-board">
                <button class="cell" id="cell-1" data-pos="1" type="button"></button>
                <button class="cell" id="cell-2" data-pos="2" type="button"></button>
                <button class="cell" id="cell-3" data-pos="3" type="button"></button>
                <button class="cell" id="cell-4" data-pos="4" type="button"></button>
                <button class="cell" id="cell-5" data-pos="5" type="button"></button>
                <button class="cell" id="cell-6" data-pos="6" type="button"></button>
                <button class="cell" id="cell-7" data-pos="7" type="button"></button>
                <button class="cell" id="cell-8" data-pos="8" type="button"></button>
                <button class="cell" id="cell-9" data-pos="9" type="button"></button>
            </div>
            <div class="player-info">
                <h3 class="player-marker" id="player-1">You: X</h3>
                <div id="play-again-wrapper">
                    <button id="play-again" type="button">Play Again</button>
                </div>
                <h3 class="player-marker" id="player-2">AI: O</h3>
            </div>
        </div>`;
    };

    const inputForm = () => {
        return `<div class="model">
        <div class="input-wrapper">
            <div class="name-wrapper">
                <label for="player-name">Your Name</label>
                <input type="text" name="name" id="player-name" autocomplete="off" spellcheck="false">
            </div>
            <div class="opponent-wrapper name-wrapper">
                <label for="opponent-name">Choose opponent</label>
                <input type="text" name="name" id="opponent-name" autocomplete="off" spellcheck="false">
            </div>
            <div class="select-opponent">
                <input type="submit" id="ai" class="opponent-btn" value="Ai" name="Saurabh">
                <button id="human" class="opponent-btn">Human</button>
            </div>
            <input type="button" value="Play" id="play-btn">
        </div>
    </div>`;
    };

    return {
        gameboard,
        inputForm,
    }
})();

const render = (() => {
    const gameboard = () => {
        const main = document.getElementById('main-container');
        main.innerHTML = templates.gameboard();
    }

    return {
        gameboard,
    }
})();

render.gameboard();

