/**
  * @module Anim_Dom.js
  */

/**
  * Gestion de la partie DOM de l'animation
  *
  * @class Anim.Dom
  * @static
  */
if(undefined == window.Anim) window.Anim = {}
Anim.Dom = {
  /**
    * Affiche un objet quelconque de l'animation
    * @method show
    * @param  {Any} obj L'objet (Note, Txt, etc.) à afficher
    * @param  {Object} params Les paramètres optionnels
    *   @param  {Number} params.duree   Le temps pour faire apparaitre l'objet
    *   @param  {Function} params.complete  La méthode pour suivre
    */
  show:function(obj, params)
  {
    if(undefined == params) params = {}
    obj.animate(
      {opacity:1}, 
      params.duree || 1000, 
      params.complete ? params.complete : null
      )
  },
  /**
    * Ajoute un objet DOM à l'animation
    * Notes
    *   * On ajoute toujours l'élément masqué, mais c'est ici que la méthode
    *     ajouter ` style="opacity:0;"` donc inutile de le mettre dans le
    *     code.
    *   * Pour pouvoir fonctionner, l'instance doit toujours définir : 
    *     - la propriété `code_html` qui définit le code HTML de l'instance
    *     - la méthode `positionne` qui positionne l'élément.
    *     - la méthode `show` qui l'affiche
    * @method add
    * @param  {HTMLString} code_html  Le code HTML de l'élément.
    */
  add:function(instance)
  {
    var a_simple_string = 'string' == typeof instance, code_html ;
    if(a_simple_string)
    {
      code_html = instance
    }
    else
    {
      code_html = instance.code_html
    }
    if(code_html.indexOf('opacity:0')<0)
    {
      code_html = code_html.substring(0, code_html.length-1) + ' style="opacity:0;">'
    }
    this.section.append(code_html)
    if(a_simple_string)
    {
      
    }
    else
    {
      // Positionne et affiche l'objet
      instance.positionne()
      instance.show(instance.class == 'Staff' ? 0 : Anim.transition.show)
    }
  },
  
}

Object.defineProperties(Anim.Dom,{
  /**
    * Objet DOM de la section animation
    * @property section
    */
  "section":{
    get:function(){return $('section#animation')}
  }
})