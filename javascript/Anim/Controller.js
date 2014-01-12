/*
 *  Attention, il NE s'agit PAS d'un objet Anim.Controller, mais 
 *  de l'extension de la class Anim
 *  
 */
/**
  * Toutes les méthodes qui gèrent le contrôleur de l'animation
  *
  * @module Controller.js
  * @for Anim
  */
if(undefined == window.Anim) window.Anim = {}
$.extend(Anim,{

  /**
    * === Main ===
    *
    * Joue l'animation courante
    * Notes
    * -----
    *   * La méthode est également appelée à chaque pas en mode "pas à pas"
    * @method start
    * @param  {Object} params   Paramètres optionnels
    */
  start:function(params){
    if(this.on && !this.MODE_PAS_A_PAS) return this.stop()
    else if(false == this.on)
    {
      this.reset()
      if(!this.Step.list) this.Step.list = Console.steps
    } 
    this.play()
  },
  /**
    * Pour jouer seulement le texte sélectionné
    * @method start_selection
    */
  start_selection:function()
  {
    if(this.on && this.MODE_PAS_A_PAS) this.Step.next()
    else
    {
      // Il faut resetter avant de relever la liste, car cette relève va
      // ajuster la position actuelle du curseur alors que reset la remet 
      // à zéro.
      this.reset()
      this.Step.list = Console.steps_selection()
      this.play()
    }
  },
  /**
    * Règle l'interface, soit pour le jeu, soit pour l'arrêt
    * @method set_interface
    */
  set_interface:function()
  {
    $('input#btn_anim_start').val(function(on, stp2stp){
      if(on) return stp2stp ? 'Next' : 'Stop'
      else   return "Start"
    }(this.on, this.MODE_PAS_A_PAS))
    UI.Regle.hide()
  },
  /**
    * Démarre véritablement l'animation
    * Notes
    * -----
    *   * Cette méthode a été inaugurée pour gérer les différents traitement
    *     entre jouer tout le code et ne jouer qu'une sélection du code.
    *
    * @method play
    */
  play:function()
  {
    this.on = true
    this.set_interface()
    this.Step.next()
  },
  /**
    * Stoppe l'animation, parce qu'on est au bout ou parce que 
    * c'est demandé
    * @method stop
    */
  stop:function()
  {
    if(this.timer) clearTimeout(this.timer)
    delete this.timer
    delete this.Step.list
    $('input#btn_anim_start').val("Start")
    this.on = false
    UI.Regle.wait_and_show()
  },

  /**
    * Définit le slider de vitesse de l'animation
    * @method set_slider
    */
  set_slider:function()
  {
    $('div#vitesse_animation').slider({
      step    : 1,
      value   : 11,
      min     : 1,
      max     : 21,
      change  : $.proxy(Anim.on_change_vitesse, Anim)
    })
  },
  /**
    * Règle la vitesse (avec la commande SPEED)
    * @method set_speed
    * @param {Number} speed Une valeur de 1 à 21
    */
  set_speed:function(speed)
  {
    $('div#vitesse_animation').slider('value', speed)
  },
  /**
    * Change la vitesse de l'animation
    * Notes
    *   * Appelé par le slider de vitesse du contrôleur
    *     OU par la commande SPEED(...) — qui modifie le slider
    *   * Ne pas mettre d'argument (car le premier est l'évènement)
    *
    * @method on_change_vitesse
    */
  on_change_vitesse:function()
  {
    var new_coef = $('div#vitesse_animation').slider('value')
    this.coef_speed = parseFloat(11 / new_coef)
    for(var prop in this.TRANSITIONS)
    {
      this.transition_reg[prop] = parseInt(this.TRANSITIONS[prop] * this.coef_speed)
    }
    this.transition = this.transition_reg
  }
  
})