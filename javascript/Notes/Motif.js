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
  
  this.make_instances_with(strnotes)
  
  this.build()  
}
$.extend(Motif.prototype, METHODES_TEXTE)
$.extend(Motif.prototype, METHODES_GROUPNOTES)

$.extend(Motif.prototype,{
  /**
    * Méthode qui a l'instanciation se charge de créer les instances des notes
    * du motif
    * @method make_instances_with
    * @param {String} strnotes  Les notes envoyées
    */
  make_instances_with:function(strnotes)
  {
    var me = this
    var hoffset   = this.left || Anim.current_x
    var the_staff = this.staff
    var lanote, cur_rang = 0 ;
    L(strnotes.split(' ')).each(function(strnote){
      ++cur_rang // se souvenir que les notes commencent à 1, car le premier
      // élément de `notes` est un NULL
      lanote = NOTE(strnote,{dont_build:true, rang:cur_rang, staff:the_staff, left:hoffset})
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
  },
  
  /**
    * Construction des notes
    * La méthode va surclasser la méthode héritée de METHODES_GROUPNOTES
    * car elle doit gérer un affichage temporisé des notes
    * @method build
    */
  build:function()
  {
    if(!this.speed) this.each_note(function(note){note.build()})
    else
    {
      if(undefined == this.notes_for_building)
      { // => démarrage de la construction
        this.notes_for_building = []
        var me = this
        this.each_note(function(note) me.notes_for_building.push( note.rang ))
        this.laps_building = parseInt(1000 / this.speed,10)
      }
      if(this.timer) clearTimeout(this.timer)
      if(rang = this.notes_for_building.shift())
      {
        var note = this.notes[rang], complete ;
        // Tant qu'il reste des notes à construire, on rappelle cette méthode
        if(this.notes_for_building.length) this.on_complete_operation = $.proxy(this.build, this)
        note.build()
        this.timer = setTimeout($.proxy(this.build, this), this.laps_building)
      }
      else
      { // Fin de la construction
        
      }
    }
  },
  
  
})
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
