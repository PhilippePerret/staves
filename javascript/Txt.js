/**
  * @module Txt.js
  */

/**
  * Méthodes qui doivent être héritées ($.extend) par tout objet
  * pouvant contenir un texte (Note, Accords, etc.)
  * @property {Object} METHODES_TEXTE
  * @for window
  */
window.METHODES_TEXTE = {
  /**
    * Écrit un texte au-dessus ou en dessous du possesseur du texte
    * Notes
    * -----
    *   * La méthode placera le texte (instance {Txt} dans la propriété `texte`
    *     avec en clé le type de texte ('regular', 'harmony', 'chord_mark', etc.)
    *   * L'étape suivante doit être appelée par l'affichage du texte (Txt::show)
    *
    * @method write
    * @param  {String} texte Le texte à écrire
    * @param  {Object} params Les paramètres optionnels
    * @return {Object} L'instance Note courante (pour chainage)
    */
  write:function(texte, params)
  {
    // dlog("-> <Note>.write")
    if(undefined == params) params = {}
    params.texte  = texte
    if(undefined == params.type) params.type = 'regular'
    if(!this.texte) this.texte = {}
    this.texte[params.type] = TXT(this, params)
    this.texte[params.type].build()
    return this
  },
  /**
    * Raccourci pour écrire un texte d'harmony
    * @method harmony
    * @param  {String} texte  Le texte à écrire
    * @param  {Object} params   Paramètres optionnels
    * @return {Object} L'instance Note courante (pour chainage)
    */
  harmony:function(texte, params)
  {
    if(undefined == params) params = {}
    params.type = harmony
    this.write(texte, params)
    return this
  },
  /**
    * Raccourci pour écrire un texte de type cadence
    * @method cadence
    * @param  {String} texte    Le texte à écrire
    * @param  {Object} params   Paramètres optionnels
    * @return {Object} L'instance Note courante (pour chainage)
    */
  cadence:function(texte, params)
  {
    if(undefined == params) params = {}
    params.type = cadence
    this.write(texte, params)
    return this
  },
  /**
    * Ajoute une marque de modulation
    * @method modulation
    * @param {String} texte   Le texte de la modulation (au moins la note)
    * @param {Object} params  Les paramètres optionnels
    * @return {Object} L'instance Note courante (pour chainage)
    */
  modulation:function(texte, params)
  {
    if(undefined == params) params = {}
    params.type = modulation
    this.write(texte, params)
    return this
  },
  /**
    * Raccourci pour écrire un texte de type 'chord' (un accord placé au-dessus
    * de la portée et au-dessus de l'élément porteur)
    * @method chord_mark
    * @param  {String} accord   L'accord à marquer
    * @param  {Object} params   Les paramètres optionnels
    * @return {Object} L'instance Note courante (pour chainage)
    */
  chord_mark:function(accord, params)
  {
    if(undefined == params) params = {}
    params.type = chord
    this.write(accord, params)
    return this
  }
}
/**
  * Propriétés qui doivent être héritées (Object.defineProperties) par tout objet
  * pouvant contenir un texte (Note, Accords, etc.)
  * @property {Object} PROPERTIES_TEXTE
  * @for window
  */
window.PROPERTIES_TEXTE = {
  
}

/**
  * Fonction pour créer une instance Texte
  * @method TXT
  * @param  {Staff|Note|Barre|Mesure} owner Le porteur du texte
  * @param  {String|Object} params Les paramètres ou le texte
  * @return {Txt} L'instance texte créée
  */
window.TXT = function(owner, params)
{
  // Anim.wait(1)
  return new Txt(owner, params)
}
// Alias
window.TEXTE = window.TXT

/**
  * @class Txt
  * @constructor
  * @param  {Staff|Note|Barre|etc.} owner Le porteur du texte
  * @param  {String|Object} params  Le texte ou les paramètres du texte
  */
window.Txt = function(owner, params)
{
  this.id       = 'txt'+(new Date()).getTime()

  this.owner    = owner
  this.texte    = null
  this.vOffset  = null
  this.hOffset  = null

  ObjetClass.call(this, params)
  // Apparemment, ça ne fonctionne pas, de dispatcher les paramètres avec
  // ObjetClass, donc je le fais ici
  // var me = this
  // L(params || {}).each(function(k,v){me[k] = v})
}
Txt.prototype = Object.create( ObjetClass.prototype )
Txt.prototype.constructor = Txt

/* ---------------------------------------------------------------------
 *  Méthodes de classe
 *  
 */
