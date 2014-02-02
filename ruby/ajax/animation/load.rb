=begin

Charge une animation

=end

if (param :name).to_s == ""
  RETOUR_AJAX[:ok] = false
  RETOUR_AJAX[:message] = "Le nom de l'animation est vide…"
else
  anim = Anim::new (param :name), (param :folder)
  if anim.exists?
    RETOUR_AJAX[:raw_code]    = anim.raw_code
    # On mémorise cette animation dans la liste des animations récentes
    Anim::add_recent_anim anim
    # Est-ce l'animation par défaut ?
    hdefaut = Anim::default_animation
    RETOUR_AJAX[:is_default_anim] =
      if    hdefaut.nil? then false
      else  (anim.name == hdefaut[:name] && anim.folder == hdefaut[:folder])
      end
  else
    RETOUR_AJAX[:ok] = false
    RETOUR_AJAX[:message] = "Impossible de trouver l'animation “#{param :folder}/#{param :name}”"
  end
end