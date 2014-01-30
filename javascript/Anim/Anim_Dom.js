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
    * Largeur de l'animation (calculée)
    * @property {Number} width
    */
  width:null,
  /**
    * Hauteur de l'animation (calculée)
    * @property {Number} height
    */
  height:null,
  
  /**
    * Valeur left maximale en fonction de la taille de l'animation à l'écran
    * Note : La valeur est calculée par UI.onresize_window
    * @property {Number} left_max
    */
  left_max:null,
  
  /** === Main ===
    *
    * Méthode Animate générale, qui traite l'animation d'un ou plusieurs objets
    *
    * @method anime
    * @param {jQuerySet|Array}  objets    Un DOM objet ou une liste de DOM Objets à animer
    * @param {Object}           data_css  Les données CSS de transformation
    * @param {Object}           params    Les paramètres optionnels
    *   @param  {Float}           params.duree      La durée de l'animation, en secondes
    *   @param  {Function|False}  params.complete   La méthode pour suivre, ou false.
    *   @param  {String}          params.complete_each  Une méthode (EXPRIMÉE EN STRING) à invoquer sur l'objet qui vient de terminer son animate. Par exemple 'remove'.
    *   @param  {Boolean|Number}  params.wait       Soit undéfini : on poursuit à la fin de l'animation
    *                                               Soit false : on s'arrête à la fin de l'animation.
    *                                               Soit un nombre de secondes : on passe à la suite après x secondes, et on ne fait rien à la fin de l'animation.
    */
  anime:function(objets, data_css, params)
  {
    if('function' != typeof objets.splice) objets = [objets]
    var iobjet = 0,
        nombre_objets = objets.length,
        nombre_objets_traited = 0 ;
    
    /*
     *  Définition de la méthode params.complete à appeler en fin d'animation
     *  ou au temps déterminer par params.wait
     *  Quand params.complete n'est pas défini en argument, c'est NEXT_STEP
     */
    params = define_complete(params)
    
    /*
     *  On boucle sur tous les objets fournis en argument pour les animer
     *  Noter que souvent il n'y en a qu'un seul.
     *
     *  Pour le moment, le set jQuery (l'objet) doit renvoyer à un seul élément. Pour
     *  éviter tout problème, on s'assure ici de ne prendre que le premier.
     *
     */
    for(; iobjet < nombre_objets; ++iobjet)
    {
      objets[iobjet].eq(0).
        animate(
          data_css,
          {
            duration : (params.duree || Anim.delai_for('transform')) * 1000,
            complete : function()
            {
              /*
               *  Si une méthode (simple) a été définie dans `complete_each`, on
               *  l'exécute sur l'objet.
               */
              if('string' == typeof params.complete_each) this[params.complete_each]()
            },
            always   : function()
            {
              ++ nombre_objets_traited
              if(nombre_objets_traited == nombre_objets)
              {
                // Fin de l'animation de tous les objets à traiter
                if('function' == typeof params.complete) params.complete()
              }
            }
          }
        )
    }
    
    /* 
     *  On traite éventuellement le paramètre wait, soit pour passer à l'étape
     *  suivante tout de suite, soit après un laps de temps défini par params.wait,
     *  soit on ne fait rien.
     */
    traite_wait( params )
  },
  
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
    if(nombre_elements == 0)
    {
      complete()
      return
    }
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
    * Pour les paramètres, cf. hide_or_show.
    * @method show
    */
  show:function(instance, params)
  {
    if('number'==typeof params) params = {duree:params}
    this.hide_or_show(instance, params, true)
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
    * @param  {Any} instance L'instance (Note, Txt, etc.) à masquer
    * @param  {Object} params Les paramètres optionnels
    *   @param  {Number}    params.duree      Le temps pour faire apparaitre l'objet
    *   @param  {Function}  params.complete   La méthode pour suivre (NEXT_STEP par défaut)
    */
  hide:function(instance, params)
  {
    if('number'==typeof params) params = {duree:params}
    this.hide_or_show(instance, params, false)
  },
  /**
    * Méthode générale pour masquer ou afficher l'objet `obj` de l'instance
    * quelconque +instance+.
    * @method hide_or_show
    * @param  {Any} instance L'instance (Note, Txt, etc.) à afficher
    * @param  {Object} params Les paramètres optionnels
    *   @param  {Number}    params.duree      Le temps en secondes pour faire apparaitre/disparaitre l'objet
    *   @param  {Function}  params.complete   La méthode pour suivre (NEXT_STEP par défaut)
    *   @param  {Boolean|Number} params.wait  Définit comment il faut passer à la suite.
    */
  hide_or_show:function(instance, params, to_show)
  {
    var obj = instance.obj
    if(undefined == obj || obj.length == 0) return F.error("[Anim.Dom.hide_or_show] Aucun objet à traiter…")
    params = define_wait(params, instance)
    params.duree = params.duree || Anim.delai_for('show')
    this.anime([obj], {opacity: to_show ? 1 : 0}, params)
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
    * @param {Object|Undefined} params Les paramètres optionnels
    *   @param {Function} params.complete    La méthode à appeler en fin de processus (ce processus étant asynchrone)
    *     
    */
  add:function(instance, params)
  {
    // dlog("-> Anim.Dom.add")
    var real_instance = 'string' != typeof instance ;
    
    params = define_complete(params)
    
    // === Ajout du code à l'animation ===
    this.section.append(real_instance ? instance.code_html : instance)
    
    if(real_instance)
    {
      instance.positionne()
      if(instance.opacity != 0 && !instance.hidden) instance.show(params)
      else if('function' == typeof params.complete) params.complete()
    }
    // dlog("<- Anim.Dom.add")
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