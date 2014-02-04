TBOX
  Je suis en train de travailler la méthode set
  - préparer des tests
  - documenter (ne pas oublier les propriétés 'offset_x', 'offset_y', 'offset_width' et 'offset_height')
  - ajouter le traitement des paramètres wait et duree
    MAIS : il faudrait faire peut-être une distinction entre l'utilisation avec positionne à la
    construction de la TBox (pas de animate) et l'utilisation avec la méthode `set` qui utilise
    Anim.Dom.anime (faire bien l'essai dans les tests)

MODE FLASH
L'affiner au maximum pour aller très vite jusqu'à l'endroit à jouer.

* Ligature
  - Essayer de rationnaliser encore plus la construction des beams supplémentaires
  # Corriger le bug au démarrage, avec les stems qui restent dans l'animation
  - Les stems et beams doivent être associées aux notes pour pouvoir être supprimées
    avec elles.
  - Traitement des notes pointées
  - Documenter tout ça.

ARMURES
  Comment les traiter&nbsp;?
  Il faut que "a", par exemple, retourne :
  - 3 dièses
  Il faut donc le cycle des dièses
  CYCLE_DIESES : [
  null,
    {hname: 'fa', y:<hauteur sur portée>, x:<decalage>},
    {hname: 'do', y:...}
  ]

* Poursuivre l'analyse du Prélude 1


* Normalement, on doit pouvoir mettre des flèches sur :
  - Les parties (les textes en général)
  - Les images
  (peut-être qu'un problème se posera par rapport à center_x et center_y)
  
  
* Dimensions YouTube
  720p: 1280x720
  480p: 854x480


* Utiliser la pièce de schuber en Eb et le prélude de Bach en Rém (CBT 2) pour montrer les développements possibles du I II V I (Bach Dm : I V I II V I / Schubert : I V I V II V I)