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
    * Prépare/construit la règle
    * @method prepare
    */
  prepare:function(){
    this.obj = $('div#regle')
    this.construit_graduations()
    this.obj.
      draggable({containment:'document'}).
      css({top:'480px', left:'25px'})
  },
  /**
    * Construction de la graduation de la règle
    * @method construit_graduations
    */
  construit_graduations:function()
  {
    var x = 0
    while(x < 200)
    {
      this.obj.append(this.boite_graduation(x))
      x += 12
    }
  },
  /**
    * Retourne le code HTML pour la graduation +x+
    * Note : cela consiste en deux boites imbriquées, l'une pour le trait de
    * graduation et l'autre pour la valeur de la graduation
    * @method boite_graduation
    * @param  {Number} x  Valeur de la graduation
    */
  boite_graduation:function(x)
  {
    return  '<div class="divregle" style="left:'+x+'px;">'+
              '<div class="mesregle">'+(x?x:"")+'</div>'+
            '</div>'
  }
}