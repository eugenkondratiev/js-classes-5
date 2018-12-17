/**
 * 
 * callbacks
 */

// const days = ['Mon', 'Tue', 'Wed'];

// days.forEach( daysIterator);

// function daysIterator(day, index, arr){
//     console.log(`arr[${index}] = ${day}`);
      
// }

// function myForEach(arr, iterator){
//     for (let i =0; i < arr.length; i++){
//         iterator(arr[i], i, arr);
//     }
// }

// myForEach(days, daysIterator);


const num1 = 14;
const num2 = 88;

console.log(equal(num1, num2 , add));
console.log(equal(num1, num2 , mul));

















//============================================




function add(a, b){
    return a + b;
}

function mul(a, b){
    return a * b;
}

function equal(a, b, callback){
    return callback(a, b);
}


function factorial(n) {
    // if (n ==1) {
    //         return n;
    // } else {
    //     return n * factorial(n - 1);
    // }
    return (n == 1) ? n : n * factorial(n - 1); 
}

const fact = (n) => (n == 1) ? n : n * factorial(n - 1); 

console.log(factorial(2));
console.log(factorial(3));
console.log(factorial(5));


console.log(fact(2));
console.log(fact(3));
console.log(fact(5));


/**************************************************** */
const arr1 = [
    100,
    ['a','b']
];

console.log(arr1 instanceof Array);


function foo(arr) {
    for (let i = 0; i < arr.length; i++) {
        if( arr[i] instanceof Array){
            foo(arr[i]);
        } else{
            console.log(arr[i]);
        };
        
    }    
}

foo(arr1);


/**************************************************** */
function fibo(n) {
    return n < 2 ? n : fibo(n - 2) + fibo(n - 1);
}
console.log(fibo(1));
console.log(fibo(2));
console.log(fibo(3));
console.log(fibo(4));
console.log(fibo(5));
console.log(fibo(6));
console.log(fibo(10));

