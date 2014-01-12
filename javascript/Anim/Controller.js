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
    *   * La méthode est appelée chaque fois qu'on clique le bouton “Play”
    *   * Elle réagit différemment en fonction du mode de jeu (this.play_type)
    *
    * @method start
    * @param  {Object} params   Paramètres optionnels
    */
  start:function(params){
    if(this.on && this.Step.mode_pas_a_pas)
    { // En cours de jeu en mode pas à pas
      this.Step.next()
    }
    else if(this.pause_on)
    { // => redémarrage après pause
      this.play()
    }
    else if(this.on)
    { // => Stop demandé
      this.stop()
    } 
    else
    { // Démarrage du jeu
      this.reset()
      this.Step.list = function(playtype){
        switch(playtype)
        {
        case 'all'        :
        case 'stepbystep' : return Console.steps
        case 'selection'  : return Console.steps_selection
        case 'repairs'    : return Console.steps_between_repairs
        }
      }(this.play_type)
      if(this.Step.list) this.play()
    } 
  },
  /**
    * Règle l'interface, soit pour le jeu, soit pour l'arrêt
    * @method set_interface
    */
  set_interface:function()
  {
    // dlog("-> set_interface [on="+this.on+"/pause_on="+this.pause_on+"]")
    this.stop_button.css('visibility', this.on ? 'visible':'hidden')
    this.pause_button[this.on && !this.pause_on ?'show':'hide']()
    this.start_button[!this.on || this.pause_on ?'show':'hide']()
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
    this.on       = true
    this.pause_on = false
    this.set_interface()
    UI.Regle.hide()
    this.Step.next()
  },
  /**
    * Pause demandée
    * @method pause
    */
  pause:function()
  {
    this.pause_on = true
    this.set_interface()
  },
  /**
    * Stoppe l'animation, parce qu'on est au bout ou parce que 
    * c'est demandé
    * @method stop
    */
  stop:function()
  {
    this.on       = false
    this.pause_on = false
    if(this.timer) clearTimeout(this.timer)
    delete this.timer
    delete this.Step.list
    this.set_interface()
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

Object.defineProperties(Anim,{
  /** 
    * Objet DOM du bouton Start
    * @property {jQuerySet} start_button
    */
  "start_button":{
    get:function(){return $('img#btn_anim_start')}
  },
  /** 
    * Objet DOM du bouton Stop
    * @property {jQuerySet} stop_button
    */
  "stop_button":{
    get:function(){return $('img#btn_anim_stop')}
  },
  /** 
    * Objet DOM du bouton Pause
    * @property {jQuerySet} pause_button
    */
  "pause_button":{
    get:function(){return $('img#btn_anim_pause')}
  },
})