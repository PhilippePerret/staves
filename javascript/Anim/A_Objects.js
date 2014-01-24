/**
  * @module Anim_Objects.js
  */

/**
  * Méthode pratique pour récupérer un objet de l'animation
  *
  * @method objet
  * @for    window
  * @param  {String} refobjet   La référence de l'objet
  */
window.objet = function(refobjet)
{
  return eval('Anim.Objects.'+refobjet)
}

if(undefined == window.Anim) window.Anim = {}
/**
  * Les objets qui vont être créés par les lignes de code de l'animation,
  * mais également toutes les fonctions qu'on peut trouver dans les pas.
  * pour que l'évaluation du code soit très simple (`this.Objects.<code>`)
  *
  * @class Anim.Objects
  * @static
  */

Anim.Objects = {}

FONCTIONS_ANIM_OBJETS = {
  /**
    * Retourne la portée d'indice +indice+ (1-start)
    * @method STAFF
    */
  STAFF:function(istaff){
    // dlog("-> Anim.Objects.STAFF")
    return Anim.staves[istaff - 1]
  },
  /**
    * Commande pour construire une gamme sans la placer dans une variable
    * Cf. la fonction SCALE.
    * @method SCALE
    */
  SCALE:function(scale, params){return SCALE(scale, params)},
  /** Commande pour construire une note sans la placer dans une variable
    * cf. la fonction NOTE
    * @method NOTE
    */
  NOTE:function(note, params){return NOTE(note, params)},
  /**
    * Command pour construire un motif sans le placer dans une variable
    * cf. la fonction MOTIF
    * @method MOTIF
    */
  MOTIF:function(notes, params){return MOTIF(notes, params)},
  /** Commande pour construire un accord sans le placer dans une variable
    * cf. la fonction CHORD
    * @method CHORD
    */
  /** Commande pour écrire un sous-titre à l'écran (doublage ou sous-titre)
    * Note : les doublages et sous-titres ne sont pas des textes comme les
    * autre, ils se mettent simplement dans des DIV qui leur sont réservés
    * @method CAPTION
    */
  CAPTION:function(texte, params){Anim.Dom.Doublage.show(texte, params)},

  CHORD:function(notes, params){return CHORD(notes, params)},
  /** Commande pour construire une flèche sans la placer dans une variable
    * cf. la fonction ARROW
    * @method ARROW
    */
  ARROW:function(params){return ARROW(params)},
  /** Commande pour créer une image sans la placer dans une variable
    * cf. la fonction IMAGE
    * @method IMAGE
    */
  IMAGE:function(params){return IMAGE(params)},
  
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
    Anim.timer = setTimeout($.proxy(Anim.Step.auto_next, Anim.Step), laps * Anim.delai_for('wait'))
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
    * @return {Staff} La nouvelle portée
    */
  NEW_STAFF:function(cle, params)
  {
    Anim.current_staff = Staff.create(cle, params || {})
    NEXT_STEP(no_timeout = true)
    return Anim.current_staff
  },
  
  /**
    * Déplace le "curseur de position" horizontalement pour définir le décalage 
    * horizontal de la nouvelle inscription.
    * Notes
    *   * Redéfinit la valeur de Anim.current_x
    *   * Passe à l'étape suivante
    * @method NEXT
    * @param  {Number|Object} param  Cf. la méthode `Anim.Cursor.next()`   
    */
  NEXT:function(param){Anim.Cursor.next(param)},
  /**
    * Place le curseur à une position précise
    * Notes
    *   * Redéfinit la valeur de Anim.current_x
    * @method SET_CURSOR
    * @param {Number|Object} param Définition de la nouvelle position. Cf. `Anim.Cursor.set_cursor`
    */
  SET_CURSOR:function(param, value){Anim.Cursor.set_cursor(param,value)},
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
    if(undefined == params.staff)   params.staff = Anim.current_staff.indice
    if(undefined == params.xoffset) params.xoffset = Anim.current_x
    if(params.bottom)
    {
      if('number' == typeof params.bottom) params.bottom = [params.bottom]
      Staff.erase_suplines(params.staff, params.xoffset, 'bot', params.bottom)
    }
    if(params.top)
    {
      if('number' == typeof params.top) params.top = [params.top]
      Staff.erase_suplines(params.staff, params.xoffset, 'top', params.top)
    }
    NEXT_STEP()
  },
  /**
    * Nettoie l'animation. Si `with_staves` est true, on efface aussi les
    * portée
    * Notes
    * -----
    *   * Si la suppression des portées est demandée, elles disparaitront vraiment,
    *     ie seront retirées de Anim.staves
    *
    * @method CLEAN
    */
  CLEAR:function(with_staves){Anim.Dom.clear(NEXT_STEP, {staves:with_staves})},
  
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
  },
    
  /* ---------------------------------------------------------------------
   *    PRÉFÉRENCES
   */
  /**
    * Pour définir les valeurs par défaut
    * Notes
    * -----
    *   * Il y a deux types de préférences : les préférences absolues et les
    *     préférences relatives. Les relatives se reconnaissent au fait que leur
    *     nom commence toujours par "offset_".
    *   * Lorsqu'une valeur absolue est définie, la même valeur offset est toujours
    *     (re)mise à 0 pour obtenir vraiment la valeur recherchée.
    *
    * @method DEFAULT
    * @param  {Object|String} clevalue   Valeurs par défaut à régler, avec en
    *                             clé le nom de préférence et en valeur la valeur
    *                             à lui donner.
    *                             OU la clé seule (+value+ doit être défini)
    * @param  {Number}  value   Si +clevalue+ est un string (propriété), il faut définir la valeur à lui donner.
    *                           Si value n'est pas définie, ça sera la valeur par défaut.
    */
  DEFAULT:function(clevalue, value)
  {
    if('string' == typeof clevalue)
    {
      Anim.set_pref(clevalue, value, next_step=false)
    }
    else
    {
      L(clevalue).each(function(k,v){
        Anim.set_pref(k, v, next_step=false)
      })
    }
    NEXT_STEP(no_timeout=true)
  },
  /**
    * Décalage des marques d'harmonie par rapport à la portée
    * @method OFFSET_HARMONIE
    * @param {Number} offset    Décalage par rapport à la valeur courante
    *
    */
  OFFSET_HARMONY:function(offset)
  {
    Anim.set_pref('offset_harmony', offset)
  },
  /**
    * Décalage des marques d'accords par rapport à la portée
    * Noter que la valeur sera retirée, pour qu'une valeur positive éloigne de
    * la portée
    * @method OFFSET_CHORD_MARK
    * @param {Number} offset    Décalage par rapport à la valeur courante
    *
    */
  OFFSET_CHORD_MARK:function(offset)
  {
    Anim.set_pref('offset_chord', offset)
  },
  
  /**
    * Commande qui charge pour suivre l'animation donnée en argument. Les deux
    * animation s'enchaineront.
    * Note : La commande peut être placée n'importe où puisqu'elle n'exécutée qu'à
    * la toute fin de l'animation.
    * @method LOAD_ANIM
    * @param {String} path    Chemin à l'animation à charger
    * @param {Object} params  Paramètres optionnels
    */
  SUITE:function(path, params)
  {
    Anim.set_animation_pour_suivre(path, params)
  }
}

