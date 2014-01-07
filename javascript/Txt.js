/**
  * @module Txt.js
  */

/**
  * Fonction pour créer une instance Texte
  * @method TXT
  * @param  {Staff|Note|Barre|Mesure} owner Le porteur du texte
  * @param  {String|Object} params Les paramètres ou le texte
  * @return {Txt} L'instance texte créée
  */
window.TXT = function(owner, params)
{
  if(!MODE_FLASH) Anim.wait(1)
  return new Txt(owner, params)
}

/**
  * @class Txt
  * @constructor
  * @param  {Staff|Note|Barre|etc.} owner Le porteur du texte
  * @param  {String|Object} params  Le texte ou les paramètres du texte
  */
window.Txt = function(owner, params)
{
  this.id       = 'txt'+(new Date()).getTime()
  
  ObjetClass.call(this)
  
  this.owner    = owner
  this.texte    = null
  this.vOffset  = null
  this.hOffset  = null
  
  if('string'==typeof params) this.texte = params
  else if ('object'==typeof params)
  {
    var me = this
    L(params).each(function(k,v){me[k] = v})
  }
}
Txt.prototype = Object.create( ObjetClass.prototype )
Txt.prototype.constructor = Txt

$.extend(Txt.prototype,{
  
  /**
    * Écrit le texte (en fait, construit son élément et le positionne)
    * @method build
    */
  build:function()
  {
    dlog("-> <Txt>.build")
    Anim.Dom.add(this)
    return this
  },
  /**
    * Masque le texte (sans le détruire)
    * Note
    * ----
    * @method hide
    * @param  {Object} params Paramètres optionnels, et notamment :
    *   @param {Function} params.complete La méthode poursuivre, si elle doit être
    *                                     différente de NEXT_STEP
    */
  hide:function(params)
  {
    if(undefined == params) params = {}
    if(undefined == params.complete) params.complete = NEXT_STEP
    if(MODE_FLASH){
      this.obj.css('opacity', 0) 
      params.complete()
    }
    else 
    {
      this.obj.animate(
        {opacity:0},
        Anim.transition.show,
        params.complete
      )
    }
  },
  /**
    * (Ré-)affiche le texte
    * @method show
    */
  show:function(params)
  {
    dlog("-> <Txt>.show("+params+")")
    if(MODE_FLASH)
    {
      this.obj[0].style.opacity = 1
      NEXT_STEP()
    }
    else
    {
      if(undefined == params) params = {}
      Anim.Dom.show(this.obj, $.extend(params, {complete:NEXT_STEP} ))
    } 
  },
  
  /**
    * Positionne l'élément (en fonction de son possesseur)
    * Notes
    *   * Le texte est toujours placé au-dessus de la portée, sauf
    *     indication contraire, et sauf si la note est au-dessus de la
    *     portée.
    * @method positionne
    */
  positionne:function()
  {
    var top_staff = Anim.current_staff.top
    var top_owner = this.owner.top
    var top = Math.min(top_staff, top_owner) - 20
    this.obj.css({top:top+"px", left:(this.owner.left - 10)+"px"})
  }
})

Object.defineProperties(Txt.prototype,{
  /**
    * Return l'objet DOM du texte
    * @property {jQuerySet} obj
    */
  "obj":{
    get:function(){return $('div#'+this.dom_id)}
  },
  /**
    * L'ID DOM de l'objet DOM du texte
    * @property {String} dom_id
    */
  "dom_id":{
    get:function(){return "text-"+this.id}
  },
  /**
    * Return le code HTML pour le texte
    * @property {HTLMString} code_html
    */
  "code_html":{
    get:function(){
      return '<div id="'+this.dom_id+'" class="text">'+this.texte+'</div>'
    }
  }
})