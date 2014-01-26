/**
  * @module UniversalBoxMethods.js
  */

/**
  * Object contenant les méthodes universelles utiles pour la gestion
  * général des div principaux des éléments, pour les déplacer, les
  * orienter, changer leur taille et leur couleur, etc.
  *
  * En faire hériter tous les objets/class qui en ont besoin par $.extend
  * en version `deep` : $.extend(true, <object>, UNVERSAL_BOX_METHODS)
  *
  * Requis
  * ------
  *   * Chaque objet/class doit définir la propriété (complexe) `obj` qui 
  *     devra être affecté par les changements.
  *
  * @class UNVERSAL_BOX_METHODS
  * @for window
  * @static
  */
window.UNVERSAL_BOX_METHODS = {
  
  
}
/* ---------------------------------------------------------------------
 *  INSTANCE MÉTHODES CODE
 *  
 */
$.extend(UNVERSAL_BOX_METHODS,{
  
  
  /**
    * Affiche l'objet
    * @method show
    * @param {Object} params Paramètres optionnels (dont .complete, la méthode pour suivre, ou false)
    */
  show:function(params)
  {
    if(undefined == params) params = {}
    if(undefined == this.duree) params.duree = Anim.delai_for('show')
    else params.duree = this.duree * 1000
    this.animate({opacity:this.opacity || 1}, params)
    this.hidden = false
  },
  
  /**
    * Masque l'objet
    * @method hide
    * @param {Object} params Paramètres optionnels (dont .complete)
    */
  hide:function(params)
  {
    params = define_complete(params)
    if(undefined == params.duree) params.duree = Anim.delai_for('show')
    else params.duree = params.duree * 1000
    this.animate({opacity:0}, params)
    this.hidden = true
  },

  /**
    * Crée un fondu de l'objet. La méthode détecte automatiquement s'il
    * s'agit d'un fondu au noir ou une ouverture, en fonction de l'opacité
    * courante.
    *
    * @method fade
    * @param {Object}
    */
  fade:function(params)
  {
    params = define_complete(params)
    var ouverture = this.obj.css('opacity') == "0"
    var new_opac  = ouverture ? (this.opacity || 1) : 0
    this.animate({opacity:new_opac},{
      duration:params.duree || Anim.delai_for('transition'),
      complete:params.complete
    })
  },
  
  /**
    * Déplacement de l'objet
    * @method move
    * @param {Object} params    Paramètres définissant le déplacement
    *   @param {Number}   params.x        La nouvelle position horizontale à atteindre OU
    *   @param {Number}   params.for_x    La quantité de pixels de déplacement horizontal
    *   @param {Number}   params.y        La nouvelle position verticale à atteindre OU
    *   @param {Number}   params.for_y    La quantité de pixels de déplacement vertical
    *   @param {Number}   params.duree    La durée en seconde du déplacement
    *   @param {Boolean}  params.wait     Si FALSE, on n'attend pas pour passer à la suite
    *   @param {Function} params.complete Très optionnellement, la méthode pour suivre.
    */
  move:function(params)
  {
    if(undefined == params) return F.error("Il faut définir les paramètres du déplacement !")
    var data = {}
    if(undefined != params.for_x)   data.left = this.x + params.for_x
    else if (undefined != params.x) data.left = params.x
    if(undefined != params.for_y)   data.top = this.y + params.for_y
    else if (undefined != params.y) data.top = params.y
    if(undefined != params.wait && params.wait === false) this.wait = false
    this.animate(data, params)
  }
})


/* ---------------------------------------------------------------------
 *  PROTECTED INSTANCES MÉTHODES
 *  
 */
