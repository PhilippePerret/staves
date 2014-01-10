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
    * Identifiant absolu de l'accord
    * Note : Pour le moment, il n'est pas utilisé, mais plus tard, on pourra
    * imaginer consigner les mêmes types d'éléments dans des Hash de Anim.Objects
    * @property {String} id
    */
  this.id = 'chd'+(new Date()).getTime()
  /**
    * Class d'un type accord
    * @property {String} class
    * @static @final 
    * @default 'chord'
    */
  this.class = 'chord'
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
$.extend(Chord.prototype, METHODES_TEXTE)
$.extend(Chord.prototype, METHODES_GROUPNOTES)

$.extend(Chord.prototype,{})
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
    * Le milieu horizontal de l'objet (en tenant compte vraiment de sa taille)
    * @property {Number} center_x
    */
  "center_x":{
    get:function(){
      var max_width = 0
      this.each_note(function(note){if(note.obj.width() > max_width) max_width = note.obj.width()})
      return parseInt(this.left + (max_width / 2), 10)
    }
  },
  /**
    * Le milieu vertical de l'objet
    * @property {Number} center_y
    */
  "center_y":{
    get:function(){
      var h_accord = 12
      this.each_note(function(note){ h_accord += note.top })
      return parseInt(this.top + (h_accord / 2), 10)
    }
  }
  
})