$.extend(Txt, {
  /**
    * Traite un texte quelconque d'harmonie, que ce soit une modulation,
    * une cadence, un accord, etc.
    * La méthode retourne un objet contenant les valeurs ci-dessous :
    * @method traite_texte_type_harmony
    * @param  {String} texte    Le texte à traiter
    * @return {Object}
    *   * texte           Le texte restant
    *   * renversement    La marque de renversement trouvée
    *   * crochets        Le texte entre crochets trouvé
    *
    */
  traite_texte_type_harmony:function(texte)
  {
    var renv, crochets ;
    
    // Cherche les crochets
    res       = this.traite_crochets_in(texte)
    crochets  = res.crochets ;
    
    // Cherche un renversement (harmony et cadence)
    res   = this.traite_renversement_in(res.texte)
    renv  = res.renversement // toujours défini
    texte = res.texte
    
    // Traite le chiffrage dans le texte restant et les crochets
    texte     = this.traite_chiffrage_in(texte)
    if(crochets) crochets  = this.traite_chiffrage_in(crochets)
    
    // Traite les fausses lignes de "-"
    texte     = this.traite_fausse_ligne_in(texte)
    if(crochets) crochets  = this.traite_fausse_ligne_in(crochets)
    
    return {
      texte         : texte,
      renversement  : renv,
      crochets      : crochets
    }
  },
  /**
    * Remplace les marque de simples "-" en tiret semi-long qui créent
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
    var crochets ;
    // Un texte entre crochets
    if(found = texte.match(/\[([^\]]+)\]/))
    {
      crochets  = found[1]
      found[0]  = found[0].replace(/([\[\]\(\)\*\.\+\-])/,'\\$1')
      texte     = texte.replace(new RegExp(found[0]), '').trim()
    }
    return {texte:texte, crochets:crochets}
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
    // dlog("-> <Txt>.build")
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
    *
    * @method positionne
    */
  positionne:function()
  {
    var dpos = {top:this.top+"px", left:this.real_left+"px"}
    if(this.width) dpos.width = this.width+"px"
    this.obj.css(dpos)
  },
  /**
    * Ré-initialisation du texte après la définition de valeur qui peuvent
    * obliger à un recalcul
    * @method reset
    */
  reset:function()
  {
    delete this._texte
    delete this._top
    delete this._left
    delete this._width
  },
  
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
    set:function(t){this.raw_texte = t; this.reset()},
    get:function(){
      if(undefined == this._texte)
      {
        this._texte = function(t, type)
        {
          var res ;
          switch(type)
          {
          case harmony:
          case cadence:
            res = Txt.traite_texte_type_harmony(t)
            // res.crochets
            return '<div class="center inline">'+
                      '<div class="renversement">'+res.renversement+'</div>' +
                      res.texte +
                    '</div>'
          case chord:
            return Txt.traite_chiffrage_in(t)
          case modulation:
            res = Txt.traite_texte_type_harmony(t)
            return '<div class="mark_modulation">'+res.texte+'</div>' +
                    (res.crochets ? '<div class="text_alt_mod">'+res.crochets+'</div>' : "")
          }
          return t // par défaut
        }(this.raw_texte, this.type)
      }
      return this._texte
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
      this.reset()
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
    *
    * @property {Number} top
    */
  "top":{
    set:function(top){this._top = top; this.reset()},
    get:function(){
      if(undefined == this._top)
      {
        // On part toujours de la hauteur top de la portée du texte
        var top = this.owner.staff.top || Anim.current_staff.top
        switch(this.type)
        {
        case harmony:
        case cadence:
          top += Anim.prefs.harmony + Anim.prefs.offset_harmony
          break
        case chord:   
          top -= Anim.prefs.chord_mark + Anim.prefs.offset_chord_mark
          break
        case modulation:
          top -= Anim.prefs.modulation_y + Anim.prefs.offset_modulation_y
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
    * Retourne le décalage horizontal du texte
    * Notes
    * -----
    *   * Pour certains types, comme `harmony`, il doit être calculé pour
    *     pouvoir placer son bord droit au bout du possesseur.
    *     Mais cela ne peut être fait qu'une fois qu'on connait la taille du
    *     texte, donc c'est la méthode `positionne` qui s'en charge. c'est quand
    *     elle appelle this.left qu'on le calcule.
    *
    * @property {Number} left
    */
  "left":{
    set:function(left){this._left = left; this.reset()},
    get:function(){
      if(undefined == this._left)
      {
        this._left = this.owner.left
        switch(this.type)
        {
        case modulation:
          this._left += Anim.prefs.modulation_x
          break
        default:
        }
      }
      return this._left
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
      var left = this.left
      var w_box = this.obj.width()
      switch(this.type)
      {
      case harmony:
        // this._real_left = this.owner.center_x - parseInt(w_box/2, 10)
        // J'essaie de le placer comme une cadence
        this._real_left = left - w_box + 18
        break
      case cadence:
        // Pour un texte d'harmonie, le bord droit doit être aligné au possesseur,
        // à peine plus à droite.
        this._real_left = left - w_box + 4
        break
      case chord:
        // On doit le placer bien au center
        this._real_left = this.owner.center_x - parseInt(w_box/2, 10)
        break
      default:
        this._real_left = left - 10
      }
      return this._real_left
    }
  },
  
  /* ---------------------------------------------------------------------
   *  DOM  
   */
  /**
    * Return l'objet DOM du texte
    * @property {jQuerySet} obj
    */
  "obj":{
    get:function(){return $('div#'+this.id)}
  },
  /**
    * Return le code HTML pour le texte
    * @property {HTLMString} code_html
    */
  "code_html":{
    get:function(){
      var css = ['text']
      if(this.type) css.push(this.type)
      var style = []
      if(this.width) style.push("width:"+this.width+"px;")
      return '<div id="'+this.id+'" class="'+css.join(' ')+'" style="'+style.join('')+'">'+this.texte+'</div>'
    }
  }
})