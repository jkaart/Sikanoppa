let players = [];
let roundPoints = 0;
let oneDice = true;
let throwNumbers = [[null], [null]];
let currentPlayerIndex = 0;
let nextPlayerIndex = 0;
let currentDiceIndex = 0;
let gameEndPts = 100;

const gameDiv = document.getElementById("game");

const loadDiceFaces = () => {
    const faces = [];
    for (let index = 1; index <= 6; index++) {
        faces.push("./images/dices/d" + index + ".gif");
    }
    return faces;
};

const diceFaces = loadDiceFaces();

const startGame = () => {
    gameDiv.innerHTML = "";
    gameDiv.style.border = "none";
    gameDiv.style.textAlign = "center";
    askPlayers();
};

const notification = (notificationText, timeout) => {
    const notificationDiv = document.getElementById("notification");
    notificationDiv.textContent = notificationText;

    if (timeout) {
        notificationDiv.style.display = "block";
        setTimeout(() => {
            document.getElementById("notification").style.display = "none";
        }, 5000);
    }
    else {
        notificationDiv.style.display = "block";
    }
};

const removePlayer = (event) => {
    const name = players[event.target.value].name;
    players.splice(event.target.value,1);
    updatePlayerList();
    notification("Removed " + name + " player" , true);
};

const updatePlayerList = () => {
    const playerList = document.getElementById("playerList");
    const readyBtn = document.getElementById("ready");

    playerList.innerHTML = "";
    players.forEach((player, index )=> {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        const span = document.createElement("span");
        span.textContent = player.name;
        btn.textContent = "X";
        btn.value = index;
        btn.addEventListener("click", removePlayer);
        li.appendChild(span);
        li.appendChild(btn);
        
        playerList.appendChild(li);
    });

    if (players.length < 2) {
        readyBtn.style.display = "none";
        notification("Need at least 2 players", false);
    }
    else {
        readyBtn.style.display = "block";
        notification("", true);
    }
};

const changeDiceAmount = () => {
    if (oneDice) {
        oneDice = false;
        document.getElementById("diceAmount").textContent = 2;
    }
    else {
        oneDice = true;
        document.getElementById("diceAmount").textContent = 1;
    }
};

const setGameEndPts = (event) => {
    gameEndPts = event.target.value;
};

const clearPlrList = () => {
    players = [];
    updatePlayerList();
};

const askPlayers = () => {
    gameDiv.style.backgroundColor = "#f5f5f5";
    gameDiv.style.border = "solid 1px black";
    gameDiv.style.textAlign = "left";
    const playersListDiv = document.createElement("div");
    playersListDiv.setAttribute("id", "playersList");
    gameDiv.appendChild(playersListDiv);
    const playersListHeader = document.createElement("h3");
    playersListHeader.textContent = "Players list";
    playersListDiv.appendChild(playersListHeader);
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear List";
    clearBtn.setAttribute("id", "clearListBtn");
    clearBtn.addEventListener("click", clearPlrList);
    playersListDiv.appendChild(clearBtn);
    const ol = document.createElement("ol");
    ol.setAttribute("id", "playerList");
    playersListDiv.appendChild(ol);

    const askPlayerDiv = document.createElement("div");
    askPlayerDiv.setAttribute("id", "askPlayerDiv");
    gameDiv.appendChild(askPlayerDiv);

    const settingsDiv = document.createElement("div");
    settingsDiv.setAttribute("id", "settingsDiv");

    const readyBtn = document.createElement("button");
    readyBtn.textContent = "Ready?";
    readyBtn.setAttribute("id", "ready");
    readyBtn.addEventListener("click", gameScreen);
    gameDiv.appendChild(settingsDiv);

    gameDiv.appendChild(readyBtn);
    const diceAmountDiv = document.createElement("div");
    diceAmountDiv.setAttribute("id", "diceAmountDiv");
    settingsDiv.appendChild(diceAmountDiv);
    const diceAmountLbl = document.createElement("h3");
    diceAmountLbl.setAttribute("id", "diceAmountLbl");
    diceAmountLbl.style.display = "inline-block";
    diceAmountLbl.textContent = "How many dices?";
    const diceAmountValue = document.createElement("h3");
    diceAmountValue.setAttribute("id", "diceAmount");
    diceAmountValue.style.display = "inline-block";
    diceAmountValue.textContent = 1;
    const diceAmountBtn = document.createElement("button");
    diceAmountBtn.addEventListener("click", changeDiceAmount);
    diceAmountBtn.setAttribute("id", "diceAmountBtn");
    diceAmountBtn.textContent = "Change";

    diceAmountDiv.appendChild(diceAmountLbl);
    diceAmountDiv.appendChild(diceAmountValue);
    diceAmountDiv.appendChild(diceAmountBtn);
    
    const gameEndPtsDiv = document.createElement("div");
    gameEndPtsDiv.setAttribute("id", "gameEndPtsDiv");
    const gameEndPtsHeader = document.createElement("h3");
    gameEndPtsHeader.textContent = "Points needed to win the game? ";
    gameEndPtsHeader.style.display = "inline-block";
    gameEndPtsDiv.appendChild(gameEndPtsHeader);
    settingsDiv.appendChild(gameEndPtsDiv);

    const select = document.createElement("select");
    select.addEventListener("change", setGameEndPts);
    select.setAttribute("id", "ptsSelect");
    select.setAttribute("name", "pts");

    for (let index = 1; index < 11; index++) {
        const value = 50 * index;
        const option = document.createElement("option");
        if (value === gameEndPts) {
            option.setAttribute("selected", "selected");
        }
        option.value = value;
        option.text = value;
        select.add(option);
    }

    gameEndPtsDiv.appendChild(select);

    const headerTxt = document.createTextNode("Player name:");
    const playerNameLbl = document.createElement("h2").appendChild(headerTxt);
    const inputName = document.createElement("input");
    inputName.setAttribute("id", "inputName");

    const addPlayerBtn = document.createElement("button");
    addPlayerBtn.textContent = "Add";
    addPlayerBtn.setAttribute("id", "addNewPlayer");
    addPlayerBtn.addEventListener("click", addPlayer);

    askPlayerDiv.appendChild(playerNameLbl);
    askPlayerDiv.appendChild(inputName);
    askPlayerDiv.appendChild(addPlayerBtn);
    updatePlayerList();
};

