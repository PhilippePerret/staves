$(document).ready(function(){

  // On construit une portée en clé de sol
  var staff = new Staff({cle:SOL, top:100})
  staff.build()
  Anim.current_staff = staff
  
  // On construit une portée en clé de fa
  var staffF = new Staff({cle:FA, top:200})
  staffF.build()
  
  Anim.start()
})