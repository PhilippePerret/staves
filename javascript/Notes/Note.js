/**
  * @module Note
  */


// console.dir(NOTE_TO_OFFSET)

/**
  * Pour créer une note (instance Note) et la construire sur la portée
  * @method Note
  * @for window
  * @param  {String} note   La note en version string (p.e. "ab5" pour la bémol 5)
  * @param  {Object|Undefined} params   Paramètres optionnels
  *   @param {Boolean} params.dont_build    Si true, la note n'est pas construite
  */
window.NOTE = function(note, params)
{
  if(undefined == params) params = {}
  var n = new Note(note, params)
  if(!params.dont_build)
  {
    n.build()
    Anim.wait(1)
  }
  return n
}

/**
  * @class Note
  * @constructor
  * @param  {String} note   La note
  * @param  {Object|String} Les paramètres optionnels
  */
window.Note = function(note, params)
{
  this.class      = 'Note'
  this.note       = null
  this.octave     = null
  this.alteration = null
    
  this.left   = Anim.current_x
  
  /**
    * Le texte éventuel que porte la note (instance {Txt})
    * Note
    *   * Il est inauguré par la méthode <note>.write(<texte>)
    *
    * @property {Txt} texte
    */
  this.texte = null
  
  ObjetClass.call(this, params)

  // C'est la note qui a toujours le dernier mot sur les paramètres. Par exemple,
  // avec un accord, Chord met sa staff dans les paramètres. Mais si des notes
  // sont définies par "2:...", le "2" qui signifie 2e portée doit prendre le
  // dessus.
  this.analyse_note(note)

  // On peut calculer l'identifiant
  this.id = this.note + (this.alteration || "") + this.octave + (new Date()).getTime()

}
Note.prototype = Object.create( ObjetClass.prototype )
Note.prototype.constructor = Note


/* ---------------------------------------------------------------------
 *
 *  Méthodes pour composer le code de l'animation
 *  
 */

