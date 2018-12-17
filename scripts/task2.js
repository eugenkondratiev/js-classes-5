//task 5.2

const LATE_NAME_ASK = "Так как вас звали то?";
const NICE_GOOD_BYE = "До свидания, ";

function bye() {
    alert(NICE_GOOD_BYE + prompt(LATE_NAME_ASK, "Вася"));
}

bye();