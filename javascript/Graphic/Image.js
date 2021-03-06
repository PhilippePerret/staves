/**
  * @module Image.js
  */

/**
  * Pour créer et gérer une image
  * @method IMAGE
  * @for window
  */
window.IMAGE = function(params)
{
  var image = new Img(params)
  image.build()
  return image
}

/**
  * Pour les instances d'image
  *
  * Notes
  *   * Il y a deux sortes d'instance image : les images "absolues" qui permettent
  *     de calculer les dimensions de l'image, avec une seule instance pour image
  *     différente et il existe aussi les instances véritablement créées pour 
  *     l'animation, qui peuvent partager des mêmes images.
  *
  * @class Img
  * @constructor
  * @param {Object} params Les paramètres de l'image
  *   @param {String} params.url     Adresse de l'image
  *   @param {Number} params.y     Top de l'image dans l'animation
  *   @param {Number} params.x    Left de l'image dans l'animation
  *   @param {Number} params.width   Largeur de l'image
  *   @param {Number} params.height  Hauteur de l'image
  *   @param {Number} params.cadre_width   Largeur du cadrage de l'image
  *   @param {Number} params.cadre_height  Hauteur du cadrage de l'image
  *   @param {Number} params.inner_x  Décalage horizontal du cadrage dans l'image
  *   @param {Number} params.inner_y  Décalage vertical du cadrage dans l'image
  */
window.Img = function(params)
{
  /** Identifiant absolu de l'image
    * Mais c'est une propriété complexe qui est calculée d'après l'url
    * @property {String} id
    */
  // this.id   = 'img'+(new Date()).getTime()
  
  /**
    * Position horizontale de l'image
    * @property {Number} x
    */
  this.x = 0

  /**
    * Position verticale de l'image
    * @property {Number} y
    */
  this.y = 0
  
  /**
    * Largeur de l'image (ie du div la contenant)
    * @property {Number} width
    */
  this.width = null

  /**
    * Hauteur de l'image (ie du div la contenant)
    * @property {Number} height
    */
  this.height = null
  
  /**
    * Zoom (focale) sur l'image. Cette propriété, si elle est définie,
    * remplace `width` et `height`. `1` préserve la taille de l'image.
    * Noter le trait plat, ajouté à la propriété `zoom` si elle est fournie, 
    * qui permet d'utiliser la méthode `zoom` sur l'image dans le code.
    * @property {Number} _zoom
    */
  this._zoom = null
    
  /** Largeur du cadrage de l'image
    * @property {Number} cadre_width
    * @default largeur de l'image
    */
  this.cadre_width = null

  /** Hauteur du cadrage de l'image
    * @property {Number} cadre_height
    * @default Hauteur de l'image
    */
  this.cadre_height = null

  /** Décalage horizontal du cadrage dans l'image
    * Par exemple, si `100`, on affiche l'image à partir du pixel horizontal 100
    * @property {Number} inner_x
    * @default 0
    */
  this.inner_x = 0

  /** Décalage vertical du cadrage dans l'image
    * @property {Number} inner_y
    * @default 0
    */
  this.inner_y = 0
  
  /**
    * Marque de visibilité (à la construction)
    * @property {Boolean} hidden
    * @default false  
    */
  this.hidden = false
  
  /**
    * Couleur du fond derrière l'image
    * @property {String} bg_color
    */
  this.bg_color   = 'tranparent'
  
  /**
    * Opacité du fond derrière l'image
    * @property {Float} bg_opacity
    */
  this.bg_opacity = 1
  
  /**
    * Détermine si le fond de l'image doit être opaque
    * quand une bordure est utilisé. Lorsqu'une bordure blanche est utilisée,
    * par exemple, avec une opacité de 0.3, le fond de l'image est lui aussi blanc
    * mais complètement opaque. Sauf si cette propriété est mis à false.
    * @property {Boolean} bg_image
    * @default true
    */
  this.bg_image = true
  
  /** Padding autour de l'image
    * Utile seulement lorsqu'un fond est utilisé, qui doit déborder
    * de l'image
    * @property {Number} padding
    * @default 0
    */
  this.padding = 0
  
  
  var me = this
  L(params || {}).each(function(k,v){
    if(k == 'zoom') k = '_zoom'
    me[k] = v
  })
  
  if( !this.abs )
  { /* Instanciation d'une image non "absolue" */
    Img.add(this)
    if( this._zoom )
    {
      this.calc_width_and_height_from_zoom()
    }
    else
    {
      this.calc_width_and_height()
    }
  }
  else
  { // => Pour une image "absolue"
    Img.abs_add(this)
    $('body').append(this.abs_code_html)
  }
}


