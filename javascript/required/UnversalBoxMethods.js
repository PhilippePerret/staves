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
    * Permet de redéfinir une valeur de l'objet
    * @method set
    * @param {String} prop    La propriété de la box — ou un objet définissant plusieurs propriétés
    * @param {Any}    value   La valeur à donner à la propriété
    * @param {Object} params  Les paramètres éventuels.
    *   @param  {Number}  params.duree   La durée que doit prendre la transformation (en secondes)
    *   @param  {Boolean} params.wait    Si False, on passe tout de suite à la suite.
    */
  set:function(prop, value, params)
  {
    var data = parametize(prop, value)

    // On corrige les propriétés et les valeurs
    var data = this.real_value_per_prop( this, data )
    dlog("[set] real-data:");dlog(data)
    
    params = define_complete(params)
    this.animate(data, params)
    if(params.wait === false) NEXT_STEP(0)
    traite_wait(params)
  },
  
  /** Méthode qui analyse une propriété et une valeur et renvoie la bonne
    * propriété et la bonne valeur.
    * Cette méthode doit fonctionner pour tout type d'objet qui héritent des
    * propriétés universelles de boites, et elle a été inaugurée pour la gestion
    * de la méthode `set`.
    * Par exemple, pour changer la couleur du cadre d'une boite, on utilise :
    *   monCadre.set('color', blue)
    * … et cette méthode doit retourner que ce n'est pas la propriété `color` qui
    * doit être changée (ce qui ne changerait rien puisque la couleur du border est
    * défini explicitement dans un objet cadre) mais la propriété `border-color`.
    * Autre exemple : toutes les valeurs numériques, à part `z-index` et `opacity`,
    * sont transformées en mesures pixels.
    *
    * @method real_value_per_prop
    * @param {Object} obj L'objet porteur (correspond à `this`)
    * @param {Object} hash    Object contenant les paires propriété/valeur.
    * @return {Object} Le nouveau hash des paires propriété/valeur avec les bonnes propriétés et les bonnes valeurs
    */
  real_value_per_prop:function(obj, hash)
  {
    // Le nouveau hash qui sera renvoyé
    var rhash = {}
    
    L(hash).each(function(prop, value){

      /* On met toujours la valeur fournie à l'objet, telle que donnée */
      obj[prop] = value
      
      // === CHANGEMENT DE LA PROPRIÉTÉ (ET VALEUR INITIALE) ===
      switch(prop)
      {
      case 'x':
        prop = 'left'
        break
      case 'y':
        prop = 'top'
        break
      case 'offset_x':
        prop  = 'left'
        value = (obj.x || obj.x_default) + value
        break
      case 'offset_y':
        prop  = 'top'
        value = (obj.y || obj.y_default) + value
        break
      case 'z':
        prop = 'z-index'
        break
      case 'offset_w':
        prop  = 'width'
        value = (obj.width || obj.width_default) + value
        break
      case 'offset_h':
        prop  = 'height'
        value = (obj.height || obj.height_default) + value
        break
      default:
        if(obj.class == 'box' && obj.type == 'cadre')
        {
          switch(prop)
          {
          case 'color':
            prop = 'border-color'
            break
          }
        }
      }
      
      /* === ON PEUT METTRE LA PROPRIÉTÉ DANS LE HASH === */
      rhash[prop] = value
      
      // === EN FONCTION DU TYPEOF DE LA VALEUR ===
      switch(typeof value)
      {
      case 'number':
        switch(prop)
        {
        case 'z-index':
        case 'opacity':
          break
        default:
          value = value + 'px'
        }
        break
      }

      /* === ON PEUT METTRE LA VALEUR DANS LE HASH === */
      rhash[prop] = value
    })
    
    
    return rhash
  },
  
  /**
    * Affiche l'objet
    * @method show
    * @param {Object} params Paramètres optionnels (dont .complete, la méthode pour suivre, ou false)
    */
  show:function(params)
  {
    dlog("-> " + this.id + ".show")
    if(undefined == params) params = {}
    if(undefined == this.duree) params.duree = Anim.delai_for('show')
    else params.duree = this.duree * 1000
    params.complete = this.wait === false ? false : NEXT_STEP
    this.animate({opacity:this.opacity || 1}, params)
    this.hidden = false
    dlog("<- " + this.id + ".show")
  },
  
  /**
    * Masque l'objet
    * @method hide
    * @param {Object} params Paramètres optionnels (dont .complete)
    */
  hide:function(params)
  {
    if(undefined == params) params = {}
    if(undefined == params.duree) params.duree = Anim.delai_for('show')
    else params.duree = params.duree * 1000
    params.complete = this.wait === false ? false : NEXT_STEP
    this.animate({opacity:0}, params)
    this.hidden = true
  },

  /**
    * Destruction de l'objet DOM de l'objet courant
    * Note : c'est une méthode qui enchaine tout de suite la méthode suivante.
    * @method remove
    */
  remove:function(){
    this.obj.remove()
    NEXT_STEP(0)
  },
  
  /**
    * Crée un fondu de l'objet. La méthode détecte automatiquement s'il
    * s'agit d'un fondu au noir ou une ouverture, en fonction de l'opacité
    * courante.
    *
    * @method fade
    * @param {Object} params    Paramètres optionnels
    *   @param {False} params.wait    Si false, on passe tout de suite à la suite
    */
  fade:function(params)
  {
    params = define_complete(params)
    var ouverture = this.obj.css('opacity') == "0"
    var new_opac  = ouverture ? (this.opacity || 1) : 0
    this.animate({opacity:new_opac},{
      duration:this.duree_set_or_default(params, 'fade'),
      complete:params.complete
    })
    if(params.wait === false) NEXT_STEP(0)
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
    else if (undefined != params.y) data.top = params.y ;
    params.duree = this.duree_set_or_default(params, 'move')
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
    dlog("-> "+this.id+".build")
    var params = {}
    if(this.wait === false) params.complete = false
    Anim.Dom.add(this, params)
    this.obj.draggable({stop:this.coordonnees})
    if(this.wait === false)
    {
      delete this.wait
      NEXT_STEP(0)
    }
    dlog("<- "+this.id+".build")
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
    dlog("-> "+this.id+".animate")
    // dlog("Params reçus par BUMP.animate:");dlog(params)
    params = define_complete(params, (this.wait === false) ? false : NEXT_STEP)
    this.obj.animate(data, {
      duration : params.duree || Anim.delai_for('transform'),
      complete : params.complete
    })
    // Si this.wait a été mis à false, il faut passer immédiatement à l'étape
    // suivante
    if(this.wait === false)
    {
      delete this.wait
      NEXT_STEP(0)
    } 
    dlog("<- "+this.id+".animate")
  },
    
  /**
    * Règle l'objet principal (this.obj)
    * Notes
    * -----
    *   * La méthode est appelée par Anim.Dom.add après l'ajout de l'objet
    *     dans l'animation.
    *   * Si l'objet possédant les méthodes universelles possède une méthode
    *     `after_positionne`, elle est appelée en fin de processus.
    *
    * @method positionne
    * @param {Object} params Paramètres optionnels
    */
  positionne:function(params)
  {
    dlog("-> "+this.id+".positionne")
    var data = {
      'left'    : (this.val_or_default('x'))       + 'px',
      'top'     : (this.val_or_default('y'))       + 'px',
      'width'   : (this.val_or_default('width'))   + 'px',
      'height'  : (this.val_or_default('height'))  + 'px',
      'z-index' : (this.val_or_default('z'))
    }
    if(this.type == 'cadre') data.border = this.border + 'px solid '+ this.color;
    
    this.obj.css(data)
    if(this.gradient)
    {
      this.set_css('background', "linear-gradient( to right, "+this.background+", "+this.gradient+")")
    }
    else if (this.type != 'cadre')
    {
      this.set_css('background-color', this.background || this.background_default)
    }
    else // pour un cadre
    {
      this.set_css('background-color', 'transparent')
    }
    
    if('function'==typeof this.after_positionne) this.after_positionne()
  },
  
  /** Retourne la durée définie dans +params+ ou la durée par défaut d'identifiant
    * +duree_id+
    * @method duree_set_or_default
    * @param {Object} params    Les paramètres contenant peut-être `duree`
    * @param {String} duree_id  L'identifiant dans Anim.transition de la durée par défaut
    * @return {Float} Le nombre de millisecondes
    */
  duree_set_or_default:function(params, duree_id)
  {
    return (undefined == params.duree) ? Anim.delai_for(duree_id) : params.duree * 1000
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
    enumerable:true,
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
    set:function(x){this._x = x},
    get:function(){return this._x}
  },
  /**
    * Position verticale de l'objet
    * @property {Number} y
    */
  "y":{
    configurable:true,
    set:function(y){this._y = y},
    get:function(){return this._y}
  },
  /**
    * Largeur de l'objet
    * @property {Number} width
    */
  "width":{
    configurable:true,
    set:function(w){this._width = w},
    get:function(){return this._width}
  },
  /**
    * Hauteur de l'objet
    * @property {Number} height
    */
  "height":{
    configurable:true,
    set:function(h){this._height = h},
    get:function(){return this._height}
  },
  /**
    * Le z-index du div de l'objet.
    * @property {Number} z
    */
  "z":{
    configurable:true,
    set:function(z){this._z = z},
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
    * La couleur de border (color) quand c'est une box de type 'cadre'
    * @property {String} color
    */
  "color":{
    set:function(couleur)
    {
      this._color = couleur
    },
    get:function(){ return this._color }
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
