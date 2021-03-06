/**
  * @module Functions.js
  */

/**
  * Dans certaines méthodes, on utilise `x` à la place de `offset_x` et `y` à la place de
  * `offset_y`. Cette méthode permet de corriger ça (note: ce n'est pas une erreur, c'est normal)
  * en supprimant `x` et `y` dans les params
  * @method change_x_y_to_offsets_in_params
  * @for window
  * @param  {Object} params Les paramètres éventuels
  * @return {Object} Les nouveau paramètres corrigés ou un Hash vide.
  *
  */
window.change_x_y_to_offsets_in_params = function(params)
{
  if(undefined == params) return {}
  if(undefined !== params.x)
  {
    params.offset_x = parseInt(params.x)
    delete params.x
  }
  if(undefined !== params.y)
  {
    params.offset_y = parseInt(params.y)
    delete params.y
  }
  return params
}

/**
  * Méthode qui défini les paramètres +params+ en ajoutant l'objet donné en
  * deuxième argument.
  * @method define_params
  * @for    window
  * @param {Undefined|Object} params
  * @param {Object}           extension   Ce qu'il faut ajouter à params
  * @return {Object} +params+ étendu avec +extension+
  */
window.define_params = function(params, extension)
{
  if(undefined == params)     params = {}
  if(undefined != extension)  $.extend(params, extension)
  return params
}

/**
  * Méthode qui définit dans les paramètres +params+ la propriété `wait` et
  * la propriété `duree` si elles ne sont pas définies
  *
  * @method define_wait_and_duree
  * @for window
  * @param  {Object|Undefined}  params    Les paramètres éventuellement déjà définis
  * @param  {Object}            instance  L'instance de l'élément qui appelle la fonction
  * @param  {String}            trans_id  L'identifiant de délai (dans Anim.transition)
  * @return {Object}  Les paramètres renseignés
  *
  */
window.define_wait_and_duree = function(params, instance, trans_id)
{
  params = define_wait (params, instance)
  params = define_duree(params, trans_id)
  return params
}
/**
  * Méthode qui définit la propriété `duree` dans les paramètres, si elle
  * n'est pas définie, en prenant l'identifiant duree `trans_id`, clé dans
  * Anim.transition
  * @method define_duree
  * @for    window
  * @param {Object|Undefined} params    Les paramètres éventuellement existants
  * @param {String} trans_id    Identifiant de durée
  * @return {Object} L'objet params avec éventuellement la durée ajoutée.
  */
window.define_duree = function(params, trans_id)
{
  if(undefined == params) params = {}
  if(undefined == params.duree) params.duree = Anim.delai_for( trans_id )
  return params
}
/**
  * Méthode qui ajoute la propriété `wait` aux paramètres +param+ si nécessaire.
  *
  * La méthode est nécessaire car le paramètre `wait`, qui va déterminer à quel moment
  * une étape quelconque va devoir passer la main à l'étape suivante, peut être déterminé
  * de plusieurs façons :
  *   * Soit dans les paramètres envoyés à la méthode d'animation (dans ce cas `wait` sera
  *     déjà dans +params+)
  *   * Soit à l'instanciation de l'objet (dans ce cas, ce sera une propriété de l'objet/l'instance)
  *
  * @method define_wait
  * @for window
  * @param {Undefined|Object} params      Les paramètres déjà définis ou non
  * @param {Object}           instance    L'instance appelant la méthode, de n'importe quelle classe.
  * @param {Boolean|Number}   def_value   Optionnellement, la valeur par défaut à donner
  * @return {Object} Les paramètres avec éventuellement la propriété `wait` ajoutée.
  *
  */
window.define_wait = function(params, instance, def_value)
{
  if(undefined == params) params = {}

  if(undefined === params.wait){
    if(undefined !== instance.wait)
    {
      params.wait = instance.wait
      delete instance.wait
    } 
    else params.wait = def_value
  }
  
  return params
}

/** Méthode qui traite la propriété `wait` dans les paramètres de la
  * plupart des méthodes.
  *
  * L'idée est la suivante : si `params.wait` est exactement égal à `false`, on
  * doit immédiatement passer à la suite (ce n'est pas la méthode `animate` ou autre
  * qui s'en charge). Si `params.wait` est un nombre, alors c'est le temps d'attente,
  * en secondes, avant de passer à la suite.
  *
  * Question :  Est-ce que ce n'est pas la méthode `params.complete` qu'il faudrait
  *             appeler ? (qui est souvent à NEXT_STEP, mais pas toujours) TODO
  *
  * @method traite_wait
  * @for window
  * @param {Objet} params   Les paramètres envoyés (peut être indéfini)
  */
window.traite_wait = function(params)
{
  // dlog("-> traite_wait(params:");dlog(params)
  if(undefined === params.wait) return
  if(params.wait === false)
  {
    NEXT_STEP(0)
  }
  else if('number' == typeof params.wait)
  {
    NEXT_STEP(params.wait)
  }
  else if(MODE_FLASH)
  {
    NEXT_STEP(0.1)
  }
  else
  {
    // Mauvaise valeur ou true inutile
  }
}


/**
  * Méthode définissant la propriété `complete` si nécessaire.
  * @method define_complete
  * @for window
  * @param  {Object}  params   Les paramètres envoyés à la méthode, ou undefined
  * @param  {Any}     value     La valeur à donner à complete (NEXT_STEP par défaut)
  * @return {Object}  Les paramètres, auxquels a été ajouté la méthode complete
  *                   (à NEXT_STEP) si elle n'existait pas.

  */
window.define_complete = function(params, value)
{
  // dlog("params reçus par define_complete (value="+value+"):");dlog(params)
  if(undefined == params) params = {}
  if(undefined == value ) value  = NEXT_STEP
  if(undefined == params.complete && (undefined === params.wait || params.wait === true)) params.complete = value
  // dlog("params renvoyés par define_complete : ");dlog(params)
  return params
}
