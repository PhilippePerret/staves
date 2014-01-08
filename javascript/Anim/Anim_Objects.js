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
    * Commande console construisant une gamme
    * @method SCALE
    * @param  {String} scale  La gamme à construire, exprimée par une note et une altération
    * @param  {Object} params Les paramètres optionnels
    *   @param  {Number} params.staff     Indice de la portée. Défaut : la portée courante.
    *   @param  {String} params.type      Le type de gamme parmi :
    *                                     * 'MAJ' (défaut = gamme majeure), 
    *                                     * 'min_h' (mineure harmonique), 
    *                                     * 'min_ma' (mineure mélodique ascendante)
    *                                     * 'min_md' (mineur mélodique descendante)
    *   @param  {Number} params.offset    Le décalage pixel entre chaque note. Par défault
    *                                     le décalage optimal en fonction des altérations
    *   @param  {Number} params.octave    Octave de la note de départ. Par défaut, la meilleure position
    *                                     par rapport à la portée et la note, pour produire le
    *                                     moins de lignes supplémentaires possible.
    *   @param  {Boolean} params.asc      Ascendante ou descendante (true par défaut)
    *   @param  {String}  params.from     La note de laquelle on doit partir, si c'est
    *                                     une autre note que la fondamentale.
    *   @param  {Number}  params.for      Le nombre de notes à écrire (8 par défaut)
    */
  SCALE:function(scale, params)
  {
    var note_scale  = scale.substring(0,1).toLowerCase() // -> p.e. "c"
    var inote_scale = NOTES.indexOf(note_scale)
    if(inote_scale < 0) throw "Il faut donner une note correcte pour la gamme !"
    var alteration = null
    if(scale.length > 1) alteration = scale.substring(1,2)
    // Paramètres de la gamme
    if(undefined == params) params = {}
    if(undefined == params.staff)   params.staff = Anim.current_staff
    else params.staff = Anim.staves[params.staff]
    if(undefined == params.staff) throw "Portée "+params.staff+" inconnue…"
    if(undefined == params.type)    params.type  = 'MAJ'
    var data_scale = DATA_SCALES[params.type]
    if(undefined == data_scale) throw "Le type de gamme `"+params.type+"` est inconnu…"
    if(undefined == params.asc)     params.asc   = true
    if(undefined == params.offset)  params.offset = 60
    if(undefined == params.octave)  params.octave = Staff.best_octave_scale(params.staff.cle, inote_scale)
    if(undefined == params.for)     params.for    = 8
    if(undefined == params.from)    params.from   = note_scale
    // Liste des intervalles de la gamme demandée
    var intervalles = DATA_SCALES[params.type].intervalles
    
    //== On peut construire la gamme ==
    var i, note, i_int = -1, alt, last_hauteur ;
    for(i = 0; i < params.for; ++i)
    {
      note = NOTES[i + inote_scale] // p.e. "e"
      if(i > 0 && note == "c") ++params.octave

      // -- L'altération --
      if('undefined' != typeof last_hauteur)
      {
        hauteur_needed     = (last_hauteur + intervalles[++i_int])
        if(hauteur_needed > 12) hauteur_needed -= 12
        diff = hauteur_needed - REAL_INDICES_NOTES[note]
        switch(diff)
        {
        case -2 : alt = "t"; break;
        case -1 : alt = "b"; break;
        case 0  : alt = "" ; break;
        case 1  : alt = "d"; break;
        case 2  : alt = "x"; break;
        default : ""
        }
      }
      else
      { // la première
        alt = alteration || ""
      }
      note_str = note + alt
      
      // -- l'octave --
      note_str += params.octave.toString()
      
      dlog("note str finale:"+note_str)
      
      Anim.current_x += params.offset
      NOTE(note_str)
      // On mémorise la hauteur de la note courante pour pouvoir
      // régler la hauteur de la prochaine note
      last_hauteur = REAL_INDICES_NOTES[note]
      switch(alt)
      {
      case null: break;
      case 'd' : last_hauteur += 1; break
      case 'b' : last_hauteur -= 1; break
      case 'x' : last_hauteur += 2; break
      case 't' : last_hauteur -= 2; break
      }
    }
  },
  
  /**
    * Méthode qui reset l'affichage
    * Produit
    * -------
    *   * Remet la position left (x) à la position de départ
    *   * Efface tout sauf les portées
    *
    * @method RESET
    */
  RESET:function()
  {
    Anim.current_x = 100
    $('section#animation *:not(.staffline, .cle)').remove()
    NEXT_STEP()
  },
  
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
  }
}
$.extend(Anim.Objects, FONCTIONS_ANIM_OBJETS)