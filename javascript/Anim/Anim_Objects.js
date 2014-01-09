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
    * Commande pour construire une gamme sans la placer dans une variable
    * Cf. la fonction SCALE.
    * @method SCALE
    */
  SCALE:function(scale, params){SCALE(scale, params)},
  /** Commande pour construire une note sans la placer dans une variable
    * cf. la fonction NOTE
    * @method NOTE
    */
  NOTE:function(note, params){NOTE(note, params)},
  /** Commande pour construire un accord sans le placer dans une variable
    * cf. la fonction CHORD
    * @method CHORD
    */
  CHORD:function(notes, params){CHORD(notes, params)},
  
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
    if(MODE_FLASH) return Anim.Step.auto_next()
    Anim.timer = setTimeout($.proxy(Anim.Step.auto_next, Anim.Step), laps * Anim.transition.wait)
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
    NEXT_STEP(no_timeout = true)
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
    * Suppression des lignes supplémentaires
    * @method REMOVE_SUPLINE
    * @param  {Object}  params  Les paramètres pour supprimer
    *   @param  {Number}  params.staff    L'indice-portée de la portée dont il faut supprimer des lignes
    *                                     Par défaut, c'est la portée active.
    *   @param  {Number|Array}  params.bottom   La ou les lignes à supprimer en bas
    *   @param  {Number|Array}  params.top      La ou les lignes à supprimer en haut
    *   @param  {Number}        params.xoffset  Position horiztonale de la ligne (Anim.current_x par défaut)
    */
  REMOVE_SUPLINE:function(params)
  {
    if(undefined == params) return F.error("Il faut donner les paramètres pour la suppression des lignes supplémentaires !")
    if(undefined == params.staff) params.staff = Anim.current_staff.indice
    if(undefined == params.xoffset) params.xoffset = Anim.current_x
    if(params.bottom)
    {
      if('number' == typeof params.bottom) params.bottom = [params.bottom]
      L(params.bottom).each(function(indice_supline){
        var id = "supline-"+params.staff+params.xoffset+"-"+indice_supline+"bot"
        $('img#'+id).fadeOut(Anim.transition.show)
      })
    }
    if(params.top)
    {
      if('number' == typeof params.top) params.top = [params.top]
      L(params.top).each(function(indice_supline){
        var id = "supline-"+params.staff+params.xoffset+"-"+indice_supline+"top"
        $('img#'+id).fadeOut(Anim.transition.show)        
      })
    }
    NEXT_STEP()
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
    if(!with_staves) not = ":not(.staffline, .cle)"
    $('section#animation *'+not).remove()
    if(with_staves) Anim.staves = []
    NEXT_STEP()
  },
  
  /**
    * Modifie la vitesse de l'animation
    * @method SPEED
    * @param {Number} indice_vitesse Une valeur de 0 à 20
    */
  SPEED:function(indice_vitesse)
  {
    if(undefined == indice_vitesse) indice_vitesse = 10
    if(isNaN(indice_vitesse)) throw "Il faut donner un nombre pour la vitesse ! (SPEED)"
    if(indice_vitesse < 0 || indice_vitesse > 20) throw "L'indice vitesse est invalide (SPEED(0&lt;->21))"
    Anim.set_speed(indice_vitesse + 1)
    NEXT_STEP(no_timeout = true)
  }
}

METHODES_ANIM_OBJETS = {
  /**
    * Méthode qui reset l'affichage
    * Produit
    * -------
    *   * Remet la position left (x) à la position de départ
    *   * Efface tout sauf les portées
    *   * Propriété complexe => appeler sans parenthèses
    *
    * @method RESET
    */
  "RESET":{
    get:function(){
      Anim.current_x = 100
      $('section#animation *:not(.staffline, .cle)').remove()
      NEXT_STEP()
    }
  }
}

$.extend(Anim.Objects, FONCTIONS_ANIM_OBJETS)
Object.defineProperties(Anim.Objects, METHODES_ANIM_OBJETS)