METHODES_ANIM_OBJETS = {
  /**
    * Pseudo-méthode pour passer en mode flash
    * @method MODE_FLASH
    */
  "MODE_FLASH":{
    get:function(){ MODE_FLASH = true; NEXT_STEP(no_timeout=true)}
  },
  // Alias
  "FLASH":{get:function(){this.MODE_FLASH}},
  /**
    * Pseudo-méthode pour sortir du mode flash
    * @method STOP_MODE_FLASH
    */
  "STOP_MODE_FLASH":{
    get:function(){ MODE_FLASH = false; NEXT_STEP(no_timeout=true)}
  },
  // Alias
  "STOP_FLASH":{get:function(){this.STOP_MODE_FLASH}},
  /**
    * Remet le curseur de position à la position de départ (début des portées)
    * @method RESET_CURSOR
    */
  "RESET_CURSOR":{
    get:function(){
      Anim.current_x = parseInt(Anim.prefs.x_start,10)
      NEXT_STEP(no_timeout=true)
    }
  },
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
      $('section#animation > *:not(div.staff)').remove()
      this.RESET_CURSOR // c'est elle qui appellera l'étape suivante
    }
  },
  "RESET_PREFERENCES":{
    get:function(){
      Anim.reset_prefs()
      NEXT_STEP(no_timeout = true)
    }
  },
  /**
    * Pseudo-méthode qui permet d'attendre la fin de l'écriture d'un doublage avant
    * de passer à la suite
    * Si le CAPTION contient les paramètres {wait:true}, l'animation attend la fin
    * de l'écriture du doublage, mais parfois on veut que pendant l'écriture du 
    * doublage il se passe quelque chose. C'est dans ce cas que cette commande entre
    * en action.
    * @method WAIT_CAPTION
    */
  "WAIT_CAPTION":{
    get:function(){
      if(Anim.prefs.caption_timer == false)
      {
        if(!MODE_FLASH) F.error("WAIT_CAPTION doit être utilisé dans le contexte de doublage énoncés (`DEFAULT('caption_timer', true)`).\nJe passe à l'étape suivante sans attendre.")
        NEXT_STEP(no_timeout = true)
      }
      else
      {
        // Si un doublage est toujours en cours d'écriture, on ne fait simplement
        // rien du tout. C'est la fin du doublage qui lancera l'étape suivante.
        // Dans le cas contraire, on lance l'étape suivante.
        if(Anim.Dom.Doublage.on)
        {
          Anim.Dom.Doublage.temporize.poursuivre = NEXT_STEP
        } 
        else NEXT_STEP(no_timeout = true)
      }
    }
  }
  
}

$.extend(Anim.Objects, FONCTIONS_ANIM_OBJETS)
Object.defineProperties(Anim.Objects, METHODES_ANIM_OBJETS)