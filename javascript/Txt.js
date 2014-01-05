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
  Anim.wait(1)
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
  this.id       = (new Date()).getTime()
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
$.extend(Txt.prototype,{
  
  /**
    * Écrit le texte (en fait, construit son élément et le positionne)
    * @method build
    */
  build:function()
  {
    Anim.add(this)
  },
  /**
    * Affiche les objets de l'élément
    * @method show
    * @param  {Number} vitesse La vitesse d'apparition
    */
  show:function(vitesse)
  {
    this.obj.show(vitesse)
  },
  /**
    * Positionne l'élément (en fonction de son possesseur)
    * TODO Pour le moment, je fais avec une note, donc en le plaçant
    *       au-dessus.
    * @method positionne
    */
  positionne:function()
  {
    dlog("this.owner.top="+this.owner.top)
    this.obj.css({top:(this.owner.top - 40)+"px", left:(this.owner.left - 10)+"px"})
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
      return '<div id="'+this.dom_id+'" class="text" style="display:none;">'+this.texte+'</div>'
    }
  }
})