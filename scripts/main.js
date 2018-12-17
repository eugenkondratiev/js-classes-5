

function f() {
    console.log(this);
    
}
const o = {
    foo: f
}
student = {
    name : 'John',
    lastName:'Doe'
}

f.call(student);
f.apply(student);


var helloKeyWord = function(){
        return  "Halo,  "
}

var greeting = helloKeyWord;
greeting();

var sayGreeting = function(){
    
    let d = new Date();
    //console.log(Date.now +"         " + typeof Date.now +"    " +d);
    let currentHour = d.getHours();

    if (currentHour<7 || currentHour>18 ) {
        return  "Good night,  ";
    
    } else {
        if (currentHour<11) {
            return  "Good morning,  "
        } else {
            return  "Good day,  "
        }
        
    }
    
}



const MAX_STUDENTS = 3;
const students =['Eugen','Alex', 'Mia']; 
for(let i = 0; i< students.length; i++) {
    console.log(sayGreeting() + students[i]);
}


function multiply(a, b) {
   return a * b;
} 
function add(a = 0, b = 0) {
    return a + b;
 } 
let x = multiply(10, 20, 30, 50 , 70);

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


 /* самовызов */
 

 const color = (function(){
     return {
         RED: '#FF0000'
         ,GREEN : '#00FF00'
         ,BLUE : '#0000FF'
     }
 })();
 /*
color with closure
 */
const _color = (function(){
    RED = '#FF0000';
    GREEN = '#00FF00';
    BLUE = '#0000FF';

    return {
        red: function(){
            return RED
        }
        ,green: function(){
            return GREEN
        }
        ,blue: function(){
            return BLUE
        }
    }
})();

 const GRAY_IS_NEW_BLACK = 'rgb(192, 192, 192)';

 //const NEXT_COLOR = color.GREEN;//'#FFA0B0';
 const NEXT_COLOR = _color.green();//'#FFA0B0';

 //console.log(document.getElementsByTagName('html').item(0) );
 const block = document.createElement('dev');
 block.style.width = '300px';
 block.style.height = '500px';
 block.style.backgroundPositionX = '500px';
 block.style.backgroundPositionY = '500px';

 block.style.backgroundColor = NEXT_COLOR ;//rgb(192, 192, 192);
 document.body.appendChild(block);
 block.innerHTML = 'New Block';


 

 

















