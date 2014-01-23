/**
  * @module Txt.js
  */

/**
  * Fonction pour créer une instance Texte
  * @method TXT
  * @param  {Staff|Note|Barre|Mesure} owner Le porteur du texte
  * @param  {String|Object} params Les paramètres ou le texte
  * @return {Txt} L'instance texte créée
  */
window.TXT = function(owner, params)
{
  return new Txt(owner, params)
}

/**
  * @class Txt
  * @constructor
  * @param  {Staff|Note|Barre|etc.} owner Le porteur du texte
  * @param  {String|Object} params  Le texte ou les paramètres du texte
  */
window.Txt = function(owner, params)
{
  dlog("Params envoyés à Txt:");dlog(params)
  this.class = 'txt'

  /**
    * Identifiant absolu du texte
    * @property {String} id
    */
  this.id = 'txt'+(new Date()).getTime()

  /**
    * Le propriétaire du texte, Staff, Note, Chord, etc.
    * @property {Object|Staff|Note|Chord|...} owner
    */
  this.owner    = owner
  
  /*
    * La portée (seulement si elle est définie dans les paramètres, sinon,
    * voir `real_staff`)
    * @property {Staff} staff
    * NON !!! DÉFINI DANS ObjectClass
    */
  // this.staff = null
  
  /**
    * Le texte complet (fourni à l'instanciation)
    * Attention : c'est une propriété complexe
    * @property {String} texte
    */
  // this.texte    = null
  /**
    * Le texte principal véritable (ie le texte sans ses crochets éventuels)
    * @property {String} texte_main
    */
  this.texte_main = null
  /**
    * Le texte optionnel "avant". Il sera placé dans un div "flottant" (pour
    * pouvoir calculer correctement le positionnement du texte principal)
    * @property {String|Null} texte_before
    * @default NULL
    */
  this.texte_before = null
  /**
    * Le texte optionnel "après". Il sera placé après le texte principal dans un
    * texte flottant, où dans un autre endroit suivant le type du texte. Par exemple,
    * pour une modulation, ce texte est placé sous la barre.
    * @property {String|Null} texte_after
    * @default NULL
    */
  this.texte_after = null
  /**
    * Décalage vertical par rapport à la position normale
    * En fonction du type, réagit différemment, mais le principe est toujours
    * le même : une valeur positive éloigne de la portée
    * @property {Number} offset_y
    * @default 0
    */
  this.offset_y = 0
  /**
    * Décalage horizontal par rapport à la position courante (left)
    * Une valeur positive pousse vers la droite, une valeur négative vers la gauche
    * @property {Number} offset_x
    * @default 0
    */
  this.offset_x = 0

  ObjetClass.call(this, params)
}
Txt.prototype = Object.create( ObjetClass.prototype )
Txt.prototype.constructor = Txt

/* ---------------------------------------------------------------------
 *  Méthodes de classe
 *  
 */
