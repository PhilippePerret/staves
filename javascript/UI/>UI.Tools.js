/**
  * @module UI.Tools.js
  */

/**
  * Gestion des Tools
  * @class UI.Tools
  * @static
  */
window.UI.Tools = {
  /**
    * Liste des objets. En clé, l'identifiant, en valeur l'objet DOM
    * @class tools
    * @static
    */
  tools:{},
  /**
    * Initialisation des Tools
    * @method init
    */
  init:function()
  {
    var my = this
    // On récupère tous les éléments de premier niveau qui ont un identifiant
    this.section.find('> *[id]').each(function(){
      my.tools[$(this).attr('id')] = $(this)
    })
  },
  /**
    * Affiche le tool d'identifiant +tid+
    * @method show
    * @param  {String} tid    Identifiant de l'outil à afficher (sans 'tool_')
    */
  show:function(tid)
  {
    this.hide_all()
    this.tools['tool_'+tid].show()
    this.section.show()
  },
  /**
    * Masque la section
    * @method hide_section
    */
  hide_section:function(){this.section.hide()},
  /**
    * Masque tous les tools
    * @method hide_all
    */
  hide_all:function()
  {
    L(this.tools).each(function(tid, tool){ tool.hide() })
  }
}

Object.defineProperties(UI.Tools,{
  /**
    * Retourne l'objet DOM de la section #tools
    * @property {jQuerySet} section
    */
  "section":{
    get:function(){return $('section#tools')}
  }
})