/**
  * @module TBox.js
  */

/**
  * Commande pour créer une TBox
  * @method TBOX
  */
window.TBOX = function(texte, params)
{
  var tbox = new TBox(texte, params)
  tbox.build()
  return tbox
}

/**
  * @class TBox
  * @constructor
  * @param {String} texte   Le texte de la TBox
  * @param {Object|String} params Soit les paramètres, soit le `style` de la TBox.
  */
window.TBox = function(texte, params)
{
  /**
    * Class TBox
    * @property {String} class
    * @final
    */
  this.class = 'tbox'
  /**
    * Identifiant unique de la TBox
    * @property {String} id
    */
  this.id   = 'tbox'+(++TBox.last_id)
  /**
    * Texte de la boite
    * @proprety {String} texte
    */
  this.texte = texte
    
  /**
    * Décalage horizontal par rapport à la position
    * définie par les autres valeurs
    * @property {Number} offset_x
    * @default 0
    */
  this.offset_x = 0

  /**
    * Décalage vertical par rapport à la position
    * définie par les autres valeurs
    * @property {Number} offset_y
    * @default 0
    */
  this.offset_y = 0
  
  /**
    * Z-index par défaut
    * @property {Number} z_default
    */
  this.z_default = 100
  
  /**
    * Opacité du fond (se souvenir que c'est une autre boite qui le fait)
    * @property {Float} opacity
    * @default 0.05
    */
  this.opacity = 0.05
  
  /**
    * Couleur du fond translucide
    * @property {Constante|Couleur hexa RRVVBB} background
    * @default 'black'
    */
  this.background = 'black'
  
  /**
    * Style du texte (class CSS)
    * @property {String} style
    * @default null
    */
  this.style = null
  
  /**
    * Alignement du texte
    * @property {String} align
    * @default 'center'
    */
  this.align = 'center'
  
  // Si `params` est de type {String}, c'est le `style` de la TBox
  if('string'==typeof params) params = {style: params}
  
  // Dispatch des valeurs fournies (même si aucune)
  this.dispatch(params)
  
  /* Si la TBox possède un style, et que les propriétés n'ont pas été
   * définies explicitement, on prend les propriétés par défaut.
   * Par exemple, si `width` n'a pas été défini dans les paramètres et que
   * `style` est 'grand_titre', alors le `width` est mis à 60% et le `y` est
   * mis à 30%
   */
  if(this.style && undefined != TBox.STYLE_TO_PROPS[this.style])
  {
    var my = this
    L(TBox.STYLE_TO_PROPS[this.style]).each(function(prop, value){
      if(undefined == my['_'+prop])
      {
        dlog("[TBox] Propriété "+prop+" mis à "+value+ " pour "+this.id)
        my[prop] = value
      }
    })
  }
  
}

/* ---------------------------------------------------------------------
 *  MÉTHODES ET PROPRIÉTÉS DE CLASSE
 *  
 */
$.extend(TBox,{
  /**
    * Dernier identifiant utilisé pour une TBox
    * @property {Number} last_id
    * @default 0
    */
  last_id:0,
  
  /**
    * Constantes définissant des propriétés prédéfinies lorsque le
    * texte est d'un style particulier (paramètre `style` dans la définition
    * de la TBox)
    * @class STYLE_TO_PROPS
    * @static
    * @final
    */
  STYLE_TO_PROPS:{
    'grand_titre' : {width:'60%', x:'20%', y:'30%'},
    'titre'       : {width:'60%'},
    'small'       : {},
    'tiny'        : {},
    'copyright'   : {y:null, bottom:0, padding:10, width:'60%', x:'20%'}
  }

})

// Héritage des méthodes et propriétés universelles de boite
$.extend(true, TBox.prototype, UNVERSAL_BOX_METHODS)
Object.defineProperties(TBox.prototype, UNIVERSAL_BOX_PROPERTIES)

/* ---------------------------------------------------------------------
 *  MÉTHODES D'INSTANCE ANIMATIONS
 *  
 */