const addPlayer = () => {
    const playerName = document.getElementById("inputName");
    const player = {"name": playerName.value, "points": 0 };
    if (playerName.value.length < 1) {
        notification("Give player name", true);
    }
    else {
        players.push(player);
        updatePlayerList();
        nextPlayerIndex = 1;
        notification("Added " + playerName.value + " player", true);
        playerName.value = "";
    }
    
};

const checkLastThrowNumber = () => {
    const lastNumbers = [throwNumbers[0][throwNumbers[0].length - 1], throwNumbers[1][throwNumbers[1].length - 1]];

    if (oneDice) {
        if (lastNumbers[0] === null) {
            return false;
        }
        else if (lastNumbers[0] === 1) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        if (lastNumbers[0] === null || lastNumbers[1] === null) {
            return false;
        }
        else if (lastNumbers[0] === 1 && lastNumbers[1] !== 1) {
            return false;
        }
        else if (lastNumbers[0] !== 1 && lastNumbers[1] === 1) {
            return false;
        }
        else {
            return true;
        }
    }
};

const throwDice = () => {
    const diceNumber = Math.round(Math.random() * (6 - 1) + 1);
    //console.log("Throw Dice\n diceIndex: " + currentDiceIndex + "\ndiceNumber: " + diceNumber);
    throwNumbers[currentDiceIndex].push(diceNumber);

    if (!checkLastThrowNumber() && currentDiceIndex === 1) {
        document.getElementById("throw").style.display = "none";
        document.getElementById("roundStop").style.display = "none";
        document.getElementById("changePlayer").style.display = "inline-block";
    }

    if (!oneDice && currentDiceIndex === 0) {
        currentDiceIndex = 1;
        throwDice();
    }
    else if (!oneDice && currentDiceIndex === 1) {
        roundPoints += sumPoints();
        if (throwNumbers[1].length > 3) {
            const numbers1 = throwNumbers[0].slice(throwNumbers[0].length - 3, throwNumbers[0].length);
            const numbers2 = throwNumbers[1].slice(throwNumbers[1].length - 3, throwNumbers[1].length);
            if (numbers1[0] === numbers2[0] && numbers1[1] === numbers2[1] && numbers1[2] === numbers2[2]) {
                changePlayer();
            }
        }
        else {
            currentDiceIndex = 0;
        }
    }
    else if (!checkLastThrowNumber() && oneDice) {
        document.getElementById("diceNumber1").style.display = "none";
        document.getElementById("throw").style.display = "none";
        document.getElementById("roundStop").style.display = "none";
        document.getElementById("changePlayer").style.display = "inline-block";
    }
    else {
        currentDiceIndex = 0;
    }
    updateScreen();
};

