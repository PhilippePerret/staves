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
    * Indicateur de la construction de la boite
    * @property {Boolean} built
    * @default false
    */
  this.built = false
  
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
    * Marque de boite masquée
    * @property {Boolean} hidden
    * @default false
    */
  this.hidden = false
  
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
  
  
  if(params)
  {
    var my = this
    L(params).each(function(k,v){ my[k] = v })
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
  last_id:0

})



/* ---------------------------------------------------------------------
 *  MÉTHODES D'INSTANCE ANIMATIONS
 *  
 */
$.extend(TBox.prototype,{
  /**
    * Anime la boite de texte
    * @method animate
    * @param {Object} data Les données d'animation (comme jQUery.animate)
    * @param {Object} params    Paramètres optionnels
    *   @param {Number}         params.time     La durée de l'animation
    *   @param {Function|Fals}  params.complete La méthode pour poursuivre
    *
    */
  animate:function(data, params)
  {
    params = define_complete(params)
    this.obj.animate(data, {
      duration : params.time || Anim.delai_for('transform'),
      complete :params.complete
    })
  },
  
  /**
    * Afficher la boite de texte
    * @method show
    * @param  {Object} params   Les paramètres optionnels
    *   @param  {Function|False} params.complete    Méthode pour suivre. False si aucune méthode ne doit suivre. Par défaut : NEXT_STEP
    */
  show:function(params)
  {
    this.animate({opacity:1}, params)
    this.hidden = false
  },

  /**
    * Masquer la boite de texte
    * @method hide
    * @param  {Object} params   Les paramètres optionnels
    *   @param  {Function|False} params.complete    Méthode pour suivre. False si aucune méthode ne doit suivre. Par défaut : NEXT_STEP
    */
  hide:function(params)
  {
    this.animate({opacity:0}, params)
    this.hidden = true
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
      'font-family'   : this.font_family
    })
    this.obj.css({
      width         : this.width+'px',
      height        : this.height+'px',
      top           : this.top+'px',
      left          : this.left+'px',
      padding       : this.padding+'px'
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
    this.built = true
    Anim.Dom.add(this)
    this.obj.draggable({
      stop:$.proxy(this.show_coordonnees, this)
    })
  },
  
  /**
    * Méthode qui affiche (feedback) les coordonnées de la boite de texte
    * après son déplacement
    * @method show_coordonnees
    */
  show_coordonnees:function(evt, ui)
  {
    var pos = this.obj.position()
    UI.feedback("Coordonnées de la TBox : left: "+pos.left+" / top: "+pos.top)
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
    * Background du box
    * @property {String} background
    */
  "background":{
    set:function(x){this._background = x},
    get:function(){
      if(undefined == this._background) this._background = Anim.prefs.tbox_background
      return this._background
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
  "left":{
    set:function(w){
      this._left = w
      if(this.obj) this.obj.css({left:w+'px'})
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
  "top":{
    set:function(w){
      this._top = w
      if(this.obj) this.obj.css({top:w+'px'})
    },
    get:function(){
      if(undefined == this._top)
      { // On définit une valeur par défaut (centrée)
        this._top = parseInt((Anim.Dom.height - this.height) / 2, 10)
        this._top += this.offset_y
      }
      return this._top
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
    * Objet DOM de la boite de texte (mais retourne NULL si la boite n'est pas construite)
    * @property {jQuerySet} obj
    */
  "obj":{
    get:function(){
      if(!this.built) return null
      if(undefined == this._obj)
      {
        var o = $('div#'+this.id)
        if(o.length == 0) return null
        this._obj = o
      }
      return this._obj
    }
  },
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
      return  '<div id="'+this.id+'" class="tbox" style="opacity:'+(this.hidden ? '0' : '1')+';">'+
                '<div id="'+this.id+'-background" class="tbox_background"></div>' +
                '<div id="'+this.id+'-text" class="tbox_content">'+this.texte+'</div>'+
              '</div>'
    }
  }
  
})