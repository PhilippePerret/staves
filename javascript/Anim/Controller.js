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
      if(!this.steps) this.steps = Console.steps
      var btn_name = this.MODE_PAS_A_PAS ? 'Next' : 'Stop'
      $('input#btn_anim_start').val(btn_name)
      this.on = true
    } 
    this.next_step()
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
    delete this.steps
    $('input#btn_anim_start').val("Start")
    this.on = false
  },
  
  /**
    * Méthode qui joue la séquence suivante
    * @method next_step
    */
  next_step:function()
  {
    if(this.timer) clearTimeout(this.timer)
    if(!this.steps) return this.stop()
    this.current_step = this.steps.shift().trim()
    // Passer les commentaires
    if(this.current_step.substring(0,1) == "#") return this.next_step()
    this.write_current_step()
    /* === On joue l'étape === */
    this.Step.run()
    if(!this.steps || this.steps.length == 0) this.stop()
  },
  
  /**
    * Passe à l'étape suivante, mais seulement si le mode pas à pas n'est
    * pas enclenché.
    * NOTES
    * -----
    *   * Si Anim.transition.step est défini, et que +no_timeout+ n'est pas true,
    *     alors il faut appeler next_step() seulement après le délai spécifié
    *
    * @method auto_next_step
    * @param  {Boolean} no_timeout Si true, pas de délai avant d'appeler l'étape suivante
    */
  auto_next_step:function(no_timeout)
  {
    if(Anim.Step.timer) clearTimeout(Anim.Step.timer)
    if(this.MODE_PAS_A_PAS) return
    if(MODE_FLASH || no_timeout || Anim.transition.step == 0)
    {
      Anim.next_step()
    }
    else
    {
      Anim.Step.timer = setTimeout($.proxy(Anim.next_step, Anim), Anim.transition.step)
    }
  }
})