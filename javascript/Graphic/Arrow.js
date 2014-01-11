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
    * Le possesseur de la flèche.
    * Voir par exemple la note : elle définit une flèche avec :
    *   maNote.arrow()
    * Ensuite, pour pouvoir appeler des méthodes par :
    *   maNote.arrow.<method>(<paramètres>)
    * … maNote a mis son _arrow à l'instance Arrow, et a ajouté les
    * méthode Arrow ci-dessous à sa méthode maNote.arrow.
    * Mais si une flèche est créée sans être associée à un objet, elle doit
    * pouvoir travailler de la même façon, d'où la définition ci-dessous.
    * @property {Object} owner
    */
  this.owner = {_arrow:this}
  
  ObjetClass.call(this, params)
}
Arrow.prototype = Object.create( ObjetClass.prototype )
Arrow.prototype.constructor = Arrow

ARROW_METHODS = {
  owner: null,
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
      this.owner._arrow.obj[method](params)  
    }
    else
    {
      this.owner._arrow.obj.animate(
        params, Anim.delai_for('transform'), complete || NEXT_STEP
      )
    }
    
  },
  /**
    * Déplacer la flèche
    * @method move
    * @param {Object} params Paramètres du déplacement
    *   @param {Number} params.x    Déplacement  horizontal (en pixels)
    *   @param {Number} params.y    Déplacement vertical (en pixels)
    */
  move:function(params)
  {
    var pos   = this.owner._arrow.obj.position()
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
    * @method width
    * @param  {Number} px La nouvelle taille en pixels
    */
  size:function(px)
  {
    var h = this.owner._arrow.obj.height()
    this.modify('animate', {width:px+"px", height:h+"px"})
  },
  /**
    * Détruire la flèche
    * @method remove
    */
  remove:function(){this.owner._arrow.remove()}
}

$.extend(Arrow.prototype, ARROW_METHODS)

Object.defineProperties(Arrow.prototype, {
  /**
    * Objet DOM de la flèche s'il est construit
    * @property {jQuerySet} obj
    * @default NULL
    */
  "obj":{
    get:function(){
      if(undefined == this._obj)
      {
        this._obj = $('img#'+this.id)
        if(this._obj.length == 0) this._obj = null
      }
      return this._obj
    }
  },
  /**
    * Source (src) de la flèche en fonction de sa couleur
    * @property {String} src
    */
  "src":{
    get:function(){
      return "../lib/img/divers/arrow/"+this.color+".png"
    }
  },
  
  /**
    * La taille de la flèche
    * Notes
    * -----
    *   * Si la propriété est re-définit et que l'objet existe, on change sa taille.
    * @property {Number} width
    */
  "width":{
    set:function(w){
      this._width = w
      if(this.obj) this.obj.css('width', w+'px')
    },
    get:function(){
      if(!this._width) this._width == this.DEFAULT_WIDTH
      return this._width
    }
  },
  /**
    * Retourne le code HTML de la flèche
    * @property {String} code_html
    */
  "code_html":{
    get:function(){
      return '<img id="'+this.id+'" class="arrow" src="'+this.src+'" style="'+this.style+'" />'
    }
  },
  /**
    * Attribut 'style' de la balise HTML de la flèche
    * @property {String} style
    */
  "style":{
    get:function(){
      var h = this.height || 15
      var w = this.width
      var a = this.angle
      return "width:"+w+"px;height:"+this.height+"px;transform: rotate("+a+"deg); transform-origin: 0% 50% 0px;"
    }
  },
  /**
    * Décalage horizontal de la flèche (par défaut le décalage courant)
    * @property {Number} left
    */
  "left":
  {
    get:function(){return this._left || Anim.current_x},
    set:function(left){this._left = left}
  },
  /**
    * Décalage vertical de la flèche (par défaut la hauteur de la portée)
    * @property {Number} top
    */
  "top":{
    get:function(){return this._top || Anim.current_staff.top},
    set:function(top){this._top = top}
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
      if(this.obj) this.obj[0].src = this.src
    },
    get:function(){
      return this._color || 'blue'
    }
  }
})