/* ---------------------------------------------------------------------

     Instance

 --------------------------------------------------------------------- */

/* Extension avec les méthodes universelles */
$.extend(Img.prototype, UNVERSAL_METHODS)

/* 
    === Methodes à utiliser dans le code === 
 */

$.extend(Img.prototype,{ 
  /**
    * Pour détruire complètement l'image
    * @method remove
    * @param {Object} params    Paramètres optionnels
    *   @param {Boolean|Number}   params.wait   Le paramètre d'attente
    *   @param {Float}            params.duree  La durée d'évanouissement
    */
  remove:function(params)
  {
    this.hide($.extend(params, {complete_each:'remove'}))
  },
  /**
    * Pour exécuter un travelling dans l'image
    * @method travelling
    * @param {Object} params    Paramètres (doit exister)
    *   @param {Number} params.duree      La durée du travelling (optionnel)
    *   @param {Number} params.x          La position horizontale de fin du cadrage
    *   @param {Number} params.y          Position verticale de fin du cadrage
    *   @param {Number} params.width      La nouvelle largeur de cadre
    *   @param {Number} params.height     La nouvelle hauteur de cadre
    *   @param {Number} params.for_x      Nombre de pixels de déplacement horizontal
    *   @param {Number} params.for_y      Nombre de pixels de déplacement vertical
    *   @param {Function} params.complete La méthode pour suivre (NEXT_STEP par défaut)
    * @return {Img} L'instance, pour chainage
    */
  travelling:function(params)
  {
    if(undefined == params) return F.error("Il faut définir les paramètres du travelling !")
    params = define_complete( params )
    if(undefined != params.for_x) params.x = this.inner_x + params.for_x
    if(undefined != params.for_y) params.y = this.inner_y + params.for_y
    if(undefined == params.duree) params.duree = 2
    if(!params.x && !params.y && !params.width && !params.height) return F.error("Il faut définir le mouvement du travelling !")
    var dtrav = {}
    if(undefined != params.x) dtrav.left = "-"+params.x+'px'
    if(undefined != params.y) dtrav.top  = "-"+params.y+'px'
    // On redimensionne le cadre si nécessaire
    var dcadre = {}
    var new_dim = this.width_height_zoom_from(params)
    if(params.width  || params.zoom)  dcadre.width  = new_dim.width  + 'px'
    if(params.height || params.zoom)  dcadre.height = new_dim.height + 'px'
    if(dcadre != {}) Anim.Dom.anime([this.obj], dcadre, {complete:false, wait:false})

    // On procède au travelling
    Anim.Dom.anime([this.image], dtrav, params)

    // On passe les nouvelles valeurs
    if(params.x)      this.inner_x        = params.x
    if(params.y)      this.inner_y        = params.y
    if(params.width)  this.cadre_width    = params.width
    if(params.height) this.cadre_height   = params.height
    return this
  },
  
  /**
    * Fait un zoom dans l'image
    * Un zoom correspond à modifier la taille de l'image (IMG) en la repositionnant
    * dans son div.
    * @method zoom
    * @param {Object} params    Les paramètres du zoom
    *                           OU La taille du zoom
    *   @param {Number} params.zoom   Le grossissement OU
    *   @param {Number} params.width  La largeur d'arrivée (si zoom n'est pas fourni)
    *   @param {Number} params.height La hauteur d'arrivée (si zoom n'est pas fourni)
    *   @param {Number} params.x      Le nouveau inner_x (sinon le même)
    *   @param {Number} params.y      Le nouveau inner_y (sinon le même)
    *   @param {Number} params.duree  La durée que doit prendre le zoom
    *   @param {Boolean|Wait} params.wait   Le paramètre d'attente
    */
  zoom:function(params)
  {
    // Si cadre_width et cadre_height ne sont pas définis, il faut les fixer
    // TODO Il faudrait tenir compte du padding
    if(undefined == this.cadre_width)   this.cadre_width  = parseInt(this.width)
    if(undefined == this.cadre_height)  this.cadre_height = parseInt(this.height)
    
    /*
     *  Si unique paramètre nombre, c'est la valeur de zoom à donner, de façon
     *  absolu, sans déplacement. On repart des valeurs initiales quel que soit
     *  l'état actuel
     *  
     */
    if('number' == typeof params)
    {
      this._zoom    = params
      this.width    = this.abs_image.width  * this._zoom
      this.height   = this.abs_image.height * this._zoom
      this.inner_x  = - ((this.width  - this.abs_image.width ) / 2)
      this.inner_y  = - ((this.height - this.abs_image.height) / 2)
    }
    /*
     *  Si params.width est déterminé, c'est la largeur d'image qu'il faut prendre
     *  Cette largeur prendra la dimension de la largeur actuelle de l'image (un zoom,
     *  par définition, ne modifie pas le cadre de l'image, qui occupera donc toujours
     *  la même surface)
     *  Donc on doit pouvoir calculer le nouveau vrai width de l'image par rapport à
     *  ce params.width.
     *  Imaginons que le cadre actuel fasse 200px, que l'image fasse 200px et qu'aucun
     *  zoom ne soit appliqué. Donc on voit l'image en entier.
     *  Maintenant, on détermine que params.width = 50 et x = 0. Ça signifie qu'on va
     *  prendre les 50 premiers pixels de l'image et grossir l'image pour que ces 50
     *  pixels occupent les 200px du cadre actuel. On va donc grossir l'image par 4,
     *  sans la changer de place (inner_x restera à 0)
     */
    else if(undefined !== params.width || undefined !== params.height)
    {
      // params.width doit correspondre à this.cadre_width
      if( undefined !== params.width) coef = this.cadre_width  / params.width
      else                            coef = this.cadre_height / params.height
      // On doit multiplier la taille de l'image par ce coefficiant pour qu'elle
      // occupe la place voulue
      this.width  = this.abs_image.width  * coef
      this.height = this.abs_image.height * coef
      this._zoom  = coef // ???
      if(undefined !== params.inner_x) this.inner_x = - params.inner_x
      if(undefined !== params.inner_y) this.inner_y = - params.inner_y
    }
    else
    {
      /*
       *  Quand ni width ni height ne sont définis dans les paramètres.
       *  Il faut donc juste grossir ou diminuer l'image.
       */
      // Il faut déterminer la taille d'arrivée
      var dims = this.width_height_zoom_from( params )
      // La différence de dimension par rapport à la dimension courante
      // Il faudrait déplacer l'image de la moitié de ces valeurs
      var diff_x = (dims.width  - this.width  ) / 2
      var diff_y = (dims.height - this.height ) / 2
      this.inner_x = undefined === params.x ? this.inner_x - diff_x : params.inner_x
      this.inner_y = undefined === params.y ? this.inner_y - diff_y : params.inner_y
      this.width  = dims.width
      this.height = dims.height
      this._zoom  = dims.zoom
    }

    data_css = {
      width   : this.width   + 'px',
      height  : this.height  + 'px',
      top     : this.inner_y + 'px',
      left    : this.inner_x + 'px'
    }
    // dlog("data_css pour le zoom :");dlog(data_css)
    Anim.Dom.anime([this.image], data_css, params)
  },
  /**
    * Méthode pour déplacer l'image
    * @method move
    * @param {Object} params  Définition du déplacement
    *   @param {Number} params.x      Nouvelle position horizontale
    *   @param {Number} params.for_x  Nombre de pixels de déplacement horizontal
    *   @param {Number} params.y      Nouvelle position verticale
    *   @param {Number} params.for_y  Nombre de pixels de déplacement vertical
    *   @param {Number} params.duree  Durée du déplacement
    *   @param {Function} params.complete   Méthode à appeler en fin de déplacement
    *   @param {Boolean|Float} params.wait  Paramètre d'attente
    * @return {Img} L'instance
    */
  move:function(params)
  {
    if(undefined == params) return F.error("Il faut définir le déplacement de l'image !")
    if(undefined != params.for_x) params.x = this.x + params.for_x
    if(undefined != params.for_y) params.y = this.y + params.for_y
    var dmove = {}
    if(undefined != params.x) dmove.left = params.x+'px'
    if(undefined != params.y) dmove.top  = params.y+'px'
    L(['x', 'y', 'for_x', 'for_y']).each(function(prop){ delete params[prop] })
    Anim.Dom.anime([this.obj], dmove, params)
    return this
  },
  
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
    var data ;
    if(undefined == params && 'object' == typeof value)
    {
      data    = prop
      params  = value
    }
    else
    {
      data = parametize(prop, value)
    }

    // On corrige les propriétés et les valeurs
    data = UI.real_value_per_prop( this, data )
    
    var my = this,
        data_div        = {}
        data_background = {},
        data_image      = {}
    L(data).each(function(prop, value){
      switch(prop)
      {
      case 'src':
        return my.src(value)
      case 'bg_color':
        return data_background['background-color'] = value
      case 'bg_opacity':
        return data_background['opacity'] = value
      case 'opacity':
        return data_div['opacity'] = value
      }
    })
    
    return this
    
  },
  /**
    * Méthode pour changer la source de l'image
    * @method src
    * @return {Img} L'instance, pour chainage
    */
  src:function(new_url)
  {
    this.url = new_url
    this.width  = null
    this.height = null
    this.image.css({width:null, height:null})
    this.image[0].src = new_url
    NEXT_STEP(0)
    return this
  }

})
/* === Protected Methods === */
$.extend(Img.prototype,{
  /**
    * Retourne la largeur (width) et la hauteur (height) en fonction des valeurs
    * fournies en paramètres.
    * Noter que la méthode ne fait QUE retourner les valeurs, elle ne les met pas
    * en paramètre.
    * @method width_height_zoom_from
    * @param {Object} params  Paramètres permettant de calculer la largeur/hauteur
    *   @param {Number|Undefined} params.width    La largeur éventuellement fournie
    *   @param {Number|Undefined} params.height   La hauteur éventuellement fournie
    *   @param {Float|Undefined}  params.zoom     Le zoom éventuellement fourni
    * @return {Object} Un object contenant {width:largeur, height:hauteur, zoom: zoom correspondant}
    */
  
  width_height_zoom_from:function(params)
  {
    // dlog("-> get_width_and_height")
    var abs_image = this.abs_image,
        width,
        height,
        zoom ;
        
    if(params.zoom)
    {
      width  = parseInt(abs_image.width  * params.zoom)
      height = parseInt(abs_image.height * params.zoom)
      zoom   = params.zoom
    }
    else
    {
      if(!params.width && !params.height)
      {
        width  = abs_image.width
        height = abs_image.height
        zoom   = 1
      }
      else if (!params.height) // largeur fournie => calcul hauteur
      {
        width  = params.width
        zoom   = width / abs_image.width
        height = parseInt(abs_image.height * zoom)
      }
      else // Hauteur fournie => calcul largeur
      {
        height = params.height
        zoom   = height / abs_image.height
        width  = parseInt(abs_image.width * zoom)
      }
    }
    
    // dlog("<- get_width_and_height ({width:"+width+", height:"+height+", zoom:"+zoom+"})")
    return {width:width, height:height, zoom:zoom}
  },
   /**
    * Calcule le weight et le height de l'image en fonction du `zoom` fourni
    * @method calc_width_and_height_from_zoom
    */
  calc_width_and_height_from_zoom:function()
  {
    var dims = this.width_height_zoom_from( {zoom:this._zoom} )
    this.width  = dims.width
    this.height = dims.height
  },
  /**
    * La méthode est appelée systématiquement à l'instanciation de l'image. Elle permet
    * de définir les valeurs manquantes (width ou height) ou de les calculer si elles ont
    * été transmises par pourcentage.
    * @method calc_width_and_height
    */
  calc_width_and_height:function()
  {
    var dsize = this.real_width_and_height(this.width, this.height)
    this.width  = dsize.width
    this.height = dsize.height
    

  },
  /**
    * Méthode qui prend les paramètres w et h, quels qu'ils soient, et retourne les
    * valeur en fonction de leur valeur.
    * @method real_width_and_height
    * @param {Any} w  La largeur fournie, peut être un nombre, 'auto', un pourcentage ou non défini
    * @param {Any} h  La hauteur fournie, peut être un nombre, 'auto', un pourcentage ou non défini
    * @return {Object} Un objet contenant `width` et `height`
    */
  real_width_and_height:function(w, h)
  {
    var w_is_defined = w && 'number' == typeof w
    var h_is_defined = h && 'number' == typeof h

    if( w_is_defined && h_is_defined ) return {width:w, height:h}

    // L'image absolue de référence
    var abs_image = Img.abs_list[this.abs_id]
    // Le rapport image
    var rapport   = abs_image.rapport
    
    if( false == w_is_defined )
    {
      if('string' == typeof w && w.indexOf('%') > -1)
      {
        var pourcentage = parseInt( w )
        w = parseInt( abs_image.width * pourcentage / 100 )
      }
      else
      {
        w = null
      }
    }
    
    if( false == h_is_defined)
    {
      if('string' == typeof h && h.indexOf('%') > -1)
      {
        var pourcentage = parseInt( h )
        h = parseInt( abs_image.height * pourcentage / 100 )
      }
      else
      {
        h = null
      }
    }
    
    if( w === null ) w = parseInt( h !== null ? h / rapport : abs_image.width )
    
    // @note : Ici, width est forcément défini
    if( h === null ) h = parseInt( w * rapport )
   
    return {width: w, height: h}
  },
  
  /** Méthode qui relève le `width` et le `height` de l'image dans son
    * inscription hors écran. Return false si l'image n'est pas encore
    * chargée et que sa taille ne peut être relevée. Sinon, renseigne
    * les propriétés width et height
    * Notes
    * -----
    *   * Cette méthode ne doit être utilisée QUE sur les instances "absolues"
    *     des images. Pour une instance d'image en cours d'animation, utiliser
    *     calc_width_and_height.
    *
    * @method get_width_and_height
    */
  get_width_and_height:function()
  {
    var width   = UI.css2number(this.abs_obj.width())
    var height  = UI.css2number(this.abs_obj.height())
    
    if(width == 0 || height == 0) return false
    
    this.width  = width
    this.height = height
    
  },
  /**
    * Construit l'image (et passe à l'étape suivante)
    * @method build
    */
  build:function()
  {
    Anim.Dom.add(this)
    this.obj.draggable({stop:$.proxy(this.on_end_move, this)})
    this.obj.bind('dblclick', $.proxy(this.edit, this))
    NEXT_STEP(0)
  },
  /**
    * Pour éditer l'image
    * @method edit
    */
  edit:function()
  {
    UI.Tools.hide_section()
    ImageTool.edit( this )
  },
  /**
    * Pour positionner l'image
    * La méthode définit en plus les observers et rend l'image draggable.
    * @method positionne
    * @return {Img} L'instance image (pour chainage éventuel)
    */
  positionne:function()
  {
    var height  = (this.cadre_height || this.height)
    if( isNaN(height) && !this.positionne.bad_height )
    {
      this.positionne.bad_height = true
      delete this.height
      this.calc_width_and_height()
      return this.positionne()
    } 
    else if(this.positionne.bad_height)
    {
      console.error("[Img.positionne] Problème avec le calcul de Height. Voilà les infos :")
      dlog({
        cadre_height: this.cadre_height,
        height : this.height,
        'height calculé': height,
        width  : this.width,
        'abs image': this.abs_image,
      })
      return
    }
    delete this.positionne.bad_height
    var padding = this.padding ? this.padding : 0
    var width   = (this.cadre_width  || this.width)
    
    // Div contenant l'image
    var div_data = {
      left    : this.x+'px',
      top     : this.y+'px',
      width   : (width  + (2 * padding)) +'px',
      height  : (height + (2 * padding)) +'px'
    }
    if(undefined !== this.z) div_data['z-index'] = this.z
    this.obj.css(div_data)
    
    // Le fond derrière l'image
    var bg_data = {}
    bg_data['background-color'] = this.bg_color ? this.bg_color : 'transparent'
    if(undefined !== this.bg_opacity) bg_data['opacity'] = this.bg_opacity
    this.obj_background.css(bg_data)
    
    // Le DIV contenant l'image (c'est lui qui permet de rogner l'image)
    var cont_data = {
      width  : width   + 'px', 
      height : height  + 'px',
      top    : padding + 'px',
      left   : padding + 'px'
    }
    this.obj_conteneur.css( cont_data )
    
    // Image
    var img_data = {
      width : this.width  +'px', 
      height: this.height +'px'
    }
    if(this.bg_color && this.bg_image)
    {
      img_data['background-color']  = this.bg_color
      img_data['opacity']           = 1
    }
    var left = 0, top = 0 ;
    if(this.inner_x) left = - this.inner_x
    if(this.inner_y) top  = - this.inner_y
    if(left) img_data.left = left + 'px'
    if(top ) img_data.top  = top  + 'px'
    this.image.css(img_data)
    
    // // Débug
    // dlog("Data CSS pour le DIV:");dlog(div_data)
    // dlog("Data CSS pour le fond:");dlog(bg_data)
    // dlog("Data CSS pour l'image:");dlog(img_data)
    // dlog("Données de l'instance :");
    // dlog({
    //   width: this.width, height:this.height,
    //   padding:padding,
    //   x:this.x, y:this.y, z:this.z,
    //   bg_color:this.bg_color, bg_opacity:this.bg_opacity,
    //   opacity:this.opacity,
    //   inner_x:this.inner_x, inner_y:this.inner_y
    // })
    
    return this
  },
  
  /**
    * Méthode appelée en fin de déplacement de l'image
    * Elle affiche les nouvelles coordonnées
    * @method on_end_move
    * @param {Event} evt    L'évènement draggable
    */
  on_end_move:function(evt)
  {
    var pos = this.obj.position()
    var mess = "x:"+pos.left + " / y:"+pos.top
    UI.feedback(mess)
  }
})
Object.defineProperties(Img.prototype,{
  /**
    * Identifiant unique de l'image
    * @note Il n'est pas à confondre avec l'identifiant absolu calculé
    *       d'après l'URL de l'image
    * @property {String} id
    */
  "id":{
    get:function(){
      if(undefined == this._id)
      {
        this._id = this.abs_id + (new Date()).getTime()
      } 
      return this._id
    }
  },
  /**
    * Identifiant absolu de l'image, calculé d'après son URL seule
    * Noter que toutes les instances d'image en cours d'animation qui possèdent
    * la même URL (les mêmes images) possèdent le même abs_id qui fait référence
    * à leur clé dans Img.abs_list, la liste des instances uniques d'images de
    * l'animation (où une image de même URL possède une instance unique)
    * @property {String} abs_id
    */
  "abs_id":{
    get:function(){
      if(undefined == this._abs_id) this._abs_id = Img.idAbsFromUrl(this.url)
      return this._abs_id
    }
  },
  /**
    * Instance de l'image absolue de référence de l'image courante
    * @property {Img} abs_image
    */
  "abs_image":{
    get:function(){
      if(undefined == this._abs_image)
      {
        this._abs_image = Img.abs_list[this.abs_id]
      }
      return this._abs_image
    }
  },
  /**
    * URL de l'image (locale ou distante)
    * @property {String} url
    */
  "url":{
    set:function(url)
    {
      this._url = url
    },
    get:function(){ return this._url}
  },
  /**
    * Identifiant DOM pour le DIV contenant l'image de l'animation
    * @property {String} dom_id
    */
  "dom_id":{
    get:function(){return "divimg-"+this.id}
  },
  /**
    * Le DIV contenant l'image (instance normale d'animation)
    * @property {jQuerySet} obj
    */
  "obj":{get:function(){return $('div#'+this.dom_id)}},
  /**
    * DOM Object de l'image (balise img)
    * @property {jQuerySet} image
    */
  "image":{get:function(){return $('img#'+this.id)}},
  /** 
    * DOM Object du Div qui contient l'image et la rogne
    * @property {jQuerySet} obj_conteneur
    */
  "obj_conteneur":{get:function(){return $('div#'+this.id+'-conteneur')}},
  /**
    * DOM Object du fond derrière l'image
    * @property {jQuerySet} obj_background
    */
  "obj_background":{get:function(){return $('div#'+this.id+'-background')}},
  
  /**
    * Objet DOM de l'image absolue
    * @property {jQuerySet} abs_obj
    */
  "abs_obj":{
    get:function(){return $('img#'+this.abs_id)}
  },
  /**
    * Code HTML pour l'image absolue
    * @property {HTMLString} abs_code_html
    */
  "abs_code_html":{
    get:function(){
      return '<img id="'+this.abs_id+'" src="'+this.url+'" style="position:absolute;top:-4000px;left:-4000px;"/>'
    }
  },
  /** Rapport de l'image (au sens audiovisuel du terme, ie la largeur/hauteur)
    * La propriété ne devrait être utilisée qu'avec l'image absolue. Pour une image
    * quelconque, cette valeur peut être récupérée par :
    *   rapport = imgquelconque.abs_image.rapport
    * 
    * Calcul avec ce rapport 
    * ----------------------
    *   On peut obtenir la hauteur d'après la largeur avec :
    *     hauteur = largeur * rapport
    *   On peut obtenir la largeur d'après la hauteur avec :
    *     largeur = parseFloat( hauteur / rapport )
    *
    *
    * @property {Float} rapport
    */
  "rapport":{
    get:function(){
      if(undefined == this._rapport)
      {
        this._rapport = parseFloat(this.height / this.width)
      }
      return this._rapport
    }
  },
  /**
    * Code HTML de l'image (instance d'animation, PAS absolu)
    * @property {HTMLString} code_html
    */
  "code_html":
  {
    get:function(){
      var styleimg = [], stylediv = [] ;
      if(this.hidden) stylediv.push("opacity:0")
      
      return  '<div id="'+this.dom_id+'" class="divimage" style="'+stylediv.join(';')+'">'+
                '<div id="'+this.id+'-background" class="bg_image"></div>' +
                '<div id="'+this.id+'-conteneur" class="image_conteneur">'+
                  '<img id="'+this.id+'" class="image" src="'+this.url+'" style="'+styleimg.join(';')+'" />'+
                '</div>'+
              '</div>'
    }
  }
    
})