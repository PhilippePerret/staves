/**
  * @module Box.js
  */

/**
  * La méthode/commande BACKGROUND permet de faire un background dans l'animation
  * Noter qu'il peut y en avoir autant qu'on veut, pour des effets de fondu par
  * exemple.
  *
  * Notes
  * -----
  *   * La définition d'un fond définit automatiquement la couleur d'un texte
  *     qui serait ajouté (Anim.prefs.text_color).
  *
  * @method BACKGROUND
  * @for window
  */
window.BACKGROUND = function(params)
{
  if(undefined == params)   params = {}
  params.class = 'background'
  if(undefined == params.z) params.z = 0
  if(undefined == params.x) params.x = 0
  if(undefined == params.y) params.y = 0
  if(undefined == params.width)       params.width      = 0 + Anim.Dom.width
  if(undefined == params.height)      params.height     = 0 + Anim.Dom.height
  if(undefined == params.background)  params.background = 'black'
  var bgd = BOX(params)
  Anim.prefs.text_color = COLOR_TEXT_PER_BACKGROUND[bgd.background]
  return bgd
}
/**
  * @method BOX
  * @for window
  */
window.BOX = function(params)
{
  var box = new Box(params)
  return box.build()
}
/**
  * @class
  * @constructor
  */
window.Box = function(params)
{
  this.class  = 'box' // attention, pourra être remplacé par 'background'
  this.id     = 'box'+(++Box.last_id)
  
  /**
    * Position horizontale par défaut d'une boite
    * @property {Number} x_default
    */
  this.x_default = 10
  /**
    * Position verticale par défaut d'une boite
    * @property {Number} y_default
    */
  this.y_default = 10
  /**
    * Largeur par défaut de la boite
    * @property {Number} width_default
    */
  this.width_default = 100
  /**
    * Hauteur par défaut de la boite
    * @property {Number} height_default
    */
  this.height_default = 60
  /**
    * Couleur de fond par défaut d'une boite
    * @property {String} background_default
    */
  this.background_default = 'blue'
  
  // === Dispatch des paramètres ===
  this.dispatch(params)

  /**
    * Position du calque par défaut
    * @property {Number} z_default
    */
  this.z_default = this.class == 'background' ? 0 : 100
}

/* ---------------------------------------------------------------------
 *  MÉTHODES ET PROPRIÉTÉS DE CLASSE
 *  
 */
$.extend(Box,{
  /**
    * Dernier identifiant pour une box
    * @property {Number} last_id
    */
  last_id:0
})

/* ---------------------------------------------------------------------
 *  MÉTHODES ET PROPRIÉTÉS D'INSTANCES
 *  
 */
$.extend(true, Box.prototype, UNVERSAL_BOX_METHODS)
$.extend(Box.prototype,{
  /**
    * Construction de la boite
    * @method build
    */
  build:function()
  {
    Anim.Dom.add(this)
    return this
  }
  
})

Object.defineProperties(Box.prototype,{
  /**
    * DOM Objet (jQuerySet) de la boite
    * @property {jQuerySet} obj
    */
  "obj":{
    get:function(){
      if(undefined == this._obj)
      {
        this._obj = $('div#'+this.id)
        if(this._obj.length == 0) delete this._obj
      }
      return this._obj
    }
  },
  /**
    * Code HTML de la box
    * @property {HTMLString} code_html
    */
  "code_html":{
    get:function(){
      return '<div id="'+this.id+'" class="box"></div>'
    }
  }
  
  
})