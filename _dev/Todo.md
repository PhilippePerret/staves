* Screensize:
  > Dire à l'utilisateur d'ajouter DEFAULT('screensize', '480p') quand il choisit
    cette valeur.
  > Prendre en compte Anim.options.screensize dans le UI.onresize_window
  > En mode 720p, disposer les éléments autrement (le doublage plus long, en
    masquant le contrôleur)
  > Sélection du menu au chargement de l'application (UI.Tools.select("screensize::"+Anim.options.screensize))
  > Dans set_prefs, ne pas traiter screensize dans les prefs mais dans les options


* Poursuivre l'analyse du Prélude 1
  # Corriger définitivement le bug 202 (qui commence à me courir...)

* Normalement, on doit pouvoir mettre des flèches sur :
  - Les parties (les textes en général)
  - Les images
  (peut-être qu'un problème se posera par rapport à center_x et center_y)
  
  
* Dimensions YouTube
  720p: 1280x720
  480p: 854x480


* Utilisé la pièce de schuber en Eb et le prélude de Bach en Rém (CBT 2) pour montrer les développements possibles du I II V I (Bach Dm : I V I II V I / Schubert : I V I V II V I)