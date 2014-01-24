const ut = "do"
const UT3 = "ut3"
const UT4 = "ut4"
const DO = "do"
const C  = "do"
const re = "ré"
const RE = "ré"
const D  = "ré"
const mi = "mi"
const MI = "mi"
const E  = "mi"
const fa = "fa"
const FA = "fa"
// const F  = "fa" // Conflit avec Flash
const sol = "sol"
const SOL = "sol"
const G   = "sol"
const la = "la"
const LA = "la"
const A  = "la"
const si = "si"
const SI = "si"
const B  = "si"

const a0='a0'; const ad0='ad0'; const ab0='ab0'; const b0='b0'; const bd0='bd0'; const bb0='bb0'; const c0='c0'; const cd0='cd0'; const cb0='cb0'; const d0='d0'; const dd0='dd0'; const db0='db0'; const e0='e0'; const ed0='ed0'; const eb0='eb0'; const f0='f0'; const fd0='fd0'; const fb0='fb0'; const g0='g0'; const gd0='gd0'; const gb0='gb0'; const a1='a1'; const ad1='ad1'; const ab1='ab1'; const b1='b1'; const bd1='bd1'; const bb1='bb1'; const c1='c1'; const cd1='cd1'; const cb1='cb1'; const d1='d1'; const dd1='dd1'; const db1='db1'; const e1='e1'; const ed1='ed1'; const eb1='eb1'; const f1='f1'; const fd1='fd1'; const fb1='fb1'; const g1='g1'; const gd1='gd1'; const gb1='gb1'; const a2='a2'; const ad2='ad2'; const ab2='ab2'; const b2='b2'; const bd2='bd2'; const bb2='bb2'; const c2='c2'; const cd2='cd2'; const cb2='cb2'; const d2='d2'; const dd2='dd2'; const db2='db2'; const e2='e2'; const ed2='ed2'; const eb2='eb2'; const f2='f2'; const fd2='fd2'; const fb2='fb2'; const g2='g2'; const gd2='gd2'; const gb2='gb2'; const a3='a3'; const ad3='ad3'; const ab3='ab3'; const b3='b3'; const bd3='bd3'; const bb3='bb3'; const c3='c3'; const cd3='cd3'; const cb3='cb3'; const d3='d3'; const dd3='dd3'; const db3='db3'; const e3='e3'; const ed3='ed3'; const eb3='eb3'; const f3='f3'; const fd3='fd3'; const fb3='fb3'; const g3='g3'; const gd3='gd3'; const gb3='gb3'; const a4='a4'; const ad4='ad4'; const ab4='ab4'; const b4='b4'; const bd4='bd4'; const bb4='bb4'; const c4='c4'; const cd4='cd4'; const cb4='cb4'; const d4='d4'; const dd4='dd4'; const db4='db4'; const e4='e4'; const ed4='ed4'; const eb4='eb4'; const f4='f4'; const fd4='fd4'; const fb4='fb4'; const g4='g4'; const gd4='gd4'; const gb4='gb4'; const a5='a5'; const ad5='ad5'; const ab5='ab5'; const b5='b5'; const bd5='bd5'; const bb5='bb5'; const c5='c5'; const cd5='cd5'; const cb5='cb5'; const d5='d5'; const dd5='dd5'; const db5='db5'; const e5='e5'; const ed5='ed5'; const eb5='eb5'; const f5='f5'; const fd5='fd5'; const fb5='fb5'; const g5='g5'; const gd5='gd5'; const gb5='gb5'; const a6='a6'; const ad6='ad6'; const ab6='ab6'; const b6='b6'; const bd6='bd6'; const bb6='bb6'; const c6='c6'; const cd6='cd6'; const cb6='cb6'; const d6='d6'; const dd6='dd6'; const db6='db6'; const e6='e6'; const ed6='ed6'; const eb6='eb6'; const f6='f6'; const fd6='fd6'; const fb6='fb6'; const g6='g6'; const gd6='gd6'; const gb6='gb6'; const a7='a7'; const ad7='ad7'; const ab7='ab7'; const b7='b7'; const bd7='bd7'; const bb7='bb7'; const c7='c7'; const cd7='cd7'; const cb7='cb7'; const d7='d7'; const dd7='dd7'; const db7='db7'; const e7='e7'; const ed7='ed7'; const eb7='eb7'; const f7='f7'; const fd7='fd7'; const fb7='fb7'; const g7='g7'; const gd7='gd7'; const gb7='gb7'; 


/**
  * En clé, la note et son octave et en valeur son décalage par
  * rapport à la portée. Donc il faut ajouter cette valeur à la hauteur
  * de la portée pour placer la note.
  *
  * @property {Object} NOTE_TO_OFFSET
  * @static
  * @final
  */

REAL_INDICES_NOTES = {
  'c' : 1,
  'd' : 3,
  'e' : 5,
  'f' : 6,
  'g' : 8,
  'a' : 10,
  'b' : 12
}

/**
  * Suite des notes (redoublé pour pouvoir faire une recherche sur 
  * des intervalles)
  * @property {Array} NOTES
  * @static
  * @final
  */
NOTES = ["c", "d", "e", "f", "g", "a", "b", "c", "d", "e", "f", "g", "a", "b", "c"]
NOTES_ENVERS = $.merge([], NOTES)
NOTES_ENVERS.reverse() // => [c, b, a, g, f, e, d, c, b, a]
/**
  * Définition des positions en hauteur des notes en fonction de leur octave
  * @property {Object} NOTE_TO_OFFSET
  * @static
  * @final
  */
NOTE_TO_OFFSET = {}
for(var octave = 0; octave < 9; ++octave)
{
  for(var inote=0; inote<7;++inote)
  {
    // zéro : octave=4 inote=5
    note    = NOTES[inote]
    valeur  = (1 + parseInt(inote)) + (octave * 7) // a4 = 6 + (4*7) = 34
    offset  = (- (valeur - 32) * 6) + 1
    NOTE_TO_OFFSET[note+octave] = offset
  }
}

/**
  * Décalage de l'altération par rapport à la note en fonction de son type
  * @property {Object} OFFSET_ALTERATION
  * @static
  * @final
  */
OFFSET_ALTERATION = {
  'b' : {top: 12, left: 14},
  'd' : {top: 5,  left: 16},
  'z' : {top: 5,  left: 16},
  'x' : {top: -1, left: 19},
  't' : {top: 9,  left: 17}
}

window.DATA_SCALES = {
  'MAJ'   : {intervalles:[2,2,1,2,2,2,1, 2,2,1,2,2,2,1]},
  'min_h' : {intervalles:[2,1,2,2,1,3,1, 2,1,2,2,1,3,1]},
  'min_ma': {intervalles:[2,1,2,2,2,2,1, 2,1,2,2,2,2,1]},
  'min_md': {intervalles:[2,1,2,2,1,2,2, 2,1,2,2,1,2,2]}
}