/**
  * @module Beam.js
  *

/**
  * @class Beam
  * @constructor
  * @param {Stem}   notes   Les instances de notes ligaturées par cette ligature
  * @param {Object} params  Autres paramètres
  */
window.Beam = function(notes, params)
{
  /**
    * L'identifiant unique de la ligature
    * @property {String} id
    */
  this.id = "beam"+(++Beam.last_id)
  
  /**
    * Liste des notes de la ligature
    *
    * @property {Array de Note} notes
    */
  this.notes = notes
  
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
  
  /**
    * Position left de la ligature
    * @property {Number} x
    */
  this.x = null
  
  /**
    * Largeur de la ligature
    * @property {Number} width
    */
  this.width = null
  
  /**
    * Couleur de la ligature
    * @property {String} color
    * @default 'black'
    */
  this.color = 'black'
  
  // On dispatche les paramètres tranmis
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


  /** = Main =
    *
    * Procède à la ligature des notes +notes+
    *
    * @method beam
    * @param {Array}  notes     La liste des instances de notes
    * @param {Object} params    Les paramètres éventuels
    */
  beam:function(notes, params)
  {
    var nb_notes = notes.length
    var beam = new Beam(notes, params)
    beam.build(params)
    
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
    var pos   = this.calc_positions() ;
    var data_css = {
      top     :this.y       + 'px', 
      left    :this.x       + 'px', 
      width   :this.width   + 'px',
      'border-color':this.color
    }
    dlog("data css:");dlog(data_css)
    this.obj.css(data_css)
    
    this.regle_each_note()
    // TODO : Il faut faire monter toutes les notes jusqu'à la ligature
  },
  /**
    * Construit la hampe de chaque note (si nécessaire) et la règle
    *
    * @method regle_each_note
    */
  regle_each_note:function()
  {
    var my      = this, 
        is_down = this.down,
        data    = { dir: this.dir } ;
        
    if( !is_down ) data.y = this.y
    L(this.notes).each(function(note){
      if (is_down) data.height = (my.y - note.y) - 4
      note.stem(data)
    })
  },
  
  /**
    * Calcul des données de la ligature en fonction des notes
    * Définit this.x, this.y et this.width
    *
    * @method calc_positions
    *
    */
  calc_positions:function()
  {
    var my        = this,
        max_far   = this.up ? 1000 : 0,
        max_left  = 4000,
        max_right = 0 ;
    L(this.notes).each(function(note){
      if     (my.up   && note.y < max_far) max_far = parseInt(note.y)
      else if(my.down && note.y > max_far) max_far = parseInt(note.y)
      if(note.x < max_left)   max_left  = parseInt(note.x)
      if(note.x > max_right)  max_right = parseInt(note.x)
    })
    this.y     = max_far + (this.up ? - 34 : 34)
    this.x     = max_left + (this.up ? 14 : 0)
    this.width = max_right - max_left + 1
  }
  
})

Object.defineProperties(Beam.prototype,{
  /**
    * Retourne TRUE si la ligature est supérieure
    * Notes
    * -----
    *   * Pour le moment, on opte pour la moyenne des sens des hampes des notes.
    *
    * @property {Boolean} up
    */
  "up":{
    get:function(){
      if(undefined == this._up)
      {
        var dispo = 0 ;
        L(this.notes).each(function(note){dispo += note.default_stem_dir == up ? 1 : -1})
        this._up = dispo >= 0
      }
      return this._up
    }
  },
  /**
    * Retourne TRUE si la ligature est inférieure
    * @property {Boolean} down
    */
  "down":{get:function(){return false == this.up}},

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
