/**
  * @module contantes_autocompletion.js
  */

/**
  * Données pour l'autocompletion dans la console
  * Définit les textes de remplacement. Chaque donnée contient en clé le
  * texte tapé en console et en valeur :
  *   - replace     Le texte de remplacement
  *   - boffset     Le "retour curseur" ie le nombre de caractères que le curseur
  *                 remontera (en arrière) pour se positionner.
  *   - length      Le nombre de caractères qui seront sélectionnés (0 par défaut)
  * @class DATA_AUTOCOMPLETION
  * @for window
  * @static
  # @final
  */
window.DATA_AUTOCOMPLETION = {
  '---' : {replace:"---------------------------------------------------", boffset:0, length:0},
  '***' : {replace:"***************************************************", boffset:0, length:0},
  '===' : {replace:"===================================================", boffset:0, length:0},
  'act' : {replace:"ACTIVE_STAFF(X)",         boffset:2,  length:1  },
  'aic' : {fourth:'w'},
  'apw' : {fourth:'c'},
  'arr' : {replace:"arrow('KEY')",            boffset:5,  length:3  },
  'bac' : {replace:"BACKGROUND({})",          boffset:2,  length:0  },
  'box' : {replace:"BOX({})",                 boffset:2,  length:0  },
  'cap' : {replace:'CAPTION("")',             boffset:2             },
  'cho' : {replace:"CHORD('c4 e4 g4')",       boffset:10, length:8  },
  'col' : {replace:"colorize(COULEUR)",       boffset:8,  length:7  },
  'cur' : {replace:"SET_CURSOR(200)",         boffset:4,  length:3  },
  'def' : {replace:"DEFAULT('PROP', VALUE)",  boffset:13, length:4  },
  'exe' : {replace:"EXEC('CODE')",            boffset:6,  length:4  },
  'fan' : {replace:"fantomize()",             boffset:0,  length:0  },
  'ima' : {replace:"IMAGE({url:'URL'})",      boffset:6,  length:3  },
  'mot' : {replace:"MOTIF('c4 d4 e4')",       boffset:10, length:8  },
  'nex' : {replace:"NEXT()",                  boffset:0             },
  'new' : {replace:"NEW_STAFF(SOL)",          boffset:4,  length:3  },
  'not' : {replace:"NOTE('c4')",              boffset:4,  length:2  },
  'now' : {replace:"EXEC('now()')",           boffset:0             },
  'opa' : {replace:"opacity:0.00",            boffset:2,  length:2  },
  'sca' : {replace:"SCALE('c')",              boffset:3,  length:1  },
  'sta' : {replace:"STAFF(1)",                boffset:2,  length:1  },
  'sui' : {replace:"SUITE('ANIM')",           boffset:6,  length:4  },
  'tbo' : {replace:"TBOX(\"TEXTE\")",         boffset:7,  length:5  },
  'wai' : {replace:"WAIT(5)",                 boffset:2,  length:1  }
}
/*
 *  À quatre lettres
 *
 *  Note : les trois dernières doivent être définies ci-dessus avec seulement
 *          le paramètre `fourth` définissant la première lettre
 */
$.extend(window.DATA_AUTOCOMPLETION, {
  'capw': {replace:'CAPTION("", {wait:true})', boffset:15             },
  'waic': {replace:'WAIT_CAPTION',             boffset:0              }
})