const sumPoints = () => {
    let sum = 0;
    if (oneDice) {
        throwNumbers[0].forEach(num => {
            sum += num;
        });
    }
    else {
        for (let index = 0; index < throwNumbers[0].length; index++) {
            const number1 = throwNumbers[0][index];
            const number2 = throwNumbers[1][index];
            if (number1 === number2) {
                if (number1 === 1 && number2 === 1) {
                    sum = 25;
                }
                else {
                    sum = (number1 + number2) * 2;
                }
            }
            else {
                sum = number1 + number2;
            }
        }
    }
    return sum;
};

const clearPlayersPts = () => {
    players.forEach(player => {
        player.points = 0;        
    });
}; 

const winScreen = (name, points) => {
    gameDiv.innerHTML = "";
    const winDiv = document.createElement("div");
    winDiv.setAttribute("id", "winDiv");
    const win = document.createElement("h2");
    win.textContent = name + " win with " + points + " points!";
    const newGameBtn = document.createElement("button");
    newGameBtn.textContent = "New Game?";
    newGameBtn.addEventListener("click", startGame);
    gameDiv.appendChild(winDiv);
    winDiv.appendChild(win);
    winDiv.appendChild(newGameBtn);
    clearPlayersPts();
    currentPlayerIndex = 0;
};

const updateScreen = () => {
    document.getElementById("currentPlayer").textContent = players[currentPlayerIndex].name;
    document.getElementById("nextPlayer").textContent = players[nextPlayerIndex].name;

    if ((throwNumbers[0][throwNumbers[0].length - 1]) !== null) {
        document.getElementById("diceNumber1").style.display = "inline-block";
        document.getElementById("diceNumber1").src = diceFaces[throwNumbers[0][throwNumbers[0].length - 1] - 1];
    }
    else {
        document.getElementById("diceNumber1").style.display = "none";
    }

    if (!oneDice) {
        if (throwNumbers[1][throwNumbers[1].length - 1]) {
            document.getElementById("diceNumber2").style.display = "inline-block";
            document.getElementById("diceNumber2").src = diceFaces[throwNumbers[1][throwNumbers[1].length - 1] - 1];
            if (throwNumbers[0][throwNumbers[0].length - 1] !== null || throwNumbers[1][throwNumbers[1].length - 1] !== null) {
                document.getElementById("dicesSum").textContent = sumPoints();
                document.getElementById("dicesSum").style.display = "inline-block";
            }
            else {
                document.getElementById("dicesSum").style.display = "none";
            }
        }
        else {
            document.getElementById("diceNumber2").style.display = "none";
        }
    }

    if (oneDice) {
        document.getElementById("roundPoints").textContent = sumPoints();
    }
    else {
        document.getElementById("roundPoints").textContent = roundPoints;
    }

    const ol = document.getElementById("gameScoreOl");
    ol.innerHTML = "";
    players.forEach(player => {
        const li = document.createElement("li");
        li.textContent = player.name + " " + player.points;
        ol.appendChild(li);
        if (player.points >= gameEndPts) {
            winScreen(player.name, player.points);
        }
    });
};

const changePlayer = () => {
    roundPoints = 0;
    throwNumbers = [[null], [null]];
    currentDiceIndex = 0;
    if (nextPlayerIndex <= players.length - 1) {
        currentPlayerIndex = nextPlayerIndex;
        nextPlayerIndex += 1;
        if (nextPlayerIndex === players.length) {
            nextPlayerIndex = 0;
        }
    }
    else {
        currentPlayerIndex = 0;
        if (players.length > 1) {
            nextPlayerIndex = 1;
        }
        else {
            nextPlayerIndex = 0;
        }
    }
    document.getElementById("throw").style.display = "inline-block";
    document.getElementById("roundStop").style.display = "inline-block";
    document.getElementById("changePlayer").style.display = "none";
    updateScreen();
};

const stopRound = () => {
    if (oneDice) {
        players[currentPlayerIndex].points += sumPoints();
    }
    else {
        players[currentPlayerIndex].points += roundPoints;
    }
    changePlayer();
};

