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


/* ---------------------------------------------------------------------
 *  Méthodes d'animation (utilisables dans le code)
 *  
 */
$.extend(ObjetClass.prototype, {
  /**
    * Affiche l'objet de l'instance (property `obj`)
    * Noter que la méthode n'est appelée que par certains objets. Pour la plupart,
    * les objets surclassent cette méthode avec leur propre méthode.
    * @method show
    * @param  {Object|Undefined} params Les paramètres optionnels (ou la durée)
    *   @param  {Number} params.duree   La durée pour apparaitre (en millisecondes)
    *                                   Default: Anim.transition.show
    */
  show:function(params)
  {
    Anim.Dom.show(this, params)
  },
  /**
    * Masque l'objet de l'instance (property `obj`)
    * 
    * Noter que la méthode n'est appelée que par certains objets. Pour la plupart,
    * les objets surclassent cette méthode avec leur propre méthode.
    *
    * @method hide
    * @param {Object}   params    Les paramètres optionnels (ou la durée)
    *   @param  {Number}  params.duree    La durée pour disparaitre
    *                                     Default: Anim.transition.show
    */
  hide:function(params)
  {
    Anim.Dom.hide(this, params)
  },
  /**
    * Destruction de l'objet DOM de l'élément
    * Notes
    * -----
    *   * Pour être utilisé, l'objet doit obligatoirement posséder une propriété
    *     `obj` qui retourne son objet DOM (set jQuery)
    *
    * @method remove
    * @async
    * @param  {Object} params   Les paramètres optionnels (complete, duree, wait, etc.)
    *
    */
  remove:function(params)
  {
    Anim.Dom.anime([this.obj], {opacity:0}, $.extend(params, {complete_each:'remove'}))
  },
  

})
/* Fin des méthodes d'animation
 * --------------------------------------------------------------------- */


/* ---------------------------------------------------------------------
 *  Méthodes protégées (propres au programme)
 *  
 */
$.extend(window.ObjetClass.prototype,{
  /**
    * Méthode consignant les erreurs survenues
    * Si la console existe, on les affiche
    * @method error
    * @param  {String}  err     L'erreur survenue
    * @param  {Object}  params  Paramètres optionnels
    */
  error:function(err)
  {
    if(undefined == this.errors) this.errors = []
    this.errors.push(err)
    if(console) console.error(err)
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
    * connaître l'opération à exécuter ('show', 'remove', 'move', etc.). On la
    * donne en second argument.
    * Enfin, la méthode a besoin des paramètres propres à cette méthode, par exemple
    * la nouvelle position pour un 'move'.
    *
    * WARNING
    * -------
    *   * Si l'on veut qu'en toute fin des opérations une méthode spéciale soit
    *     appelée, la méthode appelante doit définir `on_complete_operation` (en général
    *     `this.on_complete_operation`)
    *     Mais attention aux cas spéciaux : par exemple, pour les motifs et les gammes,
    *     cette `operation` est appelée pour autant que notes que le motif ou la gamme
    *     en contient. Donc elles possèdent leur propre gestion du lancement de
    *     l'étape suivante, tant que leur opération (à commencer par la construction et
    *     l'affichage) n'est pas achevé.
    *
    * @method operation
    * @async
    * @param  {Array}   objets La liste des objets (DOM) à traiter
    * @param  {String}  operation  L'opération à jouer
    * @param  {Object}  params Les paramètres nécessaires à l'opération + optionnels
    *   @param  {Function} params.complete  La méthode à appeler en fin de processus
    * @return {Object} L'objet this, pour le chainage
    */
  operation:function(objets, operation, params)
  {
    // if(params && params.complete) this.on_complete_operation = params.complete
    // // On commence à créer une table pour savoir quand le traitement sur les
    // // objets sera terminé. En clé, on utilise l'identifiant de l'objet DOM
    // this.tbl_operation = {}
    // var me = this
    // var objets_corriged = []
    // L(objets).each(function(obj){
    //   if(undefined == obj)
    //   {
    //     me.error("#ERROR : Dans `operation`, `obj` est indéfini (this="+me.id+":"+me.type+", operation="+operation+")")
    //     dlog("Pour info, `objets` envoyés à la méthode `operation` :");dlog(objets)
    //   }
    //   if(undefined == obj[0]) return
    //   me.tbl_operation[obj[0].id] = false 
    //   objets_corriged.push(obj)
    // })

    var data_css ;
    switch(operation)
    {
      case 'show' : 
        params.duree = params.duree || Anim.delai_for('show')
        data_css = {opacity:1} ; 
        break ;
      case 'hide' : 
        params.duree = params.duree || Anim.delai_for('show')
        data_css = {opactiy:0} ; 
        break ;
      case 'remove' : 
        params.duree = params.duree || Anim.delai_for('show')
        data_css = {opacity:0}
        params.complete_each('remove')
        break ;
      case 'move' :
        params.duree = params.duree || Anim.delai_for('note_moved')
        data_css({
          left: params.left === undefined ? obj.left : params.left,
          top : params.top  === undefined ? obj.top  : params.top
        })
    }
    
    Anim.Dom.anime(objets, data_css, params)
    
    return this
    // Pour ne pas passer là
    
    // L(objets_corriged).each(function(obj){
    //   var complete = $.proxy(me.on_end_operation, me, operation, obj[0].id)
    //   switch(operation)
    //   {
    //   case 'show':
    //     obj.animate({opacity:1}, Anim.delai_for('show') * 1000, complete)
    //     break
    //   case 'hide':
    //     obj.animate({opacity:0}, Anim.delai_for('show') * 1000, complete)
    //     break
    //   case 'remove':
    //     obj.animate({opacity:0}, Anim.delai_for('show') * 1000, function(){obj.remove(); complete()})
    //     break
    //   case 'move':
    //     if(undefined == params.left)  params.left = obj.left
    //     if(undefined == params.top)   params.top  = obj.top
    //     if('function' != typeof obj.animate)
    //     {
    //       throw "```Obj n'est pas un set jquery : "+obj.toString() + "```"
    //     }
    //     var dpos = {top:params.top+"px", left:params.left+"px"}
    //     // if(MODE_FLASH){ obj.css(dpos); complete() }
    //     // else 
    //     obj.animate(dpos, Anim.delai_for('note_moved') * 1000, complete)
    //     break
    //   }
    // })
    // return this // pour le chainage
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
    *       est appelée pour poursuivre.
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
    * Alias de 'top' pour les calculs
    * @property {Number} y
    */
  "y":{get:function(){return this.top}},

  /**
    * Offset horizontal de l'objet
    * @property {Number} left
    * @default Anim.current_x
    */
  "left":{
    get:function(){
      if(undefined == this._left) this._left = Anim.current_x
      return this._left
    },
    set:function(left){
      this._left = left
      if(this.obj) this.obj.css('left', left)
    }
  },
  /**
    * Alias de 'left' pour les calculs
    * @property {Number} x
    */
  "x":{get:function(){return this.left}},

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