/**
  * @module Staff
  */

/**
  * @class Staff
  * @constructor
  * @param  {Object} params Les paramètres optionnels (n'importe quelle propriété)
  */
window.Staff = function(params)
{
  this.class  = "Staff"
  this.cle    = SOL
  this.id     = (new Date()).getTime()
  
  /**
    * Décalage vertical par défaut de l'image
    * @property {Number} top
    * @default 0
    */
  this.top  = 100
  /**
    * Décalage horizontal par défaut de l'image
    * @property {Number} left
    * @default 0
    */
  this.left = 20
  
  // On dispatche les valeurs transmises
  var me = this
  L(params || {}).each(function(k,v){me[k]=v})
  
}
$.extend(Staff.prototype, {
  
  /**
    * Construit la portée
    * @method build 
    * @param {Object} params  Paramètres supplémentaire
    */
  build:function()
  {
    Anim.add(this)
  },
  /**
    * Affiche les objets de l'élément
    * @method show
    * @param  {Number} vitesse La vitesse d'apparition
    */
  show:function(vitesse)
  {
    this.img_staff.show(vitesse)
    this.img_cle.show(vitesse)
  },
  
  /**
    * Positionne la portée, la clé et la métrique (if any)
    * @method positionne
    * @param {Object} params  Paramètres optionnels
    */
  positionne:function()
  {
    this.img_staff.css({top: this.top+"px", left: this.left+"px"})
    var dec_top = this.cle == SOL ? -7 : 9.6
    this.img_cle.css({top:(this.top + dec_top)+"px", left:(this.left+6)+"px"})
    //+9.6 pour clé de FA, -7 pour clé de Sol
  },
  
  /**
    * Ajoute des lignes supplémentaires à la portée
    * Notes
    *   * @rappel : les lignes sont séparées par 12px
    * @method add_sup_lines
    * @protected
    * @param  {Object} params   Paramètres optionnels
    *   @param  {Number}  params.number   OBSOLÈTE Nombre de lignes à ajouter (default:1)
    *   @param  {Boolean} params.above    Si true (default) ajouter au-dessus
    *   @param  {Number}  params.upto     Des lignes jusqu'à ce nombre
    *
    */
  add_sup_lines:function(params)
  {
    if(undefined == params) params = {}
    if(undefined == params.above)  params.above  = true
    var i=0, style, depart = (params.above ? 11 : 60), inc = (params.above ? - 12 : 12) ;
    var top = this.top + depart
    do {
      top += inc
      style = "top:"+top+"px;left:"+(Anim.current_x - 2)+"px;"
      Anim.add('<img class="supline" src="img/note/supline.png" style="'+style+'" />')
    }
    while((params.above && ((top - 12) > (params.upto))) || (!params.above && (top < params.upto)))
  }
  
})

Object.defineProperties(Staff.prototype,{
  /**
    * Le "zéro" de la portée, en fonction de sa clé, qui permettra
    * de positionner les notes.
    * Notes
    *   * Ce zéro doit correspondre à la hauteur de la note A4
    * @property {Number} zero
    */
  "zero":{
    get:function(){
      if(undefined == this._zero)
      {
        switch(this.cle)
        {
        case SOL  : this._zero = this.top + 35; break;
        case FA   : this._zero = this.top -39; break;
        case UT3  : this._zero = this.top + 50; break;// pas encore implémenté
        case UT4  : this._zero = this.top + 44; break; // pas encore implémenté
        }
      }
      return this._zero
    }
  },
  /**
    * Return l'élément DOM de l'image
    * @property {jQuerySet} img
    */
  "img_staff":{
    get:function(){return $('img#'+this.dom_id)}
  },
  /**
    * Return l'élément DOM de la clé
    * @property {jQuerySet} img_cle
    */
  "img_cle":{
    get:function(){return $('img#'+this.dom_id_cle)}
  },
  
  /**
    * Return l'ID DOM de l'image de la portée
    * @property {String} dom_id
    */
  "dom_id":{get:function(){return "staff-"+this.id}},
  "dom_id_cle":{get:function(){return "staff_cle-"+this.id}},
  
  /**
    * Return le code HTML complet de la portée
    * @property {HTMLString} code_html
    */
  "code_html":{
    get:function(){
      return this.html_img_cle + this.html_img
    }
  },
  /**
    * Return le code HTML pour la portée
    * @property {HTMLString} html_img
    */
  "html_img":{
    get:function(){
      return '<img id="'+this.dom_id+'" style="display:none;" class="staff" src="img/staff.png" />'
    }
  },
  /**
    * Return le code HTML pour la clé
    * @property {HTMLString} html_img_cle
    */
  "html_img_cle":{
    get:function(){
      return '<img id="'+this.dom_id_cle+'" style="display:none;" class="cle" src="img/cle/'+this.cle+'.png" />'
    }
  }
  
})