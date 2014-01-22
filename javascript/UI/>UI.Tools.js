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
    * En réglant le bouton OK si les paramètres le nécessitent.
    *
    * @method show
    * @param  {String} tid    Identifiant de l'outil à afficher (sans 'tool_')
    * @param  {Object} params Paramètres optionnels
    *   @param  {Object}  params.ok   Définition du bouton OK
    *     @param  {String}    params.ok.name    Nom du bouton
    *     @param  {Function}  params.ok.method  Méthod à appeler quand on clique sur le bouton OK
    */
  show:function(tid, params)
  {
    if(undefined == params)     params = {}
    if(undefined == params.ok)  params.ok = {name:"OK", method:null}
    this.hide_all()
    this.tools['tool_'+tid].show()
    this.ok_poursuivre = params.ok.method
    $('section#tools input#tools_btn_ok')[0].value = params.ok.name
    this.section.show()
    
  },
  /**
    * Méthode appelée quand on clique le bouton "OK" (ou nouveau nom)
    * @method on_click_ok
    */
  on_click_ok:function()
  {
    this.hide_section()
    if(this.ok_poursuivre) this.ok_poursuivre()
  },
  /**
    * Méthode appelée quand on clique le bouton "Renoncer"
    * @method on_click_cancel
    */
  on_click_cancel:function(){
    this.hide_section()
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
   *  MÉTHODE GÉRANT L'OUVERTURE DE L'ANIMATION OU DU DOSSIER
   *  
   */
  
  /**
    * Méthode appelée quand on double clique sur un dossier ou une animation
    * dans la liste et qui :
    *   - Charge l'animation si c'est une animation qui a été choisie
    *   - Charge la liste des dossiers et animation du dossier si c'est un dossier
    * @method open_anim_or_folder
    */
  open_anim_or_folder:function()
  {
    if(true /* plus tard : is_animation */)
    {
      delete this.name
      Anim.File.load()
      this.hide_section()
    }
    else
    {
      
    }
  },
  
  
  /* ---------------------------------------------------------------------
   *  MÉTHODES GÉRANT L'AIDE À L'AUTOCOMPLETION
   */
  /**
    * Affichage des raccourcis d'auto-complétion
    * @method show_autocompletion
    *
    */
  show_autocompletion:function()
  {
    if($('div#tool_data_autocompletion').length == 0) this.prepare_data_autocompletion()
    else $('div#tool_data_autocompletion').show()
    $('section#tools').show()
  },
  /**
    * Masquage des raccourcis d'autocomplétion
    * @method hide_autocompletion
    */
  hide_autocompletion:function()
  {
    $('div#tool_data_autocompletion').hide()
    $('section#tools').hide()
  },
  /**
    * Préparation du div contenant les données d'autocomplétion (aide)
    * @method prepare_data_autocompletion
    */
  prepare_data_autocompletion:function()
  {
    $('section#tools').append(this.html_code_data_autocompletion())
  },
  /**
    * Retourne le code HTML pour le panneau autocomplétion
    * @method html_code_data_autocompletion
    * @return {HTMLString} Code HTML du panneau
    */
  html_code_data_autocompletion:function()
  {
    var c = "";
    L(DATA_AUTOCOMPLETION).each(function(rac, data){
      c +=  '<div>' +
              '<div class="raccomplete">' + rac           + '</div>' +
              '<div class="replace">'     + data.replace  + '</div>' +
            '</div>'
    })
    return  '<div id="tool_data_autocompletion">' + 
              '<div class="titre">Raccourcis d\'autocomplétion</div>' +
              '<div id="autocomp_shortcuts">'+
                c +
              '</div>' +
            '</div>'
  },
  /* ---------------------------------------------------------------------
   *  PARTIE DE UI.Tools GÉRANT L'OUTIL “COORDONNÉES”
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