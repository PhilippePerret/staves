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
  if(undefined != params.x){ params.left = params.x; delete params.x }
  if(undefined != params.y){ params.top  = params.y; delete params.y }
  var image = new Img(params)
  return image
}

/**
  * Pour les instances d'image
  * @class Img
  * @constructor
  * @params {Object} params Les paramètres de l'image
  *   @params {String} params.url     Adresse de l'image
  *   @params {Number} params.top     Top de l'image dans l'animation
  *   @params {Number} params.left    Left de l'image dans l'animation
  *   @params {Number} params.width   Largeur de l'image
  *   @params {Number} params.height  Hauteur de l'image
  *   @params {Number} params.cadre_width   Largeur du cadrage de l'image
  *   @params {Number} params.cadre_height  Hauteur du cadrage de l'image
  *   @params {Number} params.cadre_offset_x  Décalage horizontal du cadrage dans l'image
  *   @params {Number} params.cadre_offset_y  Décalage vertical du cadrage dans l'image
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
    * @property {Number} left
    */
  this.left = null
  /**
    * Position verticale de l'image
    * @property {Number} top
    */
  this.top = null
  
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
    * @property {Number} cadre_offset_x
    * @default 0
    */
  this.cadre_offset_x = 0
  /** Décalage vertical du cadrage dans l'image
    * @property {Number} cadre_offset_y
    * @default 0
    */
  this.cadre_offset_y = 0
  
  var me = this
  L(params || {}).each(function(k,v){me[k] = v})
  
  if(!this.abs /* Instanciation d'une image non "absolue" */)
  {
    Img.add(this)
    if(!this.width  || this.width  == auto || !this.height || this.height == auto)
    {
      this.calc_width_and_height()
    }
    this.build()
  }
  else
  { // => Pour une image "absolue"
    Img.abs_add(this)
    $('body').append(this.abs_code_html)
  }
}
/* ---------------------------------------------------------------------
     Classe
 --------------------------------------------------------------------- */
