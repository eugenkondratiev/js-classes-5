//task 5.4

/*
Написать функцию для подсчёта сложных процентов. 
Первый аргумент - это деньги на счету, второй - размер процента, 
третий - срок банковского вклада в годах. 
Функция возвращает конечную сумму на счету с учётом, что в конце года происходит начисление процентов.
 Если срок не завершён, то проценты прибавляются к деньгам на счёте 
 и в следующем году уже считается процент этой суммы. 
 То есть у нас ежегодная капитализация
*/

function calcComplexPercent(current = 0, percent = 5, period = 10){
        fund = current;
        currentYear = 0;
        function calcPeriod(){
             currentYear < period ? (currentYear++, fund *= (1 + 0.01 * percent)) : fund;
               // console.log( currentYear.toFixed()  + "   " + fund.toFixed(2));
            return fund;
        }

        calcPeriod.getFund = function (){
            return fund;
        }
        calcPeriod.getPeriod = function (){
            return period;
        }

        return calcPeriod;
}
const GET_START_FUND = 'Введите сумму вклада: ';
const GET_PERCENT = 'Введите процент годовой: ';
const GET_PERIOD = 'Введите скрок вклада: ';


const calcNextYear = calcComplexPercent(
    +prompt(GET_START_FUND, 1000), 
    +prompt(GET_PERCENT, 5), 
    +prompt(GET_PERIOD, 7)
    );

let schedule = 'График накопления на Вашем счету:  <br /> \n'; //чтоб и на экране в консоли было читаемо

for(let i = 1; i <= calcNextYear.getPeriod(); i++ ){
    let yearWord = i % 10 == 1 ? '-го года' : i % 10 < 5  ? '-х лет' : '-и лет'; 
    calcNextYear(); 
    schedule += i < calcNextYear.getPeriod() 
    ?`Баланс после  ${i}${yearWord}  : ${calcNextYear.getFund().toFixed(2)} грн. <br /> \n`
    : `Конечный баланс после ${i}${yearWord} :  <b>${calcNextYear.getFund().toFixed(2)} грн. </b>`;
};

console.log(schedule);

const block = document.createElement('dev');

 block.style.fontStyle.fontcolor = 'rgb(50, 50, 256)';
 document.body.appendChild(block);
 block.innerHTML = schedule;









