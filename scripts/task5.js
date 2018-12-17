//task 5.5
/* 
https://jsfiddle.net/7a2ngzm0/ в примере по ссылке я написал на скорую руку игру крестики-нолики. 
Я постарался над алгоритмом проверки победы и смог сделать игру универсальной для любого размера поля. 
3х3, 5х5, 100х100 - размер поля можно указать любой и код будет с ним работать одинаково.
размер можно задать константой SIZE, а размер ячеек через CELL_SIZE.
но, конкретно этот код можно улучшать и улучшать. Я предлагаю сосредоточиться на нескольких моментах.
1) есть баг, что если кликнуть на уже заполненную ячейку, то это содержимое перезапишется, то есть можно кликать 
на ячейки противника или много раз на свою и это будет считаться ходом. Устранить этот баг, чтобы, если по ячейке был клик,
 то повторный клик ни к чему бы не приводил)
2) в игре есть, как я его называю "искусственный идиот" - код, отвечающий за ходы компьютера против игрока. 
Он сейчас делает ходы просто случайным образом на пустые ячейки из-за чего почти всегда проигрывает. Код логики в функции checkFree().
Превратите его в подобие "искусственного интеллекта". Например, чтобы он первым своим ходом ставил нолик на центральную ячейку.
Плюс можно анализировать "вес" столбцов, строк, диагоналей. Например, если игрок ставит где-то крестик, 
то строка, столбец, диагональ с этим крестиком увеличивают свой вес и компьютер сортирует все поля по весу и случайно ходит туда, 
где вес больше, а не куда-попало.
3) мне кажется, что функции делают слишком много операций. Разбейте их на несколько, сделайте код чище
4) если удастся, то найдите более оптимальный или простой алгоритм проверки победы, который у меня в checkField()
5) наверняка там закралось ещё не мало багов, исправьте, если найдёте
6) сделайте возможность, чтобы иногда первым ходил компьютер или просто это было случайно (50% первый игрок, 50% компьютер)
*/



//"use strict";
console.clear();
const CELL_SIZE = 100;
const CELL_STYLES = {
	width : CELL_SIZE + "px",
  height : CELL_SIZE + "px",
  position : "absolute",
  textAlign : "center",
  fontSize : "50px"
};
const SIZE = 3;
const HOT_SPOT = Math.round((SIZE - 1) / 2);
const positions = [];
const PLAYER = 1;
const AI = -1;
const FREE_CELL = 0;

const weights = []; 
/*
  weights массив весов. для удобства пробега по нему - одномерный.
  SIZE элементов рядов, обратная диагональ, SIZE элементов колонок и главная диагональ.
  при SIZE == 3 , length == 7
*/
//define key indexes
const MAIN_DIAGONAL =  SIZE * 2 + 1;
const BACK_DIAGONAL =  SIZE;
const COLUMNS =  SIZE + 1;

let steps = 0;

const cells = createField(SIZE);


// define who`s turn and symbol;
/*
const PLAYER_SYMBOL = Math.random < 0.5 ? "X" : "O";
const AI_SYMBOL = PLAYER_SYMBOL == "X" ? "O" : "X";
*/
const PLAYER_SYMBOL =  "X";
const AI_SYMBOL =  "O";



//const emptyCells = [];

function createField(size) {
  const fieldContainer = document.getElementById("field");
	fieldContainer.style.position = "relative";
  let counter = 0;
  const cells = [];
  weights.push(0, 0);
  for (let i = 0; i < size; i++) {
    positions[i] = [];
    weights.push(0, 0);
  	for (let j = 0; j < size; j++){
      positions[i][j] = FREE_CELL;
      counter++;      
  		cells.push(cell(fieldContainer, i, j, counter));      
    }  
  }
//увеличим веса диагоналей.
weights[BACK_DIAGONAL] += (0.1 + Math.random() * 0.1);
weights[MAIN_DIAGONAL] += (0.1 + Math.random() * 0.1);

	return cells;
}

function cell(parent, i, j, counter) {
	const top = i;
  const left = j;
	const cell = document.createElement("BUTTON");
  setStyle(cell, CELL_STYLES);
  cell.style.top = top * CELL_SIZE + "px";
  cell.style.left = left * CELL_SIZE + "px";
  cell.textContent = "";
  cell.addEventListener("click", function(event) {
  	listener(event, i, j, cell);
  });
  parent.appendChild(cell);
	return cell;
}

function setStyle(obj, styles){
	for(let style in styles){
  	obj.style[style] = styles[style];
  }
}

function listener(event, i, j, cell) {
    //  - баг затирания 
    if (cell.textContent == PLAYER_SYMBOL || cell.textContent == AI_SYMBOL ){
        return;
    }
  cell.textContent = PLAYER_SYMBOL;
  positions[i][j] = PLAYER;
  steps++;
  calcWeights(i, j, PLAYER);

	const win = checkField(PLAYER);
  win ? console.log("player WIN") : computerStep() ? console.log("computer WIN") : console.log("next run");
}

