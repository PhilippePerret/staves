$(document).ready(function(){

  // On construit une portée en clé de sol
  var staff = new Staff({cle:SOL, top:100})
  staff.build()
  Anim.current_staff = staff
  
  // On construit une portée en clé de fa
  var staffF = new Staff({cle:FA, top:200})
  staffF.build()
  
  Console.set(
    [ // pour l'essai
      "toto=NOTE(g5)", 
      "note2=NOTE(e5)", 
      "toto.moveTo('d4')",
      "toto.write('Le texte à écrire')"
    ].join("\n")
    )
})