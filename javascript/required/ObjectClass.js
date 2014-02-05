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