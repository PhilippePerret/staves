/**
  * @module Courbe.js
  *
  */

/**
  * @class Courbe
  * @static
  */

if(undefined==window.Courbe) window.Courbe = {}
$.extend(window.Courbe,{
  
  /**
    * Pour régler la vitesse de déplacement de l'objet
    * @property {Number} WAIT Delai du timeout
    */
  WAIT: 0.02,
  
  /**
    * Déplace l'objet +obj+ selon une courbe avec les paramètres +params+
    * @method courbe
    * @async
    * @param  {jQuerySet} obj   L'objet à déplacer
    * @param  {Object} params   Les paramètres du déplacement
    *   @param  {Number} params.x_dep   Position x de départ
    *   @param  {Number} params.y_dep   Position y de départ
    *   @param  {Number} params.x_fin   Position x de fin
    *   @param  {Number} params.y_fin   Position y de fin
    *   @param  {Function}  params.complete   Méthode à appeler à la fin
    *                                         Default: NEXT_STEP (Anim.Step.next)
    */
  move:function(obj, params)
  {
    this.moved_obj  = obj
    this.mouvement  = []
    this.complete   = params.complete || NEXT_STEP
    
    var xdep = params.x_dep
    var ydep = params.y_dep
    var xmax = params.x_max
    var yfin = params.y_fin

    /*
     *  Incrément de x
     *  Il augmente d'un à chaque fois produire l'effet d'une courbe
     *  Donc x+1, x+2, x+3 alors que y n'augmente que d'un
     */
    var xinc    = 0
    /*
     *  Le nombre d'incrément qui ont été nécessaire pour que
     *  x atteigne sa position xmax.
     *  Cette donnée permettra de savoir à partir de quel moment il doit
     *  se mettre à revenir à sa position.
     */
    var nb_inc  = 0
    var xcur = parseInt(xdep,10), ycur ;
    /*
     *  Pour savoir si on est dans la phase "ascendante" de la courbe
     */
    var is_asc = true
    /*
     *  Les valeurs ajoutées à x, pour lui retirer les mêmes
     *  
     */
    var xadd = []
    // obj.animate({
    //   
    // }, vitesse, params.complete)
    var iinc = 0.1
    for(ycur=ydep; ycur <= yfin; ycur)
    {
      // Tant que x n'a pas atteint sa valeur de fin, il faut
      // l'incrémenter et incrément le nombre d'incréments nécessaires
      // @note: Pour le moment, xinc et nb_inc sont les mêmes, mais je préfère
      // les séparer pour modifier xinc peut-être plus tard par une fonction
      // plus mathématique.
      if(is_asc && xcur < xmax)
      {
        // xinc += 0.2
        xinc = Math.sin(iinc+=0.1)
        xcur += xinc
        xadd.push(xinc)
        if(xcur >= xmax)
        { 
          is_asc = false
          nb_inc = xadd.length
        }
      }
      
      if(false == is_asc)
      {
        ycur += 2
      }
      else
      {
        ycur += 1
      }
      
      /*
       *  Faut-il commencer à faire revenir x à sa position de départ ?
       *  
       */
      if(!is_asc && (ycur >= yfin - nb_inc))
      {
        xcur -= xadd.pop()
      }
      this.mouvement.push({x:xcur, y:ycur})
    }
    if(xadd.length > 0)
    {
      xcur -= xadd.pop()
      this.mouvement.push({x:xcur, y:ycur})
    }
    
    // On peut jouer le déplacement
    this.doIt()
  },
  doIt:function()
  {
    var mvt
    if(this.mouvement.length ==0)
    {
      if(this.timer)
      {
        clearTimeout(this.timer)
        delete this.timer
      }
      if(this.complete) this.complete()
    }
    else
    {
      this.timer = setTimeout($.proxy(this.doItNow, this), this.WAIT * 1000)
    }
  },
  doItNow:function()
  {
    mvt = this.mouvement.shift()
    this.moved_obj.css({left:mvt.x+"px", top:mvt.y+"px"})
    this.doIt()
  }
})