//node random.js -i turmas/123.json -o grupos -q 6 -s 1

var argv = require('yargs/yargs')(process.argv.slice(2)).argv;
console.log(argv)
const fs = require('fs');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let rawdata = fs.readFileSync(argv.i);
let turma = JSON.parse(rawdata);

let total_alunos = turma.alunos.length;
let quantidade_grupos = total_alunos / argv.q;
// console.log(total_alunos / argv.q)

grupos = {}

for (let i = 0; i < quantidade_grupos; i++) {
  grupos[`grupo_${i + 1}`] = []
}
let grupo_corrente = 1;
while (turma.alunos.length > 0) {
  // console.log(grupo_corrente, quantidade_grupos)
  if (grupo_corrente > Math.ceil(quantidade_grupos)) grupo_corrente = 1;
  // console.log('grupo_corrente', grupo_corrente)
  
  let posicao = getRandomInt(1, turma.alunos.length) - 1
  let aluno = turma.alunos[posicao]

  grupos[`grupo_${grupo_corrente}`].push(aluno)

  // console.log(aluno)
  turma.alunos.splice(posicao, 1);
  grupo_corrente += 1;
}
let filename = argv.i.split("/")[1].split(".json")[0]

fs.writeFile(`${argv.o}/${filename}_${argv.s}.json`, JSON.stringify({
  grupos,
  hardskills_atividade: turma.hardskills_atividade

}, null, 2), function (err) {
  if (err) throw err;
  console.log('complete');
}
);


