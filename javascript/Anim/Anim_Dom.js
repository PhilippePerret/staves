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
    * Valeur left maximale en fonction de la taille de l'animation à l'écran
    * Note : La valeur est calculée par UI.onresize_window
    * @property {Number} left_max
    */
  left_max:null,
  /**
    * Affiche un objet quelconque de l'animation
    * Notes
    * -----
    *   * La méthode est toujours en fin de chaine donc elle doit toujours
    *     appeler NEXT_STEP(). Mais si la méthode `params.complete` est
    *     définie, elle peut être appelée au lieu de NEXT_STEP, en sachant
    *     que cette méthode `complete` devra se charger OBLIGATOIREMENT
    *     d'appeler NEXT_STEP().
    *     Cela arrive par exemple lorsqu'un objet est constitué de plusieurs
    *     éléments, comme une note altérée avec lignes supplémentaires
    *
    * @method show
    * @param  {Any} obj L'objet (Note, Txt, etc.) à afficher
    * @param  {Object} params Les paramètres optionnels
    *   @param  {Number} params.duree   Le temps pour faire apparaitre l'objet
    *   @param  {Function} params.complete  La méthode pour suivre (NEXT_STEP par défaut)
    */
  show:function(obj, params)
  {
    // dlog("-> Anim.Dom.show / params:");dlog(params)
    if(undefined == params) params = {}
    if(undefined == params.complete) params.complete = NEXT_STEP
    if(MODE_FLASH)
    {
      obj.css('opacity',1)
      params.complete()
    }
    else
    {
      obj.animate(
        {opacity:1}, 
        params.duree || Anim.delai_for('show'),
        params.complete
        )
    }
  },
  /**
    * Ajoute un objet DOM à l'animation
    * Notes
    *   * Pour pouvoir fonctionner, l'instance doit toujours définir : 
    *     - la propriété `code_html` qui définit le code HTML de l'instance
    *     - la méthode `positionne` qui positionne l'élément.
    *     - la méthode `show` qui l'affiche
    * @method add
    * @async
    * @param  {HTMLString|Instance} instance 
    *                               L'instance ou le code HTML de l'élément. Si c'est
    *                               une instance, elle doit répondre à la méthode
    *                               `code_html` qui renvoie le code HTML à afficher
    * @params {Object|Undefined} params Les paramètres optionnels
    *   @params {Function} params.complete    La méthode à appeler en fin de processus (ce processus étant asynchrone)
    *     
    */
  add:function(instance, params)
  {
    // dlog("-> Anim.Dom.add")
    var a_simple_string = 'string' == typeof instance, code_html ;
    if(a_simple_string)
    {
      code_html = instance
    }
    else
    {
      code_html = instance.code_html
    }
    
    // === Ajout du code ===
    this.section.append(code_html)
    
    if(a_simple_string)
    {
      
    }
    else
    {
      // Positionne et affiche l'objet
      instance.positionne()
      instance.show(params)
    }
  },
  
  /**
    * Écrit le doublage ou le sous-titre +texte+ (en fonction de params et des
    * réglages par défaut)
    * @method set_doublage
    * @param {String} texte Le texte (vide pour supprimer le div)
    * @param {Object|Boolean} params  Les paramètres optionnels
    *                                 Ou une valeur true ou false, qui détermine caption
    *   @param {Boolean} params.caption    Si false => doublage, si true => caption
    */
  set_doublage:function(texte, params)
  {
    if(undefined == params) params = {}
    else if ('boolean' == typeof params) params = {caption:params}
    else if (params.doublage == true) params.caption = !params.doublage
    var is_caption = params.caption == true || Anim.prefs.caption == true
    var obj = $(is_caption ? 'span#caption_text' : 'div#doublage')
    var montrer = texte.trim() != ""
    if(montrer)
    {
      obj.html(texte.trim())
      obj.show()
    }
    else
    {
      obj.hide()
    }
    if(is_caption) $('div#caption')[montrer?'show':'hide']()
  }
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