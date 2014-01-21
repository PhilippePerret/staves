/**
  * @module Arrow.js
  */

/**
  * Ajoute une flèche indépendante des objets
  * @method ARROW
  * @param  {Object} params   Les paramètres pour la flèche
  *   @param  {Number} params.left    Le décalage horizontal
  *   @param  {Number} params.top     Le décalage vertical
  *   @param  {String} params.color   La couleur de la flèche
  *   @param  {Number} params.angle   L'angle de la flèche
  *   @param  {Number} params.width   La longueur de la flèche
  */
window.ARROW = function(params)
{
  var arrow = new Arrow(params)
  Anim.Dom.add(arrow)
  return arrow
}

/**
  * Modèle Arrow, pour la gestion des flèches
  * Notes
  * -----
  *   * Elle hérite de la class ObjetClass
  *
  * @class Arrow
  * @constructor
  */
window.Arrow = function(params)
{
  /**
    * Classe d'une flèche
    * @property {String} class
    * @static
    * @final
    */
  this.class = 'arrow'
  
  /**
    * @property {String} id   Identifiant absolu du cercle
    */
  this.id = 'arr'+(new Date()).getTime()

  /**
    * Le possesseur de la flèche, en général une note
    *
    * @property {Object} owner
    */
  this.owner = null
  
  /**
    * Taille par défaut de la flèche
    * @property {Number} DEFAULT_WIDTH
    * @static
    * @final
    */
  this.DEFAULT_WIDTH = 30
    
  /**
    * Couleur de la flèche
    * Notes
    * -----
    *   * On peut l'obtenir et la redéfinir avec la propriété complexe `color`
    *
    * @property {String} _color   La couleur du cercle
    */
  this._color = 'black'
  
  /**
    * Angle de la flèche
    * On peut obtenir et définir la rotation (en la changeant à l'écran) en
    * appelant la propriété complexe `rotation`
    * @property {Number} _rotation
    */
  this._angle = 0
  
  /**
    * Width de la flèche
    * On peut obtenir et définir la taille (à l'écran) en appelant la 
    * propriété complexe `width`.
    */
  this._width = undefined
  
  ObjetClass.call(this, params)
}
Arrow.prototype = Object.create( ObjetClass.prototype )
Arrow.prototype.constructor = Arrow

ARROW_METHODS = {
  /**
    * Méthode générale pour modifier la flèche (appelée par les autres
    * méthodes)
    * @method modify
    * @param {String} method  La méthode de mofication (p.e. 'css')
    * @param {Object} params  Les paramètres de la modification
    * @param {Function} complete  La méthode pour suivre
    */
  modify:function(method, params, complete)
  {
    if(method != 'animate')
    {
      this.obj[method](params)  
    }
    else
    {
      var suf_objs = []
      if(undefined == params.div || params.div)   suf_objs.push('div')
      if(params.head)   suf_objs.push('head')
      if(params.queue)  suf_objs.push('queue')
      var my = this
      L(suf_objs).each(function(suf){
        my['obj_'+suf].animate(
          params, Anim.delai_for('transform'), complete || NEXT_STEP
        )
      })
    }
    
  },
  /**
    * Déplacer la flèche
    * @method move
    * @param {Object} params Paramètres du déplacement (ou un des attributs ci-dessous)
    *   @param {Number} params.x    Déplacement  horizontal (en pixels)
    *   @param {Number} params.y    Déplacement vertical (en pixels)
    * @param {Number} value   Si +params+ est une propriété ('x' ou 'y'), +value+ est sa valeur
    */
  move:function(params, value)
  {
    params = parametize(params, value)
    var pos   = this.obj.position()
    var data  = {}
    if(undefined != params.x) data.left = (pos.left + params.x) + "px"
    if(undefined != params.y) data.top  = (pos.top + params.y) + "px"
    this.modify('animate', data)
  },
  /**
    * Fait pivoter la flèche de l'angle +angle+ 
    * @method rotate
    * @param  {Number} angle L'angle de rotation (positif si sens non trigo)
    */
  rotate:function(angle)
  {
    this.modify('rotate', {
      center:["0%","50%"], 
      angle:0, 
      animateTo:angle,
      callback:NEXT_STEP
    })
  },
  /**
    * Change la taille de la flèche
    * Notes
    *   * Changer sa taille consiste à allonger la queue
    * @method width
    * @param  {Number} px La nouvelle taille en pixels
    */
  size:function(px)
  {
    var h = this.obj.height()
    this.modify('animate', {width:px+"px", height:h+"px", queue:true, div:false})
  },
  /**
    * Modifie la couleur de la flèche
    * @method color
    * @param {String} couleur   La nouvelle couleur ('green', 'black', etc. — ou constante)
    */
  colorize:function(couleur)
  {
    this.color = couleur // that all! :-)
    NEXT_STEP()
  },
  
  /**
    * Positionne
    * Après sa construction, on positionne la flèche, mais ça définit plus que sa
    * position (couleur, angle, longueur)
    * @method positionne
    */
  positionne:function()
  {
    this.top    = this._top
    this.left   = this._left
    this.width  = this._width
    this.color  = this._color
    this.angle  = this._angle
  }
}

