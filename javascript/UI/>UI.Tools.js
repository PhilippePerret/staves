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
    * @param  {Array|String} tid    Identifiants des outils à afficher (sans 'tool_')
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
    if('string' == typeof tid) tid = [tid]
    var my = this
    L(tid).each(function(id){ my.tools['tool_'+id].show()})
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
    var s = $('select#animations'),
        m = s.find('> option').eq(s[0].selectedIndex),
        is_animation = m.hasClass('anim'),
        v = s.val(),
        folder = "", 
        name ;
    if(!v) return F.error("Il faut sélectionner le dossier ou l'animation.")
    if(v.indexOf('/') > -1)
    {
      dv      = v.split('/')
      name    = dv.pop()
      folder  = dv.join('/')
    }
    else
    {
      name = v
    }
    if(is_animation)
    {
      delete Anim.File.name
      delete Anim.File.folder
      Anim.File.load(name, folder)
      this.hide_section()
    }
    else
    {
      $('select#animations').html('')
      Anim.File.load_list_animations(v)
    }
  },
  /**
    * Méthode appelée quand on choisit un dossier dans la hiérarchie
    * des dossiers
    * @method on_choose_folder
    */
  on_choose_folder:function()
  {
    $('select#animations').html('')
    Anim.File.load_list_animations($('select#folders_animations').val())
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
   *  Outils divers
   *  
   */
  /**
    * Méthode appelée quand on commence à déplacer un élément de l'animation
    * (pour le moment, seulement ceux qui passent par les méthodes universelles — build —
    * mais il faudra généraliser le processus).
    * @method on_start_dragging_of
    * @param  {Object} instance L'instance de l'élément déplacé
    */
  on_start_dragging_of:function(instance)
  {
    var pos = instance.obj.position()
    this.coordonnees_of.pos_init = {top: pos.top, left:pos.left}
  },
  /**
    * Méthode qui doit être appelée par tout élément de l'animation à la fin
    * de son déplacement quand il a été rendu draggable.
    * Normalement, on renvoie simplement les positions de son `instance.obj`
    * @method coordonnees_of
    * @param  {Object} instance L'instance de l'élément déplacé ({Txt}, {Box}, etc.)
    */
  coordonnees_of:function(instance)
  {
    var pos = instance.obj.position(),
        pos_init = this.coordonnees_of.pos_init,
        mess ;
    mess = "INIT: x:"+pos_init.left+"/y:"+pos_init.top ;
    mess += " ||| FIN: x:"+pos.left+"/y:"+pos.top ;
    dif_x = pos.left - pos_init.left
    dif_y = pos.top  - pos_init.top
    mess += " ||| DIFF: x:" + (dif_x > 0 ? '+':'') + dif_x + '/y:' + (dif_y > 0?'+':'') + dif_y;
    UI.feedback(mess)
  },
  
  /* ---------------------------------------------------------------------
   *  PARTIE DE UI.Tools GÉRANT L'OUTIL “COORDONNÉES”
   *  (pour obtenir les coordonnées à l'écran à l'aide d'un rectangle rouge)
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
  coordonnees_get_taille_cadre:function()
  {
    var pos = this.cadre_coordonnees.position()
    var values = {
      'T'  : pos.top,
      'L'  : pos.left,
      'W'  : UI.css2number(this.cadre_coordonnees.width()),
      'H'  : UI.css2number(this.cadre_coordonnees.height())
    }
    values.R = values.L + values.W
    values.B = values.T + values.H
    return values
  },
  /**
    * Méthode appelée quand on change le cadre de coordonnées
    * @method coordonnees_on_resize
    */
  coordonnees_on_change:function()
  {
    var values = this.coordonnees_get_taille_cadre()
    values.wxh    = values.W + ' x ' + values.H
    L({'L':'left', 'R':'right', 'T':'top', 'B':'bottom', 'wxh':'wxh'}).each(function(key, key_css){
      $('div#coord_'+key_css).html(values[key])
    })
    $('div#coord_fuite_L').css('left', values.L+'px')
    $('div#coord_fuite_R').css('left', values.R+'px')
    $('div#coord_fuite_T').css('top',  values.T+'px')
    $('div#coord_fuite_B').css('top',  values.B+'px')
    
    UI.feedback(
      'x:'+values.L+'/y:'+values.T+'/width:'+values.W+'/height:'+values.H+
      '&nbsp;&nbsp;&nbsp;bottom:'+values.B+'/right:'+values.R
    )
  },
  start_resize_R:function(evt){this.start_resize('R', evt)},
  start_resize_L:function(evt){this.start_resize('L', evt)},
  start_resize_T:function(evt){this.start_resize('T', evt)},
  start_resize_B:function(evt){this.start_resize('B', evt)},
  start_resize:function(bord, evt)
  {
    var init_values = this.coordonnees_get_taille_cadre()

    this.coord_resize_init_value  = init_values[bord]
    this.coord_resize_init_x      = evt.clientX
    this.coord_resize_init_y      = evt.clientY
    this.coord_resize_bord        = bord
    this.coord_resize_prop        = {'L':'left', 'R':'width', 'T':'top', 'B':'height'}[bord]
    this.coord_resize_prop_fuite  = {'L':'left', 'R':'left', 'T':'top', 'B':'top'}[bord]
    this.coord_resize_prop_long   = {'L':'width', 'T':'height'}[bord]
    this.coord_resize_bords       = {'L':'LR', 'R':'LR', 'T':'TB', 'B':'TB'}[bord]
    this.coord_resize_init_long   = {'LR':init_values.W, 'TB': init_values.H}[this.coord_resize_bords]
    
    $('section#animation').bind('mousemove', $.proxy(this['on_move_'+this.coord_resize_bords], this))
    $('section#animation').bind('mouseup',   $.proxy(this.stop_resize, this, bord) )
  },
  on_move_LR:function(evt)
  {
    this.change_taille_cadre(evt.clientX - this.coord_resize_init_x)
    return stop_event(evt)
  },
  on_move_TB:function(evt)
  {
    this.change_taille_cadre(evt.clientY - this.coord_resize_init_y)
    return stop_event(evt)
  },
  change_taille_cadre:function(dif)
  {
    var add_R_B         = 0,
        data            = {},
        new_value       = (this.coord_resize_init_value + dif),
        new_value_long  = (this.coord_resize_init_long  - dif)
        
    data[this.coord_resize_prop] = new_value+'px' ;
    if(this.coord_resize_prop_long)
    {
      data[this.coord_resize_prop_long] = new_value_long + 'px'
    } 
    else
    {
      new_value += this.coord_resize_init_long
    }
    this.cadre_coordonnees.css(data)
    $('div#coord_fuite_'+this.coord_resize_bord).css(this.coord_resize_prop_fuite, new_value+'px')
    dlog("bord:"+this.coord_resize_bord+"/ prop fuite:"+this.coord_resize_prop_fuite+" / value:"+new_value)
  },
  stop_resize:function(bord)
  {
    $('section#animation').unbind('mousemove',  $.proxy(this['on_move_'+this.coord_resize_bords], this))
    $('section#animation').unbind('mouseup',    $.proxy(this.stop_resize, this))
  },
  /**
    * Construction du cadre si nécessaire, le place dans la fenêtre et
    * place les observers dessus.
    *
    * @method coordonnees_build_cadre
    */
  coordonnees_build_cadre:function()
  {
    // var cadre = '<div id="coord_main_cadre" onresize="$.proxy(UI.Tools.coordonnees_on_change, UI.Tools, \'resize\', event)()">'+
    var cadre = '<div id="coord_main_cadre">'+
              '<div id="coord_bord_R"></div>'+
              '<div id="coord_bord_L"></div>'+
              '<div id="coord_bord_T"></div>'+
              '<div id="coord_bord_B"></div>'+
              '<div id="coord_inner_cadre"></div>'+
              '<div id="coord_left">---</div>'+
              '<div id="coord_right">---</div>'+
              '<div id="coord_top">---</div>'+
              '<div id="coord_bottom">---</div>'+
              '<div id="coord_wxh">---</div>'+
            '</div>'
    $('section#animation').append(cadre)
    this.cadre_coordonnees.draggable({stop:$.proxy(UI.Tools.coordonnees_on_change, UI.Tools, 'move')})
    this.cadre_coordonnees.bind('mouseup', $.proxy(UI.Tools.coordonnees_on_change, UI.Tools, 'click'))
    $('div#coord_main_cadre > div#coord_bord_R').bind('mousedown', $.proxy(this.start_resize_R, this))
    $('div#coord_main_cadre > div#coord_bord_L').bind('mousedown', $.proxy(this.start_resize_L, this))
    $('div#coord_main_cadre > div#coord_bord_T').bind('mousedown', $.proxy(this.start_resize_T, this))
    $('div#coord_main_cadre > div#coord_bord_B').bind('mousedown', $.proxy(this.start_resize_B, this))
    $('div#coord_inner_cadre').bind('mousedown', function(){$('div#coord_main_cadre').draggable('enable')})
    $('div#coord_inner_cadre').bind('mouseup', function(){$('div#coord_main_cadre').draggable('disable')})
    // Les quatres lignes de fuite
    $('section#animation').append(
      '<div id="coord_fuite_L"></div>'  +
      '<div id="coord_fuite_R"></div>'  +
      '<div id="coord_fuite_T"></div>'  +
      '<div id="coord_fuite_B"></div>'
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