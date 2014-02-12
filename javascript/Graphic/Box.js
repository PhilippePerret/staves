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
  * @param {String|Object}  color    Soit la couleur, soit les paramètres
  * @param {Object}         params   Les paramètres ou undefined
  */
window.BACKGROUND = function(color, params)
{
  if('string' == typeof color) 
  {
    if(undefined == params) params = {}
    params.background = color
  }
  else
  {
    params = color || {}
    if(undefined == params.background) params.background = 'black'
  }
  params.class = 'background'
  params.type  = 'plain'
  if(undefined == params.z)       params.z = 0
  if(undefined == params.x)       params.x = 0
  if(undefined == params.y)       params.y = 0
  if(undefined == params.width)   params.width      = 0 + Anim.Dom.width
  if(undefined == params.height)  params.height     = 0 + Anim.Dom.height
  var bgd = BOX(params)
  /*
   *  Si la couleur de background correspond à une valeur connue, on modifie
   *  la couleur par défaut du texte.
   */
  ctext = COLOR_TEXT_PER_BACKGROUND[bgd.background]
  if(undefined != ctext) Anim.prefs.text_color = ctext
  
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
  * @class Box
  * @constructor
  */
window.Box = function(params)
{
  this.class  = 'box' // attention, pourra être remplacé par 'background'
  this.id     = 'box'+(++Box.last_id)
  
  /**
    * Type de la boite
    * Les types sont 'plain' boite pleine, 'cadre' un cadre, 'segment' un segment
    * en "U"
    * @property {String} type
    * @default 'plain'
    */
  this.type = 'plain'
  
  /**
    * Pour une box de type segment ("U"), la direction vers laquelle pointent les
    * branche. Par défaut, le haut ('up').
    * @property {String} dir
    * @default ""
    */
  this.dir = null
  
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
  this.background_default = '#0000FF'
  /**
    * Couleur de la border (pour le fond, c'est la propriété `background`)
    * @property {String} color
    * @default 'black'
    */
  this.color = '#000000'
  
  /**
    * Rotation de la boite (null par défaut)
    * @property {Number} rotation
    */
  this.rotation = null
  
  // === Dispatch des paramètres ===
  this.dispatch(params)

  /*
   *  Valeurs par défaut pour un type 'segment' : 
   *    - 'dir' à 'up'
   *    - Dimension fourche à 10
   *  
   */
  if(this.type == 'segment')
  {
    if(!this.dir) this.dir = "up"
    
    if((this.dir == up || this.dir == down) && !this.height)        this.height = 10
    else if((this.dir == left || this.dir == right) && !this.width) this.width  = 10
  } 
  
  /**
    * La largeur du bord, pour une box de type différente de 'plain'
    * @property {Number} border
    */
  this.border = this.border ||  function(type) {
                                  switch(type)
                                  {
                                  case 'plain'    : return 0
                                  case 'cadre'    : return 3
                                  case 'segment'  : return 1
                                  }
                                }(this.type)
  
  /**
    * Position du calque par défaut
    * @property {Number} z_default
    */
  this.z_default = (this.class == 'background') ? 0 : 100
}

// Héritages
$.extend(Box.prototype, UNVERSAL_BOX_METHODS)
Object.defineProperties(Box.prototype, UNIVERSAL_BOX_PROPERTIES)

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
$.extend(Box.prototype,{

})

Object.defineProperties(Box.prototype,{
  /**
    * Code HTML de la box
    * @property {HTMLString} code_html
    */
  "code_html":{
    get:function(){
      return '<div id="'+this.id+'" class="box '+this.type+'" style="opacity:0;"></div>'
    }
  }
  
  
})