$.extend(Note.prototype,{
  /**
    * Déplace la note à la hauteur +hauteur+
    * Notes
    * -----
    *   * Le déplacement a été simplifié : la note change de couleur et 
    *     se déplace de façon rectiligne en passant au-dessus des autres
    *   * L'option prise, par rapport à l'altération, est de la faire disparaitre
    *     et ré-apparaitre à la nouvelle position. Sinon c'est trop compliqué
    *     (et pas nécessaire) de la faire se déplacer aussi.
    *     Cf. la méthode `analyse_note` qui s'en charge le cas échéant.
    * @method moveTo
    * @param  {String}  hauteur   La nouvelle hauteur
    * @param  {Object}  params    Les paramètres optionnels
    */
  moveTo:function(hauteur)
  {
    var top_init = parseInt(this.top,10)
    this.analyse_note(hauteur)
    this.exergue()
    this.operation([this.obj], 'moveTo', {top: this.top})
  },
  
  /**
    * Construit une flèche partant de la note
    * @method arrow
    * @param {Object} params Paramètres optionnels
    *   @param  {Number} params.orientation   L'angle d'orientation de la flèche
    *                                         Par défaut : 180 (horizontal)
    */
  arrow:function(params)
  {
    if(this._arrow) this._arrow.remove()
    $.extend(this.arrow, ARROW_METHODS)
    this.arrow.owner = this
    if(undefined == params) params = {}
    var x = this.left + 20
    var y = this.top
    params = $.extend(params, {owner:this, top:y, left:x})
    this._arrow = new Arrow(params)
    Anim.Dom.add(this._arrow)
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
    if(this.circle) this.circle.remove()
    if(undefined == params) params = {}
    var x = this.left - (6 + (this.alteration ? 18 : 0))
    var y = this.top  - (6 + (this.alteration ? 9  : 0))
    params = $.extend(params, {owner:this, top:y, left:x})
    this.circle = new Circle(params)
    Anim.Dom.add(this.circle)
  },
  /**
    * Retirer le cercle entourant la note
    * @method unsurround
    */
  unsurround:function()
  {
    if(!this.circle) return F.error("La note "+this.note_str+" n'est pas entourée !")
    this.circle.remove()
  },
  /**
    * Met la note en exergue (bleue et au-dessus)
    * @method exergue
    */
  exergue:function()
  {
    this.obj[0].src = "img/note/rond-couleur.png"
    this.obj.css('z-index','20')
    if(this.alteration && this.obj_alt.length)
    {
      this.obj_alt[0].src = "img/note/"+this.filename_alteration+"-couleur.png"
      this.obj_alt.css('z-index', "20")
    }
  },
  /**
    * Sorte la note de son exergue
    * @method unexergue
    */
  unexergue:function()
  {
    this.obj[0].src = "img/note/rond-noir.png"
    this.obj.css('z-index','10')
    if(this.alteration && this.obj_alt.length)
    {
      this.obj_alt[0].src = this.src_alteration
      this.obj_alt.css('z-index', "10")
    }
  },
  
  /**
    * Destruction de la note
    * Notes
    *   * Pour le moment, je détruis seulement son objet DOM
    * @method remove
    */
  remove:function()
  {
    this.exergue()
    this.operation(this.objets, 'remove')
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
  },

  /**
    * Appelée en fin de l'opération 'moveTo' ci-dessus, juste avant 
    * le passage à l'étape suivante.
    * @method on_complete_moveTo
    */
  on_complete_moveTo:function()
  {
    this.suplines_if_necessary()
    this.unexergue()    
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
    this.unexergue()
    NEXT_STEP()
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
    */
  build:function()
  {
    Anim.Dom.add(this)
    this.suplines_if_necessary()
  },
  /**
    * Ajoute les lignes supplémentaires si nécessaire
    * @method suplines_if_necessary
    */
  suplines_if_necessary:function()
  {
    var dsuplines = this.need_suplines(this.staff.cle)
    if(dsuplines) this.staff.add_suplines( dsuplines )
  },
  
  /**
    * Méthode propre pour afficher la note
    *
    * @method show
    * @async
    * @param {Object} params Les paramètres optionnels
    */
  show:function(params)
  {
    // dlog("-> note.show "+this.note_str)
    this.operation(this.objets, 'show')
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
    this.obj.css({top:this.top+"px", left:this.left+"px"})
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
    
    // === Définit la portée ===//
    if(note_str.indexOf(':') > -1)
    {
      dnote       = note_str.split(':')
      // this.staff  = Anim.staves[parseInt(dnote.shift(),10) - 1]
      this.staff  = parseInt(dnote.shift(),10)
      note_str    = dnote.shift()
    }
    note_str = note_str.split('')

    // === Définition de la note === //
    this.note   = note_str.shift()
    
    /*
     *  Analyse de l'altération
     *  -----------------------
     *  En cas de changement de hauteur, trois situations peuvent se produire,
     *  nécessitant un résultat différent :
     *  1.  La note possédait une altération, elle n'en possède plus
     *      => détruire l'altération courante
     *  2.  La note ne possédait pas d'altération, elle en possède une
     *      => Il faut construire l'altération
     *  3.  La note possédait une altération, elle en possède une autre.
     *      => Il faut modifier l'altération courante.
     *  Note: Rien à faire quand 4. les deux notes ne possèdent pas d'altération,
     *        ou 5. les deux notes possèdent la même altération.
     */
    if(["b", "d", "x", "t"].indexOf(note_str[0]) > -1)
    {
      if(this.alteration)
      {
        this.old_alteration = this.alteration.toString()
      }
      // === Définition de l'altération ===//
      this.alteration = note_str.shift()
      
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
        if(this.obj.length)
        {
          Anim.Dom.add(this.html_img_alt)
          this.positionne_and_show_alteration()
        }
      }
    } 
    else 
    {
      if(this.alteration) this.remove_alteration()
      delete this.alteration
    }
    
    // === Définition de l'octave ===//
    this.octave = note_str.shift()
    if(this.octave == "-") this.octave = "-" + note_str.shift()
    this.octave = parseInt(this.octave,10)
    
  },
  positionne_and_show_alteration:function()
  {
    this.positionne_alteration()
    this.obj_alt.animate({opacity:1}, Anim.delai_for('show'))
  },
  
  /**
    * Actualise l'altération
    * Notes
    * -----
    *   * Cette méthode n'est appelée QUE si une altération existe, mais
    *     qu'il faut la modifier. Elle se sert de la nouvelle valeur de
    *     `this.alteration`.
    *
    * @method update_alteration
    */
  update_alteration:function()
  {
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
  /** Retourne la liste ({Array}) des objets DOM de la note
    * (pour le moment, la note elle-même et éventuellement son altération)
    * @property {Array} objets
    */
  "objets":{
    get:function()
    {
      var objets = [this.obj]
      if(this.alteration) objets.push(this.obj_alt)
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
        var inote = REAL_INDICES_NOTES[this.note]
        this._midi = inote + ((this.octave - 1) * 24) - 13
        if(this.alteration)
        {
          switch(this.alteration)
          {
          case 'b'  : this._midi -= 1; break;
          case 'd'  : this._midi += 1; break;
          case 'x'  : this._midi += 2; break;
          case 't'  : this._midi -= 2; break;
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
      return '<img class="note" id="'+this.id+'" src="img/note/rond-noir.png" />'
    }
  },
  
  /**
    * Path (src) de l'altération
    * @property {String} src_alteration
    */
  "src_alteration":{
    get:function(){return "img/note/"+this.filename_alteration+".png"}
  },
  /**
    * Retourne le nom du fichier en fonction de l'altération
    * @property {String} filename_alteration
    */
  "filename_alteration":{
    get:function(){
      switch(this.alteration)
      {
      case 'b'  : return "bemol";
      case 'd'  : return "diese";
      case 'x'  : return "dbl-diese";
      case 't'  : return "dbl-bemol";
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
