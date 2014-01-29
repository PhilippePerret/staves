/**
  * @module Note
  */


// console.dir(NOTE_TO_OFFSET)

/**
  * Pour créer une note (instance Note) et la construire sur la portée
  * @method Note
  * @for window
  * @param  {String}            note   La note en version string (p.e. "ab5" pour la bémol 5)
  * @param  {Object|Undefined}  params   Paramètres optionnels
  *   @param {Boolean} params.dont_build    Si true, la note n'est pas construite
  */
window.NOTE = function(note, params)
{
  if(undefined == params) params = {}
  var inote = new Note(note, params)
  if(!params.dont_build) inote.build({complete:NEXT_STEP})
  return inote
}

/**
  * @class Note
  * @constructor
  * @param  {String}        note    La note
  * @param  {Object|String} params  Les paramètres optionnels
  */
window.Note = function(note, params)
{
  this.class      = 'note'
  this.note       = null
  this.octave     = null
  this.alteration = null
  
  /**
    * Position horizontale de la note
    * Noter que c'est une propriété complexe (héritée de ObjectClass), définie 
    * ici seulement pour la clarté.
    * @property {Number} left
    */
  this.left = null
  
  /**
    * Les textes éventuels que porte la note (instances {Txt})
    * Note
    *   * Il est inauguré par la méthode <note>.write(<texte>)
    *
    * @property {Object} texte    L'objet porte en clé le type de texte porté
    *                             par la note ('regular', 'part', etc.) et en valeur l'instance Txt correspondante.
    */
  this.texte = null
  
  /**
    * Mis à true si la note est entourée
    * @property {Boolean} surrounded
    * @default false
    */
  this.surrounded = false
  
  ObjetClass.call(this, params)

  // C'est la note qui a toujours le dernier mot sur les paramètres. Par exemple,
  // avec un accord, Chord met sa staff dans les paramètres. Mais si des notes
  // sont définies par "2:...", le "2" qui signifie 2e portée doit prendre le
  // dessus.
  // Petite réserve quand à l'octave. S'il est défini dans le paramètres, comme
  // pour les motifs, il n'est pas pris dans la note
  this.analyse_note(note)

  // On peut calculer l'identifiant
  // Note : Normalement, tout est fait pour que cet identifiant soit unique, en partant
  //        du principe qu'il est impossible d'avoir, exactement au même moment (comme
  //        dans un motif, deux notes identiques à la même position left).
  this.id = "note-"+this.note + (this.alteration || "") + this.octave + this.left + (new Date()).getTime()

}
Note.prototype = Object.create( ObjetClass.prototype )
Note.prototype.constructor = Note

/* ---------------------------------------------------------------------
 *  MÉTHODES ET PROPRIÉTÉS DE CLASSE
 *  
 */
