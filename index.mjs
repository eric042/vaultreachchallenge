import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);

const accBob = await stdlib.newTestAccount(startingBalance);

const accAlice = await stdlib.newTestAccount(stdlib.parseCurrency(6000))
console.log('Hello, Alice and Bob!');

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

const choiceArray = ["I am not here, I am still here"];

const getBalance = async (who) => stdlib.formatCurrency((await stdlib.balanceOf(who)))

console.log(`Alice previous bal is: ${await getBalance(accAlice)}`);
console.log(`Bob previous bal is: ${await getBalance(accBob)}`);

const Shared = () => ({
  showTime: (t) => {
    //parseInt
    console.log(parseInt(t));
  },
});

console.log('Starting backends...');
await Promise.all([
  backend.Alice(ctcAlice, {
    ...stdlib.hasRandom,
    ...Shared(),
    inherit: stdlib.parseCurrency(5000),
    getChoice: () => {
      const choice = Math.floor(Math.random() * 2);
      console.log(`Alice choice is ${choiceArray[choice]}`);
      return (choice == 0 ? false : true);
    },
    // implement Alice's interact object here
  }),
  backend.Bob(ctcBob, {
    ...stdlib.hasRandom,
    acceptTerms: (num) => {
      console.log(`Bob accepts terms of the vault for ${stdlib.formatCurrency(num)}`);
      return true;
    },
    // implement Bob's interact object here
  }),
]);

console.log('Alice balance after is:')
console.log('Bob balance after')
console.log('Goodbye, Alice and Bob!');
