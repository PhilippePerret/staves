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
    NEXT_STEP(0)
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
  update      : function(){return this.traite('update')},
  stem        : function(params){return this.traite('stem', params)},
  hampe       : function(params){return this.traite('stem', params)},
  
  /**
    * Méthode propre permettant de ligaturer les notes d'un motif ou d'une gamme
    * @method beam
    * @param  {Object} params Les paramètres éventuels
    */
  beam:function(params)
  {
    var my = this,
        arr_notes = [] ;
    L(this.list).each(function(indice){
      arr_notes.push(my.notes[indice])
    })
    Beam.beam(arr_notes, params)
  }
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
    if(undefined != this.speed && !MODE_FLASH)
    {
      Note.building_temporized(this.notes, this.speed, {complete:NEXT_STEP})
    }
    else 
    {
      this.each_note(function(note){note.build()}, {complete:NEXT_STEP})
    }
  },
  
  /**
    * Retourne la note d'indice (1-start) +indice+ ou l'ensemble de notes spécifié
    * @method note
    * @param  {Number|String} indice  Indice 1-start de la note à retourner, ou [notes] ou '<la note>' ou '<première>..<dernière>'
    * @return {Note|Array} L'instance de la note désirée ou la liste de notes
    */
  note:function(indice)
  {
    if('number' == typeof indice) return this.notes[indice]
    else if('string' == typeof indice)
    { // C'est un range OU Il faut trouver la note
      if(indice.indexOf('..') < 0)
      { 
        // => une note précise stipulée (soit seulement son nom, soit son nom + altération + octave)
        
      }
      else
      { 
        // => Un range de notes
        indice = indice.split('..')
        var first = parseInt(indice[0])
        var last  = parseInt(indice[1])
        if(isNaN(first) || isNaN(last)) throw "Il faut fournir des nombres, pour un range de notes ! ('<indice première>..<indice dernière>')"
        if(first > last) throw "L'indice de la première note doit être inférieur à l'indice de la dernière, dans un range…"
        indice = []
        while(first <= last) indice.push(first++)
        return this.objet_traitement_liste_notes( indice )
      }
    }
    else if('object' == typeof indice)
    {
      return this.objet_traitement_liste_notes( indice )
    }
  },
  /**
    * Retourne un “Objet de traitement de notes” qui permettra de traiter chaque
    * note dont les indices sont spécifiés dans la liste +arr+
    * @method objet_traitement_liste_notes
    * @param {Array} arr  Liste des indices des notes à traiter
    */
  objet_traitement_liste_notes:function(arr)
  {
    var obj_traitement    = $.extend(true, {}, OBJET_TRAITEMENT)
    obj_traitement.list   = arr
    obj_traitement.owner  = this
    obj_traitement.notes  = this.notes
    return obj_traitement
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