$.extend(Note, {
  /**
    * Le motif régulier pour analyser la note
    *   - [optionnel] portée désignée par 1 ou 2 chiffres suivis de ":"
    *   - [mandatory] Le nom de la note (une lettre de "a" à "g")
    *   - [optionnel] L'altération (une lettre parmi "d", "b", "x", "t", "z")
    *   - [optionnel] Le signe "-" de l'octave
    *   - [optionnel] l'octave (un nombre de 0 à 8) - il est optionnel dans un motif
    * @class REGEXP_NOTE
    * @static
    * @final
    */
  REGEXP_NOTE : new RegExp("^([0-9]{1,2}\:)?([a-g])(b|d|x|z|t)?(\-?[0-8])?$"),
  /**
    * Parse la note string +notestr+ et retourne un objet contenant ses données
    * @method parse
    * @param {String} notestr   La note comme string fourni en argument d'une méthode
    * @return {Object} contenant :
    *   staff   L'indice de la portée (ou undefined)
    *   note    Le nom de la note (a-g)
    *   octave  {Number} L'octave, positif ou négatif (ou undefined)
    *   alter   L'altération (ou undefined)
    * Retourne NULL si la note n'a pas été trouvée
    */
  parse:function(notestr)
  {
    founds = notestr.trim().match(this.REGEXP_NOTE)
    if(!founds) return null
    return {
      staff   : founds[1] ? parseInt(founds[1],10) : null,
      note    : founds[2],
      alter   : founds[3],
      octave  : founds[4] ? parseInt(founds[4],10) : null
    }
  },
  /**
    * Affichage temporisé de l'ensemble de notes +notes+ à la vitesse +speed+
    * Utilisé par Scale et Motif
    * @method building_temporized
    * @param {Array of Note}  notes Liste des instances de notes à construire
    * @param {Number}         speed La vitesse de construction
    * @param {Object}         params  Paramètres optionnels
    *   @param {Function}   params.complete   La méthode pour suivre quand c'est fini. Par défaut, NEXT_STEP
    */
  building_temporized:function(notes, speed, params)
  {
    if(undefined == this.building_timer)
    { // => Première arrivée dans la méthode. On définit les valeurs
      if(speed == 0)
      {
        F.error("La vitesse (speed) ne peut être nulle. Je la mets à 1")
        speed = 1
      }
      if(undefined == params) params = {}
      if(undefined == params.complete) params.complete = NEXT_STEP
      this.building_params  = params
      this.building_laps    = parseInt(1000 / speed)
      this.building_notes   = $.merge([], notes)
      this.building_notes.shift() // car pas de première note, mais la valeur null
    }
    else clearTimeout(this.building_timer)
      
    if(note = this.building_notes.shift()) // Tant qu'il reste des notes
    {
      note.build()
      this.building_timer = setTimeout($.proxy(this.building_temporized, this), this.building_laps)
    }
    else
    { 
      // === Fin de la construction ===
      delete this.building_timer
      delete this.building_laps
      delete this.building_notes
      if('function' == typeof this.building_params.complete)
      {
        this.building_params.complete()
      }
      delete this.building_params
    }
    
  }
})
/* ---------------------------------------------------------------------
 *
 *  MÉTHODE POUR LE CODE DE L'APPLICATION
 *  
 *  Note
 *    * Quand une méthode est ajoutée, elle doit l'être aussi dans la
 *      constante `OBJET_TRAITEMENT` du module GroupeNotes.js
 *  
 */
// Méthodes universelles
$.extend(Note.prototype, UNVERSAL_METHODS)

