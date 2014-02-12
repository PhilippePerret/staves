/**
  * @module Anim_Cursor
  * Gestion du curseur de position de l'animation
  */


/**
  * @class Anim.Cursor
  * @static
  */
window.Anim.Cursor = {
  
  /**
    * Définir la prochaine position d'inscription relativement à la position
    * courante.
    * Cette méthode répond à la commande NEXT
    * Si l'argument est un objet qui défini `var` (String) c'est le nom de la variable window
    * qui conservera la valeur de la nouvelle position courante.
    *
    * @method next
    * @param  {Number|Object} params Décalage par rapport à la position courante ou objet contenant `x` et optionnellement `var`
    *   @param  {Number} params.x           Le décalage horizontal par rapport à la position courante
    *   @param {Number}  paramx.offset_x    OU le décalage par rapport à la position suivante naturelle
    *   @param  {String} params.var         Le nom de la variable dans laquelle mettre la nouvelle position.
    * @return {Number} La position actuelle
    */
  next:function(param)
  {
    var default_offset = parseInt(Anim.prefs.next + Anim.prefs.offset_next)
    if(undefined == param)
    {
      param = {}
      param.x = default_offset
    } 
    else if ('number' == typeof param)
    {
      param = { x:param }
    }
    else if( undefined == param.x) param.x = default_offset
    
    var position_courante = Anim.current_x + param.x
    
    if(undefined != param.offset_x) position_courante += param.offset_x
    
    // == On fixe la position courante ==
    this.set( position_courante )
    
    if(undefined != param.var) window[param.var] = position_courante
    return position_courante
  },
  /**
    * Définir la prochaine position d'inscription de façon absolue par une valeur
    * de pixels ou une valeur de pas.
    * @method set_cursor
    * @param {Number|Object} param Si c'est un nombre, la position exacte que
    *         doit prendre le curseur. Sinon, c'est un objet contenant {pas:<valeur>}
    *         où `pas` est un des `left` utilisés dans l'animation (toutes portées
    *         confondues).
    * @param  {Number} value. Si +param+ est string, définit la valeur du paramètre
    */
  set_cursor:function(param, value)
  {
    var p, offset, cur_pas ;
    if('string' == typeof param ) param = parametize(param, value)
    if('number' == typeof param)
    {
      if(param < 15) // => définition d'un pas
      {
        offset = Anim.Grid.lefts[param]
      }
      else          // => définition d'une position précise
      {
         offset = param
      }
    }
    else if(undefined != param.pas)     offset = Anim.Grid.lefts[param.pas]
    else if(undefined != param.offset)
    {
      cur_pas = Anim.Grid.lefts.indexOf(Anim.current_x)
      offset  = Anim.Grid.lefts[cur_pas + param.offset] 
    }
    else return F.error("SET_CURSOR doit être appelé avec la position exacte à donner au curseur ou un objet contenant `{pas:&lt;le pas&gt;}`")
    this.set(offset)
  }
}
/*
 *  Méthodes protégées (usage interne)
 *  
 */
$.extend(Anim.Cursor, {
  /**
    * Positionner le cursor de position à la position +offset+ en réglant
    * la position sur la grille et en passant à l'étape suivante.
    *
    * @method set
    * @protected
    * @param  {Number} offset La position du curseur de position
    */
  set:function(offset)
  {
    Anim.current_x = parseInt(offset,10)
    Anim.Infos.show_offset_cursor()
    NEXT_STEP(0)
  }
})