/**
  * @module Image_Class.js
  * Pour les propriétés et méthodes de class de Img
  */

/**
  * @class Img
  */
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
    *     distincte. En revanche, la table `abs_list` contient de façon unique toutes
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
    *     attend qu'elles soient toutes chargées.
    *   * La méthode tient compte du fait que l'image a déjà pu être pré-loadée
    * @method preload_image
    * @protected
    */
  preload_image_of_code:function(code)
  {
    var found, url, absid ;
    if(found=code.match(/IMAGE\((.*)\)/))
    {
      if(url=found[1].replace(/ +/, ' ').match(/['"]?url['"]? ?: ?['"]([^'"]+)['"]/))
      {
        url = url[1]
        absid = Img.idAbsFromUrl(url)
        if(undefined == Img.abs_list[absid]) new Img({url:url, abs:true})
        // Le code ci-dessus force l'affichage hors-champ de l'image pour calcul 
        // de sa taille.
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
