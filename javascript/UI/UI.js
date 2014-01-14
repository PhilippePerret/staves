/**
  * @module UI.js
  */

/**
  * @class UI
  * @static
  */
if(undefined == window.UI) window.UI = {}
$.extend(UI,{
  /**
    * Prépare l'interface au chargement de l'application
    * @method prepare
    */
  prepare:function()
  {
    this.Regle.prepare()
    this.onresize_window()
  },
  /**
    * Retourne la vraie largeur de l'objet DOM +obj+ en tenant compte de
    * ses paddings et autres border
    * @method exact_width_of
    * @param {jQuerySet} obj
    * @return {Number} Le nombre de pixels qu'occupe l'objet à l'écran
    */
  exact_width_of:function(obj)
  {
    return  obj.width() +
            this.prop_of_obj(obj, 'padding-left')       + 
            this.prop_of_obj(obj, 'padding-right')      +
            this.prop_of_obj(obj, 'border-left-width')  +
            this.prop_of_obj(obj, 'border-right-width')
  },
  /**
    * Retourne la vraie hauteur de l'objet DOM +obj+ en tenant compte de
    * ses paddings et autres border
    * @method exact_height_of
    * @param {jQuerySet} obj
    * @return {Number} Le nombre de pixels qu'occupe l'objet à l'écran
    */
  exact_height_of:function(obj)
  {
    return  obj.height() +
            this.prop_of_obj(obj, 'padding-top') + 
            this.prop_of_obj(obj, 'padding-bottom') +
            this.prop_of_obj(obj, 'border-top-width') +
            this.prop_of_obj(obj, 'border-bottom-width')
  },
  /**
    * Retourne la valeur de la propriété +prop+ de l'objet +obj+
    * @method prop_of_obj
    * @param  {jQuerySet} obj
    * @param  {String}    prop
    * @return {Number}    La valeur numéraire de la propriété
    */
  prop_of_obj:function(obj, prop)
  {
    return this.css2number(obj.css(prop))
  },
  /** 
    * Prends une valeur de type "12px" et retourne 12
    * @method css2number
    * @param  {String} la valeur
    * @return {Number} le nombre de pixels (ou autre unité)
    */
  css2number:function(valeur)
  {
    return parseInt(valeur, 10)
  },
  /**
    * Redimensionne les éléments dans la fenêtre
    * Notes
    *   * La méthode est appelée au chargement de l'application
    *
    * @method onresize_window
    */
  onresize_window:function(evt)
  {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  
    anim_width      = parseInt(x * 70/100)
    anim_height     = parseInt(y * 78/100)
    console_width   = x - ( anim_width + 10 + 32)
  
    var oanim     = $('section#animation')
    var pos_anim  = oanim.position()
    oanim.css({
      width : anim_width+"px", 
      height: anim_height+"px"}
    )
    $('section#section_console').css({
      width : console_width+"px",
      height: anim_height+"px"
    })
    controller_width = $('section#controller').width()
    $('section#controller').css({
      top   : (anim_height + 40)+"px",
      left  : (anim_width - controller_width + 30) + "px"
    })
    // La position de la règle de mesure
    this.Regle.obj.css({top:(anim_height - 10)+'px'})
    // Positions pour la grille (grid)
    Anim.Grid.obj.css({
      top     :pos_anim.top+'px', 
      left    :(pos_anim.left + 15)+'px',
      width   :anim_width+'px',
      height  :anim_height+'px'
    })
    Anim.Grid.cursor.css({height:(anim_height-10)+'px'})
    Anim.Grid.set_cursor()
    
    Anim.Dom.left_max = anim_width - 40
  },
  /**
    * Peuple le menu des applications avec la liste +name_list+
    * @method peuple_liste_animations
    * @param {Array} name_list  Liste des affixes d'animation
    */
  peuple_liste_animations:function(name_list)
  {
    $('select#animations').html('<option value="0">Charger l\'animation…</option>')
    L(name_list).each(function(name){
      $('select#animations').append('<option value="'+name+'">'+name+'</option>')
    })
  },
  
  /**
    * Modifie le nom courant de l'animation
    * Note
    *   * La méthode est appelée après avoir changé le nom du fichier
    *     enregistré
    *   * La méthode modifie également le nom Anim.name
    *
    * @method change_animation_name
    * @param  {String} L'ancien nom (le nom actuel)
    * @param  {String} Le nouveau nom
    */
  change_animation_name:function(old_name, new_name)
  {
    code = '<option value="'+new_name+'">'+new_name+'</option>'
    old_option = $('select#animations option[value="'+old_name+'"]')
    $(code).insertAfter(old_option)
    old_option.remove()
    Anim.name = new_name
    $('select#animations').val(new_name)
  }
  
  
})

/**
  * Appelé quand on redimensionne la page
  * @method onresize
  * @for window
  */
window.onresize = UI.onresize_window

