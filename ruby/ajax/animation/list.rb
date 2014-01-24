# Remonte la liste des animations et des dossiers (les affixes seuls)
# 
# param :folder     Le dossier qu'il faut remonter (nil si c'est le
#                   chargement de l'application)
# 

folder_animation = File.expand_path(Anim::folder)
RETOUR_AJAX[:folder_animation] = folder_animation

if (param :folder).nil?
  if defanim = Anim::default_animation
    RETOUR_AJAX[:default_animation] = defanim # un hash, maintenant
    RETOUR_AJAX[:raw_code]          = Anim::new(defanim[:name], defanim[:folder]).raw_code
    RETOUR_AJAX[:list]              = Anim::list_of_folder defanim[:folder]
  end
end

if RETOUR_AJAX[:list].nil?
  Anim::list_of_folder ""
end