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
  }
  
})