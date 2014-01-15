
class Anim
  class << self
    
    # Retourne la liste des animations
    def list
      @list ||= pick_list
    end
    
    # Relève la liste des animations 
    def pick_list
      Dir["#{folder}/*.txt"].collect{|path| File.basename(path, File.extname(path))}
    end
    
    # Retourne le NOM de l'animation par défaut si elle existe (NIL otherwise)
    # 
    def default_animation
      return nil unless File.exists?('.default')
      defanim = File.read('.default')
      return defanim if(new defanim).exists?
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
  
  # # Code brut de l'animation
  # # 
  # attr_reader :raw_code
  
  # Code brut de l'animation
  
  def initialize name
    @name = name
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
    File.open('.default', 'wb'){|f| f.write name}
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
    @path ||= File.join(self.class.folder, "#{name}.txt")
  end
end
