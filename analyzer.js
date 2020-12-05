//node analyzer.js -i grupos/123_1.json -o analises

var argv = require('yargs/yargs')(process.argv.slice(2)).argv;
const fs = require('fs');


//------
// Comparar a proporção interna do saber baseado no peso das hardskills na atividade
// Mensurar Distancia entre os grupos
// Validar distribuição complementar das softskills (quantidade maior)

let rawdata = fs.readFileSync(argv.i);
let grupos = JSON.parse(rawdata);

let min_deficit_distribuicao = 100;
let max_deficit_distribuicao = 0;

let min_softskill = 100;
let max_softskill = 0;

for (let g in grupos.grupos) {

  let grupo = grupos.grupos[g]
  // console.log(g, grupo)


  let total_integrantes = grupo.length;
  let softskills = [];
  let conhecimento_grupo = {
    hardskills: {},
    total_conhecimento_hardskills: 0,
  }

  for (let a in grupo) {
    let aluno = grupo[a];

    for (let s in aluno.softskills) {
      let softskill = aluno.softskills[s];
      if (!softskills.includes(softskill)) {

        softskills.push(softskill);
      }
    }

    for (let h in aluno.hardskills) {
      let hardskill = aluno.hardskills[h];

      conhecimento_grupo.total_conhecimento_hardskills += hardskill.nota;
      if (!conhecimento_grupo.hardskills.hasOwnProperty(h)) {
        conhecimento_grupo.hardskills[h] = {
          total_pontos: hardskill.nota
        }
      } else {
        conhecimento_grupo.hardskills[h].total_pontos += hardskill.nota
      }

    }

  }
  let deficit_distribuicao = 0;

  for (let h in conhecimento_grupo.hardskills) {
    let hardskill = conhecimento_grupo.hardskills[h]

    conhecimento_grupo.hardskills[h].percentual = (hardskill.total_pontos * 100) / conhecimento_grupo.total_conhecimento_hardskills

    // console.log(grupos.hardskills_atividade)

    if (conhecimento_grupo.hardskills[h].percentual < grupos.hardskills_atividade[h].peso) {
      let deficit = grupos.hardskills_atividade[h].peso - conhecimento_grupo.hardskills[h].percentual;
      deficit_distribuicao += deficit;
      // console.log(g, h, conhecimento_grupo.hardskills[h].percentual, grupos.hardskills_atividade[h].peso, deficit)
    } else {
      // console.log(g, h, conhecimento_grupo.hardskills[h].percentual, grupos.hardskills_atividade[h].peso)
    }



  }

  if (deficit_distribuicao < min_deficit_distribuicao) {
    min_deficit_distribuicao = deficit_distribuicao
  }

  if (deficit_distribuicao > max_deficit_distribuicao) {
    max_deficit_distribuicao = deficit_distribuicao
  }


  conhecimento_grupo['deficit_hardskills_absoluto'] = deficit_distribuicao;
  console.log(g, conhecimento_grupo['deficit_hardskills_absoluto'])

  // console.log(g, softskills.length / total_integrantes);

  conhecimento_grupo['media_softskills'] = softskills.length / total_integrantes

  if (conhecimento_grupo['media_softskills'] < min_softskill) {
    min_softskill = conhecimento_grupo['media_softskills']
  }

  if (conhecimento_grupo['media_softskills'] > max_softskill) {
    max_softskill = conhecimento_grupo['media_softskills']
  }


  grupos.grupos[g] = {
    conhecimento_grupo
  }

}
console.log(min_deficit_distribuicao, max_deficit_distribuicao)
console.log(min_softskill, max_softskill)


let gap_softskill = 0;
for (let cg in grupos.grupos) {
  let grupo = grupos.grupos[cg].conhecimento_grupo
  console.log(grupo.media_softskills)
  let gap = (max_softskill - grupo.media_softskills) /
    (max_softskill - min_softskill)
  console.log("gap_softskill", gap)


  if (gap > 0 && gap < 1) {
    gap_softskill += gap
  }

}


let gap_hardskill = 0;
for (let cg in grupos.grupos) {
  let grupo = grupos.grupos[cg].conhecimento_grupo
  console.log(grupo.deficit_hardskills_absoluto)
  let gap = (min_deficit_distribuicao - grupo.deficit_hardskills_absoluto) /
    (min_deficit_distribuicao - max_deficit_distribuicao)
  console.log("gap", gap)

  grupos.grupos[cg].conhecimento_grupo['deficit_hardskills_relativo'] = grupo.deficit_hardskills_absoluto * gap
  if (gap > 0 && gap < 1) {
    gap_hardskill += gap
  }

}




let analise = {
  grupos: grupos.grupos,
  gap_hardskill: gap_hardskill,
  gap_softskill: gap_softskill,
  acuracia: 100 - (9 * gap_hardskill) + (1 * gap_softskill)
}
//-----

let filename = argv.i.split("/")[1]
fs.writeFile(`${argv.o}/${filename}`, JSON.stringify({
  analise

}, null, 2), function (err) {
  if (err) throw err;
  console.log('complete');
}
);


