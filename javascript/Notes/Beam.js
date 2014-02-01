/**
  * @module Beam.js
  *

/**
  * @class Beam
  * @constructor
  * @param {Stem}   stem    L'instance de la hampe qui porte la ligature
  * @param {Object} params  Autres paramètres
  */
window.Beam = function(stem, params)
{
  /**
    * L'identifiant unique de la ligature
    * @property {String} id
    */
  this.id = "beam"+(++Beam.last_id)
  
  /**
    * L'instance de la hampe qui porte la ligature
    * @property {Stem} stem
    */
  this.stem = stem
  
  /**
    * Position top de la ligature
    * Note : pour le moment, les ligatures sont toujours horizontales, mais à l'avenir
    * on pourra se rapprocher d'une vraie partition en calculant leur inclinaison.
    * La hauteur est calculée en fonction de la hauteur de la note la plus haute qui
    * appartient à la ligature.
    *
    * @property {Number} y
    */
  this.y = null
  
  
  this.dispatch(params)
}

/* ---------------------------------------------------------------------
 *  MÉTHODES ET PROPRIÉTÉS DE CLASSE
 *  
 */
$.extend(Beam, {
  
  /**
    * Dernier identifiant utilisé pour une ligature
    * @property {Number} last_id
    */
  last_id:0,


  /**
    * Procède à la ligature des notes +notes+
    * @method beam
    * @param {Array}  notes     La liste des instances de notes
    * @param {Object} params    Les paramètres éventuels
    */
  beam:function(notes, params)
  {
    var nb_notes = notes.length
    F.show("Je vais ligaturer de "+notes[0].note_str+" à la note "+notes[nb_notes-1].note_str)
  }
})



/* ---------------------------------------------------------------------
 *  MÉTHODES ET PROPRIÉTÉS D'INSTANCE
 *  
 */
/* Héritage des propriétés universelles */
$.extend(Beam.prototype, UNVERSAL_METHODS)
/* Méthodes et propriétés propres */
$.extend(Beam.prototype, {
  
  /**
    * Construction de la hampe (sauf si la durée est inférieure à 4)
    * @method build
    * @param {Object} params  Paramètres éventuels
    */
  build:function(params)
  {
    Anim.Dom.add(this, params)
    return this
  },
  
  /**
    * Positionnement de la ligature
    * Notes
    * -----
    *   * TODO La hauteur de la hampe devra être calculée de façon beaucoup plus complexe
    *     en fonction des ligatures.
    *
    * @method positionne
    */
  positionne:function()
  {
    var n     = this.stem,
        to_up = this.dir == up,
        left  = n.x + ( to_up ? 12+1 : 0 ),
        top   = n.y + ( to_up ? 4 - this.height : 6) ;
        
    this.obj.css({
      top     :top+'px', 
      left    :left+'px', 
      height  :this.height+'px',
      'border-color':this.color
    })
  }
  
})

Object.defineProperties(Beam.prototype,{
  /**
    * Objet DOM (set jQuery) de la ligature
    * @property {jQuerySet} obj
    */
  "obj":{
    get:function(){return $('div#'+this.id)}
  },
  /**
    * Code HTML pour la ligature
    * @property {HTMLString} code_html
    */
  "code_html":{
    get:function(){
      return '<div id="'+this.id+'" class="beam"></div>'
    }
  }
})