function computerStep() {
//  const pos = checkFree();
  const pos = aiMove();
  if(pos) {
  	cells[pos[0] * SIZE + pos[1]].textContent = AI_SYMBOL
  } else {
  	console.log("DRAW");
    return;
  }
  positions[pos[0]][pos[1]] = AI;
  steps++;
  calcWeights(pos[0], pos[1], AI);
	const win = checkField(AI);
  return win;
}

// пересчет массива "весов" каждой линии. после каждого хода
function calcWeights(i, j, num){
  weights[i] += num;
  weights[j + COLUMNS] += num;
  if ( i == j){
    weights[MAIN_DIAGONAL] += num;
  }
   if ( i == SIZE - j - 1){
    weights[BACK_DIAGONAL] += num;
  }
}


function aiMove() {
  //let theAiCell = [];

  if (steps >= SIZE * SIZE){
    return false;
  }

  const freeCells = [];
  if (positions[HOT_SPOT][HOT_SPOT] == 0){
    //const freeCells = [];  
//    return [].push([HOT_SPOT,HOT_SPOT]);
    return [HOT_SPOT,HOT_SPOT];
  }
  /*
  идея добавлять в массив свободные клетки и выбирать случайным образом хороша, 
  особенно если размер будет хотя бы 5 на 5  и более.
  но сделаем то же самое только по самой "опасной линии"

  для 3*3 можно брать первую же свободную, но задача стоит сделать общий случай.
  */

  let mostDagerousLine = 0; let max = weights[0];
  for (let i = 1; i < weights.length; i++) {
    mostDagerousLine = weights[i] > max ? (max = weights[i], i)  : mostDagerousLine;
  }
  //для начала научим АИ "отбиваться"
  for (let i = 0; i < SIZE; i++) { // цикл общий. т.к. клеток линии все равно одинаковое количество
    if (mostDagerousLine < SIZE) { //ряд
      if(positions[mostDagerousLine][i] == FREE_CELL){
        freeCells.push([mostDagerousLine, i]);
      }      
    } else if (mostDagerousLine == MAIN_DIAGONAL){
        if(positions[i][i] == FREE_CELL){
          freeCells.push([i, i]);
        }      
    } else if(mostDagerousLine == BACK_DIAGONAL){
        if(positions[i][SIZE - i - 1] == FREE_CELL){
          freeCells.push([i, SIZE - i - 1]);
        }      
    } else{ // колонка
      if(positions[i][mostDagerousLine - COLUMNS] == FREE_CELL){
        freeCells.push([i, mostDagerousLine - COLUMNS]);
      }
    };
  }
//имеем массив пустых клеток в опасной линии. и выбираем случайную из них.
  const theAiCell = freeCells[Math.floor(Math.random() * freeCells.length)];




  return theAiCell;//freeCells[Math.floor(Math.random() * freeCells.length)];
}

function checkFree() {
  const freeCells = [];
  let mostDagerousLine = 0; let max = weights[0];
  for (let i = 1; i < weights.length; i++) {
    mostDagerousLine = weights[i] > max ? (max = weights[i], i)  : mostDagerousLine;
    
  }

  positions.forEach(function(row, i) {
  	row.forEach(function(val, j) {
    	if(positions[i][j] == FREE_CELL){
      	freeCells.push([i, j]);
      }
    });
  });
  const freeCell = freeCells[Math.floor(Math.random() * freeCells.length)];
   return freeCell;
}

function checkField(value) {
  let win = weights.some( w => w == value * SIZE);

	// let horizont = 0, vertical = 0, diagonalOne = 0, diagonalTwo = 0;
	// for (let i = 0; i < SIZE; i++) {  	
  //   for (let j = 0; j < SIZE; j++) {
  //   	if(positions[i][j] == value) {
  //     	horizont++;        
  //     }
  //     for(let l = 0; l < SIZE; l++){
  //     	if(positions[l][j] == value) {
  //     		vertical++;        
  //     	}
  //     }
  //     if(i == j && positions[i][j] == value) {
  //     	diagonalOne++;        
  //     }
  //     if(i == (SIZE - j - 1) && positions[i][j] == value) {
  //     	diagonalTwo++;        
  //     }
  //     if(horizont == SIZE || vertical == SIZE || diagonalOne == SIZE || diagonalTwo == SIZE) {
  //     	win = true;
  //     }
  //     vertical = 0;
  //   }
  //   horizont = 0;
  // }
  return win;
}
/*  checkWin() лишняя можно и удалить */
function checkWin() {
	const win = false;
  return win;
}