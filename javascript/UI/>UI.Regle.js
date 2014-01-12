/**
  * @module UI.Regle.js
  */

/**
  * Gestion de la règle de mesure
  *
  * @class  Regle
  * @for    UI
  * @static
  */
if(undefined == window.UI) window.UI = {}
window.UI.Regle = {
  /**
    * Nombre de secondes d'attente entre la fin de l'animation et la
    * ré-apparition de la règle de mesure
    * @property {Number} DELAY_BEFORE_SHOW
    * @static @final
    */
  DELAY_BEFORE_SHOW: 2,
  /**
    * Objet DIV de la règle
    * @property {jQuerySet} obj
    */
  obj:null,
  /**
    * Détruit le timer éventuel
    * Notes
    * -----
    *   * Un timer a été déclenché, par exemple, pour ne pas ré-afficher la
    *     règle tout de suite à la fin de l'animation.
    *
    * @method kill_timer
    */
  kill_timer:function()
  {
    if(!this.timer) return
    clearTimeout(this.timer)
    delete this.timer
  },
  /**
    * Affiche la règle après un petit délai
    */
  wait_and_show:function()
  {
    this.timer = setTimeout($.proxy(this.show, this), this.DELAY_BEFORE_SHOW * 1000)
  },
  /**
    * Affiche la règle (après avoir joué l'animation et un petit délai)
    * @method show
    */
  show:function(){this.kill_timer(), this.obj.show()},
  /**
    * Masque la règle (pendant l'animation)
    * @method hide
    */
  hide:function(){this.obj.hide()},
  /**
    * Prépare la règle
    * @method prepare
    */
  prepare:function(){
    this.obj = $('div#regle')
    this.obj.
      draggable({containment:'document'}).
      css({top:'480px', left:'25px'})
  }
}