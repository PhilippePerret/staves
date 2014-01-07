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
    * Définition de la vitesse (ou plutôt la durée) des transitions
    * @property {Object} transition
    *   @property {Number} transition.step  Délai entre chaque étape (en millisecondes)
    *   @property {Number} transition.show Vitesse d'apparition de tout élément
    *   @property {Number} transition.note_moved  Délai de déplacement des notes (en millisecondes ?)
    */
  transition:{
    step        : 500,
    show        : 400,
    note_moved  : 1000
  },

  /**
    * Valeurs par défauts
    * @property {Object} defaut
    *   @property {Number} default.hoffset  Décalage droite par défaut, en pixels
    */
  defaut:{
    hoffset       : 40,
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
    * Attends +laps+ secondes avant de passer à l'étape suivante
    * Notes
    * -----
    *   * C'est un raccourci de Anim.Objects.WAIT qui peut être utilisé
    *     dans la programmation.
    *
    * @method wait
    * @param  {Number} laps Nombre de secondes (peut être un flottant)
    */
  wait:function(laps){ this.Objects.WAIT(MODE_FLASH ? 0 : laps) },
  

  /**
    * Active ou désactive le mode "pas à pas"
    * @method def_mode_pas_a_pas
    * @param  {Boolean} active    Si true, active le mode Pas à pas
    */
  def_mode_pas_a_pas:function(active)
  {
    this.MODE_PAS_A_PAS = active
    Flash.show("Le mode pas à pas est "+(active ? 'activé' : 'désactivé'))
  },
  /**
    * Reset l'animation (au démarrage)
    * @method reset
    */
  reset:function()
  {
    $('section#animation').html('')
    this.Objects    = {}
    $.extend(this.Objects, FONCTIONS_ANIM_OBJETS)
    this.staves     = []
    this.current_x  = 100 // TODO: à recalculer d'après l'armure et la métrique
  },
  
  /** Raccourci pour Anim.Dom.show
    * OBSOLÈTE
    * @method show */
  show:function(obj, params){this.Dom.show(obj,params)},
 
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

