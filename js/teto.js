/* main 処理 */
document.getElementById("teto_text").textContent = "Teto! ()";
document.addEventListener("keydown", onKeyDown);

var count = 0;
var cells;

// ブロックパターン
var blocks = {
    i: {
	class: "i",
	pattern: [
	    [1, 1, 1, 1]
	]
    },
    o: {
	class: "o",
	pattern: [
	    [1, 1],
	    [1, 1]
	]
    },
    t: {
	class: "t",
	pattern: [
	    [0, 1, 0],
	    [1, 1, 1]
	]
    },
    s: {
	class: "s",
	pattern: [
	    [0, 1, 1],
	    [1, 1, 0]
	]
    },
    z: {
	class: "z",
	pattern: [
	    [1, 1, 0],
	    [0, 1, 1]
	]
    },
    j: {
	class: "j",
	pattern: [
	    [1, 0, 0],
	    [1, 1, 1]
	]
    },
    l: {
	class: "l",
	pattern: [
	    [0, 0, 1],
	    [1, 1, 1]
	]
    },
};
    
var isGameOver = false;
loadTable();
// setInterval(定時処理したい関数, 間隔(ms))
setInterval(function() {
    count++;
    document.getElementById("teto_text").textContent = "Teto! (" + count + ")";

	if (!(isGameOver)) {
		// ゲームオーバーチェック
		for (var row = 0; row < 2; row++) {
			for (var col = 0; col < 10; col++) {
				if (cells[row][col].className !== "" && cells[row][col].blockNum !== fallingBlockNum) {
					alert("Game over.");
					isGameOver = true;
				}
			}
		}
		if (hasFallingBlock()) { // 落下中のブロックがあれば
			fallBlocks();
		} else {
			deleteRow();
			generateBlock();
		}
    }
}, 200);

/* 関数定義 */
function loadTable() {
    cells = [];    
    var td_array = document.getElementsByTagName("td");
    var index = 0;
    for (var row = 0; row < 20; row++) {
	cells[row] = [];
		for (var col = 0; col < 10; col++) {
			cells[row][col] = td_array[index];
			index++;
		}
    }
}

function fallBlocks() {
    
    // 底についていないか
    for (var col = 0; col < 10; col++) {
	if (cells[19][col].blockNum === fallingBlockNum) {
	    isFalling = false;
	    return;
	}
    }
    
    // 1マス下に別のブロックがないか
    for (var row = 18; row >= 0; row--) {
	for (var col = 0; col < 10; col++) {
	    if (cells[row][col].blockNum === fallingBlockNum) {
		if (cells[row + 1][col].className !== "" && cells[row + 1][col].blockNum !== fallingBlockNum) {
		    isFalling = false;
		    return;
		}
	    }
	}
    }

    // 下から二番目の行から繰り返しクラスを下げていく
    for (var row = 18; row >= 0; row--) {
	for (var col = 0; col < 10; col++) {
	    if (cells[row][col].blockNum === fallingBlockNum) {
		cells[row + 1][col].className = cells[row][col].className;
		cells[row + 1][col].blockNum = cells[row][col].blockNum;
		cells[row][col].className = "";
		cells[row][col].blockNum = null;
	    }
	}
    }
}

var isFalling = false;
function hasFallingBlock() {
    // 落下中のブロックがあるか確認する
    return isFalling;
}

function deleteRow() {
    for (var row = 19; row >= 0; row--) {
	var canDelete = true;
	for (var col = 0; col < 10; col++) {
	    if(cells[row][col].className === "") {
		canDelete = false;
	    }
	}
	if (canDelete) {
	    for (var col = 0; col < 10; col++) {
		cells[row][col].className = "";
	    }
	    for (var downRow = row - 1; row >= 0; row--) {
		for (var col = 0; col < 10; col++) {
		    cells[downRow + 1][col].className = cells[downRow][col].className;
		    cells[downRow + 1][col].blockNum = cells[downRow][col].blockNum;
		    cells[downRow][col].className = "";
		    cells[downRow][col].blockNum = null;
		}
	    }
	}
    }	    
}

var fallingBlockNum = 0;
function generateBlock() {
    // ブロックパターンからランダムに1つパターンを選ぶ
    var keys = Object.keys(blocks);
    var nextBlockKey = keys[Math.floor(Math.random() * keys.length)];
    var nextBlock = blocks[nextBlockKey];
    var nextFallingBlockNum = fallingBlockNum + 1;
    
    // 選んだパターンをもとにブロックを配置する
    var pattern = nextBlock.pattern;
    for (var row = 0; row < pattern.length; row++) {
	for (var col = 0; col < pattern[row].length; col++) {
	    if (pattern[row][col]) {
		cells[row][col + 3].className = nextBlock.class;
		cells[row][col + 3].blockNum = nextFallingBlockNum;
	    }
	}
    }
    
    // 落下中のブロックがあるとする
    isFalling = true;
    fallingBlockNum = nextFallingBlockNum;
}

function moveRight() {
    for (var row = 0; row < 20; row++) {
	for (var col = 9; col >= 0; col--) {
	    if (cells[row][col].blockNum === fallingBlockNum && cells[row][col +1].className === "") {
			cells[row][col + 1].className = cells[row][col].className;
			cells[row][col + 1].blockNum = cells[row][col].blockNum;
			cells[row][col].className = "";
			cells[row][col].blockNum = null;
			}
		}
    }
}

function moveLeft() {
    for (var row = 0; row < 20; row++) {
	for (var col = 0; col < 10; col++) {
	    if (cells[row][col].blockNum === fallingBlockNum && cells[row][col - 1].className === "") {
		cells[row][col - 1].className = cells[row][col].className;
		cells[row][col - 1].blockNum = cells[row][col].blockNum;
		cells[row][col].className = "";
		cells[row][col].blockNum = null;
	    }
	}
    }
}

// キーボード入力のコールバック関数
function onKeyDown(event) {
    if(event.keyCode === 37) {
	moveLeft();
    } else if (event.keyCode === 39) {
	moveRight();
    }
}
