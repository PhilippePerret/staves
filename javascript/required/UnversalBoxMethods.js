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
    var ouverture = this.obj.css('opacity') == 0
    var new_opac  = ouverture ? this.opacity : 0
    this.animate({opacity:new_opac},{
      duration:params.duree || Anim.delai_for('transition'),
      complete:params.complete
    })
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
    var my = this
    L(params).each(function(k,v){ my[k] = v})
  },
  
  /**
    * Anime la boite de texte
    * @method animate
    * @param {Object} data Les données d'animation (comme jQUery.animate)
    * @param {Object} params    Paramètres optionnels
    *   @param {Number}         params.duree      La durée de l'animation
    *   @param {Function|Fals}  params.complete   La méthode pour poursuivre
    *
    */
  animate:function(data, params)
  {
    params = define_complete(params)
    this.obj.animate(data, {
      duration : params.duree || Anim.delai_for('transform'),
      complete : params.complete
    })
  },
  
  /**
    * Affiche l'objet
    * @method show
    * @param {Object} params Paramètres optionnels (dont .complete, la méthode pour suivre, ou false)
    */
  show:function(params)
  {
    this.animate({opacity:this.opacity}, define_complete(params))
    this.hidden = false
  },
  
  /**
    * Masque l'objet
    * @method hide
    * @param {Object} params Paramètres optionnels (dont .complete)
    */
  hide:function(params)
  {
    this.animate({opacity:0}, define_complete(params))
    this.hidden = true
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
    this.set_css('background-color', this.background || this.background_default)
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
    UI.feedback("Coordonnées de la TBox : left: "+pos.left+" / top: "+pos.top)
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

Object.defineProperties(UNVERSAL_BOX_METHODS, {
  /**
    * Position horizontale de l'objet
    * @property {Number} x
    */
  "x":{
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
    set:function(h){
      this._height = h
      this.set_css('height', h)
    }
  },
  /**
    * Le z-index du div de l'objet.
    * @property {Number} z
    */
  "z":{
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
  }
    
})
