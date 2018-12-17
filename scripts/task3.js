//task 5.3

const num1 = 14;
const num2 = 4;
const pow = ((a, b) => (a ** b));
const mod =  (a, b) => ( (a - a % b) / b) ; 
/*
попробовал перевести на стрелочные функции. 
еще раз убедился что поределение функции
можно писать где угодно.

а функциональное выражении нужно все же определять до использования. :)

*/
console.log(calc(num1, num2 , add));
console.log(calc(num1, num2 , sub));
console.log(calc(num1, num2 , mul));
console.log(calc(num1, num2 , div));
console.log(calc(num1, num2 , mod));
console.log(calc(num1, num2 , pow));

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
