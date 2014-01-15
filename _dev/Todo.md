*#* Poursuivre le travail sur l'édition de l'image


* Faire des essais de la nouvelle class Img
  > Un menu "Éditer l'image" ? (mais s'il y en a plusieurs ?)
  > monImage = IMAGE({url:<url>})
  > Documenter le manuel
  
  > Il faut pouvoir décider quelle portion de l'image prendre.
    Fonctionnement :
    - On affiche l'image dans sa totalité
    - On place dessus un div resize:both pour choisir la portion
    - On prend cette portion et on donne le code à l'utilisateur
    - On place toujours l'image en image de fond d'un div pour
      pouvoir en choisir la portion voulue
    