// Méthodes propres aux Notes (ou traitements propres)
$.extend(Note.prototype,{
  /**
    * Ré-affiche une note masquée par `hide`
    * @method show
    * @async
    * @param  {Object|Undefined} params Les paramètres optionnels
    * @return {Note} this, pour le chainage
    */
  show:function(params)
  {
    return this.operation(this.objets, 'show', params)
  },
  /**
    * Masque la note
    * @method hide
    * @return {Note} this, pour le chainage
    */
  hide:function()
  {
    return this.operation(this.objets, 'hide')
  },
  /**
    * Destruction de la note de l'animation
    * @method remove
    * @param {Object} params  Paramètres optionnels
    *   @param {Boolean}  params.texts          Si true, on doit aussi détruire les textes de la note (false par défaut)
    *   @param {Boolean}  params.dont_unstaff   Si true, on ne retire pas la note de la portée (utile à la destruction de la portée pour éviter les boucles infinies)
    */
  remove:function(params)
  {
    if(undefined == params) params = {}
    var objs = this.objets
    if (params.texts && this.texte) L(this.texte).each(function(ktxt, instance_txt){ objs.push(instance_txt.obj)})
    this.operation(objs, 'remove')
    if(!params.dont_unstaff) this.staff.notes.remove(this)
    this.surrounded = false
  },
  
  /**
    * Actualise l'affichage de la note
    * Pour le moment, la méthode peut remettre en place une note
    * décalée à cause d'une conjointe qui a disparu maintenant.
    * @method update
    * @return {Note} this, pour le chainage
    */
  update:function()
  {
    this.update_affichage()
    NEXT_STEP(0)
    return this
  },
  /**
    * Rend la note presque invisible, mais toujours présente
    * @method fantomize
    * @param  {Object} params   Paramètres optionnels
    *   @param  {Function|False}  params.complete   Méthode à appeler pour suivre (NEXT_STEP par défaut), ou false pour ne pas passer à l'étape suivante
    * @return {Note} pour le chainage
    */
  fantomize:function(params)
  {
    this.colorize('shadow', define_complete(params))
    return this
  },
  /**
    * Remet la note en noir
    * @method defantomize
    * @return {Note} this, pour le chainage
    */
  defantomize:function(params)
  {
    this.colorize(black, define_complete(params))
    return this
  },
  /**
    * Colorize la note avec la couleur voulue
    * @method colorize
    * @param  {String} color  La couleur voulue (constante 'red', 'blue', etc.)
    * @return {Note} this, pour le chainage
    */
  colorize:function(color, params)
  {
    params = define_complete(params)
    this.color      = color
    this.obj[0].src = this.src
    if(this.alteration) this.obj_alt[0].src = this.src_alteration
    if('function' == typeof params.complete) params.complete()
    return this
  },
  /**
    * Déplace la note à la hauteur +hauteur+ (noter qu'il s'agit en fait d'un
    * changement de note. On l'utilise aussi s'il faut simplement ajouter une
    * altération).
    *
    * Notes
    * -----
    *   * Le déplacement a été simplifié : la note change de couleur et 
    *     se déplace de façon rectiligne en passant au-dessus des autres
    *   * L'option prise, par rapport à l'altération, est de la faire disparaitre
    *     et ré-apparaitre à la nouvelle position. Sinon c'est trop compliqué
    *     (et pas nécessaire) de la faire se déplacer aussi.
    *     Cf. la méthode `analyse_note` qui s'en charge le cas échéant.
    * @method moveTo
    * @param  {String}  new_note  La nouvelle note à atteindre
    * @param  {Object}  params    Les paramètres optionnels
    *   @param {Boolean}  params.no_exergue   Si TRUE, ne met pas la note en exergue
    *   @param {Function|False} params.complete   La méthode pour suivre. NEXT_STEP PAR DÉFAUT (méthode "terminale")
    */
  moveTo:function(new_note, params)
  {
    var top_init    = parseInt(this.top,10),
        staff_init  = parseInt(this.staff.indice),
        objs,
        method ;

    params = define_complete( params )
    this.analyse_note(new_note)
    if(staff_init != this.staff.indice)
    {
      Anim.staves[staff_init - 1].notes.remove(this)
      this.staff_changed = true
    }
    objs = [this.obj]
    var was_surrounded = true && this.surrounded
    if(this.surrounded) this.unsurround()
    method = $.proxy(this.operation, this, objs, 'moveTo', {top: this.top, complete:params.complete})
    if(!params.no_exergue) this.exergue({complete:method})
    else method()
    if(was_surrounded) this.surround()
  },
  
  /**
    * Entoure la note
    * Notes
    * -----
    *   * La méthode définit la propriété 'circle' du cercle
    * @method surround
    * @param  {Object} params   Les paramètres d'entourage
    *   @param  {String}  params.color   La couleur du cercle (rouge par défaut)
    *   @param  {Number}  params.margin  L'espace entre la note et l'entourage
    *   @param  {Boolean} params.square   Si true, on place un carré plutôt qu'un rond
    */
  surround:function(params)
  {
    var x, y ;
    if(undefined == params) params = {}
    if(this.circle) this.circle.remove()
    if(this.alteration)
    {
      x = this.left - 24
      y = this.top  - 15
    }
    else
    {
      x = this.left - 6
      y = this.top  - 7
    }
    params = $.extend(params, {owner:this, top:y, left:x})
    this.circle = new Circle(params)
    Anim.Dom.add(this.circle)
    this.surrounded = true
  },
  /**
    * Retirer le cercle entourant la note
    * @method unsurround
    */
  unsurround:function()
  {
    if(!this.circle) return F.error("La note "+this.note_str+" n'est pas entourée !")
    this.circle.remove()
    this.surrounded = false
  },
  /**
    * Met la note en exergue (bleue et au-dessus)
    * @method exergue
    * @param {Object|String} params        Paramètres optionnels pour définir l'exergue.
    *                                       OU seulement la couleur en String (constante)
    *   @param {String} params.color       La couleur de l'exergue (constante ou def)
    *   @param {Function} params.complete  La méthode pour suivre (NEXT_STEP par défaut)
    * @return {Object} this, pour le chainage
    */
  exergue:function(params)
  {
    if(undefined == params)             params          = {}
    else if ('string' == typeof params) params          = {color:params}
    if(undefined == params.color)       params.color    = blue
    if(undefined == params.complete)    params.complete = NEXT_STEP
    
    this.color = params.color
    this.obj[0].src = this.src
    this.obj.css('z-index','20')
    if(this.alteration && this.obj_alt.length)
    {
      this.obj_alt[0].src = this.src_alteration
      this.obj_alt.css('z-index', "20")
    }
    if('function'==typeof params.complete) params.complete()
    return this // chainage
  },
  /**
    * Sort la note de son exergue
    * @method unexergue
    */
  unexergue:function(params)
  {
    if(undefined == params)           params = {}
    if(undefined == params.complete)  params.complete = NEXT_STEP
    delete this.color
    this.obj[0].src = this.src
    this.obj.css('z-index','10')
    if(this.alteration && this.obj_alt.length)
    {
      this.obj_alt[0].src = this.src_alteration
      this.obj_alt.css('z-index', "10")
    }
    if('function'==typeof params.complete) params.complete()
  }  
  
})

