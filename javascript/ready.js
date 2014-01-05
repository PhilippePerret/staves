$(document).ready(function(){

  // Régler le mode pas à pas 
  Anim.def_mode_pas_a_pas($('input#cb_mode_pas_a_pas')[0].checked)
  
  Anim.load_list_animations()
//   var code = "\
// NEW_STAFF(SOL)\n\
// ba5=NOTE(a5)\n\
// na4=NOTE(a4)\n\
// ndo4=NOTE(c4)\n\
// NEW_STAFF(FA)\n\
// notela=NOTE(ad3)\n\
// CLEAR(true)\
// "
//   Console.set(code)
    // [ // pour l'essai
    // "NEW_STAFF(SOL)",
    // "notela=NOTE(a4)"
    //   // "toto=NOTE(g5)",
    //   // "note2=NOTE(e5)", 
    //   // "toto.moveTo('d4')",
    //   // "toto.write('Le texte à écrire')",
    //   // "toto.remove()",
    //   // "note2.remove()",
    //   // "acc=CHORD('c4 eb4 g4')",
    //   // "WRITE('je vais détruire l\\'accord dans 3 secondes')",
    //   // "WAIT(3)",
    //   // "acc.remove()"
    // ].join("\n")
    // )
})