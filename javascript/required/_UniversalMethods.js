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
    * Construit l'objet de tout élément qui hérite des méthodes universelles (dont potentiellement
    * tous les éléments de l'animation).
    *
    * Pour pouvoir fonctionner, l'objet, quel que soit son type, doit posséder :
    *   - La propriété `code_html` qui définit le code HTML de l'objet, 
    *   - La propriété `obj` qui retourne le set jQuery de l'objet principal
    *   - la méthode `positionne` qui positionne l'objet et son contenu en fonction 
    *     des paramètres transmis à l'instanciation.
    *
    * @method build 
    * @param {Object} params  Paramètres supplémentaires
    */
  build:function(params)
  {
    dlog("-> build (UniversalMethods)")
    Anim.Dom.add(this, params)
    if(this.obj)
    {
      this.obj.draggable({
        containment:'parent',
        start:$.proxy(UI.Tools.on_start_dragging_of, UI.Tools, this),
        stop:$.proxy(UI.Tools.coordonnees_of, UI.Tools, this)
      })
    }
    dlog("<- build (UniversalMethods)")
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
    var d = this.args_for_arrow(aid, params)
    var aid = d.index
    params  = d.params
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
    * @param {Number} index   Indice de la flèche à supprimer
    * @param {Object} params  Paramètres optionnels (dont wait et complete)
    */
  unarrow:function(index, params)
  {
    var d = this.args_for_arrow(index, params)
    var index = d.index
    params    = d.params
    if(undefined != this.arrows[index])
    {
      Anim.Dom.anime([this.arrows[index].obj], {opacity:0}, $.extend(params || {}, {complete_each:'remove'}))
      delete this.arrows[index]
      this.arrows.length -= 1
      if(this.arrows.length == 0) delete this.arrows
    }
    else NEXT_STEP(0)
  },
  /**
    * Récupère et analyse les arguments envoyés à arrow et unarrow et retourne le bon index
    * et les bons paramètres.
    * Ce traitement est nécessaire car on peut appeler la méthode avec des paramètres sans index,
    * ou avec rien du tout.
    * @method args_for_arrow
    * @param {Undefined|Object|Number} index Tout est là, qu'est-ce que c'est ?
    * @param {Undefined|Object} params  Les paramètres ?
    * @return {Object} définissant `index` et `params`
    */
  args_for_arrow:function(index, params)
  {
    if('object' == typeof index)
    {
      params  = $.extend(true, {}, index)
      index   = 1
    }
    else if(undefined == index)
    {
      index   = 1
      params  = {}
    }
    return {index: index, params:params}
  },
  
  /**
    * Détruit tous les textes si l'élément possède la propriété `texte`
    * @method remove_textes
    */
  remove_textes:function()
  {
    if(!this.texte) return
    L(this.texte).each(function(k, instance){ instance.remove() })
  },
  
  /**
    * Dispatche les données +params+ dans l'objet, à l'instantiation
    * Noter que dans beaucoup de cas, dispatcher les paramètres signifie 
    * également définir l'objet à l'affichage, puisque la plupart des propriétés
    * sont complexes et règlent l'objet quand on les modifie.
    *
    * @method dispatch
    * @param {Object} params    Paramètres de l'objet.
    */
  dispatch:function(params)
  {
    if(undefined == params) return
    var my = this
    L(params).each(function(k,v){ my[k] = v })
  }
  
  
}