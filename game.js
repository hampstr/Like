



function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function create2DArray(rows, cols, fill) {
  let arr = new Array(rows);
  for (let i = 0; i < rows; i++) {
    arr[i] = new Array(cols).fill(fill);
  }
  return arr;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function inRange(value, min, max) {
    return value >= min && value <= max;
}

window.addEventListener("keyup", moveSelection)

let gameContainer = document.getElementById("gameContainer");
let backButton = document.getElementById("backToMM");
let winScreen = document.getElementById("winScreen");
let winScreenPlayAgain = document.getElementById("playAgain")
let winScreenQuit = document.getElementById("quit")
let rows = 5
let cols = rows
let boxes = create2DArray(rows, cols, 0)
let states = create2DArray(rows, cols, "primary")

let borderWidth = 2
let started = false
let selectionColorAdd = 50
let canMove = false
let selection = [0, cols-1]


let primaryColor = [26, 111, 195]
let primaryColorBorder = [6, 76, 156]
let primaryColorSelection = primaryColor.map(val => clamp(val + selectionColorAdd, 0, 255))

let secondaryColor = [195, 26, 26]
let secondaryColorBorder = [147, 23, 1]
let secondaryColorSelection = secondaryColor.map(val => clamp(val + selectionColorAdd, 0, 255))

let overrideAllBorders = true
let overrideColor = [255, 255, 255]

let touchStart = [0, 0]
let touchEnd = [0, 0]

let moveCount = 100
let movesDone = 0
let moveGenerator;
let moveDelay = 10


function win() {
    states = create2DArray(rows, cols, "primary")
    drawBoxes()
    canMove = false
    setTimeout(() => {
        winScreen.style.display = "flex"
        winScreen.style.animation = "popIn 1s ease-in-out forwards"

        winScreenPlayAgain.style.animation = "popIn 1.3s ease-in-out forwards"
        winScreenQuit.style.animation = "popIn 1.6s ease-in-out forwards"
        // window.alert("You Win!")
        // location.reload()
    }, 100)
}

document.addEventListener("DOMContentLoaded", function() {
    drawBoxes();
    window.addEventListener("keyup", moveSelection);
    window.addEventListener("touchstart", (e) => {
        touchStart = [e.changedTouches[0].screenX, e.changedTouches[0].screenY]
        
    })
    window.addEventListener("touchend", (e) => {
        touchEnd = [e.changedTouches[0].screenX, e.changedTouches[0].screenY]
        interpretSwipe()
    })
    backButton.addEventListener("click", () => {
        location.href = "index.html";
    })
    winScreenPlayAgain.addEventListener("click", () => {
        location.reload()
    })
    winScreenQuit.addEventListener("click", () => {
        location.href = "index.html";
    })
    generateLevel()
});


function generateLevel() {
    resetSelection()
    moveGenerator = setInterval(randomMove, moveDelay)
    gameContainer.style.opacity = "50%"
}

function randomMove() {
    let index = random(0, 3)
    if (index == 0) {
        if (selectionRight()) {
            movesDone++
        }
    }
    if (index == 1) {
        if (selectionLeft()) {
            movesDone++
        }
    }
    if (index == 2) {
        if (selectionDown()) {
            movesDone++
        }
    }
    if (index == 3) {
        if (selectionUp()) {
            movesDone++
        }
    }
    if (movesDone >= moveCount) {
        let hasSecondary = false
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (states[i][j] == "secondary") {
                    hasSecondary = true
                }
            } 
        }
        if (hasSecondary) {
            clearInterval(moveGenerator)
            resetSelection()
            gameContainer.style.opacity = "100%"
            canMove = true
        }

        else {
            movesDone = 0
        }
        

    }
}


function winCheck() {
    if (!started) {
        return 
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (states[i][j] == "secondary") {
                return 
            }
        }  
    }
    win()
}

function resetSelection() {
    selection = [0, cols-1]
    drawBoxes();
}