$.extend(Txt, {
  /**
    * Traite un texte quelconque de type harmonie, accord, cadense, harmony
    * ou modulation
    * La méthode ne retourne QUE le renversement éventuel trouvé et renseigne
    * les valeurs de l'instance fournie en premier argument :
    *   itxt.texte_main, itxt.texte_before, itxt.texte_after
    * @method traite_texte_type_harmony
    * @param  {Object}  itxt     L'instance texte qui contient le texte
    * @param  {String}  texte    Le texte à traiter (par défaut, celui de l'instance envoyée)
    * @return {String}  Le renversement éventuellement trouvé, mais la valeur est
    * toujours définie car lorsqu'il n'y a pas de renversement, on renvoie une
    * espace insécable.
    */
  traite_texte_type_harmony:function(itxt, texte)
  {
    if(undefined == texte) texte = itxt.texte

    res = this.traite_crochets_in(texte)
    itxt.texte_main   = res.texte
    itxt.texte_before = res.before
    itxt.texte_after  = res.after
    
    // Cherche un renversement (harmony et cadence)
    res = this.traite_renversement_in(itxt.texte_main)
    var renversement = res.renversement // toujours défini
    itxt.texte_main  = res.texte
    // Chiffrage et fausses lignes
    var me = this // Attention : la classe Txt, pas l'instance du texte
    L(['texte_main', 'texte_before', 'texte_after']).each(function(prop){
      if(itxt[prop])
      {
        itxt[prop] = me.traite_chiffrage_in(itxt[prop])
        itxt[prop] = me.traite_fausse_ligne_in(itxt[prop])
      } 
    })
    // dlog("itxt.texte_main ("+itxt.id+":"+itxt.type+") FIN :"+itxt.texte_main)
    return renversement
  },
  /**
    * Remplace les marques de simples "-" en tiret semi-long qui créent
    * vraiment une ligne médiane
    * @method traite_fausse_ligne_in
    * @param  {String} texte Le texte
    * @return {String} Le texte modifié
    */
  traite_fausse_ligne_in:function(texte)
  {
    // On remplace aussi les "---" par des "———" qui dessinent bien
    // une ligne
    texte = texte.replace(/(\-\-+)/g, function(match, tirets, offset, s){
      var trait = ""
      while(trait.length < tirets.length) trait += '—'
      return trait
    })
    return texte
  },
  /**
    * Cherche une marque de renversement dans +texte+
    * @method traite_renversement_in
    * @param {String} texte Le texte dans lequel chercher
    * @return {Object} Un objet contenant {texte, renversement}
    */
  traite_renversement_in:function(texte)
  {
    // Un texte d'harmonie peut se terminer par des "*" qui 
    // définissent le renversement
    var renv, renv_len ;
    if(found = texte.match(/([\*•]+)/))
    {
      renv = found[1].replace(/\*/g, '•')
      renv_len = renv.length
      texte = texte.substring(0, texte.length - renv_len).trim()
    }
    else renv = '&nbsp;'
    return {texte:texte, renversement: renv}
  },
  /**
    * Cherche un texte entre crochets dans +texte+
    * @method traite_crochets_in
    * @param {String}   texte   Le texte
    * @return {Object}  Objet contenant {texte, crochets}
    */
  traite_crochets_in:function(texte)
  {
    var before, after ;
    found = texte.trim().match(/^(?:\[([^\]]+)\])?([^\[]*)(?:\[([^\]]+)\])?/)
    // console.dir(found)
    before = found[1]; if(before) before = before.trim();
    texte  = found[2];
    after  = found[3]; if(after) after   = after.trim();
    return {before:before, after:after, texte:texte.trim()}
  },
  /**
    * Traite le chiffrage (romain) dans +texte+
    * @method traite_chiffrage_in
    * @param {String}   texte   Le texte initial
    * @return {String}  Le texte corrigé
    */
  traite_chiffrage_in:function(texte)
  {
    texte = texte.replace(/7dim/g, '7°')
    texte = texte.replace(/m/g, '<span style="font-variant:normal;">m</span>')
    return texte.replace(/([0-9]+e?M?\-?)/g, function(match, chiffrage, offset, s){
      chiffrage = chiffrage.
                    replace(/(e|\-)/, '<sup>$1</sup>')
      return '<span class="chiffrage">'+chiffrage+'</span>'
      })
  }
})

