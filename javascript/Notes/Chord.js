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
window.CHORD = function(strnotes)
{
  var notes = strnotes.split(' ')
  var acc = [null]
  L(notes).each(function(strnote){
    acc.push(NOTE(strnote,{dont_build:true}))
  })
  // On ajoute les méthodes et propriétés de l'accord
  $.extend(acc, CHORD_METHODS)
  Object.defineProperties(acc, CHORD_PROPERTIES)
  
  // On peut construire les notes
  Anim.wait(1)
  acc.each_note(function(note){note.build()})
  return acc
}

/**
  * Méthodes de tout accord
  * @class CHORD_METHODS
  * @static
  */
window.CHORD_METHODS = {
  /**
    * Exécute une fonction sur toutes les notes de l'accord
    * @method each_note
    * @param  {Function} fn La fonction à exécuter
    */
  each_note:function(fn)
  {
    for(var i=1, len=this.length; i<len; ++i)
    {
      fn(this[i])
    }
  },
  
  /**
    * Destruction de l'accord (destruction de chaque note)
    * @method build
    */
  remove:function()
  {
    this.each_note(function(note){note.remove()})
  }
}

window.CHORD_PROPERTIES = {
  "prop":{
    get:function(){return null}
  }
}