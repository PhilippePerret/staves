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
    *   * L'étape suivante doit être appelée par l'affichage du texte (Txt::show)
    *
    * @method write
    * @param  {String} texte Le texte à écrire
    * @param  {Object} params Les paramètres optionnels
    */
  write:function(texte, params)
  {
    // dlog("-> <Note>.write")
    if(undefined == params) params = {}
    params.texte  = texte
    this.texte    = TXT(this, params)
    this.texte.build()
  },
  /**
    * Raccourci pour écrire un texte d'harmony
    * @method harmony
    * @param  {String} texte  Le texte à écrire
    * @param  {Object} params   Paramètres optionnels
    */
  harmony:function(texte, params)
  {
    if(undefined == params) params = {}
    params.type = harmony
    this.write(texte, params)
  },
  /**
    * Raccourci pour écrire un texte de type cadence
    * @method cadence
    * @param  {String} texte    Le texte à écrire
    * @param  {Object} params   Paramètres optionnels
    */
  cadence:function(texte, params)
  {
    if(undefined == params) params = {}
    params.type = cadence
    this.write(texte, params)
  },
  /**
    * Raccourci pour écrire un texte de type 'chord' (un accord placé au-dessus
    * de la portée et au-dessus de l'élément porteur)
    * @method chord_mark
    * @param  {String} accord   L'accord à marquer
    * @param  {Object} params   Les paramètres optionnels
    */
  chord_mark:function(accord, params)
  {
    if(undefined == params) params = {}
    params.type = chord
    this.write(accord, params)
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
        Anim.transition.show,
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
  }
})

Object.defineProperties(Txt.prototype,{
  /* ---------------------------------------------------------------------
   *  PROPERTIES
   */
  /**
    * Le texte 
    * Notes
    *   * Suivant le type de l'instance (`type`), il peut être transformé
    */
  "texte":{
    set:function(t){this.raw_texte = t; this.reset()},
    get:function(){
      if(undefined == this._texte)
      {
        this._texte = function(t, type)
        {
          switch(type)
          {
          case harmony:
          case cadence:
            // Un texte d'harmonie peut se terminer par des "*" qui 
            // définissent le renversement
            if(found = t.match(/([\*•]+)$/))
            {
              var renv = found[1].replace(/\*/g, '•')
              var renv_len = renv.length
              if(renv_len == 2) renv = "&nbsp;"+renv // pour bon alignement
              t = t.substring(0, t.length - renv_len)
              return '<div class="center inline">'+
                        '<div class="renversement">'+renv+'</div>' +
                        t +
                      '</div>'
            }
            return t
          case chord:
            return t
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
          top += 60; break;
        case chord:   top -= 40; break;
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
      }
      return this._left
    }
  },
  "real_left":{
    get:function()
    {
      var left = this.left
      switch(this.type)
      {
      case harmony:
        var w_box = this.obj.width()
        this._real_left = left - w_box + 7
        break
      case cadence:
        // Pour un texte d'harmonie, le bord droit doit être aligné au possesseur,
        // à peine plus à droite.
        var w_box = this.obj.width()
        this._real_left = left - w_box + 4
        break
      case chord:
        // On doit le placer bien au center
        var w_box = this.obj.width()
        dlog("center x de "+this.owner.id+":"+this.owner.center_x)
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