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
    */
  traite:function(method, param1, param2)
  {
    var my = this
    L(this.list).each(function(indice){
      my.notes[indice][method](param1, param2)
    })
    NEXT_STEP()
  },
  show:function(params){this.traite('show', Anim.transition.show)},
  hide:function(params){this.traite('hide', Anim.transition.show)},
  fantomize:function(){this.traite('fantomize')},
  defantomize:function(){this.traite('defantomize')},
  colorize:function(color){this.traite('colorize', color)}
  
}
// /**
//   * Méthodes pouvant être utilisées par tout "groupe de notes", comme pour les
//   * accords (chord), les motifs (motif) ou les gammes (scale)
//   *
//   * Notes
//   * -----
//   * Pour pouvoir être utilisées, il suffit de mettre les notes dans un array (avec
//   * un premier élément null car tous les décomptes sont 1-start) puis d'étendre
//   * cette liste avec GROUPNOTES_METHODS :
//   *   `$.extend(groupnotes, GROUPNOTES_METHODS)`
//   * et de définir ses propriétés (cf. plus bas) : 
//   *   `Object.defineProperties(<groupnotes>, GROUPNOTES_PROPERTIES)`
//   *
//   * @class GROUPNOTES_METHODS METHODES_GROUPNOTES
//   * @static
//   */
// window.GROUPNOTES_METHODS = {
//   /**
//     * Retourne la note d'indice (1-start) +indice+
//     * Ou un objet qui traitera toutes les notes envoyées
//     * @method note
//     * @param  {Number|Array} indice Indice 1-start de la note à retourner, ou
//     *                         liste de notes.
//     * @return {Note|Object} L'instance de la note désirée
//     */
//   note:function(indice)
//   {
//     dlog("-> note(type indice:"+(typeof indice)+")")
//     if('number' == typeof indice) return this[indice]
//     else if('string' == typeof indice)
//     { // Il faut trouver la note
//       
//     }
//     else if('object' == typeof indice)
//     {
//       dlog("-> liste d'indices")
//       var obj_traitement = $.extend(true,{}, OBJET_TRAITEMENT)
//       obj_traitement.list   = indice
//       obj_traitement.owner  = this
//       obj_traitement.notes  = this // c'est un array étendu
//       return obj_traitement
//     }
//   },
//   
//   /**
//     * Exécute une fonction sur toutes les notes de l'accord
//     * @method each_note
//     * @param  {Function} fn La fonction à exécuter
//     */
//   each_note:function(fn)
//   {
//     for(var i=1, len=this.length; i<len; ++i)
//     {
//       fn(this[i])
//     }
//   },
//   
//   /**
//     * Destruction de l'accord (destruction de chaque note)
//     * @method build
//     */
//   remove:function()
//   {
//     this.each_note(function(note){note.remove()})
//   }
// }
// 
// window.GROUPNOTES_PROPERTIES = {
// 
// }

/**
  * Remplacement des méthodes ci-dessus pour une utilisation plus rationnelle:
  * Un objet qui gère un groupe de notes (comme Chord ou Scale) définit une 
  * propriété `notes` qui contient la liste des instances Note (1-start) et
  * cette propriété qui est utilisée
  * @property {Object} METHODES_GROUPNOTES
  * @for window
  */
window.METHODES_GROUPNOTES = {
  /**
    * Construit les notes du groupe de notes
    * @method build
    */
  build:function()
  {
    this.each_note(function(note){note.build()})
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
    * @method each_note
    * @param  {Function} fn La fonction à exécuter
    */
  each_note:function(fn)
  {
    for(var i=1, len=this.notes.length; i<len; ++i)
    {
      fn(this.notes[i])
    }
  },
  
  /**
    * Destruction de l'accord (destruction de chaque note)
    * @method build
    */
  remove:function()
  {
    this.each_note(function(note){note.remove()})
  }
}