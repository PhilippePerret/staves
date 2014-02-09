/**
  * Module qui gère les lignes supplémentaires des portées
  *
  * @module Suplines.js
  */


/**
  * Classe Supline gérant les lignes supplémentaires.
  * @class Supline
  * @constructor
  * @param {Object} Les paramètres de la ligne supplémentaire
  */
window.Supline = function(params)
{
  
}

/*
  * ---------------------------------------------------------------------
  * MÉTHODES ET PROPRIÉTÉS DE CLASSE
  *
  * --------------------------------------------------------------------- 
  */
$.extend(Supline,{
  
  /**
    * Méthode qui supprime les lignes supplémentaires définies dans les
    * paramètres +params+
    * Note : Cette méthode passe tout de suite à l'étape suivante sans attendre la fin de la 
    *         disparition des lignes supplémentaires.
    *
    * @method erase
    * @param  {Object} params Définition des lignes supplémentaires à supprimer
    *   @param {Number}   params.staff    Indice de la portée portant les lignes supplémentaires
    *   @param {Number}   params.x        Position horizontale de la ligne supplémentaire à supprimer
    *   @param {Array}    params.top      Les lignes supplémentaires à supprimer au-dessus de la portée
    *   @param {Array}    params.bottom   Les lignes supplémentaires à supprimer en dessous de la portée
    *   @param {Float}    params.duree    Le temps pour faire disparaitre les lignes
    *
    */
  erase:function(params)
  {
    if(undefined  == params) return F.error("Il faut donner les paramètres pour la suppression des lignes supplémentaires !")
    if(undefined  == params.staff)  params.staff = Anim.current_staff.indice
    if(undefined !== params.left)   params.x = params.left
    if(undefined  == params.x)      params.x = Anim.current_x
    if(params.bottom)
    {
      if('number' == typeof params.bottom) params.bottom = [params.bottom]
      this.erase_suplines(params.staff, params.x, 'bot', params.bottom, params.duree)
    }
    if(params.top)
    {
      if('number' == typeof params.top) params.top = [params.top]
      this.erase_suplines(params.staff, params.x, 'top', params.top, params.duree)
    }
    NEXT_STEP(0)
  },
  /**
    * Efface des lignes supplémentaires
    * @method erase_suplines
    * @param  {Number} istaff   Indice de la portée
    * @param  {Number} xoffset  Décalage horizontal où se trouve la ligne
    * @param  {String} endroit  'bot' ou 'top' pour bottom ou top
    * @param  {Array}  indices  Indices 1-start des lignes supplémentaires à supprimer
    */
  erase_suplines:function(istaff, xoffset, endroit, indices)
  {
    L(indices).each(function(indice_supline, duree){
      var id = "supline-"+istaff+xoffset+"-"+(indice_supline - 1)+endroit
      $('img#'+id).fadeOut(duree || Anim.delai_for('show'))
    })
  }
  
})

/**
  * ---------------------------------------------------------------------
  *   MÉTHODE ET PROPRIÉTÉS D'INSTANCE
  *
  * ---------------------------------------------------------------------
  */
$.extend( Supline.prototype, {
  
})
Object.defineProperties(Supline.prototype, {
  
})