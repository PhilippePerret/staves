/**
  * @module UI.Tools.js
  */

/**
  * Gestion des Tools
  * Les “tools” correspondent à une section HTML dans laquelle se trouvent déjà 
  * quelques éléments (comme la liste des animations) et dans laquelle on peut 
  * placer tout dialogue interactif, comme par exemple la liste des images quand
  * on doit en choisir une.
  *
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
  },
  /**
    * Ajoute le code +code+ à la boite des tools
    * Notes
    *   * Ce code devrait être contenu dans un div principal avec pour identifiant
    *     un nom commençant par "tool_" pour pouvoir être géré correctement.
    *
    * @method add
    * @param {String} code Le code HTML
    */
  add:function(code)
  {
    this.section.append(code)
    this.init()
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