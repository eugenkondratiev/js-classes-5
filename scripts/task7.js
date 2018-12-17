//task 5.7
/*
Напишите функцию sum, которая работает так: sum(a)(b) = a+b.

Да, именно так, через двойные скобки (это не опечатка). Например:

sum(1)(2) = 3
sum(5)(-1) = 4


*/

/* first */
function sum(a) {
    return  function(b){
        return b + a;
    }
 } 

 console.log(sum(1)(2));
 console.log(sum(5)(-1));

/* second */ /* на память. подсмотрел пример сокращения !! очень красиво, надо перенимать */
const _sum = (a) => (b) => (a + b);
console.log(_sum(1)(2));
console.log(_sum(5)(-1));


/*
В некоторых языках программирования существует объект «строковый буфер», который аккумулирует внутри себя значения.
 Его функционал состоит из двух возможностей:

Добавить значение в буфер.
Получить текущее содержимое.
Задача – реализовать строковый буфер на функциях в JavaScript, со следующим синтаксисом:

Создание объекта: var buffer = makeBuffer();.
Вызов makeBuffer должен возвращать такую функцию buffer, которая при вызове buffer(value) добавляет значение 
в некоторое внутреннее хранилище, а при вызове без аргументов buffer() – возвращает его.
Вот пример работы:
 */
function makeBuffer() { 
        let bufferString = "";
        /*
    return function(addingSting){
        if (arguments.length == 0){
            return bufferString;
        } else {
            bufferString += addingSting;
            return 0;
        }
    }
    */
   // можно без else т.к. return же прерывает функцию
    function foo(addingSting){
        if (arguments.length == 0){
            return bufferString;
        }             
        bufferString += addingSting;
    }

    foo.clear = function(){
        bufferString = "";
    }
    return foo;

}

var buffer = makeBuffer();


// добавить значения к буферу
buffer('Замыкания');
buffer(' Использовать');
buffer(' Нужно!');

// получить текущее значение
alert( buffer() ); // Замыкания Использовать Нужно!
//Буфер должен преобразовывать все данные к строковому типу:

var buffer = makeBuffer();
buffer(0);
buffer(1);
buffer(0);

alert( buffer() ); // '010'
/*

*/
buffer.clear();
alert( buffer() ); // ''

