/**
  * Gestion des Motifs (suite de notes)
  * @module Motif.js
  */

/**
  * @method MOTIF
  * @param  {String} strnotes La suite des notes, séparées par des espaces
  * @param  {Object} params   Paramètres optionnels
  * @return {Motif} Instance de Motif
  */
window.MOTIF = function(strnotes, params)
{
  return new Motif(strnotes, params)
}

/**
  * Class Motif
  * Gestion des Motifs (suite de notes)
  * Notes
  * -----
  *
  * @class Motif
  * @constructor
  */
window.Motif = function(strnotes, params)
{
  /**
    * Identifiant absolu du motif
    * Note : Pour le moment, il n'est pas utilisé, mais plus tard, on pourra
    * imaginer consigner les mêmes types d'éléments dans des Hash de Anim.Objects
    * @property {String} id
    */
  this.id = 'mot'+(new Date()).getTime()
  /**
    * Class d'un type motif
    * @property {String} class
    * @static @final 
    * @default 'motif'
    */
  this.class = 'motif'
  /**
    * Position left du motif (par défault le Anim.current_x courant)
    * Note : C'est seulement le left de sa première note.
    * Note : Pourra être redéfini par les paramètres
    * @property {Number} left
    */
  this.left = Anim.current_x
  /**
    * Liste {Array} des instances {Note} des notes du motif
    * Notes
    * -----
    *   * Les notes (strnotes) seront dispatchés une fois que le left
    *     sera éventuellement redéfini par les paramètres
    *
    * @property {Array of Note} notes
    */
  this.notes = [null]
  
  if(undefined == params) params = {}
  for(var prop in params){
    this[prop] = params[prop]
  } 
  
  var me = this
  var hoffset   = this.left || Anim.current_x
  var the_staff = this.staff
  var lanote ;
  L(strnotes.split(' ')).each(function(strnote){
    lanote = NOTE(strnote,{dont_build:true, staff:the_staff, left:hoffset})
    if(lanote.alteration)
    {
      lanote.left = lanote.left + 18
      hoffset += 18
    } 
    me.notes.push(lanote)
    hoffset += me.offset_x || Anim.prefs.next
    if(hoffset > Anim.Dom.left_max)
    {
      hoffset   = this.left || Anim.current_x
      the_staff = Anim.Objects.NEW_STAFF(me.staff.cle)
    }
  })
  
  // On peut construire les notes
  Anim.wait(1)
  this.build()  
}
$.extend(Motif.prototype, METHODES_TEXTE)
$.extend(Motif.prototype, METHODES_GROUPNOTES)

$.extend(Motif.prototype,{})
Object.defineProperties(Motif.prototype, {
  /**
    * Portée du motif ({Staff})
    * Pour la définir, on peut soit envoyer la portée, soit envoyer son indice 1-start
    * Note : Le motif peut s'étaler sur plusieurs portées, cette valeur ne correspond
    * qu'à la portée de la première note (et encore…).
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
    * Si le motif s'étale sur plusieurs portées, c'est la largeur de la portée
    * qui est utilisée
    * @property {Number} centre_x
    */
  "centre_x":{
    get:function(){
      var w_motif = 0
      this.each_note(function(note){ w_motif += note.width })
      if(w_motif > Anim.Dom.left_max) w_motif = Anim.Dom.left_max
      return parseInt(this.left + (w_motif / 2),10)
    }
  },
  /**
    * Le milieu vertical de l'objet
    * @property {Number} center_y
    */
  "center_y":{
    get:function(){
      var h_motif = 12
      this.each_note(function(note){ h_motif += note.top })
      return parseInt(this.top + (h_motif / 2), 10)
    }
  }
  
})