$.extend(Txt.prototype,{
  
  /**
    * Écrit le texte (en fait, construit son élément et le positionne)
    * @method build
    */
  build:function()
  {
    // dlog("-> <Txt>.build ("+this.texte_main+")")
    Anim.Dom.add(this)
    return this
  },
  /**
    * Masque le texte (sans le détruire)
    * Note
    * ----
    * @method hide
    * @param  {Object} params Paramètres optionnels, et notamment :
    *   @param {Function} params.complete La méthode poursuivre, si elle doit être
    *                                     différente de NEXT_STEP
    */
  hide:function(params)
  {
    if(undefined == params) params = {}
    if(undefined == params.complete) params.complete = NEXT_STEP
    if(MODE_FLASH){
      this.obj.css('opacity', 0) 
      params.complete()
    }
    else 
    {
      this.obj.animate(
        {opacity:0},
        Anim.delai_for('show'),
        params.complete
      )
    }
  },
  /**
    * (Ré-)affiche le texte
    * @method show
    */
  show:function(params)
  {
    // dlog("-> <Txt>.show("+params+")")
    if(MODE_FLASH)
    {
      this.obj[0].style.opacity = 1
      NEXT_STEP()
    }
    else
    {
      if(undefined == params) params = {}
      Anim.Dom.show(this.obj, $.extend(params, {complete:NEXT_STEP} ))
    } 
  },
  
  /**
    * Positionne l'élément (en fonction de son possesseur)
    * Notes
    *   * Le texte est placé à différents endroit de la portée en fonction
    *     du type de texte.
    *   * Le left doit être recalculé, une fois qu'on connait la taille du texte,
    *     pour être calé correctement contre le possesseur.
    *   * Le top doit lui aussi être recalculé en fonction de offset_y
    *   * Le code contient des boites div `txtbefore` et `txtafter` qui,
    *     si elles ne sont pas vides, doivent être positionnées correctement.
    *
    *
    * @method positionne
    */
  positionne:function()
  {
    // NOTE : j'ai placé le traitement de la largeur avant le calcul de
    // real_left, car real_left se sert de la taille du texte, mais ça
    // risque de poser un problème pour le placement de certains éléments
    // comme les cadences (qui sont pour le moment les seuls à définir un
    // width particulier)
    if(this.width) this.obj.css({width:this.width+'px'})
    var dpos  = {}, my = this ;
    L(['left', 'top', 'height']).each(function(key){
      var val = my['real_'+key]
      if(val != null) dpos[key] = val + 'px'
    })
    this.obj.css(dpos)
    this.positionne_texte_before()
    this.positionne_texte_after()
  },
  /**
    * Position la boite DIV du texte_before
    * @method positionne_texte_before
    */
  positionne_texte_before:function()
  {
    if(!this.obj_texte_before || this.type == modulation) return
    var o = this.obj_texte_before
    o.css({left: "-"+(o.width()+12)+'px'})
  },
  /**
    * Position la boite DIV du texte_after
    * @method positionne_texte_after
    */
  positionne_texte_after:function()
  {
    if(!this.obj_texte_after || this.type == modulation) return
    var o = this.obj_texte_after
    o.css({right: "-"+(o.width()+12)+'px'})
  },
  /**
    * Ré-initialisation du texte après la définition de valeur qui peuvent
    * obliger à un recalcul
    * NON ! ÇA CASSE TOUT CE QUI A PU ÊTRE DÉFINI
    * @method reset
    */
  reset:function()
  {
    delete this._texte
    delete this._top
    delete this._left
    delete this._width
  },
  /**
    * Analyse le texte fourni
    * La méthode va définir les valeurs de texte_main (tout type), texte_after
    * et texte_before pour types particuliers de texte comme les harmonies,
    * les accords, etc.
    *
    * @method analyse_texte
    */
  analyse_texte:function()
  {
    switch(this.type)
    {
    case harmony:
    case cadence:
      renversement    = Txt.traite_texte_type_harmony(this)
      this.texte_main = '<div class="center inline">'+
                '<div class="renversement">'+renversement+'</div>' +
                (this.texte_main || "") +
              '</div>'
      break
    case chord:
      this.texte_main = Txt.traite_chiffrage_in(this.texte)
      break
    case modulation:
      Txt.traite_texte_type_harmony(this)
      this.texte_main = '<div class="mark_modulation">'+(this.texte_main||"")+'</div>'
      break
    case part:
      Txt.traite_texte_type_harmony(this)
      this.texte_main = '<div class="mark_part">'+(this.texte_main||"")+'</div>'
      break
    default:
      this.texte_main = this.texte
    }
  }
})