$.extend(Note.prototype, METHODES_TEXTE)
Object.defineProperties(Note.prototype, PROPERTIES_TEXTE)

/* ---------------------------------------------------------------------
 *  
 */
$.extend(Note.prototype,{
  
  /**
    * Reset la note (pour forcer le recalcul des valeurs après un changement de hauteur,
    * d'altération, etc.)
    * WARNING
    *   Ne surtout pas mettre ici la destruction de la note, de l'alteration (même
    *   la variable).
    *
    * @method reset
    */
  reset:function()
  {
    delete this.suplines
    delete this._top
    delete this._midi
    delete this._indice
    delete this._indice_real
  },

  /**
    * Analyse la note fournie en argument
    *
    * Produit
    * -------
    *   – La définition de la portée  this.staff
    *   - La définition de la note    this.note
    *   - Calcul le top de la note    this.top
    *   - Définit l'octave            this.octave
    *   – Définit l'altération        this.alteration     ou undefined
    *
    *   - Si c'est un changement de hauteur, et que la note possédait une
    *     altération, modifie l'altération (le src de l'image).
    *
    * @method analyse_note
    * @param {String} note_str  Un string de la forme :
    *                           "[<portée>:]<note 1 lettre><altération><octave>"
    *                           <portée>      : indice portée 1-start
    *                           <alteration>  : "b", "d", "x", "t" ou ""
    *                           <octave>      : 0 à 9 avec ou sans "-" devant
    */
  analyse_note:function(note_str)
  {
    var dnote, staff ;
    this.reset()
    
    var data_note = Note.parse(note_str)
    if(!data_note)
    {
      F.error("La note `"+note_str+"` est mal définie…")
      return false
    } 
    
    
    // === Définition de la portée (if any) ===//
    if(data_note.staff) this.staff  = data_note.staff

    // === Définition de la note === //
    this.note = data_note.note
    
    // === Définition de l'altération (if any, et mémorisation de l'altération courante si nécessaire) ===//
    this.old_alteration = undefined
    if(data_note.alter)
    {
      if(this.alteration) this.old_alteration = this.alteration.toString()
      this.alteration = data_note.alter
    } 
    else 
    {
      if(this.alteration) this.remove_alteration()
      delete this.alteration
    }
    
    // === Définition de l'octave ===//
    // Il peut ne pas exister dans la note mais avoir été défini explicitement
    // dans les paramètres comme dans le cas d'un motif
    if(data_note.octave) this.octave = data_note.octave
    
    /*
     *  Travail à faire sur les altérations en cas de modification de la note
     *  
     */
    if(this.old_alteration)
    {
      if(this.old_alteration != this.alteration)
      { // Quand l'ancienne et la nouvelle altération ne sont pas identiques.
        this.hide_alteration($.proxy(this.update_alteration,this))
      } 
      else
      { // Quand l'ancienne altération et la nouvelle sont les mêmes
        // Dans ce cas, on va masquer l'altération courante, la repositionner
        // puis la faire ré-apparaitre.
        this.hide_alteration($.proxy(this.positionne_and_show_alteration,this))
      }
    }
    else
    {
      // Construction de l'altération (sauf nouvelle note) et positionnement
      if(this.obj.length && this.alteration)
      {
        Anim.Dom.add(this.html_img_alt)
        this.positionne_and_show_alteration()
      }
    }
    
  },

  /**
    * Appelée en fin de l'opération 'moveTo' ci-dessus, juste avant 
    * le passage à l'étape suivante.
    * @method on_complete_moveTo
    */
  on_complete_moveTo:function()
  {
    this.suplines_if_necessary()
    if(this.staff_changed)
    {
      this.staff.notes.add(this)
      delete this.staff_changed
    }
    // `complete` réglé ci-dessous juste pour qu'il est une valeur et ne
    // soit pas remplacé par NEXT_STEP
    this.unexergue({complete:$.proxy(this.update_affichage, this)})    
    if(upper = this.staff.notes.hasConjointeUpper(this)) upper.update_affichage()
  },
  /**
    * Détruit l'alteration
    * Notes
    *   * La méthode est appelée lorsqu'il y a changement de hauteur de la
    *     note, et qu'elle perd son altération
    *
    * @method remove_alteration
    */
  remove_alteration:function()
  {
    if(!this.alteration) return
    delete this.alteration
    var me = this
    this.obj_alt.animate({opacity:0}, Anim.delai_for('show'),function(){
      me.obj_alt.remove()
      })
  },
  /**
    * Méthode qui "complete" vraiment l'affichage et passe à l'étape
    * suivante. Elle sort la note de son exergue si nécessaire.
    * Notes
    * -----
    *   * Noter que la méthode ne doit être appelée directement que lorsqu'on
    *     est sûr que tous les éléments sont traités ou affichés (cf. on_complete).
    *     La méthode `moveTo` peut le faire par exemple.
    *
    * @method complete
    */
  complete:function()
  {
    this.suplines_if_necessary()
    this.unexergue() // poursuivra avec NEXT_STEP
  },
  /**
    * Méthode à appeler à la fin de toute animation
    * 
    * @method on_complete
    * @param {String} type_obj  Le type de l'objet qui appelle la méthode
    *                           Peut-être 'note', 'alteration'
    */
  on_complete:function(type_obj)
  {
    if(this.is_complete_with(type_obj)) this.complete()
  },
  /**
    * Return true si tous les objets de la note sont affichés
    * @method is_complete_with
    * @param  {String} type_obj Le type de l'objet (cf. `on_complete`)
    * @return {Boolean} True si tous les éléments sont affichés
    */
  is_complete_with:function(type_obj)
  {
    if(undefined == this.tbl_complete) this.tbl_complete = {note:false, alteration:false}
    this.tbl_complete[type_obj] = true
    for(var tobj in this.tbl_complete) if(false == this.tbl_complete[tobj]) return false
    delete this.tbl_complete
    return true
  },
  /**
    * Méthode appelée après l'opération 'remove' ci-dessus, juste avant qu'on
    * ne passe à l'étape suivante.
    * @method on_complete_remove
    */
  on_complete_remove:function()
  {
    this.obj.remove()
    if(this.alteration) this.obj_alt.remove()
  },
  
  /**
    * Construit la note
    * @method build
    * @async
    * @param  {Object|Undefined} params   Paramètres optionnels, dont :
    *    @param {Function} params.complete    La méthode pour suivre la construction
    */
  build:function(params)
  {
    Anim.Dom.add(this, params)
    this.suplines_if_necessary()
    this.staff.notes.add(this)
  },
  /**
    * Ajoute les lignes supplémentaires si nécessaire
    * @method suplines_if_necessary
    */
  suplines_if_necessary:function()
  {
    var dsuplines = this.need_suplines(this.staff.cle)
    if(dsuplines){
      dsuplines = $.extend(dsuplines, {left:this.left})
      this.staff.add_suplines(dsuplines)
    } 
  },
  /**
    * Méthode qui masque l'altération
    * Note
    * ----
    *   * Elle doit exister
    *     Cette méthode est utile pour par exemple déplacer l'altération lorsqu'il
    *     y a un changement de hauteur.
    *
    * @method hide_alteration
    * @param  {Function} complete   La fonction à appeler ensuite.
    */
  hide_alteration:function(complete)
  {
    this.obj_alt.animate({opacity:0}, Anim.delai_for('show'), complete)
  },
  /**
    * Positionne la note en fonction de sa hauteur de note
    * et de la hauteur de la portée
    * @method positionne
    */
  positionne:function()
  {
    // dlog({
    //   'top current staff':Anim.current_staff.top,
    //   'top note':this.top,
    //   'key in NOTE_TO_OFFSET': this.note+this.octave,
    //   'value in NOTE_TO_OFFSET':NOTE_TO_OFFSET[this.note+this.octave]
    // })
    var d = {top:this.top+'px', left:this.real_left+'px'}
    if(Anim.prefs.note_size != Anim.prefs_default.note_size) d.height = Anim.prefs.note_size+'px';
    this.obj.css(d)
    if(this.alteration) this.positionne_alteration()
  },
  /**
    * Cette méthode vise à rafraichir l'affichage de la note après un
    * changement important, comme un déplacement, qui a pu supprimer par
    * exemple une note conjointe et donc un décalage à gauche.
    * À l'avenir, cette méthode devra gérer tous les cas, par exemple l'altération
    * qu'il faut peut-être recaler aussi
    * @method update_affichage
    */
  update_affichage:function()
  {
    this.obj.animate({left:this.real_left+'px'}, 250)
    if(this.alteration) this.positionne_alteration()
  },
  /**
    * Position l'altération
    * Notes
    * -----
    *   * Chaque type d'altération possède son propre positionnement.
    * @method positionne_alteration
    */
  positionne_alteration:function()
  {
    var off = OFFSET_ALTERATION[this.alteration]
    if(undefined == off)
    {
      console.error("Altération inconnue (`"+this.alteration+"`) avec note:"+this.note_str+". Des problèmes collatéraux seront posés.")
      return false
    }
    this.obj_alt.css({top:(this.top - off.top)+"px", left:(this.left - off.left)+"px"})
  },
  /**
    * Return TRUE si la note nécessite des lignes supplémentaires
    *   Note max clé de SOL = 80 si "a", 81
    *   Note min clé de SOL = 62 si "c" 61 si "c" ou "b", 60
    *   
    *   Note max clé de FA  = 58 si "c", 59 si "c", 60
    *   Note min clé de FA    30 et 29 si "e", 28
    *   c au milieu = 48, c tout en bas = 24
    *   mi en bas = 28
    * @property {Boolean} need_suplines
    * @param  {String} key  La clé de la portée sur laquelle il faut mettre la note
    * @return {Object} NULL si la note ne nécessite pas de lignes supplémentaires, 
    *                       ou un object contenant :above et :number, la donnée
    *                       à envoyer à Staff pour construire les lignes supplémentaires
    
Il faudrait arriver à :

Clé de SOL
==========
  En dessous
  ----------
  do4   => 1 ligne supplémentaire quel que soit son altération
  si3   => 1 ligne
  la3   => 2 lignes
  sol3  => 2 lignes
  fa3   => 3 lignes
  mi3   => 3 lignes
  => Lignes si do4 || octave < 3

  Au-dessus
  ---------
  la5   => 1 ligne
  si5   => 1 ligne
  do6   => 2 lignes
  re6   => 2 lignes
  mi6   => 3 lignes
  fa6   => 3 lignes
  => Lignes si indice_note >= 6 && octave == 5 || octave > 5
    
    */
  need_suplines:function(key)
  {
    if(undefined == this.suplines || undefined == this.suplines[key])
    {
      if(undefined == this.suplines) this.suplines = {}
      this.suplines[key] = function(key, note, octave, midi){
        var oct, ino, lis, n, fin=false, nombre_lignes=0 ;
        var notoc = note + octave
        switch(key)
        {
        case SOL :
          if(notoc == "c4" || octave < 4)
          { // => Lignes supplémentaires en dessous
            lis = [c4, a3, f3, d3, b2, g2, e2, c2, a1, f1, d1]
            ino = -1
            oct = 4
            do {
              ino += 1
              not = NOTES_ENVERS[ino]
              if(ino == 1) oct -= 1
              if( lis.indexOf(not+oct) >-1 ) ++ nombre_lignes
              if(not+oct == notoc) return {top:false, number: nombre_lignes}
            } while( oct > 0)
          }
          else if(notoc == "a5" || notoc == "b5" || octave > 5)
          { // Lignes supplémentaires au-dessus
            lis = [a5, c6, e6, g6, b6, d7, f7, a7]
            ino = 4
            oct = 5
            do {
              ino += 1
              if(ino == 7){ ino = 0; oct += 1}
              not = NOTES[ino]
              if( lis.indexOf(not + oct) > -1) ++ nombre_lignes
              if(not+oct == notoc) return {top:true, number: nombre_lignes}
            } while( oct < 8)
          }
          else return null
        case FA  :
          if(octave >= 3)
          { // Lignes supplémentaires au-dessus
            lis = [c4, e4, g4, b4, d5, f5, a5]
            ino = -1 // pour commencer à 0 = do
            oct = 3
            do {
              ino += 1
              if(ino == 7){ ino = 0; oct += 1}
              not = NOTES[ino]
              if( lis.indexOf(not + oct) > -1) ++ nombre_lignes
              if(not+oct == notoc) return {top:true, number: nombre_lignes}
            } while( oct < 6)
          }
          else if(["e2","d2","c2"].indexOf(notoc)>-1 || octave < 2)
          { // Lignes supplémentaires en dessous
            lis = [e2, c2, a1, f1, d1, 'b0', 'g0', 'e0', 'c0']
            ino = 4 // pour commencer à 5 = e2
            oct = 2
            do {
              ino += 1
              not = NOTES_ENVERS[ino]
              if(ino == 1) oct -= 1
              if( lis.indexOf(not+oct) >-1 ) ++ nombre_lignes
              if(not+oct == notoc) return {top:false, number: nombre_lignes}
            } while( oct > 0)
          }
          else return null
        default: return null; // pour le moment
        }
      }(key, this.note, this.octave, this.midi)
    }
    return this.suplines[key]
  },
  
  positionne_and_show_alteration:function()
  {
    if(!this.alteration) return
    this.positionne_alteration()
    this.obj_alt.animate({opacity:1}, Anim.delai_for('show'))
  },
  
  /**
    * Actualise l'altération
    * Notes
    * -----
    *   * Cette méthode peut être appelée même s'il n'y a pas d'altération, il 
    *     faut donc vérifier. Sinon, elle se sert de la nouvelle valeur de
    *     `this.alteration`.
    *
    * @method update_alteration
    */
  update_alteration:function()
  {
    if(!this.alteration) return
    this.obj_alt[0].src = this.src_alteration
    this.positionne_and_show_alteration()
  }
  
})

