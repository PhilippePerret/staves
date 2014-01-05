/**
  * @module Anim_Objects.js
  */

if(undefined == window.Anim) window.Anim = {}
/**
  * Les objets qui vont être créés par les lignes de code de l'animation,
  * mais également toutes les fonctions qu'on peut trouver dans les pas.
  *
  * @class Objets
  * @for   Anim
  * @static
  */

Anim.Objects = {
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
    Anim.timer = setTimeout($.proxy(Anim.auto_next_step, Anim), laps * 1000)
  },
  WRITE:function(texte)
  {
    F.show(texte) // pour le moment
  },
  /**
    * Affiche une nouvelle portée et la met en portée courante
    * @method SHOW_STAFF
    * @param {String|Constante} cle   La clé de la portée
    * @param {String} metrique  La métrique éventuelle
    */
  NEW_STAFF:function(cle, metrique)
  {
    Anim.current_staff = Anim.new_staff(cle, metrique)
  },
  
  /**
    * Activer la portée +indice+ (1-start)
    * @method ACTIVE_STAFF
    * @param {Number} indice Numéro de la portée dans l'affichage, 1-start
    */
  ACTIVE_STAFF:function(indice)
  {
    Anim.current_staff = Anim.staves[indice-1]
  },
  
  /**
    * Nettoie l'animation. Si `with_staves` est true, on efface aussi les
    * portée
    * @noter que tous les objets créés resteront quand même dans l'animation, donc
    * on pourra tout à fait les faire réapparaitre plus tard (TODO pas pour le moment)
    * @method CLEAN
    */
  CLEAR:function(with_staves)
  {
    if(undefined == with_staves) with_staves = false
    var not = ""
    if(!with_staves) not = ":not(.staff, .cle)"
    $('section#staves *'+not).remove()
  }
}