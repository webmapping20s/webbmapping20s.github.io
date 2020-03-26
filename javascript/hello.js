// alert("Hello world");

// let message = "Hello world";
// alert(message);
// message = "Hallo Welt";
// alert(message);

const LINK_COLOR = "#ff0000";
console.log("Link bitte in der Farbe ", LINK_COLOR);

// numerische Variable

let highscore = 520233;
console.log(highscore / 10);

// Zeichenketten/Strings

let firstname = "John";
let lastname = 'Smith';
console.log("Name: ", firstname, lastname);

let fullname = 'Jeffrey "The Dude" Lebowski';
console.log(fullname);

let template = `Dein Highscore sind ${highscore} Punkte`;
console.log(template);

let isOver18 = true;
console.log(isOver18);

let age = 19;
console.log("über 18?", age > 18);

// Arrays/Listen

let participants = [ "John", "Jane", "Max" ];
console.log(participants);
console.log("Einträge im Array: ", participants.length);
console.log(participants[2]);

let gameHighscores = [2099, 3010, 3333, 5000 ];
console.log(gameHighscores);

// Objekte

let user = {
    firstname: "John",
    lastname: "Smith",
    age: 25
};

console.log(user);
console.log(user.firstname);
user.highscore = 200;
user["highscore ever"] = 400;
console.log(user);

let a = 2;
let b = 4;
console.log(a+b);
console.log(b/(a-1));
a++;
console.log(a);

// if-Abfrage

// let myAge = prompt("Wie alt bist du?");
// console.log(`Du bist ${myAge} Jahre alt.`);
// console.log(`über 18? ${myAge > 18}`);

// if (myAge > 18) {
//     console.log("Glückwunsch über 18");
// } else {
//     console.log("Leider unter 18");
// }

// Schleifen: for Schleife

for (let i=0; i<10; i++) {
    console.log(`Schleife ${i}`);
}

for (let j = 0; j < participants.length; j++) {
    const participant = participants[j];
    console.log(`Teilnehmer*in ${j} ${participant}`);
}

participants.forEach(participant => {
    console.log(`Teilnehmer*in ${participant}`);
});

// Funktionen

function showAge(birthYear) {
    console.log(`Du bist ca. ${2020 - birthYear} Jahre alt.`);
}

showAge(1964);
showAge(1977);

function calcAge(birthYear) {
    return 2020 - birthYear;
}

console.log(`Max ist ${calcAge(1977)} Jahre alt (ca.)`);
console.log(`John ist ${calcAge(1988)} Jahre alt (ca.)`);

let birthYears = [ 1964, 1977, 1980, 2001, 2004 ];
console.log(birthYears);

birthYears.forEach(year => {
    console.log(`Geboren ${year}, heute ca. ${calcAge(year)} Jahre alt.`);
});

let users = [
    { firstname: "John", lastname: "Smith", birthYear: 1960 },
    { firstname: "Jane", lastname: "Doe", birthYear: 1970 },
    { firstname: "Max", lastname: "Mustermann", birthYear: 1990 },
];

console.log(users);

users.forEach(user => {
    console.log(`${user.firstname} ist oder wird heuer ${calcAge(user.birthYear)} Jahre alt.`);
});

let firstParagraph = document.querySelector("#pFirst");
console.log(firstParagraph);
// firstParagraph.remove();
firstParagraph.innerHTML = "Test";
firstParagraph.style.color = "red";

let indetedParas = document.querySelectorAll(".indent");
console.log(indetedParas);
indetedParas.innerHTML = "Test2";
indetedParas.forEach((para, index) => {
    console.log(`Data attribut LAT ${para.dataset.lat}`);
    para.innerHTML = `Absatz ${index}`;
    if ( index % 2 == 0) {
        para.style.color = "red";
    } else {
        para.style.color = "blue";
    }
});