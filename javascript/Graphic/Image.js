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
  if(!Img.virtual_operation) image.build()
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
    * @proprety {String} id
    */
  this.id   = 'img'+(new Date()).getTime()
  
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
  L(params || {}).each(function(k,v){
    me[k] = v
  })
  
  Img.add(this)
}
/* ---------------------------------------------------------------------
     Classe
 --------------------------------------------------------------------- */
$.extend(Img,{
  /**
    * Liste {Object} des images instanciées
    * En clé l'identifiant de l'image et en valeur l'instance image.
    * @property {Object} images
    */
  list:{},
  /**
    * Détermine une opération virtuelle en cours, c'est-à-dire une opération
    * dont les résultats ne doivent pas être affichés. 
    * On en a besoin par exemple lors de la relève des images dans le code, où
    * les lignes créant des images sont interprétés, mais il ne faut pas construire
    * les images comme le ferait la fonction IMAGE.
    * Note
    * ----
    *   * Le lancement de l'animation remet automatiquement ce paramètre à false.
    * @property {Boolean} virtual_operation
    * @default false
    */
  virtual_operation:false,
  /**
    * Ajoute une image à la liste des images
    * @method add
    * @param {Img} image  L'instance de l'image
    */
  add:function(image)
  {
    this.list[image.id] = image
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
    *   permet de cherche dans le code toutes les images.
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
    L(this.list).each(function(iid, image){
      inststr = "Img.list['"+iid+"']"
      c += '<img src="'+image.url+'" style="width:120px;" onclick="$.proxy('+inststr+'.'+onclick+', '+inststr+')()" />'
    })
    if(!params.all_done)
    {
      // La méthode qui sera appelée pour suivre `find_all_images_in_code`
      // après la relève de toutes les images dans le code
      var prox = '$.proxy(Img.update_listing_html, Img, \''+onclick+'\')'
      c += '<div><input type="button" value="Chercher toutes les images dans le code" '+
            'onclick="$.proxy(Img.find_all_images_in_code, Img, '+prox+')()" /></div>'
    }
    return '<div id="tool_listing_images">'+c+'</div>'
  },
  /**
    * Méthode qui actualise le listing HTML des images
    * @method update_listing_html
    * @param {String} onclick     La méthode instance-image à appeler quand on clique sur l'image.
    */
  update_listing_html:function(onclick)
  {
    dlog("-> update_listing_html")
    $('div#tool_listing_images').replaceWith(this.html_listing(onclick, {all_done:true}))
  },
  /**
    * Recherche toutes les images dans le code de la console
    * La méthode crée toutes les instances nécessaires.
    * Fonctionnement
    * --------------
    *   * La méthode passe simplement en revue toutes les lignes de code, repère
    *     celles contenant "IMAGE" est les exécute.
    *
    * @method find_all_images_in_code
    * @param {Function} poursuivre  La méthode pour suivre
    */
  find_all_images_in_code:function(poursuivre)
  {
    this.virtual_operation = true // pour empêcher la fabrication des images
    L(Console.get_code(null, null, true)).each(function(line){
      if(line.indexOf('IMAGE') < 0 ) return
      eval('Anim.Objects.'+line)
    })
    if('function'==typeof poursuivre) poursuivre()
  }
})
/* Fin méthodes et propriétés de classe
 --------------------------------------------------------------------- */


/* ---------------------------------------------------------------------

     Instance

 --------------------------------------------------------------------- */

/* === Methodes à utiliser dans le code === */
$.extend(Img.prototype,{
  
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
    */
  travelling:function(params)
  {
    if(undefined == params) return F.error("Il faut définir les paramètres du travelling !")
    if(undefined != params.x_for)     params.x = this.cadre_offset_x + params.x_for
    if(undefined != params.y_for)     params.y = this.cadre_offset_y + params.y_for
    if(undefined == params.seconds)   params.seconds = 2
    if(undefined == params.complete)  params.complete = NEXT_STEP
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
    */
  move:function(params)
  {
    if(undefined == params) return F.error("Il faut définir le déplacement de l'image !")
    if(undefined != params.x_for)     params.x = this.left + params.x_for
    if(undefined != params.y_for)     params.y = this.top  + params.y_for
    if(undefined == params.complete)  params.complete = NEXT_STEP
    if(undefined == params.seconds)   params.seconds  = 2
    var dmove = {}
    if(undefined != params.x) dmove.left = params.x+'px'
    if(undefined != params.y) dmove.top  = params.y+'px'
    this.obj.animate(dmove, params.seconds * 1000, params.complete)
  },
  
  /**
    * Méthode pour changer la source de l'image
    * @method src
    */
  src:function(new_url)
  {
    this.url = new_url
    this.width  = null
    this.height = null
    this.image.css({width:null, height:null})
    this.image[0].src = new_url
    NEXT_STEP(notimeout=true)
  }



})
/* === Protected Methods === */
$.extend(Img.prototype,{
  /**
    * Affiche l'image
    * @method show
    */
  show:function()
  {
    this.obj.show(Anim.delai_for('show'))
  },
  /**
    * Masque l'image
    * @method hide
    */
  hide:function()
  {
    this.obj.hide(Anim.delai_for('show'))
  },
  /**
    * Construit l'image
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
    * Le DIV contenant l'image
    * @property {jQuerySet} obj
    */
  "obj":{get:function(){return $('div#divimage-'+this.id)}},
  /**
    * DOM Object de l'image (balise img)
    * @property {jQuerySet} image
    */
  "image":{get:function(){return $('img#'+this.id)}},
  
  /**
    * Code HTML de l'image
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
      
      return  '<div id="divimage-'+this.id+'" class="divimage" style="'+stylediv.join(';')+'">'+
                '<img id="'+this.id+'" class="image" src="'+this.url+'" style="'+styleimg.join(';')+'" />'+
              '</div>'
    }
  }
    
})