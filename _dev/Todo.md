* Manuel (ou tutoriel) : utilisation du mode pas à pas pour faire avancer très vite l'animation

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
Mais pour le faire, cf. RÉFLEXION SUR NEXT_STEP

RÉFLEXION SUR NEXT_STEP
Le problème de NEXT_STEP (qui est aussi une de ses qualités, c'est qu'il permet de déclencher une autre étape avant une étape courante soit achevé. Cela entraine des erreurs, par exemple l'erreur de base&nbsp;:

    maVar = <commande>()
    maVar.show()
    
Si dans `<commande>` se trouve l'appel à l'étape suivante (ce qui est pratiquement toujours le cas), alors le retour de la commande ne sera pas encore donné — donc `maVar` ne sera pas encore défini — lorsque l'étape suivante `maVar.show` sera invoquée. Ce qui provoque fatalement une erreur.
  
Pour palier ce problème, certaines commandes doivent impérativement renvoyer leur résultat avant d'invoquer la suite. Mais comme la suite doit forcément être appelé avant le renvoi de la valeur (qui est forcément la dernière chose faite par la commande), il faudrait un système comme celui-ci :

    # Définition de la commande
    #
    .... du code ....
    wait(0.1)
    return <la valeur>
    
De cette manière, la valeur sera retournée avant que ne soit invoqué l'étape suivante.



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