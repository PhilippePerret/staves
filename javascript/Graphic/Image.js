/**
  * @module Image.js
  */

/**
  * Pour créer et gérer une image
  * @method IMAGE
  * @for window
  */
window.IMAGE = function(params)
{
  return new Img(params)
}

/**
  * Pour les instances d'image
  * @class Img
  * @constructor
  * @params {Object} params Les paramètres de l'image
  *   @params {String} params.url     Adresse de l'image
  *   @params {Number} params.top     Top de l'image dans l'animation
  *   @params {Number} params.left    Left de l'image dans l'animation
  *   @params {Number} params.width   Largeur de l'image
  *   @params {Number} params.height  Hauteur de l'image
  */
window.Img = function(params)
{
  this.id   = 'img'+(new Date()).getTime()
  
  var me = this
  L(params || {}).each(function(k,v){
    me[k] = v
  })
}
$.extend(Img.prototype,{
  /**
    * Affiche l'image
    * @method show
    */
  show:function()
  {
    
  }
})
Object.defineProperties(Img.prototype,{
  /**
    * URL de l'image (locale ou distante)
    * @property {String} url
    */
  "url":{
    set:function(url)
    {
      this._url = url
    },
    get:function(){ return this._url}
  },
  
  /**
    * L'image DOM
    * @property {jQuerySet} obj
    */
  "obj":{get:function(){return $('img#'+this.id)}},
  
  /**
    * Code HTML de l'image
    * @property {HTMLString} code_html
    */
  "code_html":
  {
    get:function(){
      var style = []
      if(this.width)  style.push('width:'+this.width+'px;')
      if(this.height) style.push('height:'+this.height+'px;')
      style.push('top:'+this.top+'px;left:'+this.left+'px;')
      return '<img id="'+this.id+'" src="'+this.url+'" style="'+style.join('')+'" />'
    }
  }
    
})