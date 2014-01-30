/**
  * @module GroupNotes.js
  */

/**
  * Objet qui permet d'utiliser la méthode <objet>.note().<method> avec
  * une liste d'indices de notes au lieu d'une note seule.
  * Cet objet doit posséder toutes les méthodes applicables aux notes
  * @class OBJET_TRAITEMENT
  * @static
  */
window.OBJET_TRAITEMENT = {
  list  : null, // la liste des indices de notes à traiter
  notes : null, // toutes les notes du possesseur
  owner : null, // Le possesseur
  /**
    * Exécute le traitement déterminé par +method+ et passe à l'étape
    * suivante
    * @method traite
    * @param {String} method    La méthode à exécuter sur la note
    * @param  {Any}   param1    Le premier paramètre éventuel
    * @param  {Any}   param2    Le second paramètre éventuel
    * @return {Object} Cet objet, pour le chainage
    */
  traite:function(method, param1, param2)
  {
    var my = this
    L(this.list).each(function(indice){
      my.notes[indice][method](param1, param2)
    })
    NEXT_STEP()
    return this // chainage
  },
  arrow       : function(id, params){return this.traite('arrow', id, params)},
  colorize    : function(color){return this.traite('colorize', color)},
  defantomize : function(){return this.traite('defantomize')},
  fantomize   : function(){return this.traite('fantomize')},
  hide        : function(params){return this.traite('hide', Anim.delai_for('show'))},
  remove      : function(params){return this.traite('remove', params)},
  show        : function(params){return this.traite('show', Anim.delai_for('show'))},
  surround    : function(params){return this.traite('surround', params)},
  unarrow     : function(id,params){return this.traite('unarrow', id, params)},
  unsurround  : function(params){return this.traite('unsurround', params)},
  update      : function(){return this.traite('update')}
}

/**
  * Un objet qui gère un groupe de notes (comme Chord ou Scale) définit une 
  * propriété `notes` qui contient la liste des instances Note (1-start) et
  * cette propriété qui est utilisée
  * @property {Object} METHODES_GROUPNOTES
  * @for window
  */
window.METHODES_GROUPNOTES = {}

/* On lui adjoint les méthodes universelles */
$.extend(METHODES_GROUPNOTES, UNVERSAL_METHODS)

$.extend(METHODES_GROUPNOTES,{  
  /**
    * Construction des notes (du motif ou de la gamme), soit en mode normal, soit
    * en mode temporisé si `speed` est défini.
    * @method build
    */
  build:function()
  {
    if(undefined != this.speed)
    {
      Note.building_temporized(this.notes, this.speed, {complete:NEXT_STEP})
    }
    else 
    {
      this.each_note(function(note){note.build()}, {complete:NEXT_STEP})
    }
  },
  
  /**
    * Retourne la note d'indice (1-start) +indice+
    * @method note
    * @param  {Number} indice Indice 1-start de la note à retourner
    * @return {Note} L'instance de la note désirée
    */
  note:function(indice)
  {
    if('number' == typeof indice) return this.notes[indice]
    else if('string' == typeof indice)
    { // Il faut trouver la note
      
    }
    else if('object' == typeof indice)
    {
      var obj_traitement = $.extend(true,{}, OBJET_TRAITEMENT)
      obj_traitement.list   = indice
      obj_traitement.owner  = this
      obj_traitement.notes  = this.notes
      return obj_traitement
    }
  },
  
  /**
    * Exécute une fonction sur toutes les notes de l'accord
    * Noter que cette méthode n'est pas asynchrone, dès que la méthode a été appelée
    * sur toutes les notes, même si le processus n'est pas terminé, on passe à la méthode
    * `params.complete` si elle a été définie.
    *
    * @method each_note
    * @param  {Function}  fn        La fonction à exécuter sur chaque note
    *                               Cette fonction doit recevoir en premier argument la note.
    *                               WARNING : ne pas envoyer les paramètres à la fonction, ça provoquerait des erreurs sans fin avec le passage à la suite.
    * @param  {Object}    params    Les paramètres optionnels
    *   @param  {Function}  params.complete   La méthode à appeler quand on finit.
    */
  each_note:function(fn, params)
  {
    for(var i=1, len=this.notes.length; i<len; ++i)
    {
      fn(this.notes[i])
    }
    if(params && 'function' == typeof params.complete) params.complete()
  },
  
  /**
    * Destruction des notes (destruction de chaque note)
    * @method build
    */
  remove:function(params)
  {
    params = define_wait(params, this)
    this.remove_textes()
    this.each_note(function(note){note.remove()})
    if(undefined == params.wait) params.wait = 0
    traite_wait(params)
  }
})