$.extend(true, Arrow.prototype, ARROW_METHODS)

Object.defineProperties(Arrow.prototype, {
  /**
    * Objet DOM de la flèche s'il est construit (un DIV contenant les deux images
    * de la queue et de la tête)
    * @property {jQuerySet} obj
    * @default NULL
    */
  "obj":{
    get:function(){
      if(undefined == this._obj)
      {
        this._obj = $('div#'+this.id)
        if(this._obj.length == 0) this._obj = null
      }
      return this._obj
    }
  },
  /**
    * Alias de `obj` pour certaines méthodes (cf. `modify`)
    * @property {jQuerySet} obj_div
    */
  "obj_div":{get:function(){return this.obj}},
  "obj_head":{
    get:function(){
      if(!this.obj) return null
      if(undefined == this._obj_head) this._obj_head = $('img#'+this.id+'-head')
      return this._obj_head
    }
  },
  "obj_queue":{
    get:function(){
      if(!this.obj) return null
      if(undefined == this._obj_queue) this._obj_queue = $('img#'+this.id+'-queue')
      return this._obj_queue
    }
  },
  /**
    * Source (src) de la tête de la flèche en fonction de sa couleur
    * @property {String} src
    */
  "src_head":{
    get:function(){
      return "../lib/img/divers/arrow/head-"+this.color+".png"
    }
  },
  /**
    * Source (src) de la queue de la flèche en fonction de sa couleur
    * @property {String} src
    */
  "src_queue":{
    get:function(){
      return "../lib/img/divers/arrow/queue-"+this.color+".png"
    }
  },
  
  /**
    * La taille de la flèche
    * Notes
    * -----
    *   * Si la propriété est re-définit et que l'objet existe, on change sa taille.
    *   * Changer la taille consiste à changer deux choses : la taille du div
    *     et la taille de la queue de flèche
    * @property {Number} width
    */
  "width":{
    set:function(w){
      this._width = w
      if(this.obj)
      {
        this.obj.css('width', w+'px')
        this.obj_queue.css('width', (w - UI.css2number(this.obj_head.width()))+'px')
      } 
    },
    get:function(){
      if(!this._width) this._width == this.DEFAULT_WIDTH
      return this._width
    }
  },
  /**
    * Retourne le code HTML de la flèche.
    * Note
    *   * La flèche est constitué d'un div qui contient la queue et la tête de la
    *     la flèche qui permettent de la changer de taille sans changer son aspect.
    * @property {String} code_html
    */
  "code_html":{
    get:function(){
      return  '<div id="'+this.id+'" style="'+this.style+'" class="arrow">' +
                '<img id="'+this.id+'-queue" class="arrow-queue" src="'+this.src_queue+'" style="'+this.style_queue+'" />'+
                '<img id="'+this.id+'-head" class="arrow-head" src="'+this.src_head+'" style="'+this.style_head+'" />'+
              '</div>'
    }
  },
  /**
    * Attribut 'style' de la balise DIV HTML de la flèche
    * @property {String} style
    */
  "style":{
    get:function(){
      var h = this.height || 15
      var w = this.width
      var a = this.angle
      return "transform: rotate("+a+"deg); transform-origin: 0% 50% 0px;"
    }
  },
  /**
    * Attribut 'style' de la tête de la flèche
    * @property {String} style_head
    */
  "style_head":{
    get:function(){return ""}
  },
  /**
    * Attribut 'style' de la queue de la flèche
    * @property {String} style_head
    */
  "style_queue":{
    get:function(){return ""}
  },
  /**
    * Décalage horizontal de la flèche (par défaut le décalage courant)
    * @property {Number} left
    */
  "left":
  {
    get:function(){return this._left || Anim.current_x},
    set:function(left){
      this._left = left
      if(this.obj) this.obj.css('left', left+'px')
    }
  },
  /**
    * Décalage vertical de la flèche
    * @property {Number} top
    */
  "top":{
    get:function(){return this._top || Anim.current_staff.top},
    set:function(top){
      this._top = top
      if(this.obj) this.obj.css('top', this._top+'px')
    }
  },
  /**
    * Angle de la flèche
    * @property {Number} angle
    */
  "angle":{
    set:function(angle){
      this._angle = angle
    },
    get:function(){
      return this._angle || 0
    }
  },
  /**
    * Couleur de la flèche
    * Note
    * ----
    *   * La définition de cette valeur modifie le src de l'objet s'il est
    *     construit.
    *   * La couleur est blue par défaut
    *
    * @property {String} color
    * @default 'blue'
    */
  "color":{
    set:function(couleur){
      this._color = couleur
      if(this.obj)
      {
        this.obj_head[0].src  = this.src_head
        this.obj_queue[0].src = this.src_queue
      }
    },
    get:function(){
      return this._color || 'blue'
    }
  }
})
