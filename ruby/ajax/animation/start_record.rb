=begin

Script qui lance l'enregistrement de l'animation

Rien ne veux fonctionner, malheureusement…

=end
# def osascript(script)
#   system 'osascript', *script.split(/\n/).map { |line| ['-e', line] }.flatten
# end
# 
# anim = Anim::new(param :name)
# 
# osascript <<-EOC
# tell application "Finder"
#   display dialog "Hello tout le monde !"
# end
# EOC

# DIR = Dir.pwd
# RETOUR_AJAX['dossier_courant']        = DIR
# Dir.chdir('./asset/prog/') do
# 
#   RETOUR_AJAX['dossier_courant après chdir'] = Dir.pwd
#   # exec("open -a Screen_Recording.app 2>&1")
#   # exec("open -a Screen_Recording 2>&1")
#   # system("open -a Screen_Recording.app 2>&1")
#   # RETOUR_AJAX['open_screen_recording']  = `open -a Screen_Recording.app 2>&1`
# end
# # RETOUR_AJAX['open_screen_recording']  = `open -a ./asset/prog/Screen_Recording 2>&1`
# RETOUR_AJAX['definition_nom']         =system("osascript -e 'tell application \"Screen_Recording\" to define_file(\"#{param :name}\")' 2>&1")
# system("osascript -e 'tell application \"Screen_Recording\" to start_recording()' 2>&1")
# # RETOUR_AJAX['definition_nom']         = `osascript -e 'tell application "Screen_Recording" to define_file("#{param :name}")' 2>&1`
# # RETOUR_AJAX['lancerment_recording']   = `osascript -e 'tell application "Screen_Recording" to start_recording()' 2>&1`
