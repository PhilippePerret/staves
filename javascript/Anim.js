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
    * @property {Object} prefs_default
    * @static
    * @final
    */
  prefs_default:{
    next          :40,  
    harmony       :60, 
    chord_mark    :40, 
    speed         :1,
    staff_top     :50,
    staff_offset  :100
  },
  /**
    * Toutes les préférences
    * @property {Object} prefs
    * @static
    */
  prefs:{
    // Positions absolues
    /**
      * Décalage à droite quand la commande NEXT est utilisée
      * @property {Number} next */
    next                : 40,
    /**
      * Décalage de la marque d'harmonie ou de cadence par rapport à
      * la portée.
      * @property {Number} harmony */
    harmony             : 60,
    /**
      * Décalage de la marque d'accord par rapport à la portée.
      * @property {Number} chord_mark */
    chord_mark          : 40,
    /**
      * Coefficiant vitesse
      * @property {Number} speed */
    speed               : 1,
    /** Décalage haut de la première portée affichée
      * @property {Number} staff_top */
    staff_top     :50,
    /** Décalage entre portée
      * @property {Number} staff_offset */
    staff_offset  :100,
    // Positions relatives. Elles seront ajoutées aux valeurs absolues ci-dessus
    offset_next         : 0,
    offset_harmony      : 0,
    offset_chord_mark   : 0
  },
  /**
    * Définit une préférence
    * Notes
    * -----
    *   * La préférence peut être de deux types : soit une valeur absolue, soit
    *     une valeur relative (cf. prefs ci-dessus)
    *   * Pour ré-initialiser une valeur à sa valeur par défaut, on envoie une value
    *     non définie.
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
      this.prefs[pref]            = value
      this.prefs['offset_'+pref]  = 0
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
    * Mode pas à pas
    * Si true, on passe d'un pas de l'animation à un autre en cliquant
    * sur le bouton pour jouer l'animation
    * @property {Boolean} MODE_PAS_A_PAS
    */
  MODE_PAS_A_PAS:false,
  
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
    * Le décalage horizontal courant
    * Notes
    *   * Ce décalage est défini en fonction de la présence de la métrique ou non
    *     (TODO à implémenter dans la création de la portée — new_staff)
    * @property {Number} current_x
    * @default 100
    */
  current_x:100,
  
  /**
    * Animation en cours (si true)
    * @property {Boolean} on
    * @default false
    */
  on:false,
  
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
    * Active ou désactive le mode "pas à pas"
    * @method def_mode_pas_a_pas
    * @param  {Boolean} active    Si true, active le mode Pas à pas
    */
  def_mode_pas_a_pas:function(active)
  {
    this.MODE_PAS_A_PAS = active
    // Flash.show("Le mode pas à pas est "+(active ? 'activé' : 'désactivé'))
  },
  /**
    * Reset l'animation (au (re)-démarrage)
    * @method reset
    */
  reset:function()
  {
    $('section#animation').html('')
    this.Objects    = {}
    $.extend(this.Objects, FONCTIONS_ANIM_OBJETS)
    Object.defineProperties(this.Objects, METHODES_ANIM_OBJETS)
    this.staves     = []
    this.current_x  = 100 // TODO: à recalculer d'après l'armure et la métrique
    Console.cursor_offset = 0
    this.reset_prefs()
  },
  /**
    * Reset les préférences
    * @method reset_prefs
    */
  reset_prefs:function()
  {
    // Il faut remettre toutes les préférences au départ
    L(this.prefs_default).each(function(key, value){
      Anim.set_pref(key, value)
    })
  },
  
  // /** Raccourci pour Anim.Dom.show
  //   * OBSOLÈTE
  //   * @method show */
  // show:function(obj, params){this.Dom.show(obj,params)},
 
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
        this.Step.list  = null
        this.name       = name
        Console.set(rajax.raw_code.stripSlashes())
      }
      else F.error(rajax.message)
    }
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
      }
      else F.error(rajax.message)
    }
  }
})

