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
const DEFAULT_FUND = 1000;
const DEFAULT_PERCENT = 7;
const DEFAULT_PERIOD = 10;

const increaseFundWithPercent = (_fund, _percent) => (_fund * (1 + 0.01 * _percent));


function calcComplexPercent(current = DEFAULT_FUND, percent = DEFAULT_PERCENT, period = DEFAULT_PERIOD){
        fund = current;
        currentYear = 0;
        function calcPeriod(){            
            fund = currentYear < period ? (currentYear++, increaseFundWithPercent(fund, percent)) : fund;
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
const GET_START_FUND = 'Введите сумму вклада , грн: ';
const GET_PERCENT = 'Введите процент годовой , %: ';
const GET_PERIOD = 'Введите скрок вклада, лет: ';


const calcNextYear = calcComplexPercent(
    +prompt(GET_START_FUND, DEFAULT_FUND), 
    +prompt(GET_PERCENT, DEFAULT_PERCENT), 
    +prompt(GET_PERIOD, DEFAULT_PERIOD)
    );

let schedule = 'График накопления на Вашем счету:  <br /> \n'; //чтоб и на экране в консоли было читаемо

for(let i = 1; i <= calcNextYear.getPeriod(); i++ ){
    let yearWord = i % 10 == 1 ? '-го года' : i % 10 < 5  ? '-х лет' : '-и лет'; //выбор окончания и склонения
    calcNextYear(); 
    schedule += i < calcNextYear.getPeriod() 
    ?
    `Баланс после  ${i}${yearWord}  : ${calcNextYear.getFund().toFixed(2)} грн. <br /> \n`
    : 
    `Конечный баланс после ${i}${yearWord} :  <b>${calcNextYear.getFund().toFixed(2)} грн. </b>`;
};

console.log(schedule);

const block = document.createElement('dev');
block.style.position = "relative";
block.style.top = "50px";

 block.style.fontStyle.fontcolor = 'rgb(50, 50, 256)';
 document.body.appendChild(block);
 block.innerHTML = schedule;









