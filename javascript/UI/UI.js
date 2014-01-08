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
    * Redimensionne les éléments dans la fenêtre
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
  
    // dlog("Dimension : "+x)
    anim_width      = parseInt(x * 70/100)
    dlog("Largeur animation : "+anim_width)
    anim_height     = parseInt(y * 78/100)
    dlog("Hauteur animation : "+anim_height)
    console_width   = x - ( anim_width + 10 + 32)
  
    $('section#animation').css({
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
  },
  /**
    * Peuple le menu des applications avec la liste +name_list+
    * @method peuple_liste_animations
    * @param {Array} name_list  Liste des affixes d'animation
    */
  peuple_liste_animations:function(name_list)
  {
    $('select#animation').html('<option value="0">Charger l\'animation…</option>')
    L(name_list).each(function(name){
      $('select#animation').append('<option value="'+name+'">'+name+'</option>')
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
    old_option = $('select#animation option[value="'+old_name+'"]')
    $(code).insertAfter(old_option)
    old_option.remove()
    Anim.name = new_name
    $('select#animation').val(new_name)
  }
  
  
})

/**
  * Appelé quand on redimensionne la page
  * @method onresize
  * @for window
  */
window.onresize = UI.onresize_window

