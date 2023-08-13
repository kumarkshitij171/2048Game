var score = 0;
var board;
const rows = 4;
const columns = 4;
const NewGame = document.getElementById('NewGame')
let canPresskey;

window.onload = newG        // have to pass only reference not function call

function newG() {
    startGame()
}

const startGame = () => {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    // testing
    // board = [
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [4, 4, 8, 8],
    //     [4, 4, 8, 8]
    // ]

    canPresskey = true
    score = 0
    document.getElementById('MyScore').innerText = score
    if (localStorage.getItem('2048Score')) {
        document.getElementById('BestScore').innerText = localStorage.getItem('2048Score')
    }
    else {
        document.getElementById('BestScore').innerText = 0
    }

    // remove previous child if any -> remove all tile
    let allTile = document.querySelectorAll('.tile')
    allTile.forEach(tile => {
        tile.remove()
    })

    NewGame.style.display = 'none'
    document.getElementById('GameOver').style.display = 'none'

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            // create tile using js 
            let tile = document.createElement('DIV')
            tile.id = i.toString() + '-' + j.toString(); // giving an id to each tile so that we can change it further as game begins  { board[2][1] -> id = '2-1' }
            let val = board[i][j]
            updateTile(tile, val)
            document.getElementById('board').append(tile)

        }

    }
    // to start game have two 2's
    setTwo()
    setTwo()
}

function hasEmptyTile() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (board[i][j] == 0) {
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if (!hasEmptyTile()) {
        canPresskey = false;
        document.getElementById('GameOver').style.display = 'flex'
        NewGame.style.display = 'flex'
        // storing the score in local storage and show that it is the best score till now!
        let lastBest = localStorage.getItem('2048Score')
        console.log(lastBest);
        // checking with previous best score if it is greater then update else not 
        if (score > lastBest) {
            localStorage.clear('2048Score')
            localStorage.setItem('2048Score', score)
        }
        document.getElementById('BestScore').innerText = localStorage.getItem('2048Score')
        return;
    }
    // setting up 2 at empty place so having a random row and col for that
    let found = false;
    while (!found) {      // can go into infintite loop when no 0 is there have a check for this hasEmptyTile
        let r = Math.floor(Math.random() * rows)
        let c = Math.floor(Math.random() * columns)
        if (board[r][c] == 0) {
            board[r][c] = 2
            let tile = document.getElementById(r.toString() + "-" + c.toString())
            tile.innerText = "2"
            tile.classList.add("x2")
            found = true
        }
    }

}

const updateTile = (tile, val) => {
    tile.innerText = '' // pahle se jo value h usko hta denge
    tile.classList.value = '' // clear the class list

    tile.classList.add('tile')  // adding back the basic tile class
    // by checking the value adding the class to the tile
    if (val > 0) {
        tile.innerText = val
        if (val <= 4096)
            tile.classList.add('x' + val.toString())
        else
            tile.classList.add('x8192')

    }
}


document.addEventListener("keyup", (e) => {
    if (canPresskey) {
        // console.log(e);
        if (e.code == "ArrowLeft") {
            slideLeft();
            /* left key press
            original array: [2,2,2,0]
            clear zeroes: [2,2,2]
            merge left: [4,0,2]
            again if after adding there are zeroes the clear it: [4,2]
            Now all task done get zeroes back: [4,2,0,0]
            */
            setTwo()
        }
        else if (e.code == "ArrowRight") {
            slideRight();
            setTwo()
        }
        else if (e.code == "ArrowUp") {
            slideUp();
            setTwo()
        }
        else if (e.code == "ArrowDown") {
            slideDown();
            setTwo()
        }
    }

    // updating score
    document.getElementById('MyScore').innerText = score

})


function slideLeft() {
    for (let i = 0; i < rows; i++) {
        // har row ke liye slide krnge
        let CurrRow = board[i]
        CurrRow = slide(CurrRow);
        board[i] = CurrRow
        // untill this part we only do changes in js now we have to change it into our html file too

        for (let j = 0; j < columns; j++) {
            let tile = document.getElementById(i.toString() + "-" + j.toString())
            let num = board[i][j]
            updateTile(tile, num)    // this will update our html using DOM
        }
    }

}

// each time we get an array of element that we have to process for slide which contains some same process so we wrap inside a function called as slide
function slide(arr) {
    // [2,2,2,0]
    arr = filterZero(arr);
    // [2,2,2]
    // actual slide logic => [4,0,2]
    for (let i = 0; i < arr.length - 1; i++) {
        //check every two elements
        if (arr[i] == arr[i + 1]) {
            arr[i] *= 2
            arr[i + 1] = 0
            score += arr[i]     // updating score variable too
            if (score >= 2048) {
                Won.style.display = 'block'
            }
        }
    }
    arr = filterZero(arr)
    // [4,2]
    // Now adding the zeros that are removed
    while (arr.length < columns) {
        arr.push(0)
    }
    // [4,2,0,0]
    return arr
}

function filterZero(arr) {
    return arr.filter(num => num != 0)    // returns a new array which do not contains zero
}

// slide right is same as slide left just a reverse of that and after slide again have to slide to get result of slide right
function slideRight() {
    for (let i = 0; i < rows; i++) {
        // har row ke liye slide krnge
        let CurrRow = board[i]
        CurrRow.reverse()
        CurrRow = slide(CurrRow);
        CurrRow.reverse()
        board[i] = CurrRow
        // untill this part we only do changes in js now we have to change it into our html file too

        for (let j = 0; j < columns; j++) {
            let tile = document.getElementById(i.toString() + "-" + j.toString())
            let num = board[i][j]
            updateTile(tile, num)    // this will update our html using DOM
        }
    }
}

// slide up is the transpose of the row bcz for that we have to use the columns
function slideUp() {
    for (let j = 0; j < columns; j++) {
        let CurrRow = [board[0][j], board[1][j], board[2][j], board[3][j]]
        CurrRow = slide(CurrRow)
        board[0][j] = CurrRow[0]
        board[1][j] = CurrRow[1]
        board[2][j] = CurrRow[2]
        board[3][j] = CurrRow[3]
        // this update only js board have to change via dom
        for (let i = 0; i < rows; i++) {
            let tile = document.getElementById(i.toString() + "-" + j.toString())
            let num = board[i][j]
            updateTile(tile, num)
        }
    }
}
// similar as reverse in right of left
function slideDown() {
    for (let j = 0; j < columns; j++) {
        let CurrRow = [board[0][j], board[1][j], board[2][j], board[3][j]]
        CurrRow.reverse()
        CurrRow = slide(CurrRow)
        CurrRow.reverse()
        board[0][j] = CurrRow[0]
        board[1][j] = CurrRow[1]
        board[2][j] = CurrRow[2]
        board[3][j] = CurrRow[3]
        // this update only js board have to change via dom
        for (let i = 0; i < rows; i++) {
            let tile = document.getElementById(i.toString() + "-" + j.toString())
            let num = board[i][j]
            updateTile(tile, num)
        }
    }
}

