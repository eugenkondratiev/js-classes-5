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

// остались баги АИ в некоторых конкретных позициях, но в целом работает адекватно. и еще надо сделать пункт 6.
// нет заперта ходов после чьей-то победы.
// иногда все таки выбирает две подряд занятых строки.  сделать выбор в цикле while? :(

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
  console.log(pos[0] + ", " + pos[1]);
  
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
   if ( i == (SIZE - j - 1)){
    weights[BACK_DIAGONAL] += num;
  }
  //debugger;
}


function aiMove() {

  if (steps >= SIZE * SIZE){
    return false;
  }


  if (positions[HOT_SPOT][HOT_SPOT] == 0){
    return [HOT_SPOT,HOT_SPOT];
  }
  /*
  идея добавлять в массив свободные клетки и выбирать случайным образом хороша, 
  особенно если размер будет хотя бы 5 на 5  и более.
   сделаем то же самое только по самой "опасной линии"
  для 3*3 можно брать первую же свободную, но задача стоит сделать общий случай.
  */

  const sortedWeights = [];
  weights.forEach((w,i) => (sortedWeights.push(w)));
  sortedWeights.sort((a,b) => (a - b));

  let mostDangerousLine = weights.indexOf(sortedWeights[sortedWeights.length -1] );
  let mostHopefullLine = weights.indexOf(sortedWeights[0]);
   
// выбор : отбиваться или попробовать победить.
  let pickedLine = Math.abs(mostHopefullLine) > Math.abs(mostDangerousLine) && sortedWeights[0] < (1.1 - SIZE) ? mostHopefullLine : mostDangerousLine;
  //debugger;
  let freeCells = getFreeCellsFromLine(pickedLine);


//имеем массив пустых клеток в опасной линии. и выбираем случайную из них.
let theAiCell = freeCells[Math.floor(Math.random() * freeCells.length)];
if (theAiCell != undefined){
  return theAiCell;
} else {
  // выбранная линия "занята" и хода АИ не происходит.
  // так получается из-за изменения веса диагоналей.

  mostDangerousLine = weights.indexOf(sortedWeights[sortedWeights.length -2]);
  mostHopefullLine = weights.indexOf(sortedWeights[1]);
  pickedLine = Math.abs(mostHopefullLine) > Math.abs(mostDangerousLine) && sortedWeights[1] < -1 *(SIZE - 1.1) ? mostHopefullLine : mostDangerousLine;
  freeCells = getFreeCellsFromLine(pickedLine);
  //второй раз такой баг совсем маловероятен
  theAiCell = freeCells[Math.floor(Math.random() * freeCells.length)];
  return theAiCell;

}

}

function getFreeCellsFromLine(pickedLine){
  const _freeCells = [];

  for (let i = 0; i < SIZE; i++) { // цикл общий. т.к. клеток линии все равно одинаковое количество
    if (pickedLine < SIZE) { //ряд
      if(positions[pickedLine][i] == FREE_CELL){
        _freeCells.push([pickedLine, i]);
      }      
    } else if (pickedLine == MAIN_DIAGONAL){
        if(positions[i][i] == FREE_CELL){
          _freeCells.push([i, i]);
        }      
    } else if(pickedLine == BACK_DIAGONAL){
        if(positions[i][SIZE - i - 1] == FREE_CELL){
          _freeCells.push([i, SIZE - i - 1]);
        }      
    } else{ // колонка
      if(positions[i][pickedLine - COLUMNS] == FREE_CELL){
        _freeCells.push([i, pickedLine - COLUMNS]);
      }
    };
  }
  return _freeCells;
}


function checkField(value) {
  return weights.some( w => value > 0 ? w >= value * SIZE : w <= value * SIZE);

}