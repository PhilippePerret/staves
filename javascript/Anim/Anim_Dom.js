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
    * Efface en douceur le contenu de l'animation
    * (pour un lien fluide entre des animations qui se suivent — ou reset en cours d'animation)
    * @method clear
    * @param  {Function}  complete   La méthode pour suivre (NEXT_STEP par défaut)
    * @param  {Object}    params     Paramètres optionnels
    *   @param {Boolean}  params.staves   Si true, détruit aussi les portées
    *   @param {Boolean}  params.all      Pour bien préciser qu'il faut tout détruire
    */
  clear:function(complete, params)
  {
    dlog("-> Effacement de l'animation")
    if(undefined == complete) complete = NEXT_STEP
    if(undefined == params) params = {}
    if(params.all)
    {
      params.staves = true
    } 
    var not = ""
    if(!params.staves) not = ":not(.staff)"
    else Anim.staves = []
    
    var selector = 'section#animation > *'+not
    var nombre_elements = $(selector).length
    $(selector).animate(
      {opacity:0},
      {always:function(){
        -- nombre_elements
        if(nombre_elements == 0)
        {
          $(selector).remove();
          complete()
        }
      }})
  },
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
    * Masque un objet quelconque de l'animation
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
    * @method hide
    * @param  {Any} obj L'objet (Note, Txt, etc.) à masquer
    * @param  {Object} params Les paramètres optionnels
    *   @param  {Number}    params.duree      Le temps pour faire apparaitre l'objet
    *   @param  {Function}  params.complete   La méthode pour suivre (NEXT_STEP par défaut)
    */
  hide:function(obj, params)
  {
    // dlog("-> Anim.Dom.hide / params:");dlog(params)
    if(undefined == params) params = {}
    if(undefined == params.complete) params.complete = NEXT_STEP
    if(MODE_FLASH)
    {
      obj.css('opacity',0)
      params.complete()
    }
    else
    {
      obj.animate(
        {opacity:0}, 
        params.duree || Anim.delai_for('show' /* même vitesse que 'show' */),
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
    * Méthode d'aide qui affiche un point de repère aux coordonnées x/y, puis
    * le fait disparaitre. Écrit les coordonnées dans le feedback UI
    * @method show_point_at
    * @param  {Number} x    Position horizontale
    * @param  {Number} y    Position verticale
    */
  show_point_at:function(x,y)
  {
    UI.feedback("<span class=\"red\">x/left:"+x+" | y/top:"+y+'</span>')
    if(this.point_repere.length == 0) this.section.append('<div id="point_repere_anim"></div>')
    this.point_repere.css({opacity:1, left:x+'px', top:y+'px'})
    this.timer_point_repere = setTimeout($.proxy(this.hide_point_repere, this),500)
  },
  hide_point_repere:function()
  {
    clearTimeout(this.timer_point_repere)
    delete this.timer_point_repere
    this.point_repere.animate({opacity:0})
  }
}

Object.defineProperties(Anim.Dom,{
  /**
    * Objet DOM de la section animation
    * @property section
    */
  "section":{
    get:function(){return $('section#animation')}
  },
  
  /**
    * Objet DOM du point de repère
    * @property {jQuerySet} point_repere
    */
  "point_repere":{
    get:function(){return $('section#animation div#point_repere_anim')}
  }
})