Object.defineProperties(Note.prototype,{
  /**
    * Retourne la position top de la note 
    * Notes
    * -----
    *   * WARNING: Il faut penser à détruire `_top` si cette hauteur
    *     doit être actualisée, comme lorsqu'il y a un déplacement de la note
    * @property {Number} top
    */
  "top":{
    get:function(){
      if(undefined == this._top)
      {
        this._top = this.staff.zero + NOTE_TO_OFFSET[this.note+this.octave]
      }
      return this._top
    }
  },
  /**
    * Retourne le "centre vertical" de la note. Pour une note, ça correspond à
    * son `top`, mais la propriété doit être définie pour l'association d'objets
    * à la note (cf. par exemple les flèches — arrow)
    * @property {Number} center_y
    */
  "center_y":{get:function(){return this.top}},
  /**
    * Retourne le “center_x” de la note, c'est-à-dire la position left qui passe
    * vraiment au milieu de la note (sauf si elle est décalée à cause d'une
    * note conjointe)
    * C'est cette valeur qui doit être utilisée pour positionner des éléments
    * par rapport à cette note.
    * @property {Number} center_x
    */
  "center_x":{get:function(){return this.left + 6}},
  
  /**
    * Retourne la largeur exacte qu'occupe la note à l'écran
    * @property {Number} width
    */
  "width":{
    get:function()
    {
      if(this.surrounded)
      {
        return UI.exact_width_of(this.circle.obj)
      }
      else
      {
        return UI.exact_width_of(this.obj) + (this.alteration ? UI.exact_width_of(this.obj_alt) : 0)
      }
    }
  },
  /**
    * La taille en hauteur de la note
    * @property {Number} height
    */
  "height":{
    get:function(){
      if(this.surrounded)
      {
        return UI.exact_height_of(this.circle.obj)
      }
      else
      {
        return UI.exact_height_of(this.obj)
      }
    }
  },
  /**
    * Retourne la vraie valeur left pour l'affichage, en fonction des notes
    * conjointes qui peuvent se trouver sur la portée à cet endroit-là
    * @property {Number} real_left
    */
  "real_left":{
    get:function(){
      var offset = 0
      if(this.staff.notes.hasConjointeUnder(this) != null) offset += 12.5
      return this.left + offset
    }
  },
  /** Retourne la liste ({Array}) des objets DOM de la note
    * (pour le moment, la note elle-même et éventuellement son altération)
    * @property {Array} objets
    */
  "objets":{
    get:function()
    {
      var objets = [this.obj]
      if(this.alteration) objets.push(this.obj_alt)
      if(this.arrows)     L(this.arrows).each(function(i, arrow){if(i=='length')return; objets.push(arrow.obj)})
      if(this.surrounded) objets.push(this.circle.obj)
      return objets
    }
  },
  /**
    * Retourne la note courante sous forme de string (débuggage)
    * @property {String} note_str
    */
  "note_str":{
    get:function(){
      return "["+this.staff.indice+":"+this.note+this.octave+"/left:"+this.left+"]"
    }
  },
  /**
    * Note conjointe au-dessus de la note
    * La valeur est "<note><octave>"
    * Notes : Il serait aussi possible de retourner la valeur midi
    * @property {String} conjointe_upper
    */
  "conjointe_upper":{
    get:function(){
      var note_up = NOTES[this.indice + 1]
      var octa_up = this.octave + (note_up == 'c' ? 1 : 0)
      return note_up + octa_up // p.e. "c4" pour "b3"
    }
  },
  /**
    * Note conjointe en dessous de la note
    * La valeur est "<note><octave>"
    * Notes : Il serait aussi possible de retourner la valeur midi
    * @property {String} conjointe_under
    */
  "conjointe_under":{
    get:function(){
      var note_down = this.indice == 0 ? 'b' : NOTES[this.indice - 1]
      var octa_down = this.octave + (note_down == 'b' ? -1 : 0)
      return note_down + octa_down
    }
  },
  /**
    * Indice de la note dans NOTES (0-start, donc 0 pour Do, 1 pour ré, etc.)
    * @property {Number} indice
    */
  "indice":{
    get:function(){
      if(undefined == this._indice) this._indice = NOTES.indexOf(this.note)
      return this._indice
    }
  },
  /**
    * Indice “réel“ de la note (1-start, donc 0 pour Do, 1 pour Do#, 2 pour Ré, etc.)
    * @property {Number} indice_real
    */
  "indice_real":
  {
    get:function(){
      if(undefined == this._indice_real) this._indice_real = REAL_INDICES_NOTES[this.note]
      return this._indice_real
    }
  },
  /**
    * Retourne la valeur numérique de la note
    * Note
    *   * Elle est calculée pour qu'un C3 correspond à 60
    *   * LA4 (440Hz = 69)
    * @property {Number} midi
    */
  "midi":{
    get:function(){
      if(undefined == this._midi)
      {
        // A4 (69)
        // -> inote = 10 / octave = 4 => 10 + ((4 - 1)*24) => 10 + 72 => 82 
        // C4 (60)
        //    -> inote = 1 / octave = 4 => 1 + (4*7) => 
        // A#3 ?
        //  inote = 10 / octave = 3 => 10 + (3*7) + 31 => 10 + 21 + 31 => 62
        var inote = this.indice_real
        this._midi = inote + ((this.octave - 1) * 24) - 13
        if(this.alteration)
        {
          switch(this.alteration)
          {
          case 'b'  : this._midi -= 1; break;
          case 'd'  : this._midi += 1; break;
          case 'x'  : this._midi += 2; break;
          case 't'  : this._midi -= 2; break;
          case 'z'  : break;
          }
        }
      }
      return this._midi
    }
  },
  /**
    * Retourne l'objet DOM de la note
    * @property {jQuerySet} obj
    */
  "obj":{
    get:function(){ return $('img#'+this.id)}
  },
  /**
    * Retourne l'objet DOM de l'alteration de la note, if any
    * @property {jQuerySet} obj_alt
    */
  "obj_alt":{
    get:function(){ return $('img#'+this.id+'-alt')}
  },
  /**
    * Retourne le code HTML pour la note (et ses altérations, effets, etc.)
    * @property {HTMLString} code_html
    */
  "code_html":{
    get:function(){
      var c = this.html_img
      if(this.alteration) c += this.html_img_alt
      return c
    }
  },
  /**
    * Retourne le code HTML de l'image de la note
    * @property {HTMLString} html_img
    */
  "html_img":{
    get:function(){
      return '<img class="note" id="'+this.id+'" src="'+this.src+'" />'
    }
  },
  
  /**
    * Path (src) de la note (en fonction de son type et de sa couleur)
    * Note : pour le moment, c'est toujours un simple rond
    * @property {String} src
    */
  "src":{
    get:function(){
      return "img/note/rond-"+(this.color || 'noir')+".png"
    }
  },
  /**
    * Path (src) de l'altération
    * @property {String} src_alteration
    */
  "src_alteration":{
    get:function(){return "img/note/"+this.filename_alteration+"-"+(this.color||'noir')+".png"}
  },
  
  /**
    * Retourne le nom du fichier en fonction de l'altération
    * @property {String} filename_alteration
    */
  "filename_alteration":{
    get:function(){
      switch(this.alteration)
      {
      case 'b'  : return "bemol"
      case 'd'  : return "diese"
      case 'x'  : return "dbl-diese"
      case 't'  : return "dbl-bemol"
      case 'z'  : return "becarre"
      }
    }
  },
  /**
    * Code HTML pour l'image de l'altération, if any
    * @property {HTMLString} html_img_alt
    */
  "html_img_alt":{
    get:function(){
      return '<img class="alteration" id="'+this.id+'-alt" ' +
              'src="'+this.src_alteration+'" />'
    }
  }
})
