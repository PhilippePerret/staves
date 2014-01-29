/**
  * @module Functions.js
  */

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
  * @param {Undefined|Object} params    Les paramètres déjà définis ou non
  * @param {Object} instance    L'instance appelant la méthode, de n'importe quelle classe.
  * @return {Object} Les paramètres avec éventuellement la propriété `wait` ajoutée.
  *
  */
window.define_wait = function(params, instance)
{
  if(undefined == params) params = {}

  if(undefined !== instance.wait){
    params.wait = instance.wait
    delete instance.wait
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
  dlog("params renvoyés par define_complete : ");dlog(params)
  return params
}