$.extend(Img,{
  /**
    * Table {Object} des instances uniques d'image
    * Notes : lire la première note de la propriété `list` suivante
    * Key   : L'identifiant “absolu” de l'image, calculé par rapport à son URL
    * Value : L'instance {Img}. Noter que cette instance est "virtuelle", elle
    *             n'est pas utilisée au cours du jeu de l'animation.
    * @property {Object} abs_list
    */
  abs_list:{},
  /**
    * Table {Object} des images instanciées
    * Notes
    * -----
    *   * Il faut bien comprendre la différence entre ce `list` et `images_list`.
    *     La première (cette propriété) contient les instances d'images utilisées
    *     pour l'animation, en considérant qu'une même image (même URL) peut être
    *     utilisée plusieurs fois, et pour chaque utilisation doit avoir une instance
    *     distincte. Revanche, la table `abs_list` contient de façon unique toutes
    *     les images qui sont utilisées par l'animation et est établie à la pré-estimation
    *     du code (pas son exécution)
    *
    * En clé l'identifiant de l'image et en valeur l'instance image.
    * @property {Object} images
    */
  list:{},
  /**
    * Retourne l'identifiant pour l'url +url+
    * @method idAbsFromUrl
    * @param {String} url   L'URL de l'image
    */
  idAbsFromUrl:function(url)
  {
    return url.replace(/[\/ '"\>\<\.]/g,'_')
  },
  /**
    * Ajoute une instance absolue d'image à la liste absolue
    * @note Contrairement à la méthode `add` l'image est ajoutée à
    *       la table `abs_list` et sa clé est son `abs_id`
    * @method abs_add
    * @param {Img} image  L'instance de l'image à ajouter
    */
  abs_add:function(image)
  {
    this.abs_list[image.abs_id] = image
  },
  /**
    * Ajoute une image à la liste des images
    * @note Contrairement à la méthode `abs_add` l'image est ajoutée à
    *       la table `list` et sa clé est son `id` unique
    * @method add
    * @param {Img} image  L'instance de l'image
    */
  add:function(image)
  {
    this.list[image.id] = image
  },
  /**
    * Méthode qui "pré-charge" l'image (quand le pas est une image — is_image)
    * afin qu'elle soit pleinement disponible au moment où le code sera joué.
    * Notes
    * -----
    *   * La méthode est utilisée au moment de la transformation du code en instances
    *     {Pas}. À la fin de cette transformation, on fait un tour des images et on
    *     attend qu'elles sont toutes chargées.
    *   * La méthode tient compte du fait que l'image a déjà pu être pré-loadée
    * @method preload_image
    * @protected
    */
  preload_image_of_code:function(code)
  {
    var found, url, absid ;
    if(found=code.match(/IMAGE\((.*)\)/))
    {
      if(url=found[1].replace(/ +/, ' ').match(/['"]?url['"]? ?: ?['"]([^'"]+)['"] ?,/))
      {
        url = url[1]
        absid = Img.idAbsFromUrl(url)
        if(undefined == Img.abs_list[absid]) new Img({url:url, abs:true})
        // Ce code force l'affichage hors-champ de l'image pour calcul de sa taille.
      }
    }
  },
  /**
    * Retourne le code HTML pour un listing des images utilisées en version
    * “thunder” pour un choix. Quand on les click, on invoque sur l'image la
    * méthode +onclick+ définie.
    *
    * Notes
    * -----
    *   Dans un premier temps, la méthode ne liste que les images instanciées au
    *   moment où le menu est activé. Mais un bouton "Chercher toutes les images"
    *   permet de chercher dans le code toutes les images.
    *
    * @method listing_html
    * @param {String} onclick   La méthode (d'instance) invoquée quand on clique sur l'image dans le listing construit
    * @param {Object} params    Paramètres optionnels
    *   @param  {Boolean} params.all_done   Permet de préciser que l'on vient de relever toutes les images dans le code, donc le bouton pour les chercher ne devra pas être affiché.
    * @return {String}  Le code HTML, dans un div "tool_listing_images" qui pourra
    *                   être géré par UI.Tools
    */
  html_listing:function(onclick, params)
  {
    if(undefined == params) params = {}
    var c = "", inststr ;
    L(this.abs_list).each(function(absid, image){
      inststr = "Img.abs_list['"+absid+"']"
      if($('img#img'+absid).length) return
      c += '<img id="img'+absid+'" src="'+image.url+'" style="width:120px;" onclick="$.proxy('+inststr+'.'+onclick+', '+inststr+')()" />'
    })
    if(!params.all_done)
    {
      // La méthode qui sera appelée pour suivre `find_all_images_in_code`
      // après la relève de toutes les images dans le code
      var prox = '$.proxy(Img.update_listing_html, Img, \''+onclick+'\')'
      c += '<div><input type="button" value="Chercher toutes les images dans le code" '+
            'onclick="$.proxy(Img.find_all_images_in_code, Img, '+prox+')()" /></div>'
    }
    return '<div id="tool_listing_images"><hr />'+c+'</div>'
  },
  /**
    * Méthode qui actualise le listing HTML des images
    * @method update_listing_html
    * @param {String} onclick     La méthode instance-image à appeler quand on clique sur l'image.
    */
  update_listing_html:function(onclick)
  {
    // dlog("-> update_listing_html")
    $('div#tool_listing_images').replaceWith(this.html_listing(onclick, {all_done:true}))
  },
  /**
    * Recherche toutes les images dans le code de la console
    * La méthode crée toutes les instances nécessaires.
    * Fonctionnement
    * --------------
    *   * La méthode passe simplement en revue toutes les lignes de code, repère
    *     celles contenant "IMAGE" et les exécute.
    *
    * @method find_all_images_in_code
    * @param {Function} poursuivre  La méthode pour suivre
    */
  find_all_images_in_code:function(poursuivre)
  {
    L(Console.get_code(null, null, true)).each(function(line){
      if(line.indexOf('IMAGE') < 0 ) return
      Img.preload_image_of_code( line )
    })
    this.get_taille_all_images.complete = poursuivre
    this.get_taille_all_images()
  },
 
  /**
    * Méthode asynchrone qui relève les dimensions de toutes les images de
    * l'animation et renseigne leurs instances dans `Img.abs_list`.
    * La méthode est appelée après la relève de toutes les images dans le code
    * au moment de la pré-estimation ou lorsque l'édition des images est demandée
    * Notes
    * -----
    *   * Si une méthode this.get_taille_all_images.complete est définie, elle est
    *     appelée lorsque la taille de toutes les images a été relevée
    *
    * @method get_taille_all_images
    */
  get_taille_all_images:function()
  {
    
    if(undefined == this.absids_images_not_traited)
    {
      this.absids_images_not_traited = L(this.abs_list).collect(function(absid,img){return absid})
    }
    else if(this.abs_timer) clearTimeout(this.abs_timer)
    
    var len = this.absids_images_not_traited.length
    var new_list = []
    for(var i=0; i<len; ++i)
    {
      var abs_id = this.absids_images_not_traited[i]
      var image  = this.abs_list[abs_id]
      if(image.abs_obj.length == 0) $('body').append(image.abs_code_html)
      else if(image.width && image.height) continue // image traitée
      if(false == image.get_width_and_height())
      {
        new_list.push(abs_id)
      }
    }
    if(new_list.length)
    { // => Il reste des images dont on n'a pas la taille
      // => On rappelle cette méthode après un court instant
      this.absids_images_not_traited = new_list
      this.abs_timer = setTimeout($.proxy(this.get_taille_all_images, this), 200)
    }
    else
    {
      // C'est la fin, on a pu relever la taille de toutes les images
      this.remove_images_absolues()
      if(this.get_taille_all_images.complete) this.get_taille_all_images.complete()
    }
  },
  /**
    * Méthode qui détruit tous les objets DOM des images absolues après
    * relève de leur taille.
    * @method remove_images_absolues
    */
  remove_images_absolues:function()
  {
    L(this.abs_list).each(function(id,image){image.abs_obj.remove()})
  }
})
/* Fin méthodes et propriétés de classe
 --------------------------------------------------------------------- */


/* ---------------------------------------------------------------------

     Instance

 --------------------------------------------------------------------- */

/* 
    === Methodes à utiliser dans le code === 
 */

$.extend(Img.prototype,{
  
  /**
    * Affiche l'image
    * @method show
    * @return {Img} L'instance, pour chainage
    */
  show:function(params)
  {
    params = define_complete( params )
    this.obj.animate({opacity:1}, Anim.delai_for('show'), params.complete)
    return this
  },
  /**
    * Masque l'image
    * @method hide
    * @param {Object} params  Paramètres optionnels
    *   @param {Function} params.complete   Méthode à appeler à la fin (NEXT_STEP par défaut)
    * @return {Img} L'instance, pour chainage
    */
  hide:function(params)
  {
    params = define_complete( params )
    this.obj.animate({opacity:0}, Anim.delai_for('show'), params.complete)
    return this
  },
  /**
    * Pour exécuter un travelling dans l'image
    * @method travelling
    * @param {Object} params    Paramètres (doit exister)
    *   @param {Number} params.seconds    La durée du travelling (optionnel)
    *   @param {Number} params.x          La position horizontale de fin du cadrage
    *   @param {Number} params.y          Position verticale de fin du cadrage
    *   @param {Number} params.width      La nouvelle largeur de cadre
    *   @param {Number} params.height     La nouvelle hauteur de cadre
    *   @param {Number} params.x_for      Nombre de pixels de déplacement horizontal
    *   @param {Number} params.y_for      Nombre de pixels de déplacement vertical
    *   @param {Function} params.complete La méthode pour suivre (NEXT_STEP par défaut)
    * @return {Img} L'instance, pour chainage
    */
  travelling:function(params)
  {
    if(undefined == params) return F.error("Il faut définir les paramètres du travelling !")
    params = define_complete( params )
    if(undefined != params.x_for)     params.x = this.cadre_offset_x + params.x_for
    if(undefined != params.y_for)     params.y = this.cadre_offset_y + params.y_for
    if(undefined == params.seconds)   params.seconds = 2
    if(!params.x && !params.y && !params.width && !params.height) return F.error("Il faut définir le mouvement du travelling !")
    var dtrav = {}
    if(undefined != params.x) dtrav.left = "-"+params.x+'px'
    if(undefined != params.y) dtrav.top  = "-"+params.y+'px'
    // On redimensionne le cadre si nécessaire
    var dcadre = {}
    if(undefined != params.width)   dcadre.width  = params.width  + 'px'
    if(undefined != params.height)  dcadre.height = params.height + 'px'
    if(dcadre != {}) this.obj.animate(dcadre)
    // On procède au travelling
    this.image.animate(dtrav, params.seconds * 1000, params.complete)
    // On passe les nouvelles valeurs
    if(params.x)      this.cadre_offset_x = params.x
    if(params.y)      this.cadre_offset_y = params.y
    if(params.width)  this.cadre_width    = params.width
    if(params.height) this.cadre_height   = params.height
    return this
  },
  
  /**
    * Méthode pour déplacer l'image
    * @method move
    * @param {Object} params  Définition du déplacement
    *   @param {Number} params.x      Nouvelle position horizontale
    *   @param {Number} params.x_for  Nombre de pixels de déplacement horizontal
    *   @param {Number} params.y      Nouvelle position verticale
    *   @param {Number} params.y_for  Nombre de pixels de déplacement vertical
    *   @param {Number} params.seconds  Durée du déplacement
    *   @param {Function} params.complete   Méthode à appeler en fin de déplacement
    * @return {Img} L'instance, pour chainage
    */
  move:function(params)
  {
    if(undefined == params) return F.error("Il faut définir le déplacement de l'image !")
    params = define_complete( params )
    if(undefined != params.x_for)     params.x = this.left + params.x_for
    if(undefined != params.y_for)     params.y = this.top  + params.y_for
    if(undefined == params.seconds)   params.seconds  = 2
    var dmove = {}
    if(undefined != params.x) dmove.left = params.x+'px'
    if(undefined != params.y) dmove.top  = params.y+'px'
    this.obj.animate(dmove, params.seconds * 1000, params.complete)
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
    NEXT_STEP(notimeout=true)
    return this
  }

})
/* === Protected Methods === */
$.extend(Img.prototype,{
  /**
    * Lorsque qu'une des deux valeurs width ou height n'est pas fournie au cours
    * de l'animation, on la calcule avec cette méthode.
    * @method calc_width_and_height
    */
  calc_width_and_height:function()
  {
    // L'image absolue de référence
    var abs_image = Img.abs_list[this.abs_id]
    
    // Lorsqu'il faut calculer la hauteur d'après la largeur fournie
    if(this.width && this.width != auto)
    { // => la largeur (width) est définie
      this.height = (this.width / abs_image.width) * abs_image.height
    }
    // Lorsqu'il faut calculer la largeur d'après la hauteur fournie
    else if(this.height && this.height != auto)
    { // => la hauteur (height) est définie
      this.width = (this.height / abs_image.height) * abs_image.width
    }
    else
    { // => les deux valeurs sont à auto, ou non définies
      this.width  = abs_image.width
      this.height = abs_image.height
    }
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
    NEXT_STEP()
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
    */
  positionne:function()
  {
    this.obj.draggable({stop:$.proxy(this.on_end_move, this)})
    this.obj.bind('dblclick', $.proxy(this.edit, this))
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
    * Objet DOM de l'image absolue
    * @property {jQuerySet} abs_obj
    */
  "abs_obj":{
    get:function(){return $('img#'+this.abs_id)}
  },
  /**
    * DOM Object de l'image (balise img)
    * @property {jQuerySet} image
    */
  "image":{get:function(){return $('img#'+this.id)}},
  
  /**
    * Code HTML pour l'image absolue
    * @property {HTMLString} abs_code_html
    */
  "abs_code_html":{
    get:function(){
      return '<img id="'+this.abs_id+'" src="'+this.url+'" style="position:absolute;top:-4000px;left:-4000px;"/>'
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
      
      // Attribut style pour le div de l'image
      stylediv.push('top:'+this.top+'px;left:'+this.left+'px')
      stylediv.push('width:'+(this.cadre_width || this.width)+'px')
      stylediv.push('height:'+(this.cadre_height || this.height)+'px')
      // Attribut style pour l'image
      if(this.width)  styleimg.push('width:'+this.width+'px')
      if(this.height) styleimg.push('height:'+this.height+'px')
      if(this.cadre_offset_x) styleimg.push('left:-'+this.cadre_offset_x+'px')
      if(this.cadre_offset_y) styleimg.push('top:-'+this.cadre_offset_y+'px')
      
      return  '<div id="'+this.dom_id+'" class="divimage" style="'+stylediv.join(';')+'">'+
                '<img id="'+this.id+'" class="image" src="'+this.url+'" style="'+styleimg.join(';')+'" />'+
              '</div>'
    }
  }
    
})