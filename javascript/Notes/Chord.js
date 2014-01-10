/**
  * Gestion des accords
  * @module Chord.js
  */

/**
  * @method CHORD
  * @param  {String} strnotes La suite des notes, séparées par des espaces
  * @param  {Object} params   Paramètres optionnels
  * @return {Chord} Instance de Chord
  */
window.CHORD = function(strnotes, params)
{
  dlog("-> CHORD")
  var accord = new Chord(strnotes, params)
  dlog("instance Chord:");dlog(accord)
  return accord
}

/**
  * Class Chord
  * Gestion des accords
  * Notes
  * -----
  *
  * @class Chord
  * @constructor
  */
window.Chord = function(strnotes, params)
{
  this.class = 'chord'
  /**
    * Liste {Array} des instances {Note} des notes de l'accord
    * @property {Array of Note} notes
    */
  this.notes = [null]
  var notes = strnotes.split(' ')
  var me = this
  L(notes).each(function(strnote){
    me.notes.push(NOTE(strnote,{dont_build:true}))
  })

  // On peut construire les notes
  Anim.wait(1)
  this.build()  
}
$.extend(Chord.prototype, METHODES_TEXTE)
$.extend(Chord.prototype, METHODES_GROUPNOTES)
