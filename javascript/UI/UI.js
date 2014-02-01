/**
  * @module UI.js
  */

/**
  * @class UI
  * @static
  */
if(undefined == window.UI) window.UI = {}
$.extend(UI,{
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
    * @param {Object} obj     L'objet porteur (l'instance)
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
      case 'offset_x':
      case 'for_x'   :
        prop  = 'left'
        value = (obj.x || obj.x_default) + value
        break
      case 'y':
        prop = 'top'
        break
      case 'offset_y':
      case 'for_y'   :
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
    * Écrit un message de feedback
    * @method feedback
    * @param  {String} message  Le message à afficher
    */
  feedback:function(message)
  {
    var o = $('div#ui_feedback')
    o.html(message)
    if(message == "") o.hide()
    else o.show()
  },
  /**
    * Prépare l'interface au chargement de l'application
    * @method prepare
    */
  prepare_on_load:function()
  {
    this.Regle.prepare()
    this.onresize_window()
    this.Popups.prepare()
    Console.set('')
    $('input[type="text"], textarea').bind('focus',function(){IN_TEXT_FIELD = true})
    $('input[type="text"], textarea').bind('blur',function(){IN_TEXT_FIELD = false})
    Console.console.bind('blur', $.proxy(Console.onblur, Console))
    Console.console.bind('focus', $.proxy(Console.onfocus, Console))
    this.chronometre = Horloge.create()
  },
  /**
    * Retourne la vraie largeur de l'objet DOM +obj+ en tenant compte de
    * ses paddings et autres border
    * @method exact_width_of
    * @param {jQuerySet} obj
    * @return {Number} Le nombre de pixels qu'occupe l'objet à l'écran
    */
  exact_width_of:function(obj)
  {
    return  obj.width() +
            this.prop_of_obj(obj, 'padding-left')       + 
            this.prop_of_obj(obj, 'padding-right')      +
            this.prop_of_obj(obj, 'border-left-width')  +
            this.prop_of_obj(obj, 'border-right-width')
  },
  /**
    * Retourne la vraie hauteur de l'objet DOM +obj+ en tenant compte de
    * ses paddings et autres border
    * @method exact_height_of
    * @param {jQuerySet} obj
    * @return {Number} Le nombre de pixels qu'occupe l'objet à l'écran
    */
  exact_height_of:function(obj)
  {
    return  obj.height() +
            this.prop_of_obj(obj, 'padding-top') + 
            this.prop_of_obj(obj, 'padding-bottom') +
            this.prop_of_obj(obj, 'border-top-width') +
            this.prop_of_obj(obj, 'border-bottom-width')
  },
  /**
    * Retourne la valeur de la propriété +prop+ de l'objet +obj+
    * @method prop_of_obj
    * @param  {jQuerySet} obj
    * @param  {String}    prop
    * @return {Number}    La valeur numéraire de la propriété
    */
  prop_of_obj:function(obj, prop)
  {
    return this.css2number(obj.css(prop))
  },
  /** 
    * Prends une valeur de type "12px" et retourne 12
    * @method css2number
    * @param  {String} la valeur
    * @return {Number} le nombre de pixels (ou autre unité)
    */
  css2number:function(valeur)
  {
    return parseInt(valeur, 10)
  },
  /**
    * Données pour l'écran (en fonction de Anim.options.screensize)
    * @class DATA_SCREEN
    * @static
    * @final
    */
  DATA_SCREEN:{
    '720p'  : {width: 1280, height:720,   font_size:'1.3em'},
    'adapt' : {width: null, height:null,  font_size:'12.6pt'},
    '480p'  : {width: 854,  height:480,   font_size:'12.6pt'}
  },
  /**
    * Redimensionne les éléments dans la fenêtre
    * Notes
    *   * La méthode est appelée au chargement de l'application
    *
    * @method onresize_window
    */
  onresize_window:function(evt)
  {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight,
        screensize, data_screen, anim_width, anim_height ;
  
  
    // anim_width      = parseInt(x * 70/100)
    // anim_height     = parseInt(y * 78/100)
    screensize  = Anim.options.screensize
    data_screen = this.DATA_SCREEN[screensize]
    if(screensize == 'adapt')
    {
      data_screen.width   = parseInt(x * 70/100)
      data_screen.height  = data_screen.width * 9 / 16
    }
    anim_width  = parseInt(data_screen.width)
    anim_height = parseInt(data_screen.height)
    
    var oanim     = $('section#animation')
    var pos_anim  = oanim.position()
    oanim.css({
      width : anim_width+"px", 
      height: anim_height+"px"}
    )
    Anim.Dom.width  = anim_width
    Anim.Dom.height = anim_height
    
    // Dimensions pour la console
    console_width         = x - anim_width - 40
    Console.width_ranged  = console_width
    Console.width_opened  = anim_width
    Console.height        = anim_height + 16
    Console.section.css({height: Console.height+'px', width:Console.width_opened+'px'})
    Console.console.css({
      height: (Console.height - 40)+'px',
      'font-size': data_screen.font_size
    })
    Console.range()

    // La position des sous-titres
    $('div#caption').css({
      top   : (anim_height - 25)+'px',
      width : (anim_width / 2)+'px',
      left  : (10 + (anim_width / 4))+'px'
    })

    // La position de la règle de mesure
    if(this.Regle && this.Regle.obj.length) this.Regle.obj.css({top:(anim_height - 10)+'px'})
    // Positions pour la grille (grid)
    Anim.Grid.obj.css({
      top     :pos_anim.top+'px', 
      left    :(pos_anim.left + 15)+'px',
      width   :anim_width+'px',
      height  :anim_height+'px'
    })
    Anim.Grid.cursor.css({height:(anim_height-10)+'px'})
    Anim.Grid.set_cursor()
    
    Anim.Dom.left_max = anim_width - 40
  },
  /**
    * Peuple le menu des applications avec la liste +arr+
    * @method peuple_liste_animations
    * @param {Array} arr  Liste du contenu du dossier courant.
    *                       C'est un Array d'objets définissant :path (chemin
    *                       relatif depuis ./anim), :dir (à true si c'est un dossier)
    *                       et :name (affixe de l'animation)
    * @param  {String} folder   Le dossier dont on affiche le contenu
    */
  peuple_liste_animations:function(arr, folder)
  {
    $('select#animations').html('')
    // S'il y a un dossier supérieur
    if(folder != "") this.build_path_folders(folder)
    L(arr).each(function(danim){
      var css = danim.dir ? "folder" : "anim" ;
      $('select#animations').append('<option class="'+css+'" value="'+danim.path+'">'+danim.name+'</option>')        
    })
  },
  /**
    * Méthode qui actualise la liste des dossiers (à l'ouverture d'une animation)
    * @note C'est la méthode Anim.set_anim qui appelle cette méthode, ainsi que
    * la méthode précédente.
    * @method build_path_folders
    * @param  {String} path   Le chemin du dossier (= Anim.File.folder)
    */
  build_path_folders:function(path)
  {
    var menu  = $('select#folders_animations')
    menu.html('')
    var cur_path = ""
    L($.merge(['Animations'], (path || "").split('/'))).each(function(dossier){
      if(!(cur_path == "" && dossier == "Animations")) cur_path += dossier + "/"
      menu.prepend('<option value="'+cur_path+'">' + dossier + '</option>')
    })
    menu[0].selectedIndex = 0
  },
  /**
    * Modifie le nom courant de l'animation
    * Note
    *   * La méthode est appelée après avoir changé le nom du fichier
    *     enregistré
    *   * La méthode modifie également le nom Anim.name
    *
    * @method change_animation_name
    * @param  {String} L'ancien nom (le nom actuel)
    * @param  {String} Le nouveau nom
    */
  change_animation_name:function(new_name, new_path)
  {
    code = '<option value="'+new_path+'">'+new_name+'</option>'
    $('select#animations').append(code)
  },
  add_new_animation_to_menu:function(new_name, new_path)
  {
    $('select#animations').append('<option value="'+new_path+'">'+new_name+'</option>')
  }
  
  
})

/**
  * Appelé quand on redimensionne la page
  * @method onresize
  * @for window
  */
window.onresize = $.proxy(UI.onresize_window,UI)

