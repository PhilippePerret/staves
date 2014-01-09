/**
  * @module Circle.js
  */

/**
  * Modèle Circle, pour la gestion des cercles d'exergue
  * Notes
  * -----
  *   * Elle hérite de la class ObjetClass
  *
  * @class Circle
  * @constructor
  */
window.Circle = function(params)
{
  /**
    * @property {String} id   Identifiant absolu du cercle
    */
  this.id = 'cir'+(new Date()).getTime()

  /**
    * Taille par défaut du cercle
    * @property {Number} DEFAULT_WIDTH
    * @static
    * @final
    */
  this.DEFAULT_WIDTH = 30
  
  /**
    * Couleur du cercle
    * Notes
    * -----
    *   * On peut l'obtenir et la redéfinir avec la propriété complexe `color`
    *
    * @property {String} _color   La couleur du cercle
    */
  ObjetClass.call(this, params)
}
Circle.prototype = Object.create( ObjetClass.prototype )
Circle.prototype.constructor = Circle

Object.defineProperties(Circle.prototype, {
  /**
    * Objet DOM du cercle s'il est construit
    * @property {jQuerySet} obj
    * @default NULL
    */
  "obj":{
    get:function(){
      if(undefined == this._obj)
      {
        this._obj = $('img#'+this.id)
        if(this._obj.length == 0) this._obj = null
      }
      return this._obj
    }
  },
  /**
    * Source (src) du cercle en fonction de sa couleur
    * @property {String} src
    */
  "src":{
    get:function(){
      return "../lib/img/divers/cercle/"+this.color+".png"
    }
  },
  
  /**
    * Retourne le code HTML du cercle
    * @property {String} code_html
    */
  "code_html":{
    get:function(){
      return '<img id="'+this.id+'" class="circle" src="'+this.src+'" style="width:'+this.width+'px;" />'
    }
  },
  /**
    * Couleur du cercle.
    * Note
    * ----
    *   * La définition de cette valeur modifie le src de l'objet s'il est
    *     construit.
    *   * La couleur est blue par défaut
    *
    * @property {String} color
    * @default 'blue'
    */
  "color":{
    set:function(couleur){
      this._color = couleur
      if(this.obj) this.obj[0].src = this.src
    },
    get:function(){
      return this._color || 'blue'
    }
  }
})
