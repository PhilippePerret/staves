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
    * Construit l'objet
    * Pour pouvoir fonctionner, l'objet, quel que soit son type, doit posséder les
    * propriété `code_html` qui définit le code HTML de l'objet, `obj` qui retourne
    * le set jQuery de l'objet principal et la méthode `positionne` qui positionne
    * l'objet et son contenu en fonction des paramètres transmis à l'instanciation.
    *
    * @method build 
    * @param {Object} params  Paramètres supplémentaires
    */
  build:function()
  {
    Anim.Dom.add(this)
    if(this.obj)
    {
      this.obj.draggable({
        containment:'parent',
        start:$.proxy(UI.Tools.on_start_dragging_of, UI.Tools, this),
        stop:$.proxy(UI.Tools.coordonnees_of, UI.Tools, this)
      })
    }
    return this
  },
  /**
    * Affiche l'objet DOM de l'élément
    * @method show
    * @param  {Object} params  Les paramètres optionnels (ou la durée {Number})
    * @return {Any} L'instance de l'élément, pour chainage éventuel
    */
  show:function(params)
  {
    Anim.Dom.show(this, params)
    return this
  },
    
  /**
    * Masque la portée (sans la détruire)
    * @method hide
    * @param  {Object} params  Les paramètres optionnels (ou la durée {Number})
    * @return {Any} L'instance de l'élément, pour chainage éventuel
    */
  hide:function(params)
  {
    Anim.Dom.hide(this, params)
    return this
  },
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
      params = $.extend( params, {owner:this, top:this.top, left:this.left} )
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
  },
  
  
  /**
    * Détruit tous les textes si l'élément possède la propriété `texte`
    * @method remove_textes
    */
  remove_textes:function()
  {
    if(!this.texte) return
    L(this.texte).each(function(k, instance){ instance.remove() })
  }
  
}