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
      var btn_name = this.MODE_PAS_A_PAS ? 'Next' : 'Stop'
      $('input#btn_anim_start').val(btn_name)
      this.on = true
      UI.Regle.hide()
    } 
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
    UI.Regle.show()    
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