const gameScreen = () => {
    gameDiv.innerHTML = "";

    const gameScoreDiv = document.createElement("div");
    gameScoreDiv.setAttribute("id", "gameScore");
    
    const gameScoreHeader = document.createElement("h3");
    gameScoreHeader.textContent = "Total points:";
    gameScoreDiv.appendChild(gameScoreHeader);

    const gameScoreOl = document.createElement("ol");
    gameScoreOl.setAttribute("id", "gameScoreOl");

    const gameScreenDiv = document.createElement("div");
    gameScreenDiv.setAttribute("id", "gameScreenDiv");

    const buttonsDiv = document.createElement("div");
    buttonsDiv.setAttribute("id", "buttonsDiv");

    const gameStopBtn = document.createElement("button");
    gameStopBtn.setAttribute("id", "roundStop");
    gameStopBtn.addEventListener("click", stopRound);
    gameStopBtn.textContent = "Stop Round";

    const currentPlayerLbl = document.createElement("h3");
    currentPlayerLbl.setAttribute("id", "currentPlayerLbl");
    currentPlayerLbl.style.display = "inline-block";
    currentPlayerLbl.textContent = "Current Player:";

    const currentPlayer = document.createElement("h3");
    currentPlayer.style.display = "inline-block";
    currentPlayer.setAttribute("id", "currentPlayer");
    
    currentPlayer.textContent = players[currentPlayerIndex].name;

    const nextPlayerLbl = document.createElement("h3");
    nextPlayerLbl.setAttribute("id", "nextPlayerLbl");
    nextPlayerLbl.style.display = "inline-block";
    nextPlayerLbl.textContent = "Next Player:";

    const nextPlayer = document.createElement("h3");
    nextPlayer.setAttribute("id", "nextPlayer");
    nextPlayer.style.display = "inline-block";
    nextPlayer.textContent = players[nextPlayerIndex].name;

    const currentPlrDiv = document.createElement("div");
    currentPlrDiv.appendChild(currentPlayerLbl);
    currentPlrDiv.appendChild(currentPlayer);

    const nextPlrDiv = document.createElement("div");
    nextPlrDiv.appendChild(nextPlayerLbl);
    nextPlrDiv.appendChild(nextPlayer);

    const throwBtn = document.createElement("button");
    throwBtn.addEventListener("click", throwDice);
    throwBtn.setAttribute("id", "throw");
    throwBtn.textContent = "Trow The Dice";

    const changePlrBtn = document.createElement("button");
    changePlrBtn.addEventListener("click", changePlayer);
    changePlrBtn.setAttribute("id", "changePlayer");
    changePlrBtn.style.display = "none";
    changePlrBtn.textContent = "Change Next Player";

    const diceDiv = document.createElement("div");
    diceDiv.setAttribute("id", "dices");
    gameScreenDiv.append(diceDiv);
    const diceNumber1 = document.createElement("img");
    diceNumber1.setAttribute("id", "diceNumber1");
    diceDiv.appendChild(diceNumber1);

    const dicesSumDiv = document.createElement("div");
    if (!oneDice) {
        const diceNumber2 = document.createElement("img");
        diceNumber2.setAttribute("id", "diceNumber2");
        diceDiv.appendChild(diceNumber2);
        const dicesSumLbl = document.createElement("h2");
        dicesSumLbl.setAttribute("id", "dicesSumLbl");
        dicesSumLbl.textContent = "Points:";
        dicesSumLbl.style.display = "inline-block";
        const dicesSum = document.createElement("h2");
        dicesSum.setAttribute("id", "dicesSum");
        dicesSumDiv.appendChild(dicesSumLbl);
        dicesSumDiv.appendChild(dicesSum);
    }
    const roundPointsDiv = document.createElement("div");

    const roundPointsLbl = document.createElement("h2");
    roundPointsLbl.setAttribute("id", "roundPointsLbl");
    roundPointsLbl.textContent = "Round Points:";
    roundPointsLbl.style.display = "inline-block";

    const roundPoints = document.createElement("h2");
    roundPoints.setAttribute("id", "roundPoints");
    roundPoints.textContent = null;
    roundPoints.style.display = "inline-block";

    
    roundPointsDiv.appendChild(roundPointsLbl);
    roundPointsDiv.appendChild(roundPoints);

    gameDiv.appendChild(gameScoreDiv);
    gameScoreDiv.appendChild(gameScoreOl);

    gameDiv.appendChild(gameScreenDiv);

    gameScreenDiv.appendChild(buttonsDiv);
    gameScreenDiv.appendChild(dicesSumDiv);
    gameScreenDiv.appendChild(roundPointsDiv);
    gameScreenDiv.appendChild(currentPlrDiv);
    gameScreenDiv.appendChild(nextPlrDiv);

    buttonsDiv.appendChild(throwBtn);
    buttonsDiv.appendChild(changePlrBtn);
    buttonsDiv.appendChild(gameStopBtn);

    updateScreen();
};

const startGameBtn = document.getElementById("startGame");
startGameBtn.addEventListener("click", startGame);