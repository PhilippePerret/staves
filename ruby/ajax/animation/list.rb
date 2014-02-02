# Remonte la liste des animations et des dossiers (les affixes seuls)
# 
# param :folder     Le dossier qu'il faut remonter (nil si c'est le
#                   chargement de l'application)
# 

folder_animation = File.expand_path(Anim::folder)
RETOUR_AJAX[:folder_animation] = folder_animation
fold = param :folder
fold = fold[0..-2] if fold.end_with?('/')

RETOUR_AJAX[:folder] = fold


if (param :app_loading).to_i == 1
  # Si c'est le chargement de l'application
  if defanim = Anim::default_animation
    anim_defaut = Anim::new(defanim[:name], defanim[:folder])
    RETOUR_AJAX[:default_animation] = defanim # un hash, maintenant
    RETOUR_AJAX[:raw_code]          = anim_defaut.raw_code
    RETOUR_AJAX[:list]              = Anim::list_of_folder defanim[:folder]
  end
  RETOUR_AJAX[:recent_anims] = Anim::recent_anims
  Anim::add_recent_anim anim_defaut
end

if RETOUR_AJAX[:list].nil?
  RETOUR_AJAX[:list] = Anim::list_of_folder fold
end