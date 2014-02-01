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
  
  // if(undefined == params) params = {}
  for(var prop in (params || {})){this[prop] = params[prop]} 
  
  this.make_instances_with(strnotes)
  this.build()
    
}
$.extend(Motif.prototype, METHODES_TEXTE)
$.extend(Motif.prototype, METHODES_GROUPNOTES)


/* ---------------------------------------------------------------------
 *  Méthodes d'instance pour le code de l'animation
 *  
 */
$.extend(Motif.prototype,{
  /**
    * Méthode qui masque le motif
    * @method hide
    * @param {Object} params Paramètres optionnels, donc `complete`
    */
  hide:function(params)
  {
    this.each_note(function(note){ note.hide() })
  },
  /**
    * Méthode qui ré-affiche le motif
    * @method show
    * @param {Object} params Paramètres optionnels, dont `complete`
    */
  show:function(params)
  {
    this.each_note(function(note){ note.show() })
  }
})
/* ---------------------------------------------------------------------
 *  Méthodes d'instance "protected"
 *  
 */

$.extend(Motif.prototype,{
  /**
    * Méthode qui a l'instanciation se charge de créer les instances des notes
    * du motif
    * @method make_instances_with
    * @param {String} strnotes  Les notes envoyées
    */
  make_instances_with:function(strnotes)
  {
    var me = this,
        data,
        hoffset           = this.left || Anim.current_x,
        the_staff         = this.staff,
        lanote, cur_rang  = 0,
        last_octave       = 4,
        last_duration     = null;
        
    L(strnotes.split(' ')).each(function(strnote){
      ++cur_rang // se souvenir que les notes commencent à 1, car le premier
      // élément de `notes` est un NULL
      data = {
        dont_build  :true, 
        rang        :cur_rang, 
        staff       :the_staff, 
        left        :hoffset
      }

      // Si la note ne définit pas d'octave, il faut prendre l'octave précédent
      dnote = Note.parse(strnote)
      
      if( null === dnote.octave   ) data.octave   = last_octave
      else last_octave   = parseInt(dnote.octave)
      if( null === dnote.duration ) data.duration = last_duration
      else last_duration = parseInt(dnote.duration)

      // === Création de l'instance Note ===
      lanote = NOTE(strnote, data)
      
      if(lanote.alteration)
      {
        lanote.left = lanote.left + 18
        hoffset += 18
      }
      
      // ---------------------------------------------------------------------
      // TODO : Pour le hoffset, il faudrait tenir compte aussi de la durée si 
      //        elle est définie.
      // ---------------------------------------------------------------------
      
      me.notes.push(lanote)
      hoffset += me.offset_x || Anim.prefs.next
      if(hoffset > Anim.Dom.left_max)
      {
        hoffset   = me.left || Anim.current_x
        dlog("* hoffset mis à "+hoffset)
        the_staff = Anim.Objects.NEW_STAFF(me.staff.cle)
      }
    })
  }  
  
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
    * Alias de 'left' pour les calculs
    * @property {Number} x
    */
  "x":{get:function(){return this.left}},
  /**
    * Alias de 'top' pour les calculs
    * @property {Number} y
    */
  "y":{get:function(){return this.top}},
  
  /**
    * Le milieu horizontal de l'objet. Il correspond au centre de ses notes
    * Si le motif s'étale sur plusieurs portées, c'est la largeur de la portée
    * qui est utilisée
    * @property {Number} center_x
    */
  "center_x":{
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
