/**
  * @module UniversalMethods
  */

/**
  * Les "Méthodes Universelles" sont des méthodes qui s'appliquent à tout
  * objet de l'animation, quelle que soit sa classe (Notes, Accords, Portée, etc.).
  * Elles étendent toutes les classes.
  *
  * @class  UNVERSAL_METHODS
  * @static
  */
window.UNVERSAL_METHODS = {
  /**
    * Construit des flèches partant de l'objet
    * Notes
    *   * La méthode permet de construire plusieurs flèches pour l'objet.
    * @method arrow
    * @param {Number|String|Object} aid     L'identifiant de la flèche, ou les paramètres de la première
    * @param {Object}               params  Paramètres optionnels
    *   @param  {Number} params.orientation   L'angle d'orientation de la flèche
    *                                         Par défaut : 180 (horizontal)
    * @return {Arrow} La flèche d'index +index+ (1-start)
    */
  arrow:function(aid, params)
  {
    if('object' == typeof aid)
    {
      params  = $.extend(true, {}, aid)
      aid     = 1
    }
    else if(undefined == aid)
    {
      aid     = 1
      params  = {}
    }
    if(undefined == this.arrows) this.arrows = {length:0}
    if(undefined == this.arrows[aid])
    {
      // => La flèche n'existe pas, il faut la construire
      if(undefined == params) params = {}
      var darrow = 
      params = $.extend(params, {
        owner :this, 
        top   :this.center_y, 
        left  :this.left + 20 + (this.surrounded ? 4 : 0)
      })
      // dlog("params arrow :");dlog(params)
      this.arrows[aid] = new Arrow(params)
      ++ this.arrows.length
      Anim.Dom.add(this.arrows[aid])
    }
    return this.arrows[aid]
  },
  /**
    * Méthode pour supprimer la flèche
    * @method unarrow
    */
  unarrow:function(index)
  {
    if(undefined != this.arrows[index])
    {
      this.arrows[index].remove()
      delete this.arrows[index]
      this.arrows.length -= 1
      if(this.arrows.length == 0) delete this.arrows
    } 
  }
  
}