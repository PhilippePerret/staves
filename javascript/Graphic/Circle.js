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
    * Classe d'un cercle
    * @property {String} class
    * @static
    * @final
    */
  this.class = 'circle'
  
  /**
    * @property {String} id   Identifiant absolu du cercle
    */
  this.id = 'cir'+(new Date()).getTime()

  /**
    * Le possesseur du cercle, en général une note
    *
    * @property {Object} owner
    */
  this.owner = null
  
  /**
    * Taille par défaut du cercle
    * @property {Number} DEFAULT_WIDTH
    * @static
    * @final
    */
  this.DEFAULT_WIDTH = 30
  
  /**
    * Si `square` est TRUE, on dessine un cadre au lieu d'un cercle
    * @property {Boolean} square
    * @default false
    */
  this.square = false
  
  /**
    * Couleur du cercle
    * Notes
    * -----
    *   * On peut l'obtenir et la redéfinir avec la propriété complexe `color`
    *
    * @property {String} _color   La couleur du cercle
    */
  this._color = 'blue'


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
      return "../lib/img/divers/"+(this.square ? 'square':'cercle')+"/"+this.color+".png"
    }
  },
  
  /**
    * La taille du cercle
    * Notes
    * -----
    *   * Gère les différents possesseurs et leurs propriétés. Par exemple, un cercle
    *     pour une note sans altération et une note avec altération n'auront pas la
    *     même taille.
    *   * Si la propriété est re-définit et que l'objet existe, on change sa taille.
    * @property {Number} width
    */
  "width":{
    set:function(w){
      this._width = w
      if(this.obj) this.obj.css('width', w+'px')
    },
    get:function(){
      if(this.owner)
      {
        switch(this.owner.class)
        {
        case 'Note':
          this._width = 30 + (this.owner.alteration ? 18 : 0)
          break
        }
      }
      if(!this._width) this._width == this.DEFAULT_WIDTH
      return this._width
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
