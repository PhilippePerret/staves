/**
  * @module Stem.js
  */

/*
 *  Module contenant la définition de la classe Stem qui permet de dessiner les
 *  figure rythmique (hampes) des notes.
 */

/**
  * Classe permettant de construire les hampes des notes.
  *
  * Termes employés
  *   hampe    = stem = le trait vertical de la marque
  *   crochet  = flag = le dessin si la note n'est pas ligaturée à une autre note
  *   ligature = beam = la ligature qui relie plusieurs hampes de notes
  *
  * @class Stem
  * @constructor
  * @param {Note}   note    La note qui porte la hampe
  * @param {Object} params  Les paramètres éventuels
  */
window.Stem = function(note, params)
{
  /**
    * Identifiant absolu de la hampe
    * @property {String} id
    */
  this.id = 'stem'+(++Stem.last_id)
  
  /**
    * La note qui porte la hampe
    * @property {Note} note
    */
  this.note = note
  
  /**
    * Position verticale de la hampe
    * @property {Number} y
    */
  this.y = null
  
  /**
    * Position horizontale de la hampe
    * @property {Number} x
    */
  this.x = null
  
  /**
    * Hauteur de la hampe
    * Note : la valeur par défaut correspond à la hauteur d'une portée
    * @property {Number} height
    * @default 48
    */
  this.height = 48
  
  /**
    * Direction de la hampe ('up' ou 'down')
    * @property {String} dir
    */
  this.dir = null
  
  /**
    * Couleur de la hampe
    * @property {String} color
    * @default 'black'
    */
  this.color = 'black'
  
  /**
    * Instance de la ligature de la hampe, if any
    * @property {Beam} beam
    * @default false
    */
  this.beam = null
  
  this.dispatch(params)
}

/* ---------------------------------------------------------------------
 *  MÉTHODES ET PROPRIÉTÉS DE CLASSE
 *  
 */
$.extend(Stem, {
  
  /**
    * Dernier identifiant utilisé pour une hampe
    * @property {Number} last_id
    */
  last_id:0,
  
  /**
    * Retourne la direction par défaut de la hampe pour la note donnée en fonction
    * de sa hauteur et de sa portée. Par défaut (note sans portée…), la direction est up
    * @method stemp_dir_default_of_note
    * @param {Note} note  L'instance de la note
    */
  stemp_dir_default_of_note:function(note)
  {
    if(!note.staff) return up
    switch(note.staff.cle)
    {
    case SOL :
      return ((note.octave == 4 && note.indice == 6) || note.octave > 4)  ? down : up
    case FA  :
      return ((note.octave == 3 && note.indice == 0) || note.octave < 3)  ? up   : down
    case UT3 :
      return ((note.octave == 4 && note.indice > 0) ||  note.octave > 4 ) ? down : up
    case UT4 : 
      return ((note.octave == 3 && note.indice > 5) ||  note.octave > 3 ) ? down : up
    }
  }
})

/* ---------------------------------------------------------------------
 *  MÉTHODES ET PROPRIÉTÉS D'INSTANCE
 *  
 */
/* Héritage des méthodes universelles */
$.extend(Stem.prototype, UNVERSAL_METHODS)

$.extend(Stem.prototype, {
  
  /**
    * Construction de la hampe (sauf si la durée est inférieure à 4)
    * @method build
    * @param {Object} params  Paramètres éventuels
    */
  build:function(params)
  {
    if(this.note.duration >= 4) Anim.Dom.add(this, params)
    return this
  },
  
  /**
    * Positionnement de la hampe
    * Notes
    * -----
    *   * TODO La hauteur de la hampe devra être calculée de façon beaucoup plus complexe
    *     en fonction des ligatures.
    *
    * @method positionne
    */
  positionne:function()
  {
    var n     = this.note,
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

Object.defineProperties(Stem.prototype,{
  /**
    * Objet DOM (set jQuery) de la hampe
    * @property {jQuerySet} obj
    */
  "obj":{
    get:function(){return $('div#'+this.id)}
  },
  /**
    * Code HTML pour la hampe
    * @property {HTMLString} code_html
    */
  "code_html":{
    get:function(){
      return '<div id="'+this.id+'" class="stem"></div>'
    }
  }
})
