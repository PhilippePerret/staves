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
  'act' : {replace:"ACTIVE_STAFF(X)",         boffset:2,  length:1  },
  'cap' : {replace:'CAPTION("")',             boffset:2             },
  'apw' : {fourth:'c'},
  'cho' : {replace:"CHORD('c4 e4 g4')",       boffset:10, length:8  },
  'cur' : {replace:"SET_CURSOR(200)",         boffset:4,  length:3  },
  'def' : {replace:"DEFAULT('PROP', VALUE)",  boffset:13, length:4  },
  'mot' : {replace:"MOTIF('c4 d4 e4')",       boffset:10, length:8  },
  'nex' : {replace:"NEXT()",                  boffset:0             },
  'new' : {replace:"NEW_STAFF(SOL)",          boffset:4,  length:3  },
  'not' : {replace:"NOTE('c4')",              boffset:4,  length:2  },
  'sca' : {replace:"SCALE('c')",              boffset:3,  length:1  },
  'sta' : {replace:"STAFF(1)",                boffset:2,  length:1  },
  'sui' : {replace:"SUITE('ANIM')",           boffset:6,  length:4  },
  'wai' : {replace:"WAIT(5)",                 boffset:2,  length:1  }
}
/*
 *  À quatre lettres
 *
 *  Note : les trois dernières doivent être définies ci-dessus avec seulement
 *          le paramètre `fourth` définissant la première lettre
 */
$.extend(window.DATA_AUTOCOMPLETION, {
  'capw': {replace:'CAPTION("", {wait:true})', boffset:15             }
  
})