//task 5.6 reduce c  умножением 


function multiplyAll(...numbers) {
    let mult = 1;
 //       numbers.forEach(function(num){ return mult *= num});
        numbers.forEach(num => mult *= num);
    return mult;
 } 

 console.log(multiplyAll(1, 2, 3, 4, 5));


function multiplyAllReduced(...numbers) {
    let mult = 1;
        numbers.reduce((mult, num) => mult * num);
        
    return mult;
 } 

 console.log(multiplyAll(1, 2, 3, 4, 5));