$.extend(TBox.prototype,{
  /**
    * Affiche le texte
    * La méthode surclasse la méthode `show` des méthodes universelles de boite
    * car l'opacité concerne le background, pas le div principal, or, la propriété
    * this.opacity d'une TBox est réglée pour le background.
    * @method show
    * @param {Object} params Paramètres optionnels
    */
  show:function(params)
  {
    if(undefined == params) params = {}
    params.duree = this.duree_set_or_default(params, 'show')
    this.animate({opacity:1}, params)
    this.hidden = false
    return this
  },
  
  /**
    * Masque la TBox
    * Surclasse la méthode universelle pour les mêmes raisons que `show` ci-dessus
    * @method hide
    * @param {Object} params  Paramètres optionnels
    * @return {TBox} Cette boite (pour chainage)
    */
  hide:function(params)
  {
    if(undefined == params) params = {}
    params.duree = this.duree_set_or_default(params, 'show')
    this.animate({opacity:0}, params)
    this.hidden = true
    return this
  },
  
  /**
    * Méthode qui modifie à la volée les données de la TBox
    * La méthode est propre aux TBox (surclasse la méthode universelle) car le traitement des
    * différents paramètres est spécial, une TBox contenant plusieurs éléments très différents (entre
    * la boite contenant le texte, la boite définissant le fond et la boite contenant l'ensemble des
    * éléments)
    *
    * @method set
    * @param {Object|String} params   Les paramètres optionnels ou simplement le texte à changer.
    */
  set:function(params)
  {
    var param_list, i, params_set, last_params_set ;
    if('string' == typeof params) params = {texte:params}
    params = define_wait_and_duree(params, this, 'show')
    
    params_set = {
      duree     : params.duree
      // Noter que dans `set_texte` et dans `set_background`, complete appelle la méthode
      // `set_tbox` (pour régler son height). Ce qui revient à faire ici :
      // complete  : $.proxy(this.set_tbox, this)
    }
    // Les données pour le dernier appel qui permettra de passer à l'étape suivante
    last_params_set = {
      duree     : params.duree,
      wait      : params.wait,
      complete  : params.complete
    }
    delete params.wait
    delete params.duree
    delete params.complete
    
    // On dispatche les autres paramètres, qui doivent correspondre à des propriétés 
    // de la TBox
    this.dispatch(params)
    var my = this
    L(['x', 'y', 'width', 'height']).each(function(k){
      if(undefined !== params['offset_'+k]) my[k] += params['offset_'+k]
    })
    
    // Les paramètres modificateurs du texte
    param_list = ['texte', 'color', 'width', 'offset_width', 'offset_height', 'align', 'font_size', 'font_family', 'style']
    if(object_has_key(params, param_list)) this.set_texte(params_set)
    
    // Les paramètres modificateurs du fond
    param_list = ['background', 'opacity']
    if(object_has_key(params, param_list)) this.set_background(params_set)
    
    // Les paramètres modificateurs de la boite générale
    // @note : elle doit être traitée en dernier puisque ses dimensions sont calculées en fonction
    // du texte et de son style. Et elle est appelée systématiquement puisque les paramètres du
    // texte (font-size, font-family, etc.) peuvent modifier l'aspect général. D'autre part, c'est
    // aussi elle qui gère le passage à l'étape suivante.

    // param_list = ['x', 'y', 'width', 'height', 'offset_x', 'offset_y', 'offset_width', 'offset_height', 'padding', 'z']
    // if(object_has_key(params, param_list))

    this.set_tbox(last_params_set)
    
    return this // pour le chainage 
  }
  
  
})

/* ---------------------------------------------------------------------
 *  MÉTHODES INTERNES (PROTECTED)
 *  
 */
$.extend(TBox.prototype,{
  /**
    * Positionne la boite de texte (mais fait + que ça, en la dimensionnant et
    * en réglant toutes les propriétés css définies — taille de police, etc.)
    * @method positionne
    */
  positionne:function()
  {
    this.first_set_tbox()
    this.set_texte()
    this.set_background()

    // Il est inutile d'appeler `set_tbox` car la méthode est appelée après chaque transformation
    // entraînée par `set_texte` et `set_background`.
    // this.set_tbox()
  },
  
  /**
    * Les premier réglage de la TBox
    * @method first_set_tbox
    */
  first_set_tbox:function()
  {
    var data_css = {
      width         : as_pixels(this.width),
      left          : as_pixels(this.x),
      top           : as_pixels(this.y, false),
      bottom        : as_pixels(this.bottom, false),
      padding       : as_pixels(this.padding)
    }
    this.obj.css(data_css)
  },
  /**
    * Règle la TBox, c'est-à-dire le conteneur général
    * @method set_tbox
    */
  set_tbox:function(params)
  {
    var data_css = {
      height        : as_pixels(this.height, false),
      'z-index'     : this.val_or_default('z'),
      width         : as_pixels(this.width),
      left          : as_pixels(this.x),
      top           : as_pixels(this.y, false),
      bottom        : as_pixels(this.bottom, false),
      padding       : as_pixels(this.padding)
    }
    Anim.Dom.anime([this.obj], data_css, params)
  },
  
  /**
    * Définit le texte (obj_texte) de la TBox
    * @method set_texte
    */
  set_texte:function(params)
  {
    var data_css = {
      'color'         : this.color || Anim.prefs.text_color,
      'width'         : as_pixels(this.width),
      'text-align'    : this.align
    }
    if(this.font_size)    data_css['font-size']   = with_unite(this.font_size, 'pt')
    if(this.font_family)  data_css['font-family'] = this.font_family
    
    this.obj_texte.html(this.texte)
    if(this.style && !this.obj_texte.hasClass(this.style)) this.obj_texte.addClass(this.style)
    Anim.Dom.anime([this.obj_texte], data_css, $.extend(params, {complete:$.proxy(this.set_tbox, this)}))
  },
  /**
    * Définit le background sous le texte. La méthode est utilisée par `positionne` mais aussi
    * par la définission de la propriété UniversalBoxMethods `background`
    * Par défaut, la couleur de fond est la même que la couleur de police (oui,
    * étonnant, mais c'est parce que l'opacité est en action)
    * @method set_background
    */
  set_background:function(couleur, params)
  {
    
    var data_css = {
      'background-color'  : this._background || Anim.prefs.text_color,
      'opacity'           : this.opacity
    }
    Anim.Dom.anime([this.obj_background], data_css, $.extend(params, {complete:$.proxy(this.set_tbox, this)}))
  }
})

