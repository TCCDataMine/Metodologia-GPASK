//node random.js -i turmas/123.json -o grupos -q 6 -s 1

var argv = require('yargs/yargs')(process.argv.slice(2)).argv;
console.log(argv)
const { match } = require('assert');
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

  let posicao = getPosicao(grupos[`grupo_${grupo_corrente}`]);
  let aluno = turma.alunos[posicao]

  grupos[`grupo_${grupo_corrente}`].push(aluno)

  // console.log(aluno)
  turma.alunos.splice(posicao, 1);
  grupo_corrente += 1;

}

// for (let a in turma.alunos) {
//   let aluno = turma.alunos[a]
//   // console.log(a, aluno)
// }


let filename = argv.i.split("/")[1].split(".json")[0]

fs.writeFile(`${argv.o}/${filename}_${argv.s}.json`, JSON.stringify({
  grupos,
  hardskills_atividade: turma.hardskills_atividade

}, null, 2), function (err) {
  if (err) throw err;
  console.log('complete');
}
);

function getPosicao(grupo) {
  const hsActivity = Object.keys(turma.hardskills_atividade);
  if(grupo.length > 0) {
    let hsScore = [];
    for (const skill of hsActivity){
      hsScore.push(grupo.map((aluno) => aluno.hardskills[skill].nota));
    }

    hsScore = hsScore.map((skills) => skills.reduce((accumulator, currentValue) => accumulator + currentValue));


    //Define a melhor hardskill do grupo 
    const hsBest = hsActivity[hsScore.indexOf(Math.max(...hsScore)) ];

    //coleta as notas de todos os alunos da melhor hardSkill
    const hsBStudent = turma.alunos.map((aluno) => aluno.hardskills[hsBest].nota);
    
    // Retorna os melhores alunos da melhor hardskill do grupo
    return hsBStudent.indexOf(Math.max(...hsBStudent));
  }
  else { 
      // coleta os pesos de todas as HardSkils(influencia das Hardskills)
    const hsInfluence = hsActivity.map((skill) => turma.hardskills_atividade[skill].peso);

    //coleta a hardskill com mais influente
    const hsHighInfluence = hsInfluence.indexOf(Math.max(...hsInfluence));

    //coleta os melhores alunos das HardSkills mais influentes
    const hsBStudent = turma.alunos.map((aluno) => aluno.hardskills[hsActivity[hsHighInfluence]].nota);

    //Define pior aluno da hardSkill mais influente
    return hsBStudent.indexOf(Math.min(...hsBStudent));
  }
}


