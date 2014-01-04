/**
  * @module Anim
  * /

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
    * === Main ===
    *
    * Joue l'animation courante
    *
    * @method start
    * @param  {Object} params   Paramètres optionnels
    */
  start:function(params){
    
    this.code_anim = [ // pour l'essai
      "toto=NOTE('a4')", 
      "toto.moveTo('d4')",
      "toto.write('Le texte à écrire')"
      ]
    this.timer = setInterval($.proxy(this.next, this), 1000)
  },
  /**
    * Stoppe l'animation, parce qu'on est au bout ou parce que 
    * c'est demandé
    * @method stop
    */
  stop:function()
  {
    clearInterval(this.timer)
    delete this.timer
  },
  /**
    * Méthode qui joue la séquence suivante
    * @method next
    */
  next:function()
  {
    eval('this.'+this.code_anim.shift())
    if(this.code_anim.length == 0) this.stop()
  },
  
  /**
    * Ajoute un objet DOM à l'animation
    * Notes
    *   * On ajoute toujours l'élément masqué, mais c'est ici que la méthode
    *     ajouter ` style="display:none;"` donc inutile de le mettre dans le
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
    if(code_html.indexOf('display:none')<0)
    {
      code_html = code_html.substring(0, code_html.length-1) + ' style="display:none;">'
    }
    $('section#staves').append(code_html)
    instance.positionne()
    instance.show(instance.class == 'Staff' ? 0 : this.VITESSE_SHOW)
    
  }
})