/**
  * Méthodes pouvant être utilisées par tout "groupe de notes", comme pour les
  * accords (chord), les motifs (motif) ou les gammes (scale)
  *
  * Notes
  * -----
  * Pour pouvoir être utilisées, il suffit de mettre les notes dans un array (avec
  * un premier élément null car tous les décomptes sont 1-start) puis d'étendre
  * cette liste avec GROUPNOTES_METHODS :
  *   `$.extend(groupnotes, GROUPNOTES_METHODS)`
  * et de définir ses propriétés (cf. plus bas) : 
  *   `Object.defineProperties(<groupnotes>, GROUPNOTES_PROPERTIES)`
  *
  * @class GROUPNOTES_METHODS METHODES_GROUPNOTES
  * @static
  */
window.GROUPNOTES_METHODS = {
  /**
    * Retourne la note d'indice (1-start) +indice+
    * @method note
    * @param  {Number} indice Indice 1-start de la note à retourner
    * @return {Note} L'instance de la note désirée
    */
  note:function(indice)
  {
    return this[indice]
  },
  
  /**
    * Exécute une fonction sur toutes les notes de l'accord
    * @method each_note
    * @param  {Function} fn La fonction à exécuter
    */
  each_note:function(fn)
  {
    for(var i=1, len=this.length; i<len; ++i)
    {
      fn(this[i])
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

window.GROUPNOTES_PROPERTIES = {

}

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
    return this.notes[indice]
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