Object.defineProperties(Txt.prototype,{
  /* ---------------------------------------------------------------------
   *  PROPERTIES
   */
  /**
    * Le texte 
    * Notes
    *   * C'est ici qu'un type particulier de texte peut être mis en forme très
    *     exactement. Voir p.e. les cadences ou les modulations
    *   * Suivant le type de l'instance (`type`), il peut être transformé
    *
    * @property {String} texte
    */
  "texte":{
    set:function(t){ this.raw_texte = t },
    get:function(){ return this.raw_texte }
  },
  /**
    * Texte à écrire suivant le type de cadence (si le type du texte est `cadence`
    * et que `sous_type` est défini)
    * @property {String} texte_sous_type
    */
  "texte_sous_type":{
    get:function(){
      switch(this.type)
      {
      case cadence:
        switch(this.sous_type)
        {
        case faureenne: return "Fauréenne"
        case demie    : return "Demi-cadence"
        default:
          return this.sous_type.capitalize()
        }
        break
      default:
        return this.sous_type
      }
    }
  },
  /**
    * Le type du texte, s'il est défini
    * Ce type peut être (pour le moment)
    *   - harmony   Un texte pour un chiffrage d'harmonie
    *   - chord     Un accord
    *   - finger    Un doigté
    * @property {String} type
    */
  "type":{
    set:function(type){
      this._type = type
    },
    get:function(){return this._type}
  },
  /**
    * Retourne le TOP DU TEXTE
    * Notes
    * -----
    *   * Ce top dépend de pas mal de choses et notamment du type du texte (finger,
    *     harmony, etc.)
    *   * Il peut être également influencer par les décalages des préférences
    *   * Ce top est dépendant en tout premier lieu de la portée sous laquelle on
    *     doit le placer. Par ordre de priorité, on trouve la recherche de cette
    *     portée par :
    *       - la propriété `staff` définie explicitement
    *       - sinon la valeur par défaut `staff_harmony` (null par défaut)
    *       - sinon la portée du propriétaire du texte
    *       - sinon la portée active courante
    *
    * @property {Number} top
    */
  "top":{
    set:function(top){this._top = top},
    get:function(){
      if(undefined == this._top)
      {
        var top = this.real_staff.top
        switch(this.type)
        {
        case harmony:
        case cadence:
          top += Anim.prefs.harmony + Anim.prefs.offset_harmony
          break
        case chord:   
          top -= Anim.prefs.chord + Anim.prefs.offset_chord
          break
        case modulation:
          top -= Anim.prefs.modulation_y + Anim.prefs.offset_modulation_y
          break
        case part:
          top -= Anim.prefs.part_y + Anim.prefs.offset_part_y + this.offset_y
          break
        case measure:
          top -= Anim.prefs.num_measure_y + Anim.prefs.offset_num_measure_y
          break
        default:
          top = Math.min(top, this.owner.top) - 20
        }
        this._top = top
      }
      return this._top
    }
  },
  /**
    * Retourne la “vraie” portée sous laquelle on doit écrire la marque de
    * texte en fonction de son type.
    * @property {Staff} real_staff
    */
  "real_staff":{
    get:function(){
      if(this.owner.class == 'staff') return this.owner
      switch(this.type)
      {
      case harmony:
      case cadence:
        return this.staff || Anim.prefs.staff_harmony || this.owner.staff || Anim.current_staff
      case chord :
        return this.staff || Anim.prefs.staff_chords || this.owner.staff || Anim.current_staff
      default:
        return this.staff || this.owner.staff || Anim.current_staff
      }
    }
  },
  /**
    * left en fonction du owner (utilisé par "left")
    * @property {Number} left_per_owner
    */
  "left_per_owner":{
    get:function(){
      this._left_per_owner = function(owner, me)
      {
        switch(owner.class)
        {
        case 'staff':
          return (this.left || (Anim.current_x + 18)) - (UI.exact_width_of(me.obj) / 2)
        default:
          return owner.left
        }
      }(this.owner, this)
      return this._left_per_owner
    }
  },
  /**
    * Retourne le décalage horizontal du texte
    * Notes
    * -----
    *   * Pour certains types, comme `harmony`, il doit être calculé pour
    *     pouvoir placer son bord droit au bout du possesseur.
    *     Mais cela ne peut être fait qu'une fois qu'on connait la taille du
    *     texte, donc c'est la méthode `positionne` qui s'en charge. c'est quand
    *     elle appelle this.left qu'on le calcule.
    *   * Ce n'est pas ici que doit être pris en compte la valeur de `offset_x`,
    *     cf. `real_left`
    *
    * @property {Number} left
    */
  "left":{
    set:function(left){ this._left = left},
    get:function(){
      if(undefined == this._left)
      {
        this._left = this.left_per_owner
        switch(this.type)
        {
        case modulation:
          this._left += Anim.prefs.modulation_x
          break
        case part:
          this._left += Anim.prefs.part_x
        case measure:
          this._left -= 30
          break
        default:
        }
      }
      return this._left
    }
  },
  /**
    * Retourne le vrai top du texte dans le cas où un offset_y a été défini
    * Agit différemment suivant le type (cf. la définition de la propriété offset_y)
    * @property {Number} real_top
    */
  "real_top":{
    get:function(){
      return this.top + function(owner, itxt, voffset){
        switch(owner.class)
        {
        case 'staff': 
          var h = Anim.prefs.staff_top_text + voffset
          if(Anim.prefs.staff_text_up)
            return - (h + itxt.height_calc)
          else
          {
            return owner.height + h
          }
        }
        if( voffset ) return itxt.top
        switch(itxt.type){
        case chord:
          return - voffset
        default:
          return voffset
        }
      }(this.owner, this, this.offset_y)
    }
  },
  /**
    * Retourne le vrai décalage left du texte par rapport à l'objet en
    * fonction de son type
    * @property {Number} real_left
    */
  "real_left":{
    get:function()
    {
      var left  = this.left
      var w_box = this.obj.width()
      // dlog("-> real left")
      // dlog({
      //   'this': this.id+":"+this.type,
      //   'left': this.left,
      //   'owner left': this.owner.left,
      //   'owner center x':this.owner.center_x,
      //   'width box' : w_box
      // })
      switch(this.type)
      {
      case harmony:
        this._real_left = this.owner.center_x - (w_box / 2)
        break
      case cadence:
        // Pour un texte d'harmonie, le bord droit doit être aligné au possesseur,
        // à peine plus à droite.
        this._real_left = left - w_box + 4
        break
      case chord:
        this._real_left = this.owner.center_x - (w_box / 2)
        break
      default:
        this._real_left = left - 10
      }
      return this._real_left + (this.offset_x || 0)
    }
  },
  /**
    * La hauteur de la boite de texte
    * Noter que ça renvoie une "vraie" valeur, ie comptée avec le padding et
    * les bordures.
    * @property {Number} height_calc
    */
  "height_calc":{
    get:function(){
      return UI.exact_height_of(this.obj)
    }
  },
  /**
    * Vraie valeur pour la hauteur
    * @property {Number|Null} real_height
    */
  "real_height":{
    get:function(){
      dlog("-> real_height")
      switch(this.type)
      {
      case part:
        // Pour une partie, on essaie d'aller jusqu'en bas de la portée,
        // sauf si this.height est défini
        if(this.height) return this.height
        var h = this.real_staff.bottom - this.real_top
        return h
      default: return null
      }
    }
  },
  /* ---------------------------------------------------------------------
   *  DOM  
   */
  /**
    * Return l'objet DOM du texte (noter qu'il contient tous les textes)
    * @property {jQuerySet} obj
    */
  "obj":{
    get:function(){return $('div#'+this.id)}
  },
  /**
    * Boite DIV contenant (optionnellement) le `texte_before`
    * @property {jQuerySet} obj_texte_before
    */
  "obj_texte_before":{
    get:function(){
      var obj = this.obj.find('> div.txtbefore')
      if(obj.length) return obj
    }
  },
  /**
    * Boite DIV contenant (optionnellement) le `texte_after`
    * @property {jQuerySet} obj_texte_after
    */
  "obj_texte_after":{
    get:function(){
      var obj = this.obj.find('> div.txtafter')
      if(obj.length) return obj
    }
  },
  /**
    * Return le code HTML pour le texte quelconque
    * Note : Un code HTML pour un texte quelconque est composé de trois parties :
    * un texte "before", un texte "after" et le texte principal. L'alignement est
    * toujours fait par rapport au texte principal et le type de texte détermine
    * ensuite par CSS (ou calcul) la position des deux autres textes.
    * @property {HTLMString} code_html
    */
  "code_html":{
    get:function(){
      // On doit calculer le texte ici, l'appel à la propriété "texte" affecte
      // les valeurs de texte_main, texte_before et texte_after
      this.analyse_texte()
      // dlog("après analyse_texte:")
      // dlog({
      //   main:this.texte_main,
      //   before:this.texte_before,
      //   after:this.texte_after
      // })
      var css = ['text']
      if(this.type)
      {
        css.push(this.type)
      } 
      var style = []
      if(this.width) style.push("width:"+this.width+"px;")
      var boites = ""
      if(this.texte_before) boites += '<div class="txtbefore">' + this.texte_before +'</div>'
      if(this.texte_main)   boites += '<div class="maintxt">'   + this.texte_main   +'</div>'
      if(this.texte_after)  boites += '<div class="txtafter">'  + this.texte_after  +'</div>'
      if(this.sous_type)    boites += '<div class="typecadence '+this.sous_type+'">'+this.texte_sous_type+'</div>'
      return  '<div id="'+this.id+'" class="'+css.join(' ')+'" style="'+style.join('')+'">'+
                boites + '</div>'
    }
  }
})