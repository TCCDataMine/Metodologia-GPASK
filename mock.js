//https://chancejs.com/
/*
Criar Modelos:
OK - Definir tamanho da turma
OK - Criar o seed com o prefixo(base) + sufixo(incremental)
OK - Definir as skills da Disciplina [pontos a serem distribuídos]
OK - Criar SoftSkill predominantes (5 skills)
*/

/* 
Dividir integrantes:
Definir Divisão dos Grupos na Atividade
Definir peso das Disciplinas na Atividade
*/

/*
Mensurar:

- Saber em Grupo (Persona)
- distancia
Gerar um indíce de saber naquele grupo
Gerar o conhecimento das softskills
*/



// input = (123.json
// 125.json
// 127.json
// 127.json
//   ..100)

// //-----
// Algoritmo = formar grupos

// input(125.json) => (GPASK) => saida(125_grupos.json)

// //----

// grupos: {
//   grupo1: {

//   },
//   grupo2: {

//   }
// }

// node analizador.js - i 125.json - o 125_grupos.json


const Chance = require('chance');
const params = require('./config/parametros.js')();

const { turma, hardskills_atividade } = params;

const chance = new Chance(turma);
require('./ClassroomGenerate.js')(chance)

var fs = require('fs');
const { alunos, analise_hardskills_turma } = chance.classroom(params);

fs.writeFile(`turmas/${turma}.json`, JSON.stringify({
  alunos,
  analise: analise_hardskills_turma,
  hardskills_atividade
}, null, 2), function (err) {
  if (err) throw err;
  console.log('complete');
}
);

