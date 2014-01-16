/**
  * @module UI.Popups
  */

/**
  * Gestion des menus principaux
  *
  * @class UI.Popups
  * @static
  */
window.UI.Popups = {
  /**
    * Objet définissant les méthodes de traitement des menus. Chaque méthode 
    * correspond au `data-item` du menu.
    * @class UI.Popups.Methods
    * @static
    */
  Methods:{
    /**
      * Demande de rechargement de l'animation
      * @method reload
      */
    reload:function(item)
    {
      Anim.reload()
    },
    open:function(item){
      UI.Tools.show('animations')
    },
    save:function(item){
      Anim.save()
    },
    save_as:function(item)
    {
      UI.Tools.show('save_as')
    },
    /**
      * Demande de mise de l'animation courante comme animation par défaut
      * @method def_anim
      */
    def_anim:function(item)
    {
      UI.Popups.unableIf(item, true)
      Anim.set_current_as_default()
    },
    /**
      * Afficher le manuel
      * @method manual
      */
    manual:function(item){window.open('manuel.html', "aide_staff_animation")},
    /**
      * Afficher les informations courantes
      * @method infos
      */
    infos_on:false,
    infos:function(item)
    {
      $('section#infos')[this.infos_on ? 'hide' : 'show']()
      this.infos_on = !this.infos_on
    },
    /**
      * Méthode qui affiche ou masque la grille
      * @method grid
      * @param {jQuerySet} Le menu affilié
      */
    grid:function(item)
    {
      Anim.options.grid = !Anim.options.grid
      $('div#grid')[Anim.options.grid?'show':'hide']()
      item.html(Anim.options.grid?"Masquer la grille":"Afficher la grille")
    },
    /**
      * Méthode option pour masquer ou non les éléments en cours d'animation
      * @method keep
      * @param {jQuerySet} Le menu affilié
      */
    fullscreen:function(item)
    {
      Anim.options.fullscreen = !Anim.options.fullscreen
      item.html((Anim.options.fullscreen?"Pas de plein écran":"Anim en plein écran"))
    },
    /**
      * Menu "Cadrage image" actionné
      * La méthode affiche une liste des images courantes pour les éditer
      * @method cadrage
      */
    cadrage:function(item)
    {
      UI.Tools.add(Img.html_listing('edit'))
      UI.Tools.show('listing_images')
    }
  },
  /* Fin des méthodes qui correspondent aux menus
   * --------------------------------------------------------------------- */
  
  /**
    * = Main =
    * Méthode appelée quand on choisit un item de menu
    * @method onchoose
    * @param {jQuerySet} item L'objet DOM (jQuery) du menu cliqué
    */
  onchoose:function(item)
  {
    var method = item.attr('data-item')
    this.Methods[method](item)
  },
  
  /**
    * Méthode qui active ou désactive le menu_id en fonction de la condition
    * +condition+
    * @method unableIf
    * @param {String|jQuerySet}   menu   Le menu lui-même ou le "data-item" du menu
    * @param {Boolean}  condition   Si true, désactive, si false (ré-)active
    */
  unableIf:function(menu, condition)
  {
    if('string' == typeof menu) menu = this.section.find('li[data-item="'+menu+'"]')
    var data  = condition ? {opacity:0.5, 'font-style':'italic'} : {opacity:1, 'font-style':"normal"}
    menu.css(data)
  },
  
  /**
    * Préparation des popups à l'ouverture de l'application
    * @method prepare
    */
  prepare:function()
  {
    $('section#app_popups li[data-item]').bind('click', function(){ UI.Popups.onchoose($(this))})
  }
}

Object.defineProperties(UI.Popups,{
  /**
    * Objet DOM de la section Popup
    * @property {jQuerySet} section
    */
  "section":{get:function(){return $('section#app_popups')}}
  
})