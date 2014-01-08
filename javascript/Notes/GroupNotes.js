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
  * @class GROUPNOTES_METHODS
  * @static
  */
window.GROUPNOTES_METHODS = {
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
  "prop":{
    get:function(){return null}
  }
}