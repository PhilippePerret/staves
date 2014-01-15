/**
  * ObjetClass, la classe mère de tous les objets de l'animation tels
  * que les notes, les textes, etc.
  * Elle s'occupe de dispatcher les paramètres transmis à l'instanciation de l'objet.
  *
  * @class ObjetClass
  * @constructor
  * @param  {Object} params   Paramètres optionnels, pour dispatcher des valeurs
  *                           de propriétés dans l'instance.
  */
window.ObjetClass = function(params)
{  
  if(undefined != params)
  {
    // Si la portée a été définie par un nombre, il faut prendre son instance
    if(params.staff && 'number' == typeof params.staff) params.staff = Anim.staves[params.staff-1]
    var me = this
    L(params).each(function(prop,value){ me[prop] = value})
  }
}
$.extend(window.ObjetClass.prototype,{
  /**
    * Affiche l'objet ou les objets composant l'élément
    * Noter que la méthode n'est appelée que par certains objets. Pour la plupart,
    * les objets surclassent cette méthode avec leur propre méthode.
    * @method show
    * @param  {Object|Undefined} params Les paramètres optionnels
    *   @param  {Number} params.duree   La durée pour apparaitre (en millisecondes)
    *                                   Default: 400
    */
  show:function(params)
  {
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
    * Comme pour la méthode show, les objets possèdent en général leur propre 
    * méthode `positionne`
    * @method positionne
    */
  positionne:function()
  {
    if(this.obj) this.obj.css({top:this.top, left:this.left})
  },
  /**
    * Méthode générale qui permet de gérer un traitement 
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
    *
    * WARNING
    * -------
    *   * Si l'on veut qu'en toute fin des opérations une méthode spéciale soit
    *     appelée (autre que la méthode naturelle NEXT_STEP), la méthode appelante
    *     doit définir `on_complete_operation` (en général `this.on_complete_operation`)
    *
    * @method operation
    * @async
    * @param  {Array}   objets La liste des objets (DOM) à traiter
    * @param  {String}  operation  L'opération à jouer
    * @param  {Object}  params Les paramètres nécessaires à l'opération + optionnels
    *
    * @return {Object} L'objet this, pour le chainage
    */
  operation:function(objets, operation, params)
  {
    // On commence à créer une table pour savoir quand le traitement sur les
    // objets sera terminé. En clé, on utilise l'identifiant de l'objet DOM
    this.tbl_operation = {}
    var me = this
    var objets_corriged = []
    L(objets).each(function(obj){ 
      if(undefined == obj[0]) return
      me.tbl_operation[obj[0].id] = false 
      objets_corriged.push(obj)
    })
    // On envoie ensuite chaque objet dans la méthode `method`
    L(objets_corriged).each(function(obj){
      var complete = $.proxy(me.on_end_operation, me, operation, obj[0].id)
      switch(operation)
      {
      case 'show':
        obj.animate({opacity:1}, Anim.delai_for('show'), complete)
        break
      case 'hide':
        obj.animate({opacity:0}, Anim.delai_for('show'), complete)
        break
      case 'remove':
        obj.animate({opacity:0}, Anim.delai_for('show'), function(){obj.remove(); complete()})
        break
      case 'colorize':
        // Note : la couleur est donnée par une image de la note ou de l'altération
        // Pour donner une impression de colorisation, on pourrait superposer les
        // deux couleurs et fondre la première en faisant apparaitre la deuxième.
        // À voir si l'effet vaut la chandelle…
        break
      case 'moveTo':
        if(undefined == params.left)  params.left = obj.left
        if(undefined == params.top)   params.top  = obj.top
        if('function' != typeof obj.animate)
        {
          throw "```Obj n'est pas un set jquery : "+obj.toString() + "```"
        }
        var dpos = {top:params.top+"px", left:params.left+"px"}
        // if(MODE_FLASH){ obj.css(dpos); complete() }
        // else 
        obj.animate(dpos, Anim.delai_for('note_moved'), complete)
        break
      }
    })
    return this // pour le chainage
  },
  /**
    * Méthode qui fonctionne en parallèle avec `operation` pour savoir si on 
    * peut passer à l'étape suivante.
    * On peut passer à l'étape suivante lorsque tous les objets reçus par `operation`
    * ont été traités.
    * Notes
    * -----
    *   1.  Si une méthode 'on_complete_<operation>' existe, elle est appelée avant
    *       de passer à l'étape suivante.
    *   2.  Si la méthode appelante a défini on_complete_operation, cette méthode
    *       est appelée pour poursuivre, sinon, c'est NEXT_STEP qui est invoqué
    *
    * @method on_end_operation
    * @param  {String} operation  L'opération qui a été exécutée.
    * @param  {String} obj_id     Identifiant de l'objet qui a terminé son traitement
    */
  on_end_operation:function(operation, obj_id)
  {
    if(!this.tbl_operation)
    {
      if(console)
      {
        console.warn("Problème de `tbl_operation` inexistant dans ObjectClass.on_end_operation"+
        "\nCela se produit lorsque tous les éléments à opérer ont été passés en revue,"+
        "et que la méthode est pourtant appelée à nouveau."+
        "\nVoilà les éléments que j'ai pu récupérer :"+
        "\nobj_id:"+obj_id+
        "\nthis.id : "+this.id+
        "\nthis.type : "+this.type)
      }
      return
    }
    this.tbl_operation[obj_id] = true
    for(var id in this.tbl_operation)
    {
      if(this.tbl_operation[id] == false) return // on ne peut pas encore finir
    }
    // Si on arrive ici, c'est qu'on peut finir
    delete this.tbl_operation
    if('function' == typeof this['on_complete_'+operation]) this['on_complete_'+operation]()
    if(this.on_complete_operation)
    {
      if('function' == typeof this.on_complete_operation) this.on_complete_operation()
      delete this.on_complete_operation
    }
    else
    {
      NEXT_STEP()
    } 
  }
})

Object.defineProperties(ObjetClass.prototype,{
  /**
    * Portée de l'objet ({Staff})
    * Pour la définir, on peut soit envoyer la portée, soit envoyer son indice 1-start
    *
    * @property {Staff} staff
    */
  "staff":{
    set:function(staff)
    {
      if('number' == typeof staff) this._staff = Anim.staves[staff - 1]
      else if (staff.class == 'staff') this._staff = staff
      else delete this._staff
    },
    get:function(){
      if(this.class == 'txt') return this._staff
      return this._staff || Anim.current_staff
    }
  },
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
    * Offset horizontal de l'objet
    * @property {Number} left
    * @default Anim.current_x
    */
  "left":{
    get:function(){return this._left || Anim.current_x},
    set:function(left){
      this._left = left
      if(this.obj) this.obj.css('left', left)
    }
  },
  /**
    * Le milieu vertical de l'objet
    * @property {Number} center_y
    */
  "center_y":{
    get:function(){
      return parseInt(this.top + (this.obj.height() / 2), 10)
    }
  }
})