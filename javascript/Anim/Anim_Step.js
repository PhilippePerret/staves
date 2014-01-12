/**
  * Pour tout ce qui concerne un pas, une étape de l'animation
  *
  * Notes
  * -----
  *   * C'est au bout de ce fichier qu'est défini NEXT_STEP
  *
  * @module Anim_Step
  */

/**
  * @class Step
  * @for Anim
  * @static
  */
if(undefined == window.Anim) window.Anim = {}
Anim.Step = {
  /**
    * Liste de toutes les étapes (instances {Pas})
    * @property {Array of Pas} list
    * @default null
    */
  list:null,
  
  /**
    * Étape courante (instance {Pas})
    * @property {Pas} current
    */
  current:null,
  
  /**
    * Méthode qui définit et exécute l'étape suivante
    * @method next
    */
  next:function()
  {
    if(this.timer) clearTimeout(this.timer)
    if(!this.list) return Anim.stop()
    this.set_current()
    if(undefined == this.current) return Anim.stop()
    // Passer les commentaires et les lignes vides
    if(this.current.is_comment() || this.current.is_empty()) return this.next()
    /* === On joue l'étape === */
    this.current.exec()
    if(!this.list || this.list.length == 0) Anim.stop()
  },
  /**
    * Définit l'étape courante et la sélectionne dans le code
    *
    * Notes
    * -----
    *   * Définit la propriété `this.current`
    *
    * @method set_current
    */
  set_current:function()
  {
    if(!this.list || this.list.length == 0)
    {
      delete this.current
      return
    } 
    this.current = this.list.shift()
    this.current.select()
  },
  
  /**
    * Passe à l'étape suivante, mais seulement si le mode pas à pas n'est
    * pas enclenché.
    * NOTES
    * -----
    *   * Si Anim.transition.step est défini, et que +no_timeout+ n'est pas true,
    *     alors il faut appeler next() seulement après le délai spécifié
    *
    * @method auto_next
    * @param  {Boolean} no_timeout Si true, pas de délai avant d'appeler l'étape suivante
    */
  auto_next:function(no_timeout)
  {
    if(this.timer) clearTimeout(this.timer)
    if(this.mode_pas_a_pas) return
    if(MODE_FLASH || no_timeout || Anim.transition.step == 0)
    {
      this.next()
    }
    else
    {
      this.timer = setTimeout($.proxy(Anim.Step.next, Anim.Step), Anim.transition.step)
    }
  }
}
Object.defineProperties(Anim.Step,{
  "mode_pas_a_pas":{
    get:function(){
      return Anim.play_type == 'stepbystep'
    }
  }
})
/**
  * Raccourci pour définir de passer à l'étape suivante
  * @for window
  * @property NEXT_STEP
  * @static
  * @final
  */
var NEXT_STEP = $.proxy(Anim.Step.auto_next, Anim.Step)