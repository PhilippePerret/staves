=begin

Enregistrement de l'animation
OU Sauvegarde sous un autre nom

=end
new_name = param :new_name

anim = Anim::new (param :name)
if new_name
  anim.destroy
  new_anim = Anim::new new_name
  new_anim.raw_code = param :code
  new_anim.save
else
  anim.raw_code = param :code
  anim.save  
end

RETOUR_AJAX[:name] = new_name || (param :name)