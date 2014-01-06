/**
  * @module Anim_Objects.js
  */

if(undefined == window.Anim) window.Anim = {}
/**
  * Les objets qui vont être créés par les lignes de code de l'animation,
  * mais également toutes les fonctions qu'on peut trouver dans les pas.
  * pour que l'évaluation du code soit très simple (`this.Objects.<code>`)
  *
  * @class Objets
  * @for   Anim
  * @static
  */

Anim.Objects = {}

FONCTIONS_ANIM_OBJETS = {
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
    * @param {Object} params  Paramètres optionnels 
    *   @param {String} metrique  La métrique éventuelle
    */
  NEW_STAFF:function(cle, params)
  {
    Anim.current_staff = Staff.create(cle, params || {})
    NEXT_STEP()
  },
  
  /**
    * Déplace le "marker" vers la droite sur les portées (pour inscription) 
    * Note
    *   * Cela redéfinit la valeur de Anim.current_x
    * @method LEFT
    * @param  {Number} offset   Optionnellement, le déplacement à effectuer (en pixels)
    *                           Par défaut, Anim.defaut.hoffset
    */
  LEFT:function(offset)
  {
    if(undefined == offset) offset = Anim.defaut.hoffset
    Anim.current_x += parseInt(offset,10)
    NEXT_STEP(no_timeout = true)
  },
  
  /**
    * Activer la portée +indice+ (1-start)
    * @method ACTIVE_STAFF
    * @param {Number} indice Numéro de la portée dans l'affichage, 1-start
    */
  ACTIVE_STAFF:function(indice)
  {
    Anim.current_staff = Anim.staves[indice-1]
    NEXT_STEP(no_timeout = true)
  },
  
  /**
    * Nettoie l'animation. Si `with_staves` est true, on efface aussi les
    * portée
    * Notes
    * -----
    *   * Tous les objets créés resteront quand même dans l'animation, donc
    *     on pourra tout à fait les faire réapparaitre plus tard 
    *     (TODO pas pour le moment)
    *   * Si la suppression des portées est demandée, elles disparaitront vraiment,
    *     ie seront retirées de Anim.staves
    *
    * @method CLEAN
    */
  CLEAR:function(with_staves)
  {
    if(undefined == with_staves) with_staves = false
    var not = ""
    if(!with_staves) not = ":not(.staff, .cle)"
    $('section#animation *'+not).remove()
    if(with_staves) Anim.staves = []
  }
}
$.extend(Anim.Objects, FONCTIONS_ANIM_OBJETS)