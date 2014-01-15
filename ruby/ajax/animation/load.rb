=begin

Charge une animation

=end

anim = Anim::new (param :name)
if anim.exists?
  RETOUR_AJAX[:raw_code] = anim.raw_code
  RETOUR_AJAX[:is_default_anim] = (anim.name == Anim::default_animation)
else
  RETOUR_AJAX[:ok] = false
  RETOUR_AJAX[:message] = "Impossible de trouver l'animation #{param :name}"
end