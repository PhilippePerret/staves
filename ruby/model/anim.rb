
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
    unlink if exists?
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

  def path
    @path ||= File.join(self.class.folder, @folder, "#{name}.txt")
  end
end