$.extend(UNVERSAL_BOX_METHODS, {
  /**
    * Dispatche les données +params+ dans l'objet, à l'instantiation
    * Noter que dans beaucoup de cas, dispatcher les paramètres signifie 
    * également définir l'objet à l'affichage, puisque la plupart des propriétés
    * sont complexes et règlent l'objet quand on les modifie.
    *
    * @method dispatch
    * @param {Object} params    Paramètres de l'objet.
    */
  dispatch:function(params)
  {
    if(undefined == params) return
    var my = this
    L(params).each(function(k,v){ my[k] = v })
  },
  
  /**
    * Construit l'objet
    * Notes :
    *   * C'est une propriété terminale (elle appelle NEXT_STEP)
    *
    * @method build
    * @return {Instance} L'instance héritant 
    */
  build:function()
  {
    Anim.Dom.add(this)
    this.obj.draggable({stop:this.coordonnees})
    return this
  },
  /**
    * Anime la boite de texte
    * @method animate
    * @param {Object} data Les données d'animation (comme jQUery.animate)
    * @param {Object} params    Paramètres optionnels
    *   @param {Number}         params.duree      La durée de l'animation (en secondes)
    *   @param {Function|False} params.complete   La méthode pour poursuivre
    *
    */
  animate:function(data, params)
  {
    // dlog("Params reçus par BUMP.animate:");dlog(params)
    params = define_complete(params, (this.wait === false) ? false : NEXT_STEP)
    if(undefined != params.duree) params.duree = params.duree * 1000
    this.obj.animate(data, {
      duration : params.duree || Anim.delai_for('transform'),
      complete : params.complete
    })
    if(this.wait === false)
    {
      NEXT_STEP(notimeout = true)
      delete this.wait
    }
  },
    
  /**
    * Règle l'objet principal (this.obj)
    * Notes
    * -----
    *   * La méthode est appelée par Anim.Dom.add à après l'ajout de l'objet
    *     dans l'animation.
    *   * Si l'objet possédant les méthodes universelles possède une méthode
    *     `after_positionne`, elle est appelée en fin de processus.
    *
    * @method positionne
    * @param {Object} params Paramètres optionnels
    *   @param  {Function|False} params.complete Méthode à appeler en fin de processus, ou false, ou NEXT_STEP par défaut.
    */
  positionne:function(params)
  {
    dlog("-> UniversalBoxMethods.positionne")
    params = define_complete(params)
    var data = {
      'left'    : (this.val_or_default('x'))       + 'px',
      'top'     : (this.val_or_default('y'))       + 'px',
      'width'   : (this.val_or_default('width'))   + 'px',
      'height'  : (this.val_or_default('height'))  + 'px',
      'z-index' : (this.val_or_default('z'))
    }
    this.obj.css(data)
    if(this.gradient)
    {
      this.set_css('background', "linear-gradient( to right, "+this.background+", "+this.gradient+")")
    }
    else
    {
      this.set_css('background-color', this.background || this.background_default)
    }
    if('function'==typeof this.after_positionne) this.after_positionne()
    if('function'==typeof params.complete) params.complete()
  },
  
  /**
    * Définit une propriété css de l'objet
    * @method set_css
    * @param {String} prop La propriété css à définir
    * @param {Any}    value   La valeur. Si c'est un nombre, et que ce n'est pas la propriété `z-index`, on ajoute 'px' derrière
    */
  set_css:function(prop, value)
  {
    if('number'==typeof value && prop != 'z-index') value = value + 'px'
    if(this.obj) this.obj.css(prop, value)
  },
  /**
    * Méthode qui affiche (feedback) les coordonnées de la boite de texte
    * après son déplacement et les renvoie dans un {x:, y:}
    * @method coordonnees
    * @param  {Event} evt   l'évènement (car la méthode peut être invoquée suite à un drag)
    * @param  {ui}    ui    Helper jQuery (cf. ci-dessus)
    * @return {Object} avec les propriétés `x` et `y`.
    */
  coordonnees:function(evt, ui)
  {
    var pos = this.obj.position()
    UI.feedback("Coordonnées de la TBox : x: "+pos.left+" / y: "+pos.top)
    return {x: pos.left, y: pos.top}
  },
  
  /**
    * Retourne soit la valeur définie +prop+ ou la valeur par défaut
    * construite par "<prop>_default"
    * @method val_or_default
    * @param {String} prop    La propriété
    */
  val_or_default:function(prop)
  {
    if(undefined != this[prop]) return this[prop]
    else return this[prop+'_default']
  }
  
})

window.UNIVERSAL_BOX_PROPERTIES = {
// Object.defineProperties(UNVERSAL_BOX_METHODS, {
  /**
    * DOM Objet (jQuerySet) de l'instance héritant des méthodes et propriétés universelles
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
    * Position horizontale de l'objet
    * @property {Number} x
    */
  "x":{
    configurable:true,
    set:function(x){
      this._x = x
      this.set_css('left', x)
    },
    get:function(){return this._x}
  },
  /**
    * Position verticale de l'objet
    * @property {Number} y
    */
  "y":{
    configurable:true,
    set:function(y){
      this._y = y
      this.set_css('top', y)
    },
    get:function(){return this._y}
  },
  /**
    * Largeur de l'objet
    * @property {Number} width
    */
  "width":{
    configurable:true,
    set:function(w){
      this._width = w
      this.set_css('width', w)
    },
    get:function(){return this._width}
  },
  /**
    * Hauteur de l'objet
    * @property {Number} height
    */
  "height":{
    configurable:true,
    set:function(h){
      this._height = h
      this.set_css('height', h)
    },
    get:function(){return this._height}
  },
  /**
    * Le z-index du div de l'objet.
    * @property {Number} z
    */
  "z":{
    configurable:true,
    set:function(z){
      this._z = z
      this.set_css('z-index', z)
    },
    get:function(){return this._z}
  },
  /**
    * Visibilité de l'élément
    * @property {Boolean} hidden
    */
  "hidden":{
    set:function(val){ this._hidden = val},
    get:function(){
      if(undefined == this._hidden) this._hidden = false
      return this._hidden
    }
  },
  /**
    * La couleur de background de l'objet
    * Pour la modifier, l'objet/class peut définir une méthode propre `set_background`.
    * Dans le cas contraire, c'est le div principal de l'objet qui sera affecté.
    * @property {String} background   Soit une constante couleur CSS soit la définition
    *                                 hexa ou autre.
    */
  "background":{
    set:function(couleur){
      this._background = couleur
      if(this.obj)
      {
        if('function'==typeof this.set_background) this.set_background(couleur)
        else this.obj.css('background-color', couleur)
      }
    },
    get:function(){ return this._background }
  },
  /**
    * La couleur alternative utilisée pour le dégradé (if any)
    * @property {String} gradient
    */
  "gradient":{
    set:function(gr){ this._gradient = gr},
    get:function(){ return this._gradient }
  }
}
  //})
