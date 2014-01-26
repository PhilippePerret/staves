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
  
  // Dispatch des valeurs fournies (même si aucune)
  this.dispatch(params)
  
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
  last_id:0

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
    if(undefined == this.duree) params.duree = Anim.delai_for('show')
    else params.duree = this.duree
    this.animate({opacity:1}, params)
    this.hidden = false
  },
  
  /**
    * Positionne la boite de texte (mais fait + que ça, en la dimensionnant et
    * en réglant toutes les propriétés css définies — taille de police, etc.)
    * @method positionne
    */
  positionne:function()
  {
    this.obj_texte.css({
      'font-size'     : this.font_size+'pt',
      'font-family'   : this.font_family,
      'color'         : this.color || Anim.prefs.text_color
    })
    this.obj.css({
      width         : this.width+'px',
      height        : this.height+'px',
      top           : this.y+'px',
      left          : this.x+'px',
      padding       : this.padding+'px',
      'z-index'     : this.val_or_default('z')
    })
    this.obj_background.css({
      'background-color'  : this.background,
      'opacity'           : this.opacity
      // 'border'      : this.border
    })
    this.obj.css({height: this.height+'px', width:this.width+'px'})
  }
})

/* ---------------------------------------------------------------------
 *  MÉTHODES INTERNES (PROTECTED)
 *  
 */
$.extend(TBox.prototype,{
  /**
    * Construction de la boite de texte
    * @method build
    */
  build:function()
  {
    Anim.Dom.add(this)
    this.obj.draggable({
      stop:$.proxy(this.coordonnees, this)
    })
  },
  
  /**
    * Définit le background sous le texte. La méthode est utilisée par la
    * définission de la propriété UniversalBoxMethods `background`
    * Par défaut, la couleur de fond est la même que la couleur de police (oui,
    * étonnant, mais c'est parce que l'opacité est en action)
    * @method set_background
    */
  set_background:function(couleur)
  {
    this.obj_background.css('background-color', this._background || Anim.prefs.text_color)
  },
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
      if(undefined == this._font_family) this._font_family = Anim.prefs.tbox_font_family
      return this._font_family
    }
  },
  /**
    * Taille de caractère
    * @property {String} font_size
    */
  "font_size":{
    set:function(x){this._font_size = x},
    get:function(){
      if(undefined == this._font_size) this._font_size = Anim.prefs.tbox_font_size
      return this._font_size
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
      this._left = w
      this.set_css('left', w)
    },
    get:function(){
      if(undefined == this._left)
      { // On définit une valeur par défaut (centrée)
        this._left = parseInt((Anim.Dom.width - this.width) / 2, 10)
        this._left += this.offset_x
      }
      return this._left
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
      this.set_css('top', w)
    },
    get:function(){
      if(undefined == this._y)
      { // On définit une valeur par défaut (centrée)
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
      if(this.obj) this.obj.css({width:w+'px'})
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
      if(this.obj) this.obj.css({height:w+'px'})
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
    * Objet DOM contenant le texte
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