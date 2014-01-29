/**
  * @module Arrow.js
  */

/**
  * Ajoute une flèche indépendante des objets
  * @method ARROW
  * @param  {Object} params   Les paramètres pour la flèche
  *   @param  {Number} params.x    Le décalage horizontal
  *   @param  {Number} params.y     Le décalage vertical
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
    * @property {Number} _width
    */
  this._width = undefined
  
  /**
    * Décalage horizontal de la flèche par rapport à sa position naturelle
    * @property {Number} offset_x
    * @default 0
    */
  this.offset_x = 0
  
  /**
    * Décalage vertical de la flèche par rapport à sa position naturelle
    * @property {Number} offset_y
    * @default 0
    */
  this.offset_y = 0
  
  ObjetClass.call(this, params)
}
Arrow.prototype = Object.create( ObjetClass.prototype )
Arrow.prototype.constructor = Arrow

ARROW_METHODS = {
  /**
    * Méthode générale pour modifier la flèche (appelée par les autres
    * méthodes)
    * @method modify
    * @param {String}   method    La méthode de mofication (p.e. 'css')
    * @param {Object}   data      Les paramètres CSS de la modification + les éléments à traiter
    * @param {Object}   params
    *   @param {Boolean}  params.div        Si true, traitera `this.obj_div`
    *   @param {Boolean}  params.head       Si true, traitera `this.obj_head`
    *   @param {Boolean}  params.queue      Si true, traitera `this.obj_queue`
    *   @param {Function} params.complete   La méthode pour suivre (NEXT_STEP par défaut)
    *   @param {Float}    params.duree      La durée de l'animation
    *   @param {Boolean|Number} params.wait Le paramètre d'attente
    */
  modify:function(method, data, params)
  {
    if(method != 'animate')
    {
      this.obj[method](data)  
    }
    else
    {
      var objets = []
      if(undefined == params.div) params.div = true
      L(['div', 'head', 'queue']).each(function(suffix){
        if(params[suffix])
        {
          objets.push('obj_'+suffix)
          delete params[suffix]
        }
      })
      Anim.Dom.anime(objets, data, params)
    }
  },
  /**
    * Déplacer la flèche
    * @method move
    * @param {Object} params Paramètres du déplacement (ou un des attributs ci-dessous)
    *   @param {Number} data.x    Déplacement  horizontal (en pixels)
    *   @param {Number} data.y    Déplacement vertical (en pixels)
    * @param {Number} value   Si +params+ est une propriété ('x' ou 'y'), +value+ est sa valeur
    *                         Sinon, ça peut être l'objet `params` ci-dessous
    * @param {Object} params  Les paramètres optionnels
    *   @param {Float}          params.duree  La durée que doit prendre la transformation
    *   @param {Boolean|Number} params.wait   Le paramètre d'attente
    */
  move:function(data, value, params)
  {
    if('object' == typeof data)
    {
      if('object' == typeof value) params = value
    }
    else
    {
      data = parametize(data, value)
      if(undefined == params) params = {}
    }
    if(undefined == params.duree) params.duree = Anim.delai_for('move')
    var pos   = this.obj.position()
    if(undefined != data.x) data.x = (pos.left + data.x) + "px"
    if(undefined != data.y) data.y = (pos.top  + data.y) + "px"
    this.modify('animate', data, params)
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
    * @param  {Number}  px La nouvelle taille en pixels
    * @param  {Object}  params  Paramètres optionnels (comme `duree` ou `wait`)
    */
  size:function(px, params)
  {
    var h = this.obj.height()
    if(undefined == params) params = {}
    $.extend(params, {queue:true, div:false})
    this.modify('animate', {width:px+"px", height:h+"px"}, params)
  },
  /**
    * Modifie la couleur de la flèche
    * @method color
    * @param {String} couleur   La nouvelle couleur ('green', 'black', etc. — ou constante)
    */
  colorize:function(couleur)
  {
    this.color = couleur
    NEXT_STEP(0)
  },
  
  /**
    * Positionne
    * Après sa construction, on positionne la flèche, mais ça définit plus que sa
    * position (couleur, angle, longueur)
    * @method positionne
    */
  positionne:function()
  {
    this.obj.css({left: this.real_x+'px', top: this.real_y+'px'})
    this.width  = this._width
    this.color  = this._color
    this.angle  = this._angle
  },
  /**
    * Méthode qui calcule la vraie position de la flèche (_real_y et _real_x)
    * en fonction du possesseur et de l'angle à donner.
    * @method calcule_real_x_y
    */
  calcule_real_x_y:function()
  {
    var realx = parseInt(this.x, 10), 
        realy = parseInt(this.y, 10), 
        angle, angle_tri, angle_rad, sin, cos, 
        offx = 0, offy = 0,
        rayon = 10,
        ajout_around = 0,
        rectif_x = 0,
        rectif_y = 0 ;

    // Valeur si la flèche est portée par un owner
    if(this.owner)
    {
      // Centre absolu du porteur
      realx = parseInt(this.owner.center_x, 10)
      realy  = parseInt(this.owner.center_y, 10)
      // Le rayon d'après la largeur et la hauteur de l'objet porteur (if any)
      rayon = parseInt(Math.max(this.owner.width, this.owner.height) / 2, 10)
      // L'objet est-il entouré ? Il faut alors ajouter un peu de marge
      if(this.owner.surrounded) ajout_around = 4
     }
    
    // Valeur du rayon (qu'on augmente toujours un peu)
    rayon += ajout_around + 4
    
    // L'angle en valeur toujours positive, trigonométrique et en radian
    // pour calculer sinus et cosinus.
    angle = parseInt(this.angle,10)
    if (angle < 0) angle = 360 + angle
    angle_tri = 360 - (angle % 360)
    angle_rad = Math.radians(angle_tri)
    sin   = Math.sin(angle_rad)
    cos   = Math.cos(angle_rad)
    if(angle != 90 && angle != 270) offx = parseInt(rayon * cos, 10)
    if(angle != 0  && angle != 180) offy = parseInt(rayon * sin, 10)
    
    realx += offx
    realy  -= offy
    
    // dlog({
    //   angle: angle, angle_tri:angle_tri, rayon:rayon, offx:offx, offy:offy, realx:realx, realy:realy
    // })

    
    // Quelques petites rectifications en fonction du possesseur
    if(this.owner)
    {
      switch(this.owner.class)
      {
      case 'note':
        if(angle < 180) rectif_x = 3
        break
      case 'chord':
        rectif_y = this.owner.position_fleche_per_angle(angle)
        break
      }
    }

    // On ajoute finalement le décalage horizontal et vertical (if any)
    // et les petites rectifications suivant le possesseur
    realy  += rectif_y + ((angle >= 0 && angle <= 180) ? this.offset_y : - this.offset_y) ;
    realx += rectif_x + this.offset_x
    // On dispatche les valeurs
    this._real_x = realx
    this._real_y  = realy
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
    * La vraie position gauche de la flèche, en fonction de son angle et
    * d'un éventuel `offset_x` défini.
    * @property {Number} real_x
    */
  "real_x":{
    get:function(){
      if(undefined == this._real_x) this.calcule_real_x_y()
      return this._real_x
    }
  },
  "real_y":{
    get:function(){
      if(undefined == this._real_y) this.calcule_real_x_y()
      return this._real_y
    }
  },
  /**
    * Position horizontal de la flèche
    * Attention, elle peut être très différent de la position réelle de la 
    * flèche après son calcul selon l'angle.
    * @property {Number} x
    */
  "x":
  {
    get:function(){return this._x || Anim.current_x},
    set:function(x){
      this._x = x
      if(this.obj) this.obj.css('left', x+'px')
    }
  },      
  /**
    * Position verticale de la flèche
    * Attention, il peut être très différent de la position réelle de la 
    * flèche après son calcul selon l'angle.
    * @property {Number} y
    */
  "y":{
    get:function(){return this._y || Anim.current_staff.top},
    set:function(y){
      this._y = y
      if(this.obj) this.obj.css('top', this._y+'px')
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
