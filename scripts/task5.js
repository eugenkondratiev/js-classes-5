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
const positions = [];
const cells = [];

createField(SIZE);

function createField(size) {
  const fieldContainer = document.getElementById("field");
	fieldContainer.style.position = "relative";
  let counter = 0;
  for (let i = 0; i < size; i++) {
  	positions[i] = [];
  	for (let j = 0; j < size; j++){
    	positions[i][j] = -1;
    	counter++;
  		cells.push(cell(fieldContainer, i, j, counter));      
    }  	
  }
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
  cell.textContent = "X";
  positions[i][j] = 1;
	const win = checkField(1);
  win ? console.log("player WIN") : computerStep() ? console.log("computer WIN") : console.log("next run");
}

function computerStep() {
	const pos = checkFree();
  if(pos) {
  	cells[pos[0] * SIZE + pos[1]].textContent = "O"
  } else {
  	console.log("DRAW");
    return;
  }
  positions[pos[0]][pos[1]] = 0;
	const win = checkField(0);
  return win;
}

function checkFree() {
	const freeCells = [];
  positions.forEach(function(row, i) {
  	row.forEach(function(val, j) {
    	if(positions[i][j] == -1){
      	freeCells.push([i, j]);
      }
    });
  });
  const freeCell = freeCells[Math.floor(Math.random() * freeCells.length)];
  return freeCell;
}

function checkField(value) {
	let win = false;
	let horizont = 0, vertical = 0, diagonalOne = 0, diagonalTwo = 0;
	for (let i = 0; i < SIZE; i++) {  	
    for (let j = 0; j < SIZE; j++) {
    	if(positions[i][j] == value) {
      	horizont++;        
      }
      for(let l = 0; l < SIZE; l++){
      	if(positions[l][j] == value) {
      		vertical++;        
      	}
      }
      if(i == j && positions[i][j] == value) {
      	diagonalOne++;        
      }
      if(i == (SIZE - j - 1) && positions[i][j] == value) {
      	diagonalTwo++;        
      }
      if(horizont == SIZE || vertical == SIZE || diagonalOne == SIZE || diagonalTwo == SIZE) {
      	win = true;
      }
      vertical = 0;
    }
    horizont = 0;
  }
  return win;
}

function checkWin() {
	const win = false;
  return win;
}