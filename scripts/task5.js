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
const INDEX_OF_ERROR = -1;

const weights = []; 
const freeLines = [];

/*
  weights массив весов. для удобства пробега по нему - одномерный.
  SIZE элементов рядов, обратная диагональ, SIZE элементов колонок и главная диагональ.
  при SIZE == 3 , length == 7
*/
//define key indexes
const MAIN_DIAGONAL =  SIZE * 2 + 1;
const BACK_DIAGONAL =  SIZE;
const COLUMNS =  SIZE + 1;
const ROW =  0;

let steps = 0;

const cells = createField(SIZE);


// define who`s turn and symbol;
/*
const PLAYER_SYMBOL = Math.random < 0.5 ? "X" : "O";
const AI_SYMBOL = PLAYER_SYMBOL == "X" ? "O" : "X";
*/
const PLAYER_SYMBOL =  "X";
const AI_SYMBOL =  "O";

/*
fill array of free cells, for future check for free cells in picked line.
*/
function createFreeLine(i = 0, type = ROW) {
  const row = [];
  switch(type){
    case ROW:
      for (let j = 0; j < SIZE; j++) {
        row.push([i, j]);
      } 
      break;
    case COLUMNS:
      for (let j = 0; j < SIZE; j++) {
        row.push([j, i]);
      } 
      break;
    case MAIN_DIAGONAL:
      for (let j = 0; j < SIZE; j++) {
        row.push([j, j]);
      } 
      break;
    default:
    for (let j = 0; j < SIZE; j++) {
      row.push([j, SIZE - j - 1]);
    } 

  }
  return row;
}

//функция удаляет элемент с нужной позицией из массива заданной линии.
function releaseFreeCelllfromLine(pos, freeCellsArray) {
  if (freeCellsArray.length == 0) {
    return;
  }
  for (let index = 0; index < freeCellsArray.length; index++) {
    if (pos[0] == freeCellsArray[index][0] && pos[1] == freeCellsArray[index][1]) {
      freeCellsArray.splice( index, 1 );
      return;
    }

  }
}

//функция заполняет массив свободных полей.
function fillFreeLines() {
  for (let i = 0; i < SIZE; i++) {
    freeLines.push(createFreeLine(i, ROW));
  }
  freeLines.push(createFreeLine(0, BACK_DIAGONAL));

  for (let j = 0; j < SIZE; j++) {
    freeLines.push(createFreeLine(j, COLUMNS));
  }

  freeLines.push(createFreeLine(0, MAIN_DIAGONAL));
}
//функция ищет и удаляет поле во вложенных массивах массива свободных полей 
function releaseFreeCell(i, j, freeLines) {
  const _pos = [i, j];
  // ряд
  releaseFreeCelllfromLine(_pos, freeLines[i]);

  //столбец
  releaseFreeCelllfromLine(_pos, freeLines[j + COLUMNS]);

  if ( i == j) {// MAIN_DIAGONAL
    releaseFreeCelllfromLine(_pos, freeLines[MAIN_DIAGONAL]);
  }
  if (i == SIZE - j -1) { //BACK_DIAGONAL
    releaseFreeCelllfromLine(_pos, freeLines[BACK_DIAGONAL]);
  }
}


function createField(size) {
  const fieldContainer = document.getElementById("field");
  fieldContainer.style.position = "relative";
  fieldContainer.style.top = "40px";
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

fillFreeLines();
debugger;
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
  releaseFreeCell(i, j, freeLines);
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
  releaseFreeCell(pos[0], pos[1], freeLines);

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

  let mostDangerousLine = SIZE;
  

  do {
    let index = 1;
    mostDangerousLine = weights.indexOf(sortedWeights[sortedWeights.length - index] );
    index++;
  } while (freeLines[mostDangerousLine].length == 0 || index < MAIN_DIAGONAL)
  

  //let mostHopefullLine = weights.indexOf(sortedWeights[0]);
  let mostHopefullLine = 0;

  do {
    let index = 0;
    mostHopefullLine = weights.indexOf(sortedWeights[index] );
    index++;
  } while (freeLines[mostHopefullLine].length == 0 || index < MAIN_DIAGONAL)

  
  /**
   * 
   * тут нужно найти опасную или перспективную линию с пустыми полями.
   * т.е. перебирать пока не найдешь или пока не поределиг ее отсутствие.
   */

  
// выбор : отбиваться или попробовать победить.
  let pickedLine = mostHopefullLine;
  if (freeLines[mostHopefullLine].length == 0) {
    pickedLine = mostDangerousLine;
  } else if(freeLines[mostDangerousLine].length == 0){
    pickedLine  = mostHopefullLine;
  } else{
    pickedLine = Math.abs(mostHopefullLine) > Math.abs(mostDangerousLine) || sortedWeights[mostHopefullLine] < (1.01 - SIZE) 
    ? 
    mostHopefullLine 
    : 
    mostDangerousLine;
  }

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