function selectionUp() {
    selection[0]--
    if (!inRange(selection[0], 0, cols-1)) {
        selection[0] = clamp(selection[0], 0, cols-1)
        return false
    }

    // selection[0] = clamp(selection[0], 0, cols-1)
    states[selection[0]][selection[1]] = states[selection[0]][selection[1]] == "primary" ? "secondary" : "primary"
    drawBoxes()
    winCheck()
    return true
}
function selectionDown() {
    selection[0]++
    if (!inRange(selection[0], 0, cols-1)) {
        selection[0] = clamp(selection[0], 0, cols-1)
        return false
    }
    // selection[0] = clamp(selection[0], 0, cols-1)
    states[selection[0]][selection[1]] = states[selection[0]][selection[1]] == "primary" ? "secondary" : "primary"
    drawBoxes()
    winCheck()
    return true

}
function selectionRight() {
    selection[1]++
    if (!inRange(selection[1], 0, cols-1)) {
        selection[1] = clamp(selection[1], 0, cols-1)
        return false
    }
    // selection[1] = clamp(selection[1], 0, cols-1)
    states[selection[0]][selection[1]] = states[selection[0]][selection[1]] == "primary" ? "secondary" : "primary"
    drawBoxes()
    winCheck()
    return true


}

function selectionLeft() {
    selection[1]--
    if (!inRange(selection[1], 0, cols-1)) {
        selection[1] = clamp(selection[1], 0, cols-1)
        return false
    }
    // selection[1] = clamp(selection[1], 0, cols-1)
    states[selection[0]][selection[1]] = states[selection[0]][selection[1]] == "primary" ? "secondary" : "primary"
    drawBoxes()
    winCheck()
    return true

}


function interpretSwipe() {
    if (!canMove) {
        return
    }
    started = true
    let dx = touchEnd[0] - touchStart[0]
    let dy = touchEnd[1] - touchStart[1]
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            // right
            selectionRight()
        } else {
            // left
            selectionLeft()
        }
    }
    else {
        if (dy > 0) {
            // down
            selectionDown()
        } 
        else {
            // up
            selectionUp()
        }
    }
}

function drawBoxes() {

    // clear everything
    gameContainer.innerHTML = ""

    // CREATE ALL BOXES
    for (let i = 0; i < rows; i++) {
        let rowDiv = document.createElement("div")
        rowDiv.classList.add("gameRow")
        for (let j = 0; j < cols; j++) {
            let boxDiv = document.createElement("div")
            boxDiv.classList.add("gameBox")
            if (j==0) {
                boxDiv.classList.add("left")
            }
            gameContainer.appendChild(rowDiv)
            rowDiv.appendChild(boxDiv)
            boxes[i][j] = boxDiv
        }
    }
    
    // color in boxes
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let current = boxes[i][j]



            if (states[i][j] == "primary") {
                current.style.backgroundColor = `rgb(${primaryColor[0]}, ${primaryColor[1]}, ${primaryColor[2]})`
                current.style.borderColor = `rgb(${primaryColorBorder[0]}, ${primaryColorBorder[1]}, ${primaryColorBorder[2]})`
                if (selection[0] == i && selection[1] == j) {
                    current.style.backgroundColor = `rgb(${primaryColorSelection[0]}, ${primaryColorSelection[1]}, ${primaryColorSelection[2]})`
                }
            } else if (states[i][j] == "secondary") {
                current.style.backgroundColor = `rgb(${secondaryColor[0]}, ${secondaryColor[1]}, ${secondaryColor[2]})`
                current.style.borderColor = `rgb(${secondaryColorBorder[0]}, ${secondaryColorBorder[1]}, ${secondaryColorBorder[2]})`
                if (selection[0] == i && selection[1] == j) {
                    current.style.backgroundColor = `rgb(${secondaryColorSelection[0]}, ${secondaryColorSelection[1]}, ${secondaryColorSelection[2]})`
                }
            }
            if (overrideAllBorders) {
                current.style.border = `${borderWidth}px solid rgb(${overrideColor[0]}, ${overrideColor[1]}, ${overrideColor[2]})`
                current.style.borderLeft = `${borderWidth/2}px solid rgb(${overrideColor[0]}, ${overrideColor[1]}, ${overrideColor[2]})`
                if (current.classList.contains("left")) {
                    current.style.borderLeft = `${borderWidth}px solid rgb(${overrideColor[0]}, ${overrideColor[1]}, ${overrideColor[2]})`
                }
            }
        }
    }
}

function moveSelection(e) {
    code = e.code

    if (code == "Enter") {
        location.reload()
    }
    if (code == "Escape") {
        location.href = "index.html";
    }

    if (!canMove) {
        return
    }
    started = true
    // console.log(code)

    // console.log(code)
    if (code == "ArrowLeft" || code == "KeyA") {
        selectionLeft()
    }
    if (code == "ArrowRight" || code == "KeyD") {
        selectionRight()
    }

    if (code == "ArrowDown" || code == "KeyS") {
        selectionDown()
    }
    if (code == "ArrowUp" || code == "KeyW") {
        selectionUp()
    }
}