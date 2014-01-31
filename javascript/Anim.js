/**
  * @module Anim
  */

/* ---------------------------------------------------------------------
  * Constantes utiles
  */
/**
  * Constante permettant de passer ou d'arrêter le mode "flash" qui permet
  * de jouer très rapidement une partie de l'animation.
  *
  * @property {Boolean} MODE_FLASH
  * @for window
  * @default false
  *
  */
window.MODE_FLASH = false

/**
  * Pour imposer une attente sans passer par aucun objet
  * Tant que la valeur est true, impossible de passer à l'étape suivante
  * @property {Boolean} WAITING
  * @default false
  */
window.WAITING = false

/* --------------------------------------------------------------------- */
/**
  * Objet Anim pour jouer l'animation
  *
  * @class Anim
  * @static
  */
if(undefined == window.Anim) window.Anim = {}
$.extend(window.Anim,{
  
  /**
    * Propriété mise à true lorsque l'animation est en cours d'enregistrement
    * @property {Boolean} recording
    * @default false
    */
  recording: false,
  
  /**
    * Propriété mise à TRUE si l'animation en cours de jeu possède une
    * suite.
    * @property {Boolean} hasSuite
    * @default false
    */
  hasSuite: false,
  
  /**
    * Propriété mise à TRUE si l'animation en cours est la suite d'une autre
    * animation.
    * @property {Boolean} isSuite
    * @default false
    */
  isSuite: false,
  
  /* ---------------------------------------------------------------------
   *  OPTIONS
   *  
   */
  /**
    * Options diverses
    * @class Anim.options
    * @static
    */
  options:{
    /**
      * Quand True, joue l'animation en plein écran
      * @property {Boolean} fullscreen
      */
    fullscreen        :false,
    /**
      * Quand True, affiche la grille
      * @property {Boolean} grid
      */
    grid              :false,
    /**
      * Pour sauvegarder ou non automatiquement le code modifié
      * @property {Boolean} autosave
      * @default false
      */
    autosave          :false,
    /**
      * Pour passer les captions (sous-titre et doublage) en cours d'élaboration
      * de l'animation.
      * @property {Boolean} caption_omit
      * @default false
      */
    caption_omit      :false
  },
  /* Fin des options
   * --------------------------------------------------------------------- */
  
  
  /* ---------------------------------------------------------------------
   *  TRANSITIONS
   *  
   */
  /**
    * Data vitesse (constantes)
    * Serviront à calculer transition_reg en cas de modification de
    * la vitesse de l'animation
    * @property {Object} TRANSITIONS
    * @static
    * @final
    */
  TRANSITIONS:{
    step        : 0.5,
    show        : 0.4,
    move        : 1,   // Déplacement quelconque d'un objet
    note_moved  : 1,
    fade        : 1.5,
    transform   : 1,   // Transformation comme l'allongement
    wait        : 1       // multiplicateur pour la commande WAIT
  },
  /**
    * Définition de la vitesse (ou plutôt la durée) des transitions courantes
    *
    * Notes
    * -----
    *   * C'est cette table-ci qui est utilisée pour définir les durées courantes
    *   Cf. le mode "flash" qui peut modifier ces valeurs
    *       `mode_flash`
    * @property {Object} transition
    *   @property {Number} transition.step  Délai entre chaque étape (en millisecondes)
    *   @property {Number} transition.show Vitesse d'apparition de tout élément
    *   @property {Number} transition.note_moved  Délai de déplacement des notes (en millisecondes ?)
    */
  transition:{
    step        : 0.5,
    show        : 0.4,
    move        : 1,   // Déplacement quelconque d'un objet
    note_moved  : 1,
    fade        : 1.5,
    transform   : 1,    // Transformation comme l'allongement
    wait        : 1     // multiplicateur pour la commande WAIT
  },
  /**
    * Vitesses normales
    * Notes
    * -----
    *   * Ces valeurs seront affectées par `Anim.prefs.speed_coef`
    * @property {Object} transition_reg
    */
  transition_reg:{
    step        : 0.5,
    show        : 0.4,
    move        : 1,   // Déplacement quelconque d'un objet
    note_moved  : 1,
    fade        : 1.5,
    transform   : 1,      // Transformation comme l'allongement
    wait        : 1       // multiplicateur pour la commande WAIT
  },
  /**
    * Vitesses flash
    * @property {Object} transition_flash
    * @static
    * @final
    */
  transition_flash:{
    step        : 0.001,
    show        : 0.001,
    move        : 0.001,   // Déplacement quelconque d'un objet
    note_moved  : 0.005,
    fade        : 0.001,
    transform   : 0.001,
    wait        : 0
  },

  /* ---------------------------------------------------------------------
   *  PRÉFÉRENCES
   *  
   */
  /**
    * Toutes les préférences par défaut
    * Elles servent à redéfinir les valeurs de Anim.prefs au démarrage de l'animation
    * @property {Object} prefs_default
    * @static
    * @final
    */
  prefs_default:{
    /**
      * Nombre de secondes de décompte avant le lancement de l'animation
      * @property {Number} decomte
      * @default 2
      */
    decompte          :2,
    /** Décalage haut de la première portée affichée
      * @property {Number} staff_top 
      */
    staff_top         :60,
    /** Décalage entre portée
      * @property {Number} staff_offset 
      */
    staff_offset      :100,
    /** Décalage des textes de portée
      * Note : cette valeur sera RETIRÉE du top de la portée (selon le principe
      * que les valeurs positives éloignent toujours de la portée, et qu'un texte
      * de portée est par défaut au-dessus de la portée)
      * @property {Number} staff_top_text
      */
    staff_top_text    :0,
    /** Positionnement des textes de portée, au-dessus (défaut) ou en dessous
      * de la portée
      * @property {Boolean} staff_text_up
      # @default TRUE
      */
    staff_text_up     :true,
    /** Position left de départ pour chaque portée
      * @property {Number} x_start 
      */
    x_start           :100,
    /**
      * Décalage à droite quand la commande NEXT est utilisée
      * @property {Number} next 
      */
    next              :40,  
    /**
      * Décalage vertical de la marque d'harmonie ou de cadence par rapport à
      * la portée.
      * @property {Number} harmony 
      */
    harmony           :20, 
    /**
      * Portée qui doit porter l'harmonie. Pour faire porter l'harmonie
      * par une portée particulière, quelle que soit la portée active
      * @note : elle peut être définie même si la portée n'existe pas encore,
      * puisqu'un check est fait à la création de toute portée (cf. Staff.create)
      * @property {Staff|Numbre} staff_harmony
      * @default NULL
      */
    staff_harmony     :null,
    /**
      * Portée qui doit porter les accords.
      * @note : elle peut être définie même si la portée n'existe pas encore,
      * puisqu'un check est fait à la création de toute portée (cf. Staff.create)
      * @property {Staff|Number} staff_chords
      * @default NULL
      */
    staff_chords      :null,
    /**
      * Position verticale du numéro de mesure
      * @property {Number} num_measure_y
      */
    num_measure_y     :22, //-8,
    /**
      * Décalage de la marque d'accord par rapport à la portée.
      * @property {Number} chord 
      */
    chord             :46, 
    /**
      * Décalage horizontal de la marque de modulation par rapport à l'objet
      * qui la porte (souvent, un accord ou une note)
      * @property {Number} modulation_y
      */
    modulation_x      :-8,
    /**
      * Décalage vertical de la marque de modulation par rapport à la portée
      * @property {Number} modulation_y
      */
    modulation_y      :50,
    /**
      * Décalage horizontal de la marque de modulation par rapport à l'objet
      * porteur.
      * @property {Number} part_x
      */
    part_x            :25, // 17 et il faut ajouter 8
    /**
      * Décalage vertical de la marque de modulation par rapport à l'objet
      * porteur.
      * @property {Number} part_y
      */
    part_y            :46,
    /**
      * Coefficiant de vitesse final, calculé à partir du slider du controller
      * et de la définition éventuelle de la préférence `speed` (ci-dessous).
      * Cette valeur sert de multiplicateur de durée, donc plus elle est élevée,
      * plus la durée est longue. Seules les valeurs positives inférieures à 1
      * provoque une accélération. 
      * @property {Number} speed_coef
      * @default 1
      */
    speed_coef        :1,
    /**
      * Coefficiant vitesse
      * @property {Number} speed 
      * @default 1
      */
    speed             :1,
    /** Taille des notes (et altérations)
      * @property {Number} note_size 
      */
    note_size         :14.3,
    /**
      * Hauteur des notes
      * @property {Float} note_height
      */
    note_height       :13,
    /**
      * Temps d'attente à la fin de l'anim
      * @property {Number} delai_after_show
      */
    delai_after_show  :3,
    /**
      * Si false, les CAPTION afficheront le texte en doublage, hors de l'animation
      * Sinon, ils seront affichés comme des sous-titres, dans l'image de l'animation
      * @property {Boolean} doublage
      * @default true
      */
    caption           :false,
    /**
      * Débit de parole pour les captions (doublage seulement).
      * `caption_timer` doit être true pour que le débit soit activé.
      * @property {Number} caption_debit
      * @default 1
      */
    caption_debit     :1,
    /**
      * Si true, les doublages seront affichés comme s'ils étaient lus
      * @property {Boolean} caption_timer
      * @default false
      */
    caption_timer     :false,
    /**
      * Couleur par défaut des texte
      * Noter que la valeur est modifiée quand on définit un BACKGROUND sur
      * certaines valeurs
      * @property {String} text_color
      */
    text_color        : 'black',
    /**
      * Police par défaut des tboxes
      * Doit être défini par l'user pour ne pas être null
      * @property {String} tbox_font_family
      * @default null
      */
    tbox_font_family  : null, //'Verdana' dans les CSS,
    /**
      * Taille par défaut de la police de texte (en points — pt)
      * Doit être défini par l'user pour ne pas être null
      * @property {Number} tbox_font_size
      * @default null
      */
    tbox_font_size    : null,
    /**
      * Padding par défaut des boites de texte tbox (en pixels)
      * @property {Number} tbox_padding
      */
    tbox_padding      : 20,
    /**
      * Background par défaut des tbox
      * @property {String} tbox_background
      */
    tbox_background   : 'transparent',
    /**
      * Bordure par défaut des tbox
      * @property {String} tbox_border
      */
    tbox_border       : 'none'
  },
  
  
  /**
    * Toutes les préférences courant
    * Notes
    * -----
    *   * De nombreuses valeurs sont remises aux valeurs par défaut au moment
    *     du redémarrage.
    * @property {Object} prefs
    * @static
    */
  prefs:{
    decompte        :null,
    staff_top       :null,
    staff_offset    :null,
    staff_top_text  :null,
    staff_text_up   :null,
    staff_harmony   :null,
    staff_chords    :null,
    num_measure_y   :null,
    x_start         :null,
    next            :null,
    modulation_y    :null,
    modulation_x    :null,
    part_y          :null,
    part_x          :null,
    harmony         :null,
    chord           :null,
    speed_coef      :null,
    speed           :null,
    delai_after_show:null,
    note_size       :null,
    note_height     :null,
    caption         :null,
    // Positions relatives. Elles seront ajoutées aux valeurs absolues ci-dessus
    offset_next           :0,
    offset_harmony        :0,
    offset_chord          :0,
    offset_modulation_y   :0,
    offset_modulation_x   :0,
    offset_part_y         :0,
    offset_part_x         :0,
    offset_num_measure_y  :0
  },

  /**
    * Définit une préférence
    *
    * WARNING
    *   Par défaut, cette méthode lance l'étape suivante.
    *   Mettre le troisième argument à `false` pour court-circuiter ce comportement.
    *
    * Notes
    * -----
    *   * La préférence peut être de deux types : soit une valeur absolue, soit
    *     une valeur relative (cf. prefs ci-dessus)
    *   * Pour ré-initialiser une valeur à sa valeur par défaut, on envoie une value
    *     non définie.
    *   * Certaines valeurs sont à traiter de façon particulière. Par exemple, pour
    *     `staff_harmony`, si ça n'est pas une instance de Staff, c'est un indice
    *     de portée qu'on transforme en instance de Staff.
    *
    * @method set_pref
    * @param  {String} pref       La préférence à régler
    * @param  {Number} value      La valeur à donner. Si non défini, ce sera la valeur par défaut
    * @param  {Boolean} next_step Si true (default) passe à l'étape suivante (sans timeout)
    */
  set_pref:function(pref, value, next_step)
  {
    if(pref == 'x_start'){ this.current_x = value }
    if(pref.substring(0,7)=='offset_')
    {
      if(undefined == value) this.prefs[pref] = 0
      else this.prefs[pref] += value
    } 
    else {
      if(undefined == value) value = this.prefs_default[pref]
      // Contrôle de certaines valeurs
      try
      {
        if(pref == 'speed')
        {
          if(value == 0) throw "Le coefficiant de vitesse (speed) ne peut pas être 0…"
          this.calc_speed_coef()
        } 
      } catch(err) { return F.error(err) }
      
      // -- Correction de certaines valeur --
      // On remplace l'indice portée par l'instance portée si nécessaire
      // et surtout si la portée existe. Si elle n'existe pas encore, on
      // guettera le moment où elle sera créée.
      if(pref == 'staff_harmony' && 'number' == typeof value)
      {
        if(undefined != this.staves[value - 1]) value = this.staves[value - 1]
        // Sinon, elle reste un nombre
      }
      
      /* == On règle la valeur == */
      this.prefs[pref] = value
      if(undefined != this.prefs['offset_'+pref]) this.prefs['offset_'+pref]  = 0
    }
    this.Infos.show_pref(pref, value)
    if(undefined == next_step || next_step == true) NEXT_STEP(0)
  },
  /**
    * Activer ou désactiver le mode flash
    * En mode flash, l'animation se passe très vite jusqu'à un certain point
    * d'où on repart normalement.
    * @method mode_flash
    * @param  {Boolean} activer True si on doit activer le mode flash
    */
  mode_flash:function(activer)
  {
    this.transition = this['transition_'+(activer ? 'flash' : 'reg')]
  },
  
  /**
    * Liste des portées affichées
    * @property {Array} staves
    */
  staves:[],
  
  /**
    * La portée courante (une instance Staff)
    * @property {Staff} current_staff
    */
  current_staff:null,
  
  /**
    * Animation en cours (si true)
    * @property {Boolean} on
    * @default false
    */
  on:false,
  /**
    * True quand la pause est activé
    * @property {Boolean} pause_on
    * @default false
    */
  pause_on:false,
  
  /**
    * Retourne la vitesse de transition de clé +key+ (dans Anim.transition)
    * pondéré par le coefficiant de vitesse (Anim.prefs.speed), sauf si 
    * +pondered+ est false
    * @method delai_for
    * @param {String}   key   La clé définissant le type de transition
    * @return {Number} la valeur de transition correspondante, en secondes
    */
  delai_for:function(key, not_pondered)
  {
    return this.transition[key] * this.prefs.speed_coef
  },
  
  /**
    * Calcule le nouveau coefficiant de vitesse (Anim.prefs.speed_coef)
    * Noter que ce coefficiant dépent de 1/ la préférence Anim.prefs.speed et 2/
    * la position du slider du contrôleur.
    */
  calc_speed_coef:function()
  {
    // La position du slider dans le contrôleur
    var new_coef = $('div#vitesse_animation').slider('value')
    new_coef = new_coef == 11 ? 1.0 : parseFloat((11 / new_coef) / 2)
    Anim.prefs.speed_coef = Anim.prefs.speed * new_coef
    // dlog("Anim.prefs.speed_coef mis à "+Anim.prefs.speed_coef)
  },
  /**
    * Attends +laps+ secondes avant de passer à l'étape suivante
    * Notes
    * -----
    *   * C'est un raccourci de Anim.Objects.WAIT qui peut être utilisé
    *     dans la programmation.
    *
    * @method wait
    * @param  {Number} laps Nombre de secondes (peut être un flottant)
    */
  wait:function(laps){ this.Objects.WAIT(MODE_FLASH ? 0.001 : laps) },
  
  /**
    * Détruit le timer éventuel (timeout)
    * @method kill_timer
    */
  kill_timer:function()
  {
    if(!this.timer) return
    clearTimeout(this.timer)
    delete this.timer
  },
  /**
    * Ré-initialisation complète (par exemple au chargement d'une autre animation)
    * @method init_all
    */
  init_all:function()
  {
    delete Console._steps_selection
    delete Console._etapes
    this.reset()
  },
  /**
    * Reset l'animation (au (re)-démarrage de l'animation)
    * @method reset
    */
  reset:function()
  {
    dlog("-> Anim.reset")
    var my = this
    
    Flash.clean()
    this.Step.list  = null
    // Destruction des (instances) objets de l'animation et ré-initialisation
    // de this.Objects (avec les méthodes-commandes)
    L(this.Objects).each(function(key,val){ delete my.Objects[key] })
    this.Objects    = {}
    $.extend(this.Objects, FONCTIONS_ANIM_OBJETS)
    Object.defineProperties(this.Objects, METHODES_ANIM_OBJETS)
    
    // Destruction des instances portées
    L(this.staves || []).each(function(staff){staff=null; delete staff;})
    this.staves     = []
    
    // Ré-initialisation des préférences
    this.reset_prefs()
    
    // Il faut ré-initialiser la grid après avoir re-défini current_x, car
    // la grid s'en sert pour replacer le curseur de position.
    this.Grid.init_all()
    
    // Effacer doublage et sous-titre
    this.Dom.Doublage.init()
    
    dlog("<- Anim.reset")
  },
  /**
    * Appelé au chargement de l'application
    * @method on_load
    */
  on_load:function()
  {
    this.Infos.prepare()
    this.set_slider()
    this.play_type = $('input#play_type').val().toString()
    this.onchange_play_type(this.play_type)
  },
  /**
    * Reset les préférences
    * @method reset_prefs
    */
  reset_prefs:function()
  {
    // Il faut remettre toutes les préférences au départ
    L(this.prefs_default).each(function(key, value){
      Anim.set_pref(key, value, next_step = false)
    })
  },
  
  /**
    * Méthode qui lance l'enregistrement de l'animation
    * @method start_record
    * @async
    */
  start_record:function(rajax)
  {
    if(undefined == rajax)
    {
      Ajax.send({script:'animation/start_record', name:this.name, folder:this.folder}, $.proxy(this.start_record, this))      
    }
    else
    {
      if(rajax.ok)
      {
        this.recording = false
        Anim.start()
      } 
      else F.error(rajax.message)
    }
  },
  /**
    * Méthode qui arrête l'enregistrement de l'animation
    * @method stop_record
    * @async
    */
  stop_record:function(rajax)
  {
    if(undefined == rajax)
    {
      Ajax.send({script:'animation/stop_record', name:this.name, folder:this.folder}, $.proxy(this.start_record, this))      
    }
    else
    {
      if(rajax.ok) F.show("Animation enregistrée.")
      else F.error(rajax.message)
      this.recording = false
    }
  },
  /**
    * Méthode appelée quand on change le "play type", donc ce qu'il faut
    * jouer de l'animation et comment il faut le jouer. Elle affiche un message
    * d'information.
    * @method onchange_play_type
    */
  PLAY_TYPE:{
    'all'       :{hname:"Jouer tout"},
    'selection' :{hname:"Jouer la sélection"},
    'repairs'   :{hname:"Jouer entre les repère"},
    'stepbystep':{hname:"Jouer pas à pas"},
    'cursor'    :{hname:"Jouer depuis le curseur"}
  },
  onchange_play_type:function(play_type)
  {
    if(this.play_type) UI.Popups.deselect("play::"+this.play_type)
    this.play_type = play_type.toString()
    UI.Popups.select("play::"+this.play_type)
    $('input#play_type').val(this.play_type)
    $('span#mark_play_type').html(this.PLAY_TYPE[this.play_type].hname)
  },
  /**
    * Met l'animation courante comme animation par défaut
    *
    * @method set_current_as_default
    */
  set_current_as_default:function(rajax)
  {
    if(undefined == rajax)
    {
      if(!this.name) return F.error("Aucune animation n'est encore chargée !")
      Ajax.send({script:'animation/set_default', name:this.name, folder:this.folder},
      $.proxy(this.set_current_as_default, this))
    }
    else
    {
      if(rajax.ok) F.show(this.name+" a été mise en animation par défaut.")
      else F.error(rajax.message)
    }
  },
  /**
    * Création d'une nouvelle animation
    *
    * La méthode initialise tout puis demande à l'utilisateur de choisir un 
    * nom pour l'animation.
    *
    * @method new
    */
  new:function()
  {
    // TODO Avant, il faut vérifier que l'animation courante a bien été
    // sauvée.
    this.reset()
    delete this.File.name
    this.set_anim("", "", '# Nouvelle animation\n# Écrire le code ici')
    UI.Popups.unableIf('def_anim', false)
  },
  /**
    * Quand on active le menu "Fichier > Open" (ou Pomme+O)
    * @method want_open
    */
  want_open:function()
  {
    UI.Tools.show('animations', {ok:{name:"Ouvrir", method:$.proxy(UI.Tools.open_anim_or_folder, UI.Tools, null)}})
  },
  
  /* ---------------------------------------------------------------------
   *  Méthodes pour la suite d'animations
   *  @rappel : Une suite d'animations est définie dès que la commande `SUITE`
   *  est utilisée dans le code de l'animation.
   */
  /**
    * Définit l'animation pour suivre, qui sera exécutée lorsque l'animation
    * courante sera achevée. La méthode est appelée par la commande `SUITE`
    *
    * @method set_animation_pour_suivre
    * @param {String} path    Le nom ou le chemin de l'animation
    * @param {Object} params  Les paramètres optionnels (non utilisés pour le moment)
    */
  set_animation_pour_suivre:function(path, params)
  {
    stack('-> Anim.set_animation_pour_suivre', {path:path})
    this.hasSuite = true
    this.animation_pour_suivre = path.replace(/( +)/g, '_')
    NEXT_STEP(0)
    stack('<- Anim.set_animation_pour_suivre')
  },
  /**
    * Méthode qui charge et joue l'animation pour suivre si elle a été définie
    * @method load_and_start_animation_pour_suivre
    */
  load_and_start_animation_pour_suivre:function()
  {
    this.File.load.poursuivre = $.proxy(Anim.start, Anim)
    var danim = this.animation_pour_suivre.split('/')
    var anim_name = danim.pop()
    var anim_fold = danim.join('/')
    if(anim_fold == '.') anim_fold = this.File.folder
    dlog({'anim name':anim_name, 'anim folder':anim_fold})
    this.File.load(anim_name, anim_fold)
  },
  /**
    * Définit l'animation courante de nom +nom+ et de code +code+
    * Elle peut être appelée soit par `load` ci-dessus soit par le chargement
    * de la liste des animations si une animation par défaut a été définie.
    *
    * @method set_anim
    * @param {String} name    Le nom de l'animation
    * @param {String} folder  Le dossier de l'animation
    * @param {String} code    Les commandes et autres de l'animation
    */
  set_anim:function(name, folder, code)
  {
    this.init_all()
    this.File.name    = name
    this.File.folder  = folder
    $('select#animations').val(name)
    UI.build_path_folders(folder)
    if(code) Console.set(code.stripSlashes())
    $('head > title').html("Anim: "+this.name)
  }
})

Object.defineProperties(Anim,{
  /**
    * Position x courante
    * @property {Number} current_x
    * @default Anim.prefs.x_start
    */
  "current_x":{
    set:function(x){
      this._current_x = x
      this.Grid.set_cursor(x)
      this.Infos.set('current_x', x)
    },
    get:function(){ return this._current_x || parseInt(Anim.prefs.x_start || Anim.prefs_default.x_start,10)}
  },
  /**
    * Propriété raccourci pour Anim.File.name
    * @property {String} name
    */
  "name":{
    set:function(name){ this.File.name = name },
    get:function(){return this.File.name}
  },
  /**
    * Propriété raccourci pour Anim.File.folder
    * @property {String} folder
    */
  "folder":{
    set:function(folder){this.File.folder = folder},
    get:function(){return this.File.folder}
  }
  
})