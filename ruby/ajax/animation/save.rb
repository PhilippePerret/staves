=begin

Enregistrement de l'animation
OU Sauvegarde sous un autre nom

Doit retourner le nom (:name), le dossier (:folder) et le path (:path) de l'animation,
quelle qu'elle soit.

=end
new_code = (param :code).gsub(/\\\'/, "'").gsub(/\\\"/, '"')
anim = Anim::new (param :name), (param :folder)
anim.raw_code = new_code
anim.save  

RETOUR_AJAX[:name]    = anim.name
RETOUR_AJAX[:folder]  = anim.folder
RETOUR_AJAX[:path]    = anim.relpath_sans_ext