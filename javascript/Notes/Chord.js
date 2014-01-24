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
  return new Chord(strnotes, params)
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
  /**
    * Class d'un type accord
    * @property {String} class
    * @static @final 
    * @default 'chord'
    */
  this.class = 'chord'
  /**
    * Identifiant absolu de l'accord
    * Note : Pour le moment, il n'est pas utilisé, mais plus tard, on pourra
    * imaginer consigner les mêmes types d'éléments dans des Hash de Anim.Objects
    * @property {String} id
    */
  this.id = 'chd'+(new Date()).getTime()
  /**
    * Position left de l'accord (par défault le Anim.current_x courant)
    * @property {Number} left
    */
  this.left = Anim.current_x
  /**
    * Liste {Array} des instances {Note} des notes de l'accord
    * Notes
    * -----
    *   * Les notes (strnotes) seront dispatchés une fois que le left
    *     sera éventuellement redéfini par les paramètres
    *
    * @property {Array of Note} notes
    */
  this.notes = [null]
  
  // /** OBSOLÈTE : PROPRIÉTÉ COMPLEXE DE ObjectClass
  //   * La portée de l'accord
  //   * Note : Elle peut être surclassée par les paramètres
  //   * @property {Staff} staff
  //   * @static
  //   */
  // this.staff = Anim.current_staff
  
  if(undefined == params) params = {}
  for(var prop in params){
    this[prop] = params[prop]
  } 
  
  var me = this
  L(strnotes.split(' ')).each(function(strnote){
    me.notes.push(NOTE(strnote,{dont_build:true, staff:me.staff}))
  })
  
  // On peut construire les notes
  Anim.wait(1)
  this.build()  
}

$.extend(Chord.prototype, UNVERSAL_METHODS)
$.extend(Chord.prototype, METHODES_TEXTE)
$.extend(Chord.prototype, METHODES_GROUPNOTES)

$.extend(Chord.prototype,{
  /**
    * Méthode qui calcule le top et le bottom de l'accord
    * @method calcule_top_bottom_objet
    */
  calcule_top_bottom_objet:function()
  {
    var top_max = 0, top_min = 10000
    var my = this
    this.each_note(function(note){ 
      if(note.top > top_max) top_max  = note.top
      if(note.top < top_min) top_min  = note.top
    })
    this._top_obj     = top_min
    this._bottom_obj  = top_max + 12
  },
  
  /**
    * Retourne l'ajustement vertical pour le placement d'une flèche en
    * fonction de l'angle
    * @method position_fleche_per_angle
    * @param  {Number} angle  Angle en degrés, toujours positif
    * @return {Number} La rectification verticale
    */
  position_fleche_per_angle:function(angle)
  {
    if(!angle.is_between(80, 100) && !angle.is_between(260, 280)) return -12
    var demi = 0 //10 // (this._bottom_obj - this.center_y)
    return angle.is_between(80, 100) ? -10 : -4 ;
  }
  
})

Object.defineProperties(Chord.prototype, {
  /**
    * Portée de l'accord ({Staff})
    * Pour la définir, on peut soit envoyer la portée, soit envoyer son indice 1-start
    *
    * @property {Staff} staff
    */
  "staff":{
    set:function(staff)
    {
      if('number' == typeof staff) this._staff = Anim.staves[staff - 1]
      else if (staff.class == 'staff') this._staff = staff
      else delete this._staff
    },
    get:function(){
      return this._staff || Anim.current_staff
    }
  },
  /**
    * Le milieu horizontal de l'objet. Il correspond au centre de ses notes
    * @property {Number} center_x
    */
  "center_x":{
    get:function(){
      return parseInt(this.note(1).center_x,10)
    }
  },
  /**
    * Le milieu vertical de l'accord (moyenne de la hauteur de ses notes extrêmes)
    * @property {Number} center_y
    */
  "center_y":{
    get:function(){
      return parseInt(this.top_obj + ((this.bottom_obj - this.top_obj) / 2), 10)
    }
  },
  
  /**
    * Le top de l'accord (MAIS pour l'instant, c'est le centre de l'accord
    * utiliser 'top_obj' pour obtenir le vrai top)
    * @property {Number}
    */
  "top":{
    get:function(){return this.center_y},
  },
  /**
    * Le left de l'accord
    * Correspond à son center_x
    * @property {Number} top
    */
  "left":{
    get:function(){return this.center_x}
  },
  /**
    * Largeur de l'accord (correspond à la largeur d'une note)
    * @property {Number} width
    */
  "width":{
    get:function(){ return this.note(1).width}
  },
  /**
    * Hauteur de l'accord
    * @property {Number} height
    */
  "height":{
    get:function(){ return this.bottom_obj - this.top_obj + this.note(1).height}
  },
  /**
    * Top de l'accord
    * @property {Number} top_obj
    */
  "top_obj":{
    get:function(){
      if(undefined == this._top_obj) this.calcule_top_bottom_objet()
      return this._top_obj
    }
  },
  /**
    * Bottom de l'accord
    * @property {Number} bottom_obj
    */
  "bottom_obj":{
    get:function(){
      if(undefined == this._bottom_obj) this.calcule_top_bottom_objet()
      return this._bottom_obj
    }
  }

})
