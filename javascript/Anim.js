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
    * Nom de l'animation (ie l'affixe de son fichier de code)
    * @property {String|Null} name
    */
  name: null,
  
  /**
    * Coefficiant de vitesse (déterminé par le slider)
    * De -100 à 100
    * @property {Float} coef_speed
    */
  coef_speed: 1,
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
    fullscreen: false,
    /**
      * Quand True, affiche la grille
      * @property {Boolean} grid
      */
    grid:true
  },
  /* Fin des options
   * --------------------------------------------------------------------- */
  
  /**
    * Définition de la vitesse (ou plutôt la durée) des transitions
    * Notes
    * -----
    *   Cf. le mode "flash" qui peut modifier ces valeurs
    *       `mode_flash`
    * @property {Object} transition
    *   @property {Number} transition.step  Délai entre chaque étape (en millisecondes)
    *   @property {Number} transition.show Vitesse d'apparition de tout élément
    *   @property {Number} transition.note_moved  Délai de déplacement des notes (en millisecondes ?)
    */
  transition:{
    step        : 500,
    show        : 400,
    note_moved  : 1000,
    wait        : 1000 // multiplicateur de secondes
  },
  /**
    * Data vitesse (constantes)
    * Serviront à calculer transition_reg en cas de modification de
    * la vitesse de l'animation
    * @property {Object} TRANSITIONS
    * @static
    * @final
    */
  TRANSITIONS:{
    step        : 500,
    show        : 400,
    note_moved  : 1000,
    transform   : 500,  // Transformation comme l'allongement
    wait        : 1000 // multiplicateur de secondes
  },
  /**
    * Vitesses normales
    * Notes
    * -----
    *   * Ces valeurs pourront être modifiées par le `coef_speed` déterminé
    *     par le slider
    * @property {Object} transition_reg
    */
  transition_reg:{
    step        : 500,
    show        : 400,
    note_moved  : 1000,
    transform   : 500,  // Transformation comme l'allongement
    wait        : 1000  // multiplicateur de secondes
  },
  /**
    * Vitesses flash
    * @property {Object} transition_flash
    * @static
    * @final
    */
  transition_flash:{
    step        : 1,
    show        : 1,
    note_moved  : 5,
    transform   : 1,
    wait        : 1
  },
  /**
    * Toutes les préférences par défaut
    * Notes
    *   * Cf. les définitions dans `prefs` ci-dessous
    * @property {Object} prefs_default
    * @static
    * @final
    */
  prefs_default:{
    decompte          :2,
    staff_top         :60,
    staff_offset      :100,
    staff_top_text    :0,
    staff_text_up     :true,
    x_start           :100,
    next              :40,  
    harmony           :70, 
    staff_harmony     :null,
    staff_chords      :null,
    num_measure_y     :-8,
    chord             :40, 
    modulation_x      :-13,
    modulation_y      :26,
    speed             :1,
    note_size         :14.3,
    delai_after_show  :3,
    doublage          :true
  },
  /**
    * Toutes les préférences
    * @property {Object} prefs
    * @static
    */
  prefs:{
    // Positions absolues
    /**
      * Nombre de secondes de décompte avant le lancement de l'animation
      * @property {Number} decomte
      * @default 2
      */
    decompte      : 2,
    /** Décalage haut de la première portée affichée
      * @property {Number} staff_top 
      */
    staff_top     :60,
    /** Décalage entre portée
      * @property {Number} staff_offset 
      */
    staff_offset  :100,
    /** Décalage des textes de portée
      * Note : cette valeur sera RETIRÉE du top de la portée (selon le principe
      * que les valeurs positives éloignent toujours de la portée, et qu'un texte
      * de portée est par défaut au-dessus de la portée)
      * @property {Number} staff_top_text
      */
    staff_top_text:0,
    /** Positionnement des textes de portée, au-dessus (défaut) ou en dessous
      * de la portée
      * @property {Boolean} staff_text_up
      # @default TRUE
      */
    staff_text_up: true,
    /** Taille des notes (et altérations)
      * @property {Number} note_size 
      */
    /**
      * Portée qui doit porter l'harmonie. Pour faire porter l'harmonie
      * par une portée particulière, quelle que soit la portée active
      * @note : elle peut être définie même si la portée n'existe pas encore,
      * puisqu'un check est fait à la création de toute portée (cf. Staff.create)
      * @property {Staff|Numbre} staff_harmony
      * @default NULL
      */
    staff_harmony  :null,
    /**
      * Portée qui doit porter les accords.
      * @note : elle peut être définie même si la portée n'existe pas encore,
      * puisqu'un check est fait à la création de toute portée (cf. Staff.create)
      * @property {Staff|Number} staff_chords
      * @default NULL
      */
    staff_chords         : null,
    /**
      * Position verticale du numéro de mesure
      * @property {Number} num_measure_y
      */
    num_measure_y       : -8,
    /** Position left de départ pour chaque portée
      * @property {Number} x_start 
      */
    x_start             : 100,
    /**
      * Décalage à droite quand la commande NEXT est utilisée
      * @property {Number} next 
      */
    next                : 40,
    /**
      * Décalage vertical de la marque de modulation par rapport à la portée
      * @property {Number} modulation_y
      */
    modulation_y        : 26,
    /**
      * Décalage horizontal de la marque de modulation par rapport à l'objet
      * qui la porte (souvent, un accord ou une note)
      * @property {Number} modulation_y
      */
    modulation_x        : -13,
    /**
      * Décalage de la marque d'harmonie ou de cadence par rapport à
      * la portée.
      * @property {Number} harmony 
      */
    harmony             : 70,
    /**
      * Décalage de la marque d'accord par rapport à la portée.
      * @property {Number} chord 
      */
    chord          : 40,
    /**
      * Coefficiant vitesse
      * @property {Number} speed 
      */
    speed               : 1,
    /**
      * Temps d'attente à la fin de l'anim
      * @property {Number} delai_after_show
      */
    delai_after_show    : 3,
    /**
      * Taille des notes
      * @property {Float} note_size
      */
    note_size           : 14.3,
    /**
      * Si true, les CAPTION afficheront le texte en doublage, hors de l'animation
      * Sinon, ils seront affichés comme des sous-titres, dans l'image de l'animation
      * @property {Boolean} doublage
      * @default true
      */
    doublage            : true,
    
    // Positions relatives. Elles seront ajoutées aux valeurs absolues ci-dessus
    offset_next           :0,
    offset_harmony        :0,
    offset_chord          :0,
    offset_modulation_y   :0,
    offset_modulation_x   :0,
    offset_num_measure_y  :0
  },
  /**
    * Définit une préférence
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
        if(pref == 'speed' && value == 0) throw "Le coefficiant de vitesse (speed) ne peut pas être 0…"
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
    if(undefined == next_step || next_step == true) NEXT_STEP(no_timeout=true)
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
    * pondéré par le coefficiant de vitesse (Anim.prefs.speed)
    * @method delai_for
    * @param {String} key   La clé définissant le type de transition
    * @return {Number} la valeur correspondante
    */
  delai_for:function(key)
  {
    return this.transition[key] * this.prefs.speed
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
    * Reset l'animation (au (re)-démarrage)
    * @method reset
    */
  reset:function()
  {
    Flash.clean()
    $('section#animation').html('')
    this.Objects    = {}
    this.Step.list  = null
    $.extend(this.Objects, FONCTIONS_ANIM_OBJETS)
    Object.defineProperties(this.Objects, METHODES_ANIM_OBJETS)
    L(this.staves || []).each(function(staff){staff=null; delete staff;})
    this.staves     = []
    this.current_x = parseInt(this.prefs.x_start,10)
    this.reset_prefs()
    // Il faut ré-initialiser la grid après avoir re-défini current_x, car
    // la grid s'en sert pour replacer le curseur de position.
    this.Grid.init_all()
  },
  /**
    * Appelé au chargement de l'application
    * @method on_load
    */
  on_load:function()
  {
    Anim.Infos.prepare()
    Anim.set_slider()
    this.play_type = $('select#play_type').val()
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
    * Méthode appelée quand on change le "play type", donc ce qu'il faut
    * jouer de l'animation et comment il faut le jouer. Elle affiche un message
    * d'information.
    * @method onchange_play_type
    */
  onchange_play_type:function(play_type)
  {
    this.play_type = play_type
    F.show(function(playtype){
      switch(playtype)
      {
      case 'all':
        return "L'intégralité de l'animation sera jouée."
      case 'selection':
        return "Seul le code sélectionné sera joué."
      case 'repairs':
        return "Seul le code entre `#!START` et `#!END` sera joué."
      case 'stepbystep':
        return "L'animation sera jouée pas à pas."
      case 'from_cursor':
        return "L'animation sera jouée depuis la position du curseur."
      default:
        return "Bleurk… (dans Anim.onchange_play_type)"
      }
    }(play_type))
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
      Ajax.send({script:'animation/set_default', name:this.name},
      $.proxy(this.set_current_as_default, this))
    }
    else
    {
      if(rajax.ok) F.show(this.name+" a été mise en animation par défaut.")
      else F.error(rajax.message)
    }
  },
  /**
    * Enregistre l'animation courante
    * @method save
    * @async
    * @param  {Object} rajax  Le retour ajax au retour de la requête
    */
  save:function(rajax)
  {
    if(undefined == rajax)
    {
      if(!this.name) this.name = "Animation-"+Time.now()
      Ajax.send({
        script :'animation/save',
        name   :this.name,
        code   :Console.raw
      }, $.proxy(this.save, this))
    }
    else
    {
      if(rajax.ok) F.show("Animation sauvegardée sous le nom "+this.name)
      else F.error(rajax.message)
    }
  },
  
  /**
    * Enregistre l'animation sous un autre nom
    * @method save_as
    * @param {Object} rajax retour de la requête ajax
    */
  save_as:function(rajax)
  {
    if(undefined == rajax)
    {
      // On prend le nouveau titre et on le corrige
      var new_name = $('input#animation_name').val().trim()  
      if(new_name == "") return F.error("Il faut donner un nouveau nom !")
      new_name = Texte.to_ascii(new_name).
                  replace(/ /g,'_').
                  replace(/[^a-zA-z0-9_-]/g,'')
                  
      Ajax.send({
        script:"animation/save", 
        name      : this.name, 
        new_name  : new_name,
        code      : Console.raw
      }, $.proxy(this.save_as, this))
    }
    else
    {
      if(rajax.ok)
      {
        // Il faut retirer l'ancien nom et le remplacer par le nouveau
        // Ça change aussi le nom courant de l'animation
        UI.change_animation_name(this.name, rajax.name)
      }
      else F.error(rajax.message)
    }
  },
  
  /**
    * Recharge l'animation courante (utile quand on la code dans un fichier)
    * @method reload
    */
  reload:function()
  {
    this.load(this.name)
  },
  /**
    * Charge l'animation de nom +name+
    * @method load
    * @async
    * @param  {String} name Nom de l'animation (choisie dans le menu)
    * @param  {Object} rajax  Le retour de la requête
    */
  load:function(name, rajax)
  {
    if(name == "0")
    {
      this.name = null
      return // premier menu
    } 
    if(undefined == rajax)
    {
      Ajax.send({script:"animation/load", name:name}, $.proxy(this.load, this, name))
    }
    else
    {
      if(rajax.ok)
      {
        this.set_anim(name, rajax.raw_code)
      }
      else F.error(rajax.message)
    }
  },
  /**
    * Définit l'animation courante de nom +nom+ et de code +code+
    * Elle peut être appelée soit par `load` ci-dessus soit par le chargement
    * de la liste des animations si une animation par défaut a été définie.
    *
    * @method set_anim
    * @param {String} name    Le nom de l'animation
    * @param {String} code    Les commandes et autres de l'animation
    */
  set_anim:function(name, code)
  {
    this.init_all()
    this.name = name
    $('select#animations').val(name)
    Console.set(code.stripSlashes())
  },
  /**
    * Charge la liste des animations et peuple le menu
    * @method load_list_animations
    * @param  {Object} rajax  Le retour ajax
    */
  load_list_animations:function(rajax)
  {
    if(undefined == rajax)
    {
      Ajax.send({script:"animation/list"}, $.proxy(this.load_list_animations, this))
    }
    else
    {
      if(rajax.ok)
      {
        UI.peuple_liste_animations(rajax.list)
        // Y a-t-il une animation par défaut
        if(rajax.default_animation)
        {
          this.set_anim(rajax.default_animation, rajax.raw_code)
        }
        if(this.load_list_animations.poursuivre) this.load_list_animations.poursuivre()
      }
      else F.error(rajax.message)
    }
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
    },
    get:function(){ return this._current_x || parseInt(Anim.prefs.x_start,10)}
  }
  
})