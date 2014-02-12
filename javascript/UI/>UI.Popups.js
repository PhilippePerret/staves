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
     *  MENU "FICHIER"
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
    /**
      * Méthode qui répond au menu "Ouvrir récent", quand on clique sur un
      * titre d'animation.
      */
    openrecent:function(item, path)
    {
      var danim = Anim.File.recent_anims[path]
      Anim.File.load( danim.name, danim.folder )
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
     *  MENU "OPTIONS"
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
     *  MENU OUTILS
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
      * Nettoyer les commandes flash du code
      * @method clearflash
      * @param {jQuerySet} item     Le menu qui appelle cette méthode
      * @param {Undefined|Boolean}  True quand la confirmation est donnée
      */
    clearflash:function(item, confirmed)
    {
      if(!confirmed)
      {
        // Faire la demande de confirmation
        Edit.show({
          width: 500,
          title: "Nettoyage des commandes FLASH dans le code",
          fields:{
            explication: "<div>Cette méthode retire toutes les commandes FLASH, STOP_FLASH, MODE_FLASH et STOP_MODE_FLASH du code actuel.</div>"
          },
          buttons:{
            ok:{name:"Nettoyer", onclick:$.proxy(UI.Popups.Methods.clearflash, UI.Popups.Methods, item, true)},
            cancel:{name:"Renoncer"}
          }
        })
      }
      else
      {
        // Nettoyer le code
        Console.clear_commandes_flash()
        F.show("Le code a été nettoyé, il peut être enregistré.")
      }
    },
    /**
      * Exporter le doublage ou les sous-titres
      * @method exporter
      * @param  {jQuerySet} item    L'item de menu
      * @param  {String}    what    Ce qu'il faut exporter ("doublage" ou "soustitres")
      */
    exporter:function(item, what)
    {
      Caption.export(what)
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
    * Ajoute une animation dans le menu des animations récemment ouvertes
    * Ou toutes les animations récentes au chargement de l'application.
    * @method add_recent_anim
    * @param {String} name    Le nom de l'animation
    * @param {String} folder  Le dossier de l'animtion
    */
  add_recent_anim:function(name, folder)
  {
    var anims = {} ;
    if('string' == typeof name)
    {
      // Au chargement d'une nouvelle animation (ou pas)
      var path = folder + "/" + name
      if(Anim.File.recent_anims && undefined != Anim.File.recent_anims[path]) return
      if(undefined == Anim.File.recent_anims) Anim.File.recent_anims = {}
      Anim.File.recent_anims[path] = {name:name, folder:folder}
      // Ajouter au menu (ci-dessous)
      this.add_popup_recent_anims(path, name, folder)
    }
    else
    {
      // Au chargement de l'application
      Anim.File.recent_anims = name
      this.peuple_recent_anims()
    }
  },
  /**
    * Ajoute l'animation au menu des animations récentes
    * @method add_popup_recent_anims
    * @param {String} path    Le path
    * @param {String} name    Le nom de l'animation
    * @param {String} folder  Le dossier de l'animation
    */
  add_popup_recent_anims:function(path, name, folder)
  {
    var title = name.replace(/_/g, ' ')
    var li_id = 'recent' + path.replace(/[\/ ]/g, '_')
    if(folder != "") title += " -- <span class=\"small\">"+folder+"</span>" ;
    $('ul#recent_anims').prepend('<li id="'+li_id+'" data-item="openrecent::'+path+'">' + title +'</li>')
    $('section#app_popups ul#recent_anims li#'+li_id).bind('click', function(){ UI.Popups.onchoose($(this))})
  },
  /**
    * Peuple le menu des animations récentes au chargement de l'application
    * Notes
    *   * Les animations sont classées de la plus récente à la plus ancienne
    *     grâce à la propriété :time des données de l'animation.
    *
    * @method peuple_recent_anims
    */
  peuple_recent_anims:function()
  {
    // Classer les animations par le temps (la plus vieille en premier puisque
    // le peuplement se fait en ajoutant le menu au-dessus)
    var arr = []
    L(Anim.File.recent_anims).each(function(path, danim){ arr.push(danim )})
    arr.sort(function(a1, a2){ return a1.time - a2.time })
    var my = this
    L(arr).each(function(danim){ my.add_popup_recent_anims(danim.path, danim.name, danim.folder) })
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