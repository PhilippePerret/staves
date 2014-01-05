/**
  * ObjetClass, la classe mère de tous les objets de l'animation tels
  * que les notes, les textes, etc.
  *
  * @class ObjetClass
  * @constructor
  */
window.ObjetClass = function()
{
  
}
$.extend(window.ObjetClass.prototype,{
  /**
    * Affiche l'objet ou les objets composant l'élément
    * @method show
    * @param  {Object|Undefined} params Les paramètres optionnels
    *   @param  {Number} params.duree   La durée pour apparaitre (en millisecondes)
    *                                   Default: 400
    *   @param  {Function} params.complete  La méthode pour suivre
    *                                       default: NEXT_STEP (Anim.next_step)
    */
  show:function(params)
  {
    if(undefined==params)params={}
    this.obj.animate(
      {
        opacity:1
      }, 
      params.duree || 1000, 
      params.complete || NEXT_STEP
    )
  }
})