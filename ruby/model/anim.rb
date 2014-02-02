
class Anim
  class << self
    
    # Retourne la liste des animations et dossier du dossier +folder+
    # @return {Array} Un objet contenant 
    def list_of_folder subfolder
      subfolder += "/" if subfolder.to_s != "" && !subfolder.end_with?('/')
      Dir["#{folder}/#{subfolder.to_s}*"].collect do |path|
        pathrel = path.sub(/^#{folder}\//, '').sub(/(\.txt)$/, '')
        if File.directory?(path)
          {:dir => true, :path => pathrel, :name => File.basename(pathrel)}
        else
          {:dir => false, :path => pathrel, :name => File.basename(pathrel, File.extname(pathrel))}
        end
      end
    end
    
    # Ajoute l'animation +anim+ à la liste des animations récentes (si elle ne
    # s'y trouve pas déjà)
    # @param  {Anim} anim   L'instance de l'animation.
    def add_recent_anim anim
      anim_path = File.join(anim.folder, anim.name)
      @recent_anims = recent_anims.merge(anim_path => {:path => anim_path, :name => anim.name, :folder => anim.folder, :time => Time.now.to_i})
      if @recent_anims.count > 10
        # On retire l'animation la plus ancienne
        older = { :time => Time.now.to_i }
        @recent_anims.each do |path, danim|
          older = danim if danim[:time] < older[:time]
        end
        @recent_anims = @recent_anims.reject{|path, danim| danim[:path] == older[:path]}
      end
      save_recent_anim
    end
    
    # Enregistre la liste des animations récentes
    # 
    def save_recent_anim
      File.unlink path_recent_anims if File.exists? path_recent_anims
      File.open(path_recent_anims, 'wb'){|f| f.write( Marshal.dump(@recent_anims))}
    end
    
    # Retourne la table des animations récentes
    # 
    def recent_anims
      @recent_anims ||= begin
        if File.exists? path_recent_anims
          Marshal.load(File.read(path_recent_anims))
        else
          {}
        end
      end
    end
    
    # Path du fichier des animations récentes
    # 
    def path_recent_anims
      @path_recent_anims ||= File.join('.', 'anim', 'RECENT_ANIMS.msh')
    end
    
    # Construit un dossier (ou une hiérarchie de dossier) dans le dossier
    # des animations si un dossier n'est pas trouvé. Ce check est fait à
    # chaque enregistrement d'animation lorsque le path n'existe pas.
    # @param  {String}  path    Path AVEC LE NOM DE L'ANIMATION (qui sera retiré)
    #                           ET le dossier "anim" en premier
    def build_folders_animation_up_to path
      cur_folder = folder
      dpath = path.split('/')[2..-2]
      dpath.each do |dossier|
        cur_folder = (getfolder File.join(cur_folder, dossier))
      end
    end
    
    # Retourne le NOM de l'animation par défaut si elle existe (NIL otherwise)
    # 
    def default_animation
      return nil unless File.exists?('.default')
      defanim = File.read('.default').force_encoding('utf-8').split("\n")
      return {:name => defanim[0], :folder => defanim[1].to_s} if(new(defanim[0], defanim[1].to_s)).exists?
    end
    
    def folder
      @folder ||= (getfolder File.join('.', 'anim'))
    end
    def getfolder path
      Dir.mkdir(path, 0777) unless File.exists? path
      path 
    end
  end
  # ---------------------------------------------------------------------
  #   Instance
  # ---------------------------------------------------------------------
  
  # Nom de l'animation (= affixe du fichier)
  # 
  attr_reader :name
  
  # Folder de l'animation (mais seulement la partie relative depuis ./anim)
  # 
  attr_reader :folder
  
  # # Code brut de l'animation
  # # 
  # attr_reader :raw_code
  
  # Code brut de l'animation
  
  def initialize name, folder = ""
    @name   = name
    @folder = folder
  end

  def raw_code
    @raw_code ||= (File.read path).force_encoding('utf-8')
  end
  
  def raw_code= code
    @raw_code = code
  end
    
  def save
    if exists?
      unlink
    else
      # Au cas où, on regarde si le dossier existe et on le construit
      # si nécessaire (fonctionne avec autant de dossiers qu'on veut)
      self.class.build_folders_animation_up_to path
    end
    File.open(path, 'wb'){|f| f.write raw_code}
    File.chmod(0770, path)
  end
  
  # Met l'animation comme animation par défaut
  def set_default
    File.unlink('.default') if File.exists? '.default'
    File.open('.default', 'wb'){|f| f.write "#{name}\n#{folder}"}
  end
  
  # Détruit l'animation
  def destroy
    unlink if exists?
  end
  
  # Return true si le fichier de l'animation existe
  def exists?
    File.exists? path
  end
  
  # Détruit le fichier de l'animation
  def unlink
    File.unlink path
  end
  
  # Path relatif de l'animation
  # Ce path est le path depuis `./anim/` et il permet de renseigner
  # le menu des animations pour charger l'animation.
  # Il est construit d'après @folder et @name. Noter qu'il ne contient
  # donc aucune extension (pas de ".txt")
  # 
  def relpath_sans_ext
    @relpath ||= File.join(@folder, @name)
  end

  def path
    @path ||= File.join(self.class.folder, @folder, "#{name}.txt")
  end
end
