/**
  * Pour tout ce qui concerne un pas, une étape de l'animation
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
    * Joue l'étape (évalue son code)
    * Notes
    * -----
    *   * Pour le moment, la méthode prend le code dans Anim.current_step
    *     TODO: Mais plus tard, ce code devrai être géré dans ce Anim.Step
    *   * Un timer peut avoir été défini (si Anim.transition.step est ≠ 0)
    *
    * @method run
    */
  run:function()
  {
    eval('Anim.Objects.'+Anim.current_step)
  }
}