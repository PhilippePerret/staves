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
    * Objet DIV de la règle
    * @property {jQuerySet} obj
    */
  obj:null,
  /**
    * Affiche la règle (après avoir joué l'animation et un petit délai)
    * @method show
    */
  show:function()
  {
    this.obj.show()
  },
  /**
    * Masque la règle (pendant l'animation)
    * @method hide
    */
  hide:function()
  {
    this.obj.hide()
  },
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