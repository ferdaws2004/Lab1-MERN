const products = [
{ name : 'Keyboard', price : 45 } ,
{ name : 'Monitor', price : 320 } ,
{ name : 'Mouse', price : 25 }
];

//Destructuring
const { name , price } = products [0] ;
console.log ( name , price ) ; 
//find
const mouse=products.find(p => p.name === 'Mouse');
console.log(mouse.price);
//filter
const cheapProducts=products.filter(p => p.price < 100);
console.log(cheapProducts);
// Arrow function
const withDiscount = (price) => price * 0.9;
console.log(withDiscount(320));