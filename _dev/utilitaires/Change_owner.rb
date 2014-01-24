require '../table_narration/data/secret/data_phil.rb' #=> DATA_PHIL
require './ruby/model/anim'

# Pour remettre le propriétaire à tous les fichiers/dossiers
Dir["#{Anim::folder}/**/*"].each do |path|
  path = File.expand_path(path)
  `echo "#{DATA_PHIL[:password]}" | sudo -S chown _www '#{path}'`
  `echo "#{DATA_PHIL[:password]}" | sudo -S chmod 0770 '#{path}'`
end
