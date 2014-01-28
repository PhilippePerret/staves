/**
  * @module Functions.js
  */

/** Méthode qui traite la propriété `wait` dans les paramètres de la
  * plupart des méthodes.
  *
  * L'idée est la suivante : si `params.wait` est exactement égal à `false`, on
  * doit immédiatement passer à la suite (ce n'est pas la méthode `animate` ou autre
  * qui s'en charge). Si `params.wait` est un nombre, alors c'est le temps d'attente,
  * en secondes, avant de passer à la suite.
  *
  * @method traite_wait
  * @for window
  * @param {Objet} params   Les paramètres envoyés (peut être indéfini)
  */
window.traite_wait = function(params)
{
  if(undefined == params || undefined === params.wait) return
  if(params.wait === false)
  {
    NEXT_STEP(0)
  }
  else if('number' == params.wait)
  {
    NEXT_STEP(params.wait)
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
  if(undefined == params.complete && params.wait !== false) params.complete = value
  // dlog("params renvoyés par define_complete : ");dlog(params)
  return params
}
