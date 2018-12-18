//task 5.3

const num1 = +prompt('Введите 1е число', 14);
const num2 = +prompt('Введите 2е число', 4);
const pow = ((a, b) => (a ** b));
const mod =  (a, b) => ( (a - a % b) / b) ; 
/*
попробовал перевести на стрелочные функции. 
еще раз убедился что определение функции
можно писать где угодно.

а функциональное выражении нужно все же определять до использования. :)

*/

/*при целочисленном делении , понятно что проверять надо являются ли 
операнды целыми. но не стал. в ТЗ нет :) */
console.log(`${num1} + ${num2} = ${calc(num1, num2 , add)}`);
console.log(`${num1} - ${num2} = ${calc(num1, num2 , sub)}`);
console.log(`${num1} * ${num2} = ${calc(num1, num2 , mul)}`);
console.log(`${num1} / ${num2} = ${calc(num1, num2 , div)}`);
console.log(`${num1} делить нацело на ${num2} = ${calc(num1, num2 , mod)}`);
console.log(`${num1} в степени ${num2} = ${calc(num1, num2 , pow)}`);

//============================================
function add(a, b){
    return a + b;
}

function mul(a, b){
    return a * b;
}

function div(a, b){
    return a / b;
}

function sub(a, b){
    return a - b;
}

// function pow(a, b){
//     return  a ** b;
// } 

// function mod(a, b){  
//     return (a - a % b) / b; 
// }

function calc(a, b, callback){
    //console.log(callback);
    return callback(a, b);
}
