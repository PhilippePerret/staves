/**
  * @module Anim
  */

/**
  * Objet Anim pour jouer l'animation
  *
  * @class Anim
  * @static
  */
if(undefined == window.Anim) window.Anim = {}
$.extend(window.Anim,{
  /**
    * Vitesse d'apparition des éléments
    * @property {Number} VITESSE_SHOW
    * @static
    * @final
    */
  VITESSE_SHOW: 400,
  /**
    * La portée courante 
    * @property {Staff} current_staff
    */
  current_staff:null,
  
  /**
    * Les objets qui vont être créés par les lignes de code de l'animation,
    * mais également les fonctions
    *
    * @class Objets
    * @for   Anim
    * @static
    */
  Objects:{
    /**
      * Méthode pour attendre +laps+ secondes avant de poursuivre
      * l'animation
      * @method WAIT
      * @param  {Number} laps   Nombre de secondes
      * @example
      *   // Dans le code de l'animation
      *   WAIT(4)
      */
    WAIT:function(laps)
    {
      Anim.timer = setTimeout($.proxy(Anim.next_step, Anim), laps * 1000)
    }
  },
  
  /**
    * === Main ===
    *
    * Joue l'animation courante
    *
    * @method start
    * @param  {Object} params   Paramètres optionnels
    */
  start:function(params){
    this.steps = Console.steps
    this.next_step()
  },
  /**
    * Stoppe l'animation, parce qu'on est au bout ou parce que 
    * c'est demandé
    * @method stop
    */
  stop:function()
  {
    delete this.timer
  },
  /**
    * Méthode qui joue la séquence suivante
    * @method next_step
    */
  next_step:function()
  {
    if(this.timer) clearTimeout(this.timer)
    eval('this.Objects.'+this.steps.shift())
    if(this.steps.length == 0) this.stop()
  },
  
  /**
    * Attends +laps+ secondes avant de passer à l'étape suivante
    *
    * @note C'est un raccourci de Anim.Objects.WAIT
    * @method wait
    * @param  {Number} laps Nombre de secondes (peut être un flottant)
    */
  wait:function(laps){ this.Objects.WAIT(laps) },
    
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
    var code_html = instance.code_html
    if(code_html.indexOf('opacity:0')<0)
    {
      code_html = code_html.substring(0, code_html.length-1) + ' style="opacity:0;">'
    }
    $('section#staves').append(code_html)
    instance.positionne()
    instance.show(instance.class == 'Staff' ? 0 : this.VITESSE_SHOW)
    
  }
})

/**
  * Raccourci pour définir de passer à l'étape suivante
  * @for window
  * @property NEXT_STEP
  * @static
  * @final
  */
var NEXT_STEP = $.proxy(Anim.next_step, Anim)