/* ---------------------------------------------------------------------
 *  PROPRIÉTÉS CONFIGURABLES (STYLES)
 *  
 */
Object.defineProperties(TBox.prototype,{
  /**
    * Police de caractère
    * @property {String} font_family
    */
  "font_family":{
    set:function(x){this._font_family = x},
    get:function(){
      return this._font_family || Anim.prefs.tbox_font_family
    }
  },
  /**
    * Taille de caractère
    * @property {String} font_size
    */
  "font_size":{
    set:function(x){this._font_size = x},
    get:function(){
      return this._font_size || Anim.prefs.tbox_font_size
    }
  },
  /**
    * Padding de la boite
    * @property {String} padding
    */
  "padding":{
    set:function(x){this._padding = x},
    get:function(){
      if(undefined == this._padding) this._padding = Anim.prefs.tbox_padding
      return this._padding
    }
  },
  /**
    * Bordure du box
    * @property {String} border
    */
  "border":{
    set:function(x){this._border = x},
    get:function(){
      if(undefined == this._border) this._border = Anim.prefs.tbox_border
      return this._border
    }
  },
  /**
    * Décalage horizontal de la boite de texte. Celle fournie ou celle calculée
    * par défaut
    * @property {Number} left
    */
  "x":{
    set:function(w){
      this._x = w
    },
    get:function(){
      if(undefined === this._x)
      { // On définit une valeur par défaut (centrée)
        this._x = parseInt((Anim.Dom.width - this.width) / 2, 10)
        this._x += this.offset_x
      }
      return this._x
    }
  },
  /**
    * Décalage vertical de la boite de texte. Celle fournie ou celle calculée
    * par défaut
    * @property {Number} top
    */
  "y":{
    set:function(w){
      this._y = w
    },
    get:function(){
      if(undefined === this._y)
      { // On définit une valeur par défaut (centrée verticalement)
        this._y = parseInt((Anim.Dom.height - this.height) / 2 , 10)
        this._y += this.offset_y
      }
      return this._y
    }
  },
  
  /**
    * Largeur de la boite de texte. Celle fournie ou celle calculée par défaut
    * @property {Number} width
    */
  "width":{
    set:function(w){
      this._width = w
    },
    get:function(){
      if(undefined == this._width)
      { // On définit une valeur par défaut
        this._width = parseInt(Anim.Dom.width / 3, 10)
      }
      return this._width
    }
  },
  /**
    * Hauteur de la boite de texte. Celle fournie ou celle calculée par défaut
    * @property {Number} width
    */
  "height":{
    set:function(w){
      this._height = w
    },
    get:function(){
      if(undefined == this.obj_texte) return null
      return UI.exact_height_of(this.obj_texte)
    }
  }
  
})
/* ---------------------------------------------------------------------
 *  PROPRIÉTÉS PROTECTED
 *  
 */
Object.defineProperties(TBox.prototype,{
  /**
    * Objet DOM contenant le texte et seulement le texte
    * @property {jQuerySet} obj_texte
    */
  "obj_texte":{get:function(){return $('div#'+this.id+'-text')}},
  /**
    * Objet DOM du div du background sous le texte
    * @property {jQuerySet} obj_background
    */
  "obj_background":{get:function(){return $('div#'+this.id+'-background')}},
  
  /**
    * Texte de la boite
    * @property {String} texte
    */
  "texte":{
    set:function(texte)
    {
      this._texte = texte
      if(this.obj) this.obj_texte.html(texte)
    },
    get:function(){return this._texte || ""}
  },
  
  /**
    * Code HTML de la tbox
    * @property {HTMLString} code_html
    */
  "code_html":{
    get:function(){
      return  '<div id="'+this.id+'" class="tbox" style="opacity:0;">'+
                '<div id="'+this.id+'-background" class="tbox_background"></div>' +
                '<div id="'+this.id+'-text" class="tbox_content">'+this.texte+'</div>'+
              '</div>'
    }
  }
  
})