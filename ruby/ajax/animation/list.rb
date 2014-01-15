# Remonte la liste des animations (les affixes seuls)
# 
# Comme certaines animation ont pu être écrite depuis leur fichier,
# on force le possesseur, en mettant aussi le chmod à 0770.

require '../table_narration/data/secret/data_phil.rb' #=> DATA_PHIL

folder_animation = File.expand_path(Anim::folder)
RETOUR_AJAX[:folder_animation] = folder_animation

RETOUR_AJAX[:exitstatus] = []
Dir["#{Anim::folder}/**/*.txt"].each do |path|
  path = File.expand_path(path)
  `echo "#{DATA_PHIL[:password]}" | sudo -S chowner _www '#{path}';chmod 0770 '#{path}'`
  RETOUR_AJAX[:exitstatus] << $?.exitstatus
end

RETOUR_AJAX[:list]              = Anim::list
if defanim = Anim::default_animation
  RETOUR_AJAX[:default_animation] = defanim
  RETOUR_AJAX[:raw_code]          = Anim::new(defanim).raw_code
end