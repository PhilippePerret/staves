=begin

  Exportation du doublage de l'animation définie en paramètres

  Le script lit le code de l'animation et en tire tous les doublages.

  Il met le fichier créé dans la propriété `file` du retour
=end

# Méthode qui traite une ligne commençant par CAPTION
# 
# Rappel
# ------
# Le sous-titre/doublage peut se trouver sous ces trois formes :
# 
#   CAPTION("... le texte ....", true/false)      # si 'true' => sous-titre
#   CAPTION("... le texte ....", {... paramètres ...})
#   CAPTION("... le texte ....", {caption:true})  # => sous-titre
#
def traite_line_caption line
  dline = get_data_caption line
  return if dline[:caption]
  $ref.write( "#{dline[:text]}\n" )
end

# Retourne un Hash contenant :text et :params
#
def get_data_caption line
  data_line = {:text => nil, :caption => false}
  params    = nil
  line.strip.match(/^CAPTION\( ?"(.*?)" ?(?:, ?(.*))? ?\)$/){
    data_line[:text] = $1
    params           = $2
  }
  if params == 'true' || params == 'false'
    data_line[:caption] = params == 'true'
  elsif ! params.nil?
    # Plus compliqué : c'est vraiment un Hash qui est fourni. Mais on ne va que chercher
    # s'il contient 'caption' ou 'doublage'
    params.match(/(caption|doublage) ?: ?(true|false)/){
      prop = $1
      valu = $2
      data_line[:caption] = (prop == 'caption' && valu == 'true') || (prop == 'doublage' && valu == 'false')
    }
  end
  
  data_line
end

anim = Anim::new (param :name), (param :folder)

unless anim.exists?
  raise "Animation introuvable…"
end

File.unlink anim.path_doublage if File.exists? anim.path_doublage

$ref = File.open(anim.path_doublage, 'wb')

begin
  anim.raw_code.split("\n").each do |line|
    next unless line.start_with? 'CAPTION'
    traite_line_caption line
  end
rescue Exception => e
  raise e.message
end
# Fermer le fichier doublage
$ref.close

# Pour me permettre d'écriture
File.chmod(0770, anim.path_doublage)




RETOUR_AJAX[:file] = anim.path_doublage