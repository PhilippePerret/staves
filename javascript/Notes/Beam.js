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
    * Valeur éventuelle à ajouter à la hauteur de la beam
    * @property {Number} offset_y
    * @default 0
    */
  this.offset_y = 0
  
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
    * et ajoute les barres supplémentaires en fonction du rythme
    * @method regle_each_note
    */
  regle_each_note:function()
  {
    var my        = this, 
        is_down   = this.down,
        data      = { dir: this.dir },
        inote     = 0,
        note,
        nb_notes  = this.notes.length,
        inc_sousbeam  = 6 * (is_down ? -1 : 1), // espacement entre les beams
        dec_x_sous_beam = is_down ? 0 : 14,
        duree_courante,
        hauteur_courante,
        sousbeam_width,
        jusqua_next
        ;
        
    if( !is_down ) data.y = this.y
    for(; inote < nb_notes; ++inote)
    {
      note = this.notes[inote]
      next = this.notes[inote + 1]
      if (is_down) data.height = (this.y - note.y) - 4
      note.stem(data)
      if( note.duration > 8 )
      {
        // Il faut traiter les sous-ligatures (pour 16, 32, 64)
        dur_note = parseInt(note.duration)
        if(next) dur_next = parseInt(next.duration)
        hauteur_courante = parseInt(this.y)
        for(var i=4; i<8; ++i)
        {
          duree_courante = Math.pow(2, i)
          if(dur_note >= duree_courante)
          {
            // Il faut lui ajouter une sous-beam
            jusqua_next = next && (dur_next >= duree_courante)
            if( jusqua_next )
            {
              // La beam peut aller jusqu'à la note suivante
              sousbeam_width = next.x - note.x + 1
              if(undefined == next.sous_beam_traited) next.sous_beam_traited = {}
              next.sous_beam_traited[duree_courante] = true
            }
            else
            {
              // La beam doit rester seulement sur la note courante
              // Sauf si la beam a été placée avec la note précédente
              if(note.sous_beam_traited && note.sous_beam_traited[duree_courante]) continue
              sousbeam_width = 14
            }
            
            hauteur_courante += inc_sousbeam
            left_sous_beam    = (dec_x_sous_beam + note.x)
            if( !next )
            {
              // Pour la dernière note à traiter, si on arrive jusqu'ici, c'est que
              // sa beam n'a pas été traitée avec la note précédente. Il faut la faire
              // aller vers la gauche plutôt que vers la droite.
              left_sous_beam -= sousbeam_width
            }
            $('section#animation').append(
              '<div class="beam" style="left:'+left_sous_beam+'px;top:'+hauteur_courante+'px;width:'+sousbeam_width+'px;"></div>'
            )
          }
        }
        
      }
    }
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
        multi_pos = this.up ? 1 : -1,
        multi_neg = this.up ? -1 : 1
        max_far   = this.up ? 1000 : 0,
        max_left  = 4000,
        max_right = 0 ;
    L(this.notes).each(function(note){
      if     (my.up   && note.y < max_far) max_far = parseInt(note.y)
      else if(my.down && note.y > max_far) max_far = parseInt(note.y)
      if(note.x < max_left)   max_left  = parseInt(note.x)
      if(note.x > max_right)  max_right = parseInt(note.x)
    })
    this.y     = max_far + ((34 + this.offset_y) * multi_neg)
    // La ligature n'est-elle pas trop près de la portée ou à l'intérieur ?
    var limite_staff = (this.notes[0].staff[this.up ? 'top' : 'bottom']) + (8 * multi_neg)
  
    var trop_pres_de_staff = this.up ? this.y > limite_staff : this.y < limite_staff
    if( trop_pres_de_staff )
    {
      this.y = limite_staff + (2 * multi_neg)
    }
    
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
