=begin

Enregistrement de l'animation
OU Sauvegarde sous un autre nom

=end
new_name = param :new_name
new_code = (param :code).gsub(/\\\'/, "'").gsub(/\\\"/, '"')
anim = Anim::new (param :name), (param :folder)
if new_name
  new_anim = Anim::new new_name, (param :folder)
  new_anim.raw_code = new_code
  new_anim.save
else
  anim.raw_code = new_code
  anim.save  
end

RETOUR_AJAX[:name]    = new_name || (param :name)
RETOUR_AJAX[:folder]  = (param :folder)