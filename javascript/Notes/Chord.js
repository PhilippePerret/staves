/**
  * Gestion des accords
  * @module Chord.js
  */

/**
  * @method CHORD
  * @param  {String} strnotes La suite des notes, séparées par des espaces
  * @return {Array} Une liste de note, sauf premier élément
  *                 car les indices des notes doivent être 1-start.
  *                 En réalité, c'est plus qu'une liste puisque l'objet Array
  *                 contient aussi des méthodes propres aux accords.
  */
window.CHORD = function(strnotes, params)
{
  var notes = strnotes.split(' ')
  var acc = [null]
  L(notes).each(function(strnote){
    acc.push(NOTE(strnote,{dont_build:true}))
  })
  // On ajoute les méthodes et propriétés de l'accord
  $.extend(acc, GROUPNOTES_METHODS)
  Object.defineProperties(acc, GROUPNOTES_PROPERTIES)
  
  // On peut construire les notes
  Anim.wait(1)
  acc.each_note(function(note){note.build()})
  return acc
}
