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
  * C'est aussi cet objet qui gère “Coordonnates”, pour obtenir les coordonnées
  * à l'écran.
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
  },
  
  /* ---------------------------------------------------------------------
   *  PARTIE DES OBJETS GÉRANT L'OUTIL “COORDONNÉES”
   *  (pour obtenir les coordonnées à l'écran)
   */
  /**
    * Activation de l'outil coordonnées
    * L'outil affiche le cadre qui va permettre de récupérer les coordonnées
    *
    * @method coordonnees_active
    */
  coordonnees_active:function()
  {
    Anim.Grid.obj.hide()
    F.show("Placer et dimensionner le cadre rouge sur l'animation. Les coordonnées"+
    "Cliquer au centre pour obtenir les dimensions après un changement de taille.")
    if(this.cadre_coordonnees.length == 0) this.coordonnees_build_cadre()
    else
    {
      this.cadre_coordonnees.show()
      L(['left', 'right', 'top', 'bottom']).each(function(key){$('div#coord_fuite_'+key).show()}) 
    }
    this.coordonnees_on_change() // pour mettre les premières
  },
  /**
    * Désactivation de l'outil coordonnées
    * @method coordonnees_desactive
    */
  coordonnees_desactive:function()
  {
    if(Anim.prefs.grid) Anim.Grid.obj.show()
    this.cadre_coordonnees.hide()
    L(['left', 'right', 'top', 'bottom']).each(function(key){$('div#coord_fuite_'+key).hide()})
  },
  /**
    * Méthode appelée quand on change le cadre de coordonnées
    * @method coordonnees_on_resize
    */
  coordonnees_on_change:function()
  {
    var pos = this.cadre_coordonnees.position()
    var values = {
      'top'     : pos.top,
      'left'    : pos.left,
      'width'   : UI.css2number(this.cadre_coordonnees.width()),
      'height'  : UI.css2number(this.cadre_coordonnees.height())
    }
    values.bottom = values.top  + values.height
    values.wxh    = values.width + ' x ' + values.height
    values.right  = values.left + values.width
    L(['left', 'right', 'top', 'bottom', 'wxh']).each(function(key){
      $('div#coord_'+key).html(values[key])
    })
    $('div#coord_fuite_left').css('left', values.left+'px')
    $('div#coord_fuite_right').css('left', values.right+'px')
    $('div#coord_fuite_top').css('top', values.top+'px')
    $('div#coord_fuite_bottom').css('top', values.bottom+'px')
    
  },
  /**
    * Construction du cadre si nécessaire, le place dans la fenêtre et
    * place les observers dessus.
    *
    * @method coordonnees_build_cadre
    */
  coordonnees_build_cadre:function()
  {
    var cadre = '<div id="coord_main_cadre" onresize="$.proxy(UI.Tools.coordonnees_on_change, UI.Tools, \'resize\', event)()">'+
              '<div id="coord_inner_cadre"></div>'+
              '<div id="coord_left">---</div>'+
              '<div id="coord_right">---</div>'+
              '<div id="coord_top">---</div>'+
              '<div id="coord_bottom">---</div>'+
              '<div id="coord_wxh">---</div>'+
            '</div>'
    $('section#animation').append(cadre)
    this.cadre_coordonnees.draggable({stop:$.proxy(UI.Tools.coordonnees_on_change, UI.Tools, 'move')})
    $('div#coord_inner_cadre').bind('mousedown', function(){$('div#coord_main_cadre').draggable('enable')})
    $('div#coord_inner_cadre').bind('mouseup', function(){$('div#coord_main_cadre').draggable('disable')})
    $('div#coord_inner_cadre').bind('click', $.proxy(UI.Tools.coordonnees_on_change, UI.Tools, 'click'))
    // Les quatres lignes de fuite
    $('section#animation').append(
      '<div id="coord_fuite_left"></div>'   +
      '<div id="coord_fuite_right"></div>'  +
      '<div id="coord_fuite_top"></div>'    +
      '<div id="coord_fuite_bottom"></div>'
    )
  }
  /* FIN DES MÉTHODES GÉRANT L'OUTIL “COORDONNÉES”
   * --------------------------------------------------------------------- */
}

Object.defineProperties(UI.Tools,{
  /**
    * Retourne l'objet DOM de la section #tools
    * @property {jQuerySet} section
    */
  "section":{
    get:function(){return $('section#tools')}
  },
  
  /**
    * Objet DOM du cadre de coordonnées
    * @property {jQuerySet} cadre_coordonnees
    */
  "cadre_coordonnees":{
    get:function(){return $('div#coord_main_cadre')}
  }
})