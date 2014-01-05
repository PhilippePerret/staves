=begin

Charge une animation

=end

anim = Anim::new (param :name)
if anim.exists?
  RETOUR_AJAX[:raw_code] = anim.raw_code
else
  RETOUR_AJAX[:ok] = false
  RETOUR_AJAX[:message] = "Impossible de trouver l'animation #{param :name}"
end