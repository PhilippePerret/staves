/**
  * ObjetClass, la classe mère de tous les objets de l'animation tels
  * que les notes, les textes, etc.
  *
  * @class ObjetClass
  * @constructor
  * @param  {Object} params   Paramètres optionnels, pour dispatcher des valeurs
  *                           de propriétés dans l'instance.
  */
window.ObjetClass = function(params)
{
  /**
    * Taille de l'objet
    * -----------------
    * Utiliser la propriété complexe `width` pour le (re-)définir
    *
    * @property {Number} _width    La taille du cercle
    */
  this._width = 30
  
  if(undefined != params)
  {
    var me = this
    L(params).each(function(prop,value){ me[prop] = value})
  }
}
$.extend(window.ObjetClass.prototype,{
  /**
    * Affiche l'objet ou les objets composant l'élément
    * @method show
    * @param  {Object|Undefined} params Les paramètres optionnels
    *   @param  {Number} params.duree   La durée pour apparaitre (en millisecondes)
    *                                   Default: 400
    *   @param  {Function} params.complete  La méthode pour suivre
    *                                       default: NEXT_STEP (Anim.Step.auto_next)
    */
  show:function(params)
  {
    if(undefined == params) params = {}
    if(undefined == params.complete) params.complete = NEXT_STEP
    Anim.show(this.obj, params)
  },
  
  /**
    * Destruction de l'objet DOM de l'objet
    * Notes
    * -----
    *   * Pour être utilisé, l'objet doit obligatoirement posséder une propriété
    *     `obj` qui retourne son objet DOM
    *
    * @method remove
    * @async
    * @param  {Object} params   Les paramètres optionnels
    *   @param  {Function} params.complete    La méthode pour suivre (NEXT_STEP par défaut)
    *
    */
  remove:function(params)
  {
    return this.operation([this.obj], 'remove', params)
  },
  
  /**
    * Positionne l'objet à son top/left
    * @method positionne
    */
  positionne:function()
  {
    if(this.obj) this.obj.css({top:this.top, left:this.left})
  },
  /**
    * Tentative d'une méthode générale qui permette de gérer un traitement 
    * asynchrone de plusieurs éléments DOM de l'objet.
    * Par exemple : on doit retirer une note qui possède une alteration et une
    * marque de jeu (piqué). Pour la faire disparaitre, on utilise la méthode
    * `animate` de jQuery qui est asynchrone. Et c'est seulement lorsque les trois
    * élément du DOM ont été retiré (la note, l'altération, la marque du jeu) qu'on
    * peut passer à la suite.
    * Pour se faire, la méthode a besoin de connaître les objets à traiter.
    * On les donne en premier argument ({Array}). Ensuite, la méthode a besoin de
    * connaître l'opération à exécuter ('show', 'remove', 'moveTo', etc.). On la
    * donne en second argument.
    * Enfin, la méthode a besoin des paramètres propres à cette méthode, par exemple
    * la nouvelle position pour un 'moveTo'.
    * @method operation
    * @param  {Array} objets La liste des objets (DOM) à traiter
    * @param  {String} operation  L'opération à jouer
    * @param  {Object} params Les paramètres nécessaires à l'opération
    */
  operation:function(objets, operation, params)
  {
    var me = this
    // On commence à créer une table pour savoir quand le traitement sur les
    // objets sera terminé. En clé, on utilise l'identifiant de l'objet DOM
    this.tbl_operation = {}
    var objets_corriged = []
    L(objets).each(function(obj){ 
      if(undefined == obj[0]) return
      me.tbl_operation[obj[0].id] = false 
      objets_corriged.push(obj)
    })
    // On envoie ensuite chaque objet dans la méthode `method`
    L(objets_corriged).each(function(obj){
      var complete = $.proxy(me.on_complete_operation, me, operation, obj[0].id)
      switch(operation)
      {
      case 'show':
        obj.animate({opacity:1}, Anim.transition.show, complete)
        break
      case 'remove':
        obj.animate({opacity:0}, Anim.transition.show, function(){obj.remove(); complete()})
        break
      case 'moveTo':
        if(undefined == params.left)  params.left = obj.left
        if(undefined == params.top)   params.top  = obj.top
        if('function' != typeof obj.animate)
        {
          throw "```Obj n'est pas un set jquery : "+obj.toString() + "```"
        }
        var dpos = {top:params.top+"px", left:params.left+"px"}
        obj.animate(dpos, Anim.transition.note_moved, complete)
        break
      }
    })
  },
  /**
    * Méthode qui fonctionne en parallèle avec `operation` pour savoir si on 
    * peut passer à l'étape suivante.
    * On peut passer à l'étape suivante lorsque tous les objets reçus par `operation`
    * ont été traités.
    * Notes
    * -----
    *   Si une méthode 'on_complete_<operation>' existe, elle est appelée avant
    *   de passer à l'étape suivante.
    *
    * @method on_complete_operation
    * @param  {String} operation  L'opération qui a été exécutée.
    * @param  {String} obj_id   Identifiant de l'objet qui a terminé son traitement
    */
  on_complete_operation:function(operation, obj_id)
  {
    this.tbl_operation[obj_id] = true
    for(var id in this.tbl_operation)
    {
      if(this.tbl_operation[id] == false) return // on ne peut pas finir
    }
    // Si on arrive ici, c'est qu'on peut finir
    delete this.tbl_operation
    if('function' == typeof this['on_complete_'+operation]) this['on_complete_'+operation]()
    NEXT_STEP()
  }
})

Object.defineProperties(ObjetClass.prototype,{
  /**
    * Offset vertical du cercle
    * @property {Number} top
    */
  "top":{
    get:function(){return this._top},
    set:function(top){
      this._top = top
      if(this.obj) this.obj.css('top', top)
    }
  },
  /**
    * Offset horizontal du cercle
    * @property {Number} left
    */
  "left":{
    get:function(){return this._left},
    set:function(left){
      this._left = left
      if(this.obj) this.obj.css('left', left)
    }
  },
  /**
    * Taille de l'objet
    * Si `this.obj` existe, la redéfinition de la valeur modifie la taille de
    * l'objet
    * @property {Number} width
    */  
  "width":{
    get:function(){return this._width || this.DEFAULT_WIDTH},
    set:function(w){
      this._width = w
      if(this.obj) this.obj.css('width', w+"px")
    }
  }
})