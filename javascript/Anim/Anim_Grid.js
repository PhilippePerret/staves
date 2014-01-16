/**
  * @module Anim_Grid
  */

/**
  * L'objet Anim.Grid se charge de tout ce qui relève de la “grille” donc des
  * positions. Notamment :
  *   * Il gère l'affichage du curseur de position (marque de la position courante
  *     de la prochaine écriture).
  *   * Il tient à jour la liste des positions `current_x` de l'animation et les
  *     affiche discrètement.
  *   * Il affiche et masque ces éléments de grille lors du jeu ou de l'arrêt de
  *     l'animation.
  *
  * @class Anim.Grid
  * @static
  */
if(undefined == window.Anim) window.Anim = {}
window.Anim.Grid = {
  /**
    * Liste de toutes les positions left utilisées
    * @property {Array} lefts
    */
  lefts:[],
  /**
    * Ré-initialisation
    * Par exemple au re-démarrage de l'animation ou au chargement d'une
    * autre animation.
    * @method init_all
    */
  init_all:function()
  {
    $('div#grid *:not(#cursor_position)').remove()
    this.lefts = []
    this.set_cursor()
  },
  /**
    * Affiche tout ce qui concerne la grille
    * Rappel : tous les éléments de grille sont rangés dans un div#grid
    * @method show
    */
  show:function()
  {
    this.obj.show()
  },
  /**
    * Masque la grille (pendant le jeu de l'animation)
    * @method hide
    */
  hide:function()
  {
    this.obj.hide()
  },
  /**
    * Ajoute une position left inconnue
    * Produit :
    *   * Ajoute la valeur à la liste des left
    *   * Dessine sur la grille une petite marque avec la valeur
    *
    * @method add_left
    * @param  {Number} x   Nouvelle position left
    */
  add_left:function(x)
  {
    this.lefts.push(x)
    this.obj.append(this.html_mark_left(x))
  },
  /**
    * Retourne le code HTML pour une marque left sur la grille (repère)
    * @method html_mark_left
    * @param  {Number} x    La valeur du left
    * @return {HTMLString} Le code HTML à ajouter à la grille
    */
  html_mark_left:function(x)
  {
    return '<div class="mark_left" style="left:'+x+'px;">'+x+'</div>'
  },
  /**
    * Positionne le curseur de position
    * Notes
    * -----
    *   * En plus de positionner le curseur, cela mémorise la position left
    *     courante si elle n'existe pas encore
    *   * Cette méthode est automatiquement appelée lorsqu'on modifie la
    *     propriété complexe `Anim.current_x`
    *
    * @method set_cursor
    */
  set_cursor:function()
  {
    var x = parseInt(Anim.current_x,10)
    this.cursor.css({left:x+'px'})
    this.cursor.html(x)
    if(this.lefts.indexOf(x) < 0) this.add_left(x)
  }
  
  
}

Object.defineProperties(Anim.Grid,{
  /**
    * L'objet DOM de la grille (contient tous les éléments)
    * On profite du premier appel pour placer un observer sur le click
    * @property {jQuerySet} obj
    */
  "obj":{get:function(){
      if(undefined == this._obj)
      {
        this._obj = $('div#grid')
        this._obj.bind('click', function(){F.show("Désactiver la grille pour pouvoir gérer l'animation (“Options > Masquer la grille”).")})
      }
      return this._obj
    }
  },
  /**
    * L'objet DOM du curseur de position
    * @property {jQuerySet} cursor
    */
  "cursor":{
    get:function(){return $('div#grid div#cursor_position')}
  }
})