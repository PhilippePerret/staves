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
    /* ---------------------------------------------------------------------
     *  Menu "Fichier"
     *  
     */
    
    /**
      * Nouvelle animation demandée
      * @method new
      */
    new:function(item)
    {
      Anim.new()
    },
    /**
      * Demande de rechargement de l'animation
      * @method reload
      */
    reload:function(item)
    {
      Anim.File.reload()
    },
    open:function(item){
      Anim.want_open()
    },
    save:function(item){
      Anim.File.save()
    },
    save_as:function(item)
    {
      Anim.File.save_as()
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
    /* ---------------------------------------------------------------------
     *  Menu "Options"
     *  
     */
    /**
      * Appelé pour activer/désactiver la sauvegarde automatique
      * @method autosave
      */
    autosave:function(item)
    {
      Anim.options.autosave = !Anim.options.autosave
      item.html((Anim.options.autosave?"Désa":"A")+"ctiver Auto-Save")
    },
    /**
      * Appelé pour activer/désactiver l'omission des doublages
      * @method caption_omit
      */
    caption_omit:function(item)
    {
      Anim.options.caption_omit = !Anim.options.caption_omit
      item.html((Anim.options.caption_omit?"Jouer":"Omettre")+" les doublages")
    },
    /**
      * Méthode appelée pour fixer la taille actuelle du cadre comme taille pour
      * l'animation courante.
      * @method set_screensize
      * @param {jQuerySet}  item  Le menu appelant cette méthode
      */
    set_screensize:function(item)
    {
      var height = $('section#animation').height(),
          code   = "DEFAULT('screensize', "+height+")" ;
      
      F.show("Code à copier-coller dans le code de l'animation :"+
      '<input type="text" value="'+code+'" onfocus="this.select()" style="width:200px;"/>')
    },
    /**
      * Définit la taille de l'animation
      * @method screensize
      * @param {jQuerySet}  item  Le menu affilité (il y en a 3 qui peuvent appeler cette méthode)
      * @param {String}     size  La taille choisie ('adapt', '480p' ou '720p')
      */
    screensize:function(item, size)
    {
      UI.Popups.deselect("screensize::"+Anim.options.screensize)
      Anim.set_pref('screensize', size, next_step = false)
      if(size != 'adapt')
      {
        F.show("Pour que cette animation soit affichée en "+size+", il faut ajouter :\n\t\tDEFAULT('screensize', '"+size+"')\n… en début de code.")
      }
    },
    /**
      * Méthode option pour masquer ou non les éléments en cours d'animation
      * OBSOLÈTE
      * @method keep
      * @param {jQuerySet} item Le menu affilié
      */
    fullscreen:function(item)
    {
      Anim.options.fullscreen = !Anim.options.fullscreen
      item.html((Anim.options.fullscreen?"Pas de plein écran":"Anim en plein écran"))
    },
    
    /* ---------------------------------------------------------------------
     *  Menu "Outils"
     *  
     */
    autocomplete_on:false,
    autocompletion:function(item)
    {
      this.autocomplete_on = !this.autocomplete_on
      UI.Tools[(this.autocomplete_on?'show':'hide')+'_autocompletion']()
      item.html((this.autocomplete_on ? "Masquer":"Afficher") + " les données complétion")
    },
    /**
      * Afficher le manuel
      * @method manual
      */
    manual:function(item){window.open('manuel.html', "aide_staff_animation")},
    /**
      * Afficher les mesures courantes
      * @method infos
      */
    infos_on:false,
    infos:function(item)
    {
      this.infos_on = !this.infos_on
      $('section#infos')[this.infos_on ? 'show' : 'hide']()
      item.html((this.infos_on ? "Masquer":"Afficher") + " les mesures courantes")
    },
    /**
      * Méthode qui affiche ou masque la grille
      * @method grid
      * @param {jQuerySet} item Le menu affilié
      */
    grid:function(item)
    {
      Anim.options.grid = !Anim.options.grid
      $('div#grid')[Anim.options.grid?'show':'hide']()
      item.html(Anim.options.grid?"Masquer la grille":"Afficher la grille")
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
    },
    /**
      * Méthode pour activer les coordonnées, outils qui permet de récupérer
      * des coordonnées à l'écran
      * @method coordonnees
      */
    coordonnees_on:false,
    coordonnees:function(item)
    {
      this.coordonnees_on = !this.coordonnees_on
      item.html((this.coordonnees_on ? "Désactiver" : "Activer") + " coordonnées")
      if(this.coordonnees_on)
      {
        UI.Tools.coordonnees_active()
      }
      else
      {
        UI.Tools.coordonnees_desactive()
      }
    },
    /*
     *  Méthodes du menu ANIMATION
     *  
     */
    /**
      * Définit ce qu'il faut jouer
      * @method play
      * @param {String} what  Ce qu'il faut jouer ('selection', 'all', etc.)
      */
    play:function(item, what)
    {
      Anim.onchange_play_type(what)
    }
  },
  /* Fin des méthodes qui correspondent aux menus
   * --------------------------------------------------------------------- */
  
  /**
    * = Main =
    * Méthode appelée quand on choisit un item de menu
    * Notes
    * -----
    *   * Chaque menu contient un attribut 'data-item' qui définit la méthode
    *     à appeler (this.Methods.<method>)
    *   * Si `data-item` contient "::", la méthode est avant "::" et ensuite
    *     c'est un argument à envoyer à la méthode. Cf. par exemple le menu Animation
    *
    * @method onchoose
    * @param {jQuerySet} item L'objet DOM (jQuery) du menu cliqué
    */
  onchoose:function(item)
  {
    var method = item.attr('data-item'), dmethod, arg ;
    if(method.indexOf('::') > -1)
    {
      dmethod = method.split('::')
      method  = dmethod[0]
      arg     = dmethod[1]
    }
    if(item.hasClass('disabled')) return false
    this.Methods[method](item, arg)
  },
  
  /**
    * Méthode qui ré-active un menu si la condition est remplie
    * @method enableIf
    * @param {String} menu  Le menu (son data-item)
    * @param {Boolean} condition La condition. Si true => activation
    */
  enableIf:function(menu, condition)
  {
    return this.unableIf(menu, !condition)
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
    menu[condition ?'addClass':'removeClass']('disabled')
  },
  /**
    * Sélectionne un menu (lorsque c'est un choix entre plusieurs options, comme pour
    * ce qu'il faut jouer)
    * @method select
    * @param {String|jQuerySet} menu Le menu ou le "data-item" du LI
    */
  select:function(menu)
  {
    if('string' == typeof menu) menu = this.section.find('li[data-item="'+menu+'"]')
    menu.addClass('selected')
  },
  /**
    * Désélectionne un menu (lorsque c'est un choix entre plusieurs options, comme pour
    * ce qu'il faut jouer)
    * @method deselect
    * @param {String|jQuerySet} menu Le menu ou le "data-item" du LI
    */
  deselect:function(menu)
  {
    if('string' == typeof menu) menu = this.section.find('li[data-item="'+menu+'"]')
    menu.removeClass('selected')
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