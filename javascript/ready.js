$(document).ready(function(){

  // Régler le mode pas à pas 
  Anim.def_mode_pas_a_pas($('input#cb_mode_pas_a_pas')[0].checked)
  
  UI.onresize_window()

  Anim.load_list_animations()

})