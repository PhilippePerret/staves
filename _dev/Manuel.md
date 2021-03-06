#Music Animations

(Animation de portée)

Cette application permet de faire des animations musicales (écrites), à des fins pédagogiques, pour les insérer dans des screencasts.

* [Animation](#l_animation)
* [Déplacement du curseur de position](#le_curseur_de_position)
* [Outils pratiques](#usefull_tools)
* [Les notes](#les_notes)
* [Les motifs mélodiques](#les_motifs)
* [Les accords](#les_chords)
* [Les portées](#les_staves)
* [Les gammes](#les_gammes)
* [Les textes](#les_textes)
* [Les images](#les_images)
* [Les flèches](#les_fleches)
* [Les boites et les cadres](#les_boites)
* [Fond de l'animation](#background_animation)
* [Régler toutes les valeurs de l'animation](#set_preferences)
* [Exécuter du code (débuggage)](#method_exec)
* [Annexe](#lannexe)


<a name="l_animation"></a>
##Animation

###Table des matières

* [Introduction](#intro_animation)
* [Définir l'animation courante comme animation par défaut](#set_anim_courante_as_default)
* [Définir le cadre de l'animation](#definir_cadre_animation)
* [Composer le code de l'animation](#code_composition)
  * [Se déplacer sur la portée](#move_on_staff)
  * [Faire une pause](#pause_animation)
  * [Écrire un texte général](#texte_animation)
  * [Resetter l'animation](#reset_animation)
  * ["Nettoyer" l'animation (tout effacer)](#clean_animation)
  * [Commentaires dans le code](#code_comments)
  * [Mettre un point d'arrêt avant la fin](#command_stop)
  * [Jouer rapidement ce qui précède le passage travaillé](#jouer_before_avec_mode_flash)
* [Le paramètre spécial d'attente (`wait`)](#parametre_special_wait)
* [Le paramètre spécial de durée (`duree`)](#parametre_special_duree)
* [Vitesse de l'animation](#vitesse_animation)
* [Jouer l'animation](#run_animation)
* [Jouer seulement la sélection (bouton “Point”)](#run_with_point)
* [Créer des sous-titres ou des doublages](#creer_captions)
* [Enchainer des animations](#enchainer_animations)
* [Activer/désactiver le Mode “Flash”](#mode_flash)
* [Définir le décompte de départ](#set_decompte)
* [Sauvegarde automatique](#autosave_code)
* [Ouvrir une animation récemment ouverte](#open_recent_anim)
* [Ré-initialiser toutes les valeurs de préférences](#reiniti_preferences)

###Réinitialiser les préférences

<a name="intro_animation"></a>
###Introduction

Une animation est composée de `pas` (step) qui vont être exécutés l'un après l'autre, produisant des choses aussi diverses que&nbsp;:

* L'apparition d'une portée&nbsp;;
* L'écriture d'une note ou d'un accord sur la portée&nbsp;;
* La création d'un fond, avec dégradé&nbsp;;
* Le déplacement de notes&nbsp;;
* L'écriture et l'animation de textes avec des effets d'opacité&nbsp;;
* L'aide à l'audio avec l'inscription de textes de doublage&nbsp;;
* L'animation de flèches&nbsp;;
* etc.

Chaque pas (chaque “step”) exécute une action. Ces pas se définissent dans la console située à gauche de l'écran (le bloc noir). Chaque pas se trouve sur une ligne distincte. Donc chaque ligne est un nouveau pas, une nouvelle étape de l'animation.

**Bien noter que chaque ligne représente un pas, il est impossible de définir plusieurs actions sur la même ligne (en réalité c'est faux, mais c'est dangereux ;-)).**

Ces pas peuvent&nbsp;:

* Construire une portée&nbsp;;
* Construire une note (et l'afficher)&nbsp;;
* Construire un accord&nbsp;;
* Construire une gamme&nbsp;;
* Écrire un texte associé à un objet (note, portée, barre, etc.)&nbsp;;
* Déplacer un objet quelconque (des notes, des textes, etc.)&nbsp;;
* Supprimer une note&nbsp;;
* Mettre une note en exergue (entourée d'un cercle de couleur)&nbsp;;
* etc.

<a name="definir_cadre_animation"></a>
###Définir le cadre de l'animation

Par défaut, le cadre réservé à l'animation est en mode `adapt`, c'est-à-dire qu'il se règle en fonction de la taille de la fenêtre. Plus la fenêtre est large et plus le cadre est large lui aussi, en respectant une proportion de 16/9 (utilisée notamment par les projections YouTube ou Viméo).

Mais dans le menu “Options”, on peut choisir une taille fixe en activant les items “Dimension 480p” et “Dimension 720p” qui correspondent aux deux formats traditionnels d'affichage sur le web (les valeurs `480` et `720` correspondent à la hauteur du cadre de l'image).

Ces deux formats peuvent être choisis par défaut pour une animation particulière en utilisant la commande&nbsp;:

DEFAULT('screensize', '<480p ou 720p>')
  
####Définition précise de la taille

Comme mentionné plus haut, en mode `adapt` (“Dimension adaptée à l'écran”), la taille du cadre est calculé par rapport à la taille de la fenêtre courante dans laquelle est chargée l'application.

Mais ce qu'il faut comprendre, c'est que les éléments de l'animation, eux, sont en valeur absolues, ce qui signifie que lorsqu'ils sont placés et dimensionnés, leur dimension et leur placement ne changent pas avec le redimensionnement de la fenêtre (hors zoom du navigateur, évidemment). 

Donc, lorsqu'on travaille une animation très précisément, et qu'on veut ensuite l'enregistrer en conservant les mêmes positionnements, il est impératif d'enregistrer dans le code de l'animation la dimension actuelle du cadre dans lequel l'animation a été composée.

Grâce au menu “Options > Geler taille du cadre”, on peut obtenir le code à placer en début d'animation pour retrouver toujours cette taille, quel que soit la taille de la fenêtre. Ce code ressemble à&nbsp;:

    DEFAULT('screensize', <{Number} Hauteur du cadre>)
  
… où `<hauteur du cadre>` est la hauteur à donner au cadre, en sachant que la largeur sera calculée pour respecter le format de 16/9e.

<a name="code_composition"></a>
###Composer le code de l'animation

<a name="code_comments"></a>
####Écrire un commentaire

Les commentaires s'écrivent avec `#` en début de ligne.

Noter que les commentaires ne peuvent pas se trouver sur un pas proprement, même après le code. Il faut absolument qu'ils soient sur une ligne seule, qui sera passée.

<a name="pause_animation"></a>
####Faire une pause dans l'animation.

On utilise la méthode `WAIT` pour faire une pause, avec en argument le nombre de secondes (qui peut être un flottant, pour des temps très courts)&nbsp;:

    WAIT(<nombre de secondes>)
  
Par exemple, pour attendre 4 secondes&nbsp;:

    maNote=NOTE(a3)
    WAIT(4)                 
    # => 4 secondes avant de construire l'accord
    monAccord('c3 eb3 g3')
  
*Note&nbsp;: C'est un “pas” comme les autres, donc il doit être mis sur une ligne seule comme toute étape.*

Noter qu'on aurait pu aussi utiliser [le paramètre spécial d'attente](#parametre_special_wait) en créant la note pour obtenir le même résultat&nbsp;:

    maNote = NOTE(a3, {wait:4})
    # => Attente de 4 secondes avant de passer à la suite

<a name="move_on_staff"></a>
####Se déplacer sur la portée

Pour tous les déplacements sur la portée, voir [Déplacement du curseur de position](#le_curseur_de_position)

<a name="texte_animation"></a>
####Écrire un texte général

Pour écrire un texte en rapport avec l'animation (en haut à gauche), on utilise la méthode `WRITE`&nbsp;:

WRITE(<le texte à écrire>)
  
  Par exemple&nbsp;:
  
  WRITE("Ce qu'il faut remarquer à ce moment-là.")
  
*Noter que les objets tels que les notes ont également leur propre méthode textuelle, qui permet d'aligner le textes directement à ces notes, accords, etc.*

<a name="reset_animation"></a>
####Reset(-ter) l'animation

La commande `RESET` (sans parenthèses ni arguments) permet de repartir de rien en cours d'animation, c'est-à-dire&nbsp;:

* Effacer tous les objets SAUF les portées et les clés&nbsp;;
* Remettre le "curseur" tout à gauche (endroit où seront donc affichés les nouveaux objets).
* Remettre toutes les valeurs par défaut.

Usage&nbsp;:

    RESET

*Voir aussi la commande `CLEAR` ci-dessous qui permet la même chose mais de façon plus ciblée.*

<a name="clean_animation"></a>
####Nettoyer l'animation

“Nettoyer l'animation” signifie supprimer tous les éléments affiché. On peut ou non demander que les portées restent en place, though.

Le pas à utiliser est :

    CLEAR(<avec les portées>)
  
… `<avec les portées>` est FALSE par défaut, donc il faut ajouter `true` pour effacer aussi les portées&nbsp;:
    
    CLEAR(true) // efface aussi les portées
    
    
<a name="command_stop"></a>
###Mettre un point d'arrêt avant la fin

Il peut être intéressant parfois de mettre un point d'arrêt à l'intérieur du code de l'animation, qui l'interrompra comme le bouton “Stop” (par exemple pour modifier les coordonnées d'un élément de l'animation).

Pour ce faire, il suffit d'utiliser la commande&nbsp;:

    STOP

… à l'endroit où l'animation doit s'interrompre.


<a name="jouer_before_avec_mode_flash"></a>
###Jouer rapidement jusqu'au passage travaillé

Lorsqu'on travaille un passage, il peut être intéressant de jouer rapidement l'animation jusqu'à ce passage (surtout lorsque des animations lentes sont utilisées).

Pour ce faire, on utilise le [mode Flash](#mode_flash).

<a name="parametre_special_wait"></a>
###Le paramètre spécial d'attente (`wait`)

Dans toutes les méthodes d'animation, le dernier argument définit les paramètres optionnels (ou parfois obligatoires) de la méthode.

Parmi ces paramètres, on trouve le paramètre spécial `wait` très utile pour définir le comportement qu'aura l'animation sur l'étape.

Par défaut, en effet, l'animation attend toujours la fin de l'étape courante (la ligne de code courante) avant de passer à la suite. Le paramètre `wait` permet de modifier ce comportement&nbsp;:

* Si `wait` est mis à `false`, l'animation lance l'étape courante, mais passe immédiatement à la suite. Utilisé par exemple pour donner l'impression de simultanéité d'effets divers.
* Si `wait` est un nombre (entier ou flottant), l'animation lance l'étape courante puis attend le nombre de secondes défini avant de passer à la suite. Noter que deux effets peuvent en résulter&nbsp;: si le nombre de secondes est inférieur à la durée que prend l'étape, l'animation de l'étape est lancée, puis au bout du laps de temps stipulé on passe à l'étape suivante. Si, en revanche, le nombre de secondes est supérieur à la durée que prend l'étape, l'animation de l'étape est lancée, puis l'animation attend la fin de la durée avant de lancer l'étape suivante.

Exemples d'utilisation du paramètre `wait`&nbsp;:

    maNote = NOTE('a4', {wait:10})
    # => La note LA 4 est créée, mais l'animation attend 10 secondes avant
    #    de passer à la suite.

    maNote.move('2:f2', {wait:false, duree:11})
    # => L'animation va déplacer la note LA 4 vers la note FA 2, un déplacement
    #    qui va durer 11 secondes, mais l'étape suivante sera appelée dès le début
    #    du déplacement.

<a name="parametre_special_duree"></a>
###Le paramètre spécial de durée (`duree`)

Dans toutes les méthodes d'animation, le dernier argument définit les paramètres optionnels (ou parfois obligatoires) de la méthode.

Parmi ces paramètres, on trouve le paramètre spécial `duree` qui peut définir, en nombre de secondes, la durée que doit prendre l'animation quelconque.

Lorsque la durée doit être inférieur à la seconde, on utilise un flottant. Par exemple `0.5` pour une demi-seconde. *Noter qu'il est aussi possible d'utiliser une fraction, ce qui est peut-être plus clair. Par exemple `1/4` pour un quart de secondes.*

Exemples d'utilisation du paramètre spécial `duree`&nbsp;:

    monTexte = TBOX("Ceci est un texte caché au départ", {hidden:true})
    # => Un texte caché (hidden:true) est créé
    monTexte.show({duree:5})
    # => Le texte va apparaitre en 5 secondes
    monTexte.move({x:10, y:10, duree:15})
    # => Le texte va mettre 15 secondes pour rejoindre la position 10/10 de
    #    l'écran de l'animation.

<a name="vitesse_animation"></a>
###Vitesse de l'animation

On peut régler la vitesse de l'animation de façon interactive avec le “slider” se trouvant dans le contrôleur (sous le bouton “Play”).

*Pour régler la vitesse de façon très fine, cf. aussi [Réglage de la vitesse dans les préférences](#prefs_speed).*

Mais on peut aussi définir dans le code cette vitesse à l'aide de la commande&nbsp;:

    SPEED(<valeur>)
  
… avec `<valeur>` pouvant être un nombre de 0 à 20, `10` étant la vitesse normale, 0 étant la vitesse la plus lente et 20 la plus rapide.
  
Pour remettre la vitesse à la vitesse normale&nbsp;:
  
    SPEED() // pas d'argument

<a name="run_animation"></a>
###Jouer l'animation

Pour jouer l'animation, cliquer simplement sur le bouton “Play” ou presser la Barre Espace.

Si un autre choix que l'animation entière avait été fait, sélectionner l'item «&nbsp;Jouer tout&nbsp;» dans le menu «&nbsp;Animation&nbsp;» ou presser le raccourci clavier CMD+0.

Pour faire une pause au cours de l'animation, cliquer à nouveau sur le même bouton “Play” ou presser la touche “P”. Pour redémarrer après la pause, represser la touche “P” ou le bouton “Play”.

Pour arrêter l'animation, cliquer sur le bouton Stop ou presser à nouveau la Barre Espace.

<a name="run_only_selection"></a>
###Jouer une portion de l'animation

En composant l'animation, on peut vouloir ne tester qu'une partie de code qu'on est en train de programmer sans avoir à rejouer tout ce qui précède.

Il existe plusieurs moyens de le faire avec “STAVES”&nbsp;: 

* Sélectionner simplement le code à jouer (version rapide, mais non modifiable — cf. [Jouer la sélection](#run_selection_with_selection))&nbsp;;
* Jouer l'animation à partir de la position du curseur. Pratique pour les animations longues lorsque l'on code la fin (cf. [Jouer l'animation depuis le curseur](#run_from_cursor))&nbsp;;
* Placer des repères pour définir la sélection à jouer. Pratique lorsque le code à modifier ne se trouve pas à la fin (cf. [Jouer une portion par repère](#run_with_repairs_selection))&nbsp;;


<a name="run_from_cursor"></a>
####Jouer l'animation depuis le curseur

1. Choisir l'item “Jouer depuis curseur” dans le menu «&nbsp;Animation&nbsp;» (ou le raccourci clavier CMD+3)&nbsp;;
2. Placer le curseur dans la première ligne de code à jouer (inutile ici de le placer en début de ligne, il suffit de le mettre dans la ligne de code par laquelle commencer)&nbsp;;
3. Presser le bouton Play.

Noter cependant une chose importante&nbsp;: si le code à partir du curseur fait référence à des éléments précédemment créés, le jeu de l'animation échouera (elle n'exécute le code qu'à partir du curseur).

<a name="run_with_repairs_selection"></a>
####Jouer une partie de l'animation entre repères

Cette méthode est la plus pratique si on compte modifier le code au cours de différents essais et modifications.

1. Dans le code, placer <u>**au-dessus**</u> de la première ligne de code à interpréter (sur une seule ligne ne contenant QUE ce repère)&nbsp;:

        #!START
2. Placer <u>**en dessous**</u> de la dernière ligne à interpréter (sur une seule ligne ne contenant QUE ce repère)&nbsp;:

        #!END
3. Dans le menu «&nbsp;Animation&nbsp;», choisir l'item “Jouer entre #!START et #!END (ou jouer le raccourci CMD + 2)”&nbsp;;
4. Cliquer sur le bouton “Play”

<a name="run_selection_with_selection"></a>
####Jouer une partie de l'animation par sélection

Pour ce faire&nbsp;:

1. Sélectionner <u>soigneusement</u> la portion de code à tester (“soigneusement” signifie&nbsp;: en étant sûr de bien placer la sélection du début d'une ligne au début d'une autre ou à la toute fin du code. Cf. la procédure la plus simple ci-dessous)
2. Choisir l'item “Jouer la sélection” dans le menu «&nbsp;Animation&nbsp;» (ou presser le raccourci CMD+1).
3. Cliquer sur le bouton “Play”

Pour rejouer la même sélection (mais seulement si le code n'a pas été modifié), cliquer à nouveau sur “Play”.

####Méthode pour sélectionner correctement la portion de code

Le plus simple, pour sélectionner correctement la portion de code à tester, est de procéder comme suit&nbsp;:

1. Placer le curseur au début de la première ligne de code
2. Relâcher la souris
3. Faire défiler le code de la console jusqu'à afficher la dernière ligne de code à tester.
4. Presser la touche Majuscule
5. Tout en tenant la touche Majuscule, cliquer au bout de la dernière ligne du code à tester.

<a name="run_with_point"></a>
###Jouer seulement la sélection (bouton “Point”)

Grâce au bouton “Point” (le bouton se trouvant dans le contrôleur à côté du bouton Play), on peut ne jouer que la ligne dans laquelle se trouve le curseur ou les lignes sélectionnées (même si elles ne sont que partiellement sélectionnées).

Noter un point important ici&nbsp;: contrairement à l'option “Jouer seulement la sélection” (menu “Options”) qui va jouer ce qui précède la sélection en mode flash, ie très vite (cf. [Jouer une portion de l'animation][#run_only_selection]), ici, c'est vraiment uniquement la ligne ou les lignes sélectionnées qui seront interprétées.

Cela permet de faire des tests très ponctuels de commandes.

<a name="enchainer_animations"></a>
###Enchainer des animations

Le code d'une animation pouvant très vite devenir conséquent, on peut enchainer très facilement des animations. Il suffit pour cela d'utiliser la commande&nbsp;:

    SUITE('<nom ou chemin de l'animation sans extension>)
    
On peut mettre cette commande où l'on veut dans le code, puisqu'elle ne sera interprétée qu'une fois l'animation courante exécutée. Il est donc possible de la mettre au début du code comme à la fin.

Pour faire référence à une animation se trouvant le dossier de l'animation courante (ie qui utilise la commande `SUITE`), on peut indiquer le chemin complet bien sûr, mais aussi le raccourci-point&nbsp;:

    SUITE('./anim_dans_meme_dossier')

*Noter que sans ce `./` l'animation sera cherchée à la racine du dossier des animations.*

*Astuce&nbsp;: on peut remplacer les traits plats (“__”) par des espaces, ils seront automatiquement corrigés.*


<a name="mode_flash"></a>
###Activer/désactiver le mode “Flash”

Le mode “Flash” permet de jouer très rapidement une partie de l'animation. C'est utile lorsqu'une partie est calée, mais qu'on ne veut pas la rejouer systématiquement au même rythme pour atteindre la portion en cours d'élaboration.

On peut aussi l'utiliser pour accélérer un ensemble de modifications qui pourraient se faire en même temps.

Pour passer en mode flash&nbsp;:

    MODE_FLASH        ou      FLASH

Pour stopper le mode flash et revenir à la vitesse normale

    STOP_MODE_FLASH   ou      STOP_FLASH

Dans ce cas, on met le code à passer entre&nbsp;:

    FLASH
    ................
    ...  code    ...
    ... à jouer  ...
    ... en flash ...
    ................
    STOP_FLASH

NB&nbsp;: On peut utiliser l'autocomplétion `fla[TABULATION]` pour placer la commande `FLASH` et l'autocomplétion `flas[TABULATION]` pour placer la commande `STOP_FLASH`.

On peut bien évidemment passer plusieurs passages en mode flash. Chaque partie entre `FLASH` et `STOP_FLASH` sera accélérée.

Note&nbsp;: Si les commandes se multiplient trop dans le code au point de s'y perdre, on peut utiliser l'outil “Outils > Nettoyer les commandes FLASH” qui permet de supprimer toutes ces commandes du code de l'animation.

<a name="set_decompte"></a>
###Régler le décompte

Par défaut, l'animation attend deux secondes avant de démarrer.

On peut régler sa valeur par&nbsp;:

DEFAULT('decomte', <nombre de secondes>)

*Mettre `0` pour supprimer tout décompte.*

<a name="autosave_code"></a>
###Sauvegarde automatique

En activant le menu “Options > Activer Auto-Save”, tous les modifications apportées au code seront automatiquement enregistrées.

<a name="open_recent_anim"></a>
###Ouvrir une animation récemment ouverte

Le menu “Fichier > Ouvrir animation récente >” permet de rapidement retrouver une animation récemment ouverte ou créée.

Ce menu contient jusqu'à 10 animations récentes.

<a name="reiniti_preferences"></a>
###Ré-initialiser toutes les valeurs de préférence

Pour remettre toutes les valeurs de décalages aux valeurs de départ, utiliser la commande (SANS PARENTHÈSES)&nbsp;:

    RESET_PREFERENCES

*Noter que ça ne ré-initialise que les décalages des éléments, tels que les textes de marque de l'harmonie ou des accords, etc. Pour une ré-initialisation complète, utiliser la commande [`RESET`](#reset_animation).*

<a name="set_anim_courante_as_default"></a>
###Définir l'animation courante comme animation par défaut

Pour définir l'animation courante comme l'animation par défaut — ie celle qui s'ouvrira au prochain chargement de l'application&nbsp;—, activer le menu “Fichier > Définir comme anim par défaut”.



---------------------------------------------------------------------

<a name="le_curseur_de_position"></a>
##Déplacement du curseur de position

Le “curseur de position” est la ligne verticale bleue qui traverse verticalement l'animation (invisible quand on la joue) qui indique où seront positionnés les prochains éléments.

*Noter que ce “curseur de position” n'a rien à voir avec la position courante de l'animation, entendu qu'une animation n'est pas, sauf rare exception, un déplacement continu le long d'une portée. Pour l'explication d'une gamme, par exemple, il peut y avoir un affichage fixe le long duquel on se déplace indifféremment.*

###Table des matières

* [Déplacement du curseur vers la droite](#move_cursor_to_right)
* [Déplacement du curseur sur un “pas”](#move_cursor_to_a_pas)
* [Régler la valeur de déplacement entre chaque NEXT()](#set_pas_next)
* [Revenir au début des portées](#move_cursor_to_depart)
* [Placer le curseur à une position précise](#set_cursor_to_position)

<a name="move_cursor_to_right"></a>
###Déplacement du curseur vers la droite

La commande pour écrire à la suite des dernières notes sur la portée, on utilise la commande&nbsp;:

    NEXT([<nombre pixels>])
  
Cela déplacera le curseur de position d'une valeur par défaut de 40px. Cette valeur peut être modifiée grâce à `DEFAULT('next', <nouveau nombre de pixels>)` (cf. [Réglage de l'avancée à chaque NEXT (curseur)](#prefs_set_next)).

Par exemple&nbsp;:

    NEXT() 
    // => les notes suivantes s'écriront 40px plus à droite

On peut également effectuer un déplacement d'un nombre de pixels précis en indiquant le nombre de pixels en argument.

    NEXT([<nombre pixels>])

Par exemple, pour déplacer le curseur de position de 100px vers la gauche (donc un retour en arrière)&nbsp;:

    NEXT(-100)
    // => les notes suivantes s'écriront 100px plus à gauche
  
On peut enfin demander un décalage par rapport à la position `NEXT` “naturelle”&nbsp;:

    NEXT({offset_x:<nombre de pixels>})

Cela décalera la position suivante naturelle de `<nombre de pixels>` pixels. Par exemple, si le pas est de 50 pixels et que je me trouve à 100px :
  
    NEXT()
    # => me placera à 100 + 50 = 150 px
    ...
    NEXT()
    # => me placera à 150 + 50 = 200 px
    ...
    NEXT({offset_x:20})
    # => me placera à 200 + 50 + 20 = 270
    ...
    NEXT()
    # => me placera à 270 + 50 = 320 px
  
Les valeurs négatives sont bien sûr possibles.

Noter qu'il est aussi possible de récupérer la valeur `x` résultat de ce NEXT, pour un usage immédiat ou un usage futur en passant la propriété `var` dans l'argument envoyé à la méthode.

    NEXT({var:'nom_de_la_variable'})

Si on doit aussi envoyé un décalage horizontal, on définit la propriété `x`&nbsp;:

    NEXT({var:'nom de la variable', x:<décalage horizontal>})

Imaginons par exemple que nous voulions écrire un accord, puis plusieurs accords ensuite en nous déplaçant, pour ensuite revenir à la position du premier accord pour écrire un texte ou autre. On peut faire&nbsp;:

    NEXT({var:'xacc1'})
    acc1 = CHORD('c5 e g')
    NEXT()
    acc2 = CHORD('c5 f a')
    NEXT()
    acc3 = CHORD('d5 g b')
    SET_CURSOR(xacc1)
    # => Nous ramène à la position du premier accord
    


<a name="move_cursor_to_a_pas"></a>
###Déplacer le curseur sur un pas

À chaque déplacement (`NEXT` ou `SET_CURSOR`), l'animation mémorise la position comme un “pas” (*note&nbsp;: si la grille est active, ils sont représentés par des marqueurs tout en haut de l'animation.*). Il est très simple de revenir à un de ces “pas”.

**Première formule**

    SET_CURSOR({pas:<indice du pas>})

**Deuxième formule**

    SET_CURSOR('pas', <indice du pas>)
    
**Troisième formule**

    SET_CURSOR(<indice du pas>)

Noter que dans cette dernière formule, on utilise la même syntaxe que pour placer le curseur de position à une position précise. Mais l'animation par du principe que si son premier argument est un nombre inférieur à 15 (donc qui serait positionné sur une clé de portée), c'est un pas et non pas (sic) une position en pixels. Il y a rarement plus de 15 pas dans une animation traditionnelle.

Dans le cas contraire, s'il n'y avait pas de portée et qu'on voulait vraiment positionner un élément à moins de 15 pixels, on devrait alors utiliser la formule explicite&nbsp;:

    SET_CURSOR({offset:<nombre de pixels>})


<a name="set_pas_next"></a>
###Régler le pas entre chaque NEXT()

Cf. [Réglage de la position next](#prefs_set_next)

<a name="move_cursor_to_depart"></a>
###Revenir au début des portées (RESET_CURSOR)

Pour repartir au début de la portée (en tenant compte des réglages par défaut, de l'armure et de la métrique)&nbsp;:

    RESET_CURSOR

Bien sûr, on peut aussi utiliser la commande précédente avec un nombre négatif. Si l'on se trouve à la position 500, il suffit d'indiquer&nbsp;:

    NEXT(-500)

*Pour modifier cette position de début, utiliser la commande `DEFAULT('x_start', <nouvelle valeur>)` (cf. [Réglage de la position horizontale initiale (curseur)](#prefs_x_start)).*

<a name="set_cursor_to_position"></a>
###Placer le curseur à une position précise (SET_CURSOR)

####Par indication de la position exacte

Pour placer la curseur à une position précise, utiliser la commande&nbsp;:

    SET_CURSOR(<position left en pixel>)
    
Par exemple, pour se positionner à 100px exactement&nbsp;:

    SET_CURSOR(100)

Les prochains `NEXT()` partiront de cette nouvelle position.

####Par indication du “pas”

Chaque fois qu'un `NEXT` est invoqué, le curseur de position se déplace, créant un nouveau “pas”. On peut utiliser ces pas avec la commande `SET_CURSOR` en lui fournissant l'indice (1-start) du pas à utiliser&nbsp;:

    SET_CURSOR({pas:<indice du pas>})
    
    ou
    
    SET_CURSOR('pas', <indice du pas>)

*Note&nbsp;: On peut voir ces pas en affichant la grille, ils sont représentés par des petits rectangles tout en haut de l'animation.*

Par exemple&nbsp;: 

    NEXT()
    # => Place le curseur disons à 200. C'est le 1er pas
    NEXT()
    # => Place le curseur disons à 250. C'est le 2e pas
    NEXT()
    # => Place le curseur à 300. C'est le troisième pas.
    SET_CURSOR({pas:1}) ou SET_CURSOR('pas', 1)
    # => Place le curseur au premier pas, donc à 200

####Par indication du décalage de “pas”

Au lieu de fournir l'indice du pas comme dans l'utilisation précédente, on peut fournir aussi le décalage de pas par rapport à la position courante.

    SET_CURSOR({offset:<nombre de pas du déplacement>})
    
    ou
    
    SET_CURSOR('offset', <nombre de pas du déplacement>)
  
Par exemple, pour revenir de deux pas en arrière&nbsp;:

    SET_CURSOR({offset:-2})
    
    ou
    
    SET_CURSOR('offset', -2)


---------------------------------------------------------------------

<a name="usefull_tools"></a>
##Outils pratiques

###Table des matières

* [Point de repère avec la grille](#point_repere_grille)
* [Outil “Coordonnées”](#outil_coordonnees)

<a name="point_repere_grille"></a>
###Point de repère avec la grille

Lorsque la grille est active (pour l'activer&nbsp;: “Options > Afficher la grille”), lorsque l'on clique à un endroit de l'animation, un point apparait et les coordonnées de ce points sont donnés en bas de l'écran.

<a name="outil_coordonnees"></a>
###Outil “Coordonnées”

Cet outil permet d'obtenir les coordonnées précises à l'écran, pour pouvoir positionner un élément par exemple.

On l'active par le menu “Outil > Activer coordonnées”.

Ensuite, il suffit de déplacer et de re-tailler le rectangle rouge pour obtenir les coordonnées des lignes de fuite bleues.

*Noter qu'après un redimensionnement du cadre rouge, il est parfois nécessaire de cliquer au centre du cadre pour obtenir les nouvelles coordonnées.*




---------------------------------------------------------------------
<a name="les_notes"></a>
##Les Notes

###Table des matières

* [Désignation des notes](#designation_notes)
  * [Les altérations](#les_alterations)
* [Constantes notes](#constantes_notes)
* [Créer une note](#creation_note)
* [Déplacer une note](#move_note)
* [Placer une note sur une portée précise](#note_on_staff)
* [Mettre une note en exergue/La sortir de l'exergue](#note_exergue_unexergue)
* [Mettre une note en retrait (note “fantôme”)](#note_fantome)
* [Entourer une note (exergue plus forte)](#entourer_une_note)
* [Forcer le recalage d'une note](#forcer_recalage_note)
* [Détruire d'une note](#note_remove)
* [Référence aux notes d'un objet pluri-notes](#reference_note_objet_pluri_notes)

<a name="designation_notes"></a>
###Désignation des notes

Les notes doivent être désignées par :

    <nom note><alteration><octave>

* On désigne le `nom des notes` par une seule lettre, anglaise, de "a" (la) à "g" (sol).
* L'altération est soit rien (note naturelle), soit un signe (cf. ci-dessous "b", "d", "x", ou "t").
* Vient ensuite l'octave, un nombre, négatif si nécessaire (*mais pour le moment, on va seulement jusqu'à l'octave 0, les autres ne sont pas gérés*). Noter que l'octave
  peut être omis s'il est défini dans les paramètres de la création de la note.
  Par exemple&nbsp;:
  
      maNote = NOTE('e', {octave:4})

<a name="les_alterations"></a>
####Marque des altérations

La valeur `<alteration>` ci-dessus peut être :
  
* `b` pour bémol&nbsp;;
* `t` (comme "ton") pour double bémol&nbsp;;
* `d` pour dièse&nbsp;;
* `x` pour double-dièse&nbsp;;
* `z` pour bécarre (comme le Pomme/Ctrl+"Z" qui annule la dernière action, ce "z" annule la dernière altération).

<a name="constantes_notes"></a>
###Constantes notes

De l'octave 0 (qui n'existe pas en français) à l'octave 7 il existe des constantes pour chaque note avec l'altération bémol ("b") et dièze ("d").

Les deux formules suivantes sont donc possible :

    no=NOTE(ad5)
    no=NOTE('ad5')

Note: Attention à ne pas donner à une variable note le nom d'une de ces constantes. Par exemple, si on fait :

    a5=NOTE(a5)

Cela génèrera une erreur de constante déjà définie.

On peut utiliser plutôt&nbsp;:

    na5=NOTE(a5)

<a name="creation_note"></a>
###Créer une note

    <variable name> = NOTE(<note>)
  
* `<variable>` peut avoir le nom qu'on veut, HORMIS un nom de constante, comme `a5`.
* La `<note>` peut être soit un string soit une constante (cf. [Désignation des notes](#designation_notes))

On peut aussi, si l'on est certain que la note ne sera pas utilisée après (déplacée, supprimée, mise en exergue, etc.) ne pas l'affecter à une variable et composer immédiatement son aspect.

Par exemple, pour placer une note LA 4 avec une marque de cadence et un accord&nbsp;:

    NEW_STAFF(SOL)
    NOTE(a4).cadence('V I').chord('A Maj')

<a name="move_note"></a>
###Déplacer une note

Pour déplacer une note, on utilise le pas&nbsp;:

    <nom variable note>.move(<nouvelle note>[,<params>])
    
Exemple&nbsp;:

    maNote=NOTE(a4) // crée la note LA 4
    maNote.move(g4) // descend la note vers SOL4

*Ne mettre aucune espace dans ce code.*

*Noter que la note de destination devra vraiment la nouvelle valeur de la note. Si la note "a4" se déplace vers "a3", cette note deviendra "a3" dans ses données.*

<a name="note_on_staff"></a>
###Placer une note sur une portée précise

Si on veut placer une note sur une portée hors de la portée active, on indique l'indice de cette portée avant la note, puis ":"&nbsp;:

    <indice portée>:<note>
  
Par exemple&nbsp;:
  
    note_autre_staff=NOTE('2:a4')
    OU
    note_autre_staff=NOTE('2:'+a4)
  
… placera un LA4 sur la deuxième portée, même si elle n'est pas active.
  
*Noter que cela ne rend pas la portée active.*
  
<a name="note_exergue_unexergue"></a>
###Mettre une note en exergue (ou la retirer de l'exergue)

Utiliser la méthode `exergue()` (pour mettre en exergue, en couleur) et `unexergue()` (pour la sortir de l'exergue).

Exemple&nbsp;:

    maNote=NOTE('cx5')
    maNote.exergue()   # => note en couleur (bleu par defaut)
    WAIT(4)
    maNote.unexergue()  # => etat normal

On peut définir la couleur, entre `red` (rouge) `green` (vert) ou `blue` (bleu, par défaut)&nbsp;:

    maNote.exergue({color:<couleur>})

Ou même simplement&nbsp;:
    
    maNote.exergue(green)
    
Cf. aussi [Entourer une note](#entourer_une_note) ci-dessous.

<a name="note_fantome"></a>
###Note fantôme

On peut rendre la note à peine visible (fantôme), en lui appliquant la méthode&nbsp;:

    <note>.fantomize()

Par exemple&nbsp;:

    maNote = NOTE('2:c3').fantomize()
  
Pour sortir la note de cet état et la remettre visible, utiliser&nbsp;:
  
    <note>.defantomize()
    
Par exemple&nbsp;:
    
    maNote = NOTE(c4)
    maNote.fantomize()
    WAIT(4)
    maNote.defantomize()
    
<a name="entourer_une_note"></a>
###Entourer une note

Pour mettre en exergue une note de façon plus forte que la méthode [exergue](#note_exergue_unexergue), on peut utiliser la méthode `surround()` qui entoure la note d'un cercle de couleur.

Syntaxe&nbsp;:

    <note>.surround([<parameters>])
  
… où `<note>` est une instance de Note, et `<parameters>` sont les paramètres optionnels envoyés.
    
Par exemple&nbsp;:

    maNote=NOTE(c5)
    maNote.surround() # => entoure d'un cercle rouge

    oNote=NOTE(a4)
    oNote.surround({color:blue, rectangle:true})
    # => entoure d'un rectangle bleu

Les paramètres peuvent être&nbsp;:

<dl>
  <dt>color:{String|Constante}</dt>
  <dd>La couleur, parmi 'blue', 'red', 'orange', 'green', 'black' (les valeurs peuvent se définir avec ou sans guillemets).</dd>
  <dt>rectangle:{Boolean}</dt>
  <dd>Si true, un rectangle au lieu d'un rond.</dd>
  <dt>margin:{Number}</dt>
  <dd>Joue sur le diamètre du cercle/rectangle pour laisser plus ou moins de place. Utile lorsque plusieurs notes assez proches sont entourées</dd>
</dl>

####Retirer le cercle

Deux commandes pour retirer le cercle de la note&nbsp;:

    maNote.circle.remove()

Ou&nbsp;:

    maNote.unsurround()

<a name="forcer_recalage_note"></a>
###Forcer l'actualisation d'une note

Parfois, il peut survenir qu'une note reste déplacée sur le côté à cause d'une note inférieure conjointe alors que la note inférieure n'est plus là.

Par exemple&nbsp;:

    nosi = NOTE(b3)
    nodo = NOTE(c4)
    # => c4 sera décalé à droite
    nosi.move(b2)
    # => Le si est déplacé mais le do
    #    reste décalé à droite

Dans ce cas (avant que ce bug #49 ne soit corrigé), on peut utiliser la méthode `update` sur la note pour la remettre bien en place&nbsp;:

    ...
    nosi.move(b2)
    nodo.update()


<a name="note_remove"></a>
###Détruire une note

Pour détruire la note (la supprimer de l'affichage, utiliser :

    <nom variable note>.remove()
  
---------------------------------------------------------------------

<a name="les_motifs"></a>
##Les motifs mélodiques

Bien entendu, un motif mélodiques (une suite de notes) peut s'écrire avec la commande `NOTE` (cf. [Les notes](#les_notes)). Mais il peut être plus rapide d'utiliser plutôt la commande `MOTIF` qui crée rapidement un motif mélodique et permet de le manipuler comme un ensemble.

###Table des matières

* [Créer un motif](#creer_un_motif)
* [Manipuler les notes du motif](#manipuler_notes_motif)
* [Liste des paramètres optionnels](#parametres_motif)
* [Régler la distance entre les notes](#set_hoffset_notes_motif)
* [Modifier la vitesse d'affichage du motif](#regler_vitesse_affichage_motif)


<a name="creer_un_motif"></a>
###Créer un motif

monMotif = MOTIF('<suite de notes>'[, <parametres optionnels>])
  
Par exemple&nbsp;:

    unMotif = MOTIF('c4 c c d e d c5 e d d c')

*Noter que dans un motif, l'octave n'a besoin d'être stipulé avec la note que s'il est différent de l'octave de la note précédente. Par défaut (si aucune note ne possède de définition d'octave), c'est l'octave 4 qui est choisi.*

Noter qu'il est tout à fait possible de déterminer des positionnements sur des portées différentes, en préfixant les notes de la portée où elles doivent être écrites. Par exemple&nbsp;:

    unMotifSurDeuxPortees = MOTIF('c4 2:c c')

Si la portée active est la 3e portée, la première et la dernière note seront affichées sur cette portée, tandis que la deuxième note sera affichée sur la 2e (`2:`).

<a name="manipuler_notes_motif"></a>
###Manipuler les notes du motif

On peut faire référence et manipuler les notes d'un motif à l'aide de la méthode `note`.

Par exemple&nbsp;:

    monMotif.note(5).remove()
    # => Détruit la 5e notes du motif

Comme `remove` ci-dessus, toutes les méthodes applicables aux notes seules sont applicables à une note d'un groupe de notes.

Pour connaitre les différents moyens de faire référence aux notes, cf. [Référence aux notes d'un objet pluri-notes](#reference_note_objet_pluri_notes)

<a name="parametres_motif"></a>
###Paramètres optionnels

<dl>
  <dt>staff</dt>
  <dd>La portée à laquelle sera associée le motif. Noter que l'appartenance des notes est indépendante de cette valeur&nbsp;; si le motif est long et que l'animation doit passer à une portée suivante, les notes suivantes seront associées à cette portée. De la même manière, une note définie par `<indice portée>:<note>` sera associée à la portée correspondante (indice portée).</dd>
  <dt>speed</dt>
  <dd>Vitesse d'affichage du motif au cours de l'animation (cf. <a href="#regler_vitesse_affichage_motif">Régler la vitesse d'affichage du motif</a>).</dd>
  <dt>offset_x</dt>
  <dd>Définition de la distance horizontale entre les notes (cf. <a href="#set_hoffset_notes_motif">Régler la distance entre les notes</a>).</dd>
  
</dl>

<a name="set_hoffset_notes_motif"></a>
###Régler la distance entre les notes

<a name="regler_vitesse_affichage_motif"></a>
###Régler la vitesse d'affichage du motif

La vitesse d'affichage des notes du motif se règle avec la propriété `speed` envoyé dans les paramètres optionnelles de la création du motif&nbsp;:

    maMelodie = MOTIF('<mes notes>', {speed:<vitesse>})

Avec `<vitesse>` qui correspond à peu près au nombre de notes affichées par secondes. Donc une vitesse de `1` affiche une note par secondes, une vitesse de `2` affiche 2 notes par seconde et une vitesse de `0.5` affiche 1 note en 2 secondes.


---------------------------------------------------------------------

<a name="les_chords"></a>
##Les Accords

###Table des matières

* [Création d'un accord](#chord_creation)
* [Référence aux notes de l'accord](#chord_ref_note)
* [Écrire le nom de l'accord](#write_chord_name)
* [Écrire l'harmonie](#write_harmony)
* [Écrire une cadence](#write_cadence)
* [Écrire une modulation](#chord_write_modulation)
* [Fantomisation d'un accord](#chord_fantomize)
* [Destruction d'un accord](#chord_remove)

<a name="chord_creation"></a>
###Création d'un accord

On crée un accord avec : 

    monAccord=CHORD('<note1> <note2>... <noteN>')
  
… où chaque note doit correspondre à la définition normale.

Par exemple&nbsp;:

    accDom=CHORD('c3 eb3 g3')
    
####Création d'un accord sur plusieurs portées

On peut poser l'accord sur différentes portées en ajoutant `<indice portée>:` devant la note (*rappel&nbsp;: l'indice portée est "1-start", donc "1" pour la première portée en comptant depuis le haut*).
  
Noter qu'il est inutile d'indiquer l'indice portée de la portée active.
  
Par exemple (en imaginant que la portée 1 est la portée active)&nbsp;:

    acc=CHORD('2:c3 2:g3 e4 g4')

… placera "c3" et "g3" sur la 2<sup>e</sup> portée (certainement la clé de fa) et les notes "e4" et "g4" sur la 1<sup>ère</sup> portée qui est la portée active.

<a name="chord_ref_note"></a> 
###Référence aux notes de l'accord

Comme tous les types d'objets possédant plusieurs notes (Accords, Gammes, Motifs), on fait appel aux différentes notes à l'aide de la méthode `note` appelée sur l'objet :

    <nom accord>.note(<indice note(s)>)
  
Par exemple&nbsp;:

    accDom=CHORD('c3 eb3 g3')
    accDom.note(1).move('c4')
    // Prends la première note (c3) et la déplace en c4.

Voir la valeur que peut prendre `<indice note(s)>` dans [Référence aux notes d'un objet pluri-notes](#reference_note_objet_pluri_notes).

####Opération sur plusieurs notes

La méthode `note` de l'objet peut être également appelé avec une liste d'indice de notes. Toutes les notes subiront alors le même traitement.

Par exemple, pour masquer un ensemble de notes&nbsp;:

    monAccord = CHORD('b3 d4 f4 a4')
    WAIT(1)
    monAccord.note([1,2,4]).hide()
    # => masque la 1ère, 2e et 4e note
    WAIT(2)
    monAccord.note([1,2,4]).show()
    # => ré-affiche les notes

####Affecter une note à une variable

Comme pour tout “groupe de notes”, si l'on veut affecter une note de l'accord à une variable (pour l'utiliser plus facilement ensuite), on ne peut pas procéder ainsi&nbsp;:

    maNote=monAccord.note(2)      # => # ERREUR #
    maNote.write("Une seconde !") # => # ERREUR #

Pour ce faire, il faut impérativement utiliser&nbsp;:

    maNote=Anim.Objects.monAccord.note(2)
    maNote.write("Une seconde !")

Donc ajouter `Anim.Objects` devant `monAcccord.note(2)`, `Anim.Objects` étant la propriété qui contient tous les objets de l'animation.

On peut aussi utiliser la méthode pratique `objet(...)`&nbsp;:

    maNote = objet('monAccord.note(2)')
    
Mais dans ce cas, noter qu'il faut absolument mettre le paramètre (la référence de l'objet) entre guillemets ou apostrophes.

<a name="write_chord_name"></a>
###Écrire le nom de l'accord

Une marque d'accord est un texte. Cf. [Écrire un accord](#text_chord).


<a name="write_harmony"></a>
###Écrire l'harmonie

Une marque d'harmonie est un texte. Cf.[Écrire l'harmonie](#text_harmonie).

<a name="write_cadence"></a>
###Écrire une cadence

Une cadence est un texte. Cf. [Écrire une cadence](#text_cadence).

<a name="chord_write_modulation"></a>
###Écrire une modulation

Une marque de modulation est un texte. Cf. [Écrire une modulation](#text_modulation).

<a name="chord_fantomize"></a>
###Fantomisation d'un accord

On peut fantômiser et défantômiser un accord avec les méthodes `fantomize` et `defantomize`&nbsp;:

    <accord>.fantomize()
    # => Transforme les notes de l'accord en fantôme de note
    <accord>.defantomize()
    # => Défantomise les notes de l'accord
    
  
<a name="chord_remove"></a>
###Destruction d'un accord

Pour détruire l'accord, utiliser&nbsp;:

    <nom variable accord>.remove()


<a name="reference_note_objet_pluri_notes"></a>
##Référence aux notes d'un objet pluri-notes

Un objet “pluri-notes” est un objet de l'animation qui possède et manipule plusieurs notes. C'est le cas par exemple des [accords](#les_chords), des [gammes](#les_gammes) ou les [motifs](#les_motifs).

Tous ces objets possèdent une méthode `note` qui permet de récupérer et de manipuler une ou plusieurs des notes de l'objet. Par exemple&nbsp;:

    monAccord = CHORD('c4 e4 g4')
    monAccord.note(2)
    # => Retourne la deuxième note, le MI 4
    # (noter que cette étape de l'animation ne fera rien puisqu'on ne dit pas
    #  ce qu'il faut faire avec cette note)

Les valeurs possibles de l'argument passé à la méthode `note` peuvent être&nbsp;:

<dl>
  <dt>Un indice unique</dt>
  <dd>C'est alors l'indice de la note dans l'objet, la première note ayant l'indice 1</dd>
  <dt>Une liste d'indices</dt>
  <dd>Une liste des indices de notes à manipuler. Syntaxe&nbsp;: [`<indice note>`, `<indice note>` etc].</dd>
  <dt>Un rang de notes</dt>
  <dd>Un range de notes où l'on définit la première et la dernière des notes à prendre. Syntaxe : `<indice première>..<indice dernière>`.</dd>
</dl>

Par exemple&nbsp;:

    monMotif = MOTIF('c4 d e f g a')

    monMotif.note(5).surround()
    # => Entoure la 5e note, donc le SOL 4
    monMotif.note([1,3,5]).colorize(blue)
    # => Met en bleu les notes 1 (DO 4), 3 (MI 4) et 5 (SOL 4)
    monMotif.note('2..4').fantomize()
    # => "Fantomise" les notes 2 à 4, donc du RÉ 4 au FA 4


---------------------------------------------------------------------

<a name="les_staves"></a>
##Les portées

###Table des matières

* [Créer une portée](#create_staff)
* [Activer une portée](#active_staff)
* [Définir l'armure de la portée](#define_armure_staff)
* [Définir la métrique de la portée](#define_metrique_staff)
* [Récupérer une portée](#recuperer_staff)
* [Supprimer les lignes supplémentaires](#remove_suplines)
* [Placer un texte sur la portée](#ecrire_texte_portee)
* [Supprimer une portée](#remove_staff)

<a name="create_staff"></a>
###Créer une portée

Pour créer une portée, utiliser le pas&nbsp;:

    NEW_STAFF(<cle>[, <params>])

… où `<cle>` peut être `SOL`, `FA`, `UT3`, `UT4`.
  
… et `<params>` peut contenir :
  
    NEW_STAFF(<cle>, {
      (*)   offset    : decalage vertical par rapport à précédente (pixels),
            offset_y  : identique à `offset`
            y         : la position verticale précise (au lieu de `offset`)
            x         : la position horizontale précise (bord gauche par défaut)
            width     : la largeur de la portée (tout l'écran par défaut)
      (**)  metrique  : la métrique à utiliser
      (***) armure    : l'armure à placer (tonalité)
    })
  
(*) *Noter que par défaut, il y aura toujours un décalage entre deux portées créées, ce `offset` ne fait qu'aggrandir l'espacement (s'il est positif) ou le rétrécir (s'il est négatif)*

(**) *Une valeur de type "4/4" ou "3/8" etc. Cf. [Définir la métrique de la portée](#define_metrique_staff)*

(***) *La tonalité, par exemple "A", "Bb" ou "C#". Cf. [Définir l'armure de la portée](#define_armure_staff)*

Par exemple&nbsp;:
  
    NEW_STAFF(SOL)
  
… qui affichera une portée en clé de sol en dessous de la dernière portée.

*Noter que cette portée deviendra la portée active, c'est-à-dire celle où seront placées les objets définis par la suite.*

<a name="active_staff"></a>
###Activer une portée

Activer une portée signifie que tous les pas suivants la viseront. Par exemple, les notes se déposent toujours sur la portée active.

    ACTIVE_STAFF(<indice de la portee>)
  
… où `<indice de la portee>` est son rang dans l'affichage, en partant de 1 et du haut. Donc la portée la plus en haut s'active par&nbsp;:
    
    ACTIVE_STAFF(1)
    
    
<a name="define_armure_staff"></a>
###Définir l'armure de la portée

On définit l'armure de la portée avec le paramètre `armure` qu'on renseigne avec le nom de la tonalité exprimée au format de l'application, c'est-à-dire une lettre minuscule pour la note (de "a" à "g"), la lettre "b" pour "bémol" ou "d" pour "dièse".

Par exemple, pour une armure de FA# majeur avec une clé d'UT3&nbsp;:

    NEW_STAFF(UT3, {armure:'fd'})

Noter que l'animation en fonctionne pas comme un logiciel de PAO&nbsp;: il faut indiquer cette armure pour chaque portée sur laquelle on veut voir l'armure en question.

<a name="define_metrique_staff"></a>
###Définir la métrique de la portée

On définit la métrique avec le paramètre `metrique` qu'on renseigne avec les deux nombres qui composent la métrique séparés par une balance. 

Par exemple pour une mesure en 6/8&nbsp;:

    NEW_STAFF(SOL, {metrique:"6/8"})


<a name="recuperer_staff"></a>
###Récupérer une portée

On peut récupérer une portée (pour la “travailler” dessus) à l'aide de la commande&nbsp;:

    STAFF(<indice 1-start>)

Par exemple, pour supprimer la deuxième porée construite&nbsp;:

    STAFF(2).remove()

Noter que pour mettre la portée dans une variable, il faut impérativement utiliser&nbsp;:

maPortee=Anim.Objects.STAFF(x)

  
<a name="remove_suplines"></a>
###Supprimer des lignes supplémentaires

Pour le moment, la suppression de lignes supplémentaires n'est pas automatique, afin de laisser toute liberté à la programmation de l'animation.

Utiliser la commande&nbsp;:

    STAFF(<indice 1-start>).remove_suplines({
      top     : <indice ou liste d‘indice a supprimer au-dessus>,
      bottom  : <indice ou liste d‘indices a supprimer en dessous>,
      xoffset : <decalage horizontal>
    })
    
* N'utiliser que `top` et `bottom` au besoin&nbsp;;
* Les indices des lignes se comptent À PARTIR DE LA PORTÉE (donc en montant pour `top` et en descendant pour `bottom`)&nbsp;;
* `xoffset` n'est à préciser que si les lignes à supprimer ne se trouvent pas sur le décalage horizontal courant (suppression arrière, rare).

####Autre commande pour supprimer des lignes supplémentaires
On détruit ces lignes à l'aide de la commande&nbsp;:

    REMOVE_SUPLINE(<parameters>)
  
Une ligne supplémentaire est caractéristée par&nbsp;:

* La portée qui la porte&nbsp;;
* Son indice à partir de la portée&nbsp;;
* Sa position supérieure ou inférieure&nbsp;;
* Son décalage à gauche (“frame” de l'animation).

Cela détermine les paramètres de `<parameters>`.
  
    {
      staff: indice 1-start de la portée (depuis le haut),
      bottom: liste d'indices ou indice de la ligne à supprimer en bas,
      top: liste d'indices ou indice de la ligne à supprimer en haut,
      xoffset: décalage gauche (frame)
    }

Toutes les valeurs à part `bottom` xou `top` sont optionnelles&nbsp;:

Si `staff` n'est pas précisé, on prendra la portée active.

Si `xoffset` n'est pas précisé, on prendra le décalage courant (ce qui représente le cas le plus fréquent, entendu qu'on va rarement supprimer une ligne supplémentaire "en arrière").

*Note&nbsp;: lors d'un déplacement, une suppression ou tout autre effet qui doit rendre obsolète la ligne supplémentaire, il est préférable de déclencher la suppression des lignes supplémentaires AVANT la commande sur la note. Par exemple, pour un déplacement&nbsp;:*

    note=NOTE(c4) // ajoute une ligne supplément en bas
    WAIT(2)
    REMOVE_SUPLINE({bottom:1})
    note.move(c5)

####Précision des indices

Les indices peuvent être une simple valeur numérique&nbsp;:

    bottom:1 / top:1

… ou une liste d'indices

    top:[1,2] / bottom:[1,2]

Noter que ces indices sont "1-start" et se comptent toujours À PARTIR DE LA portée, donc en descendant pour `bottom` et en montant pour `top`.

Noter aussi que `bottom` et `top` sont complètement indépendants, pour `bottom` on ne tient compte QUE des lignes supplémentaires inférieures et pour `top` on ne tient compte QUE des lignes supplémentaires supérieures.


<a name="ecrire_texte_portee"></a>
###Écrire un texte sur la portée

* [Écrire le texte au curseur](#ecrire_texte_portee_cursor)
* [Régler l'écart entre texte et portée](#decaler_hauteur_texte_staff)
* [Décaler le texte à droite ou à gauche](#decaler_horizontalite_texte)
* [Définir la largeur du texte](#set_width_staff_texte)
* [Utiliser un style de texte](#set_style_staff_texte)
* [Positionner le texte en dessous de la portée](#set_texte_staff_down)

<a name="ecrire_texte_portee_cursor"></a>
####Écrire un texte au curseur

Pour écrire un texte à la position actuelle du curseur, on utilise la commande&nbsp;:

    STAFF(<indice portée>).write("<le texte>"[, <paramètres optionnels>])

Par défaut, ce texte se place au-dessus de la portée.

<a name="decaler_hauteur_texte_staff"></a>
####Régler l'écart entre texte et portée

Pour le régler à partir de maintenant et pour tous les textes de portée qui suivront, utiliser la commande&nbsp;:

    DEFAULT('staff_top_text', <nombre de pixels>)

Pour revenir à la valeur par défaut&nbsp;:

    DEFAULT('staff_top_text')

Pour régler seulement un texte en particulier, l'écrire en défissant la propriété `offset_y` des paramètres (2e argument). Par exemple&nbsp;:

    STAFF(1).write("Mon texte 20 pixels plus haut", {offset_y: 20})

<a name="decaler_horizontalite_texte"></a>
####Décale le texte à droite ou à gauche

Par défaut, le texte s'aligne par le centre à la position courante du curseur. On peut afficher ce décalage à l'aide de la propriété `offset_x` envoyé aux paramètres optionnels. Par exemple&nbsp;:

    STAFF(2).write("Mon texte 30 pixels plus à droite", {offset_x: 30})

Bien entendu, on peut combiner tous les éléments&nbsp;:

    STAFF(2).write("Mon texte modifié", {offset_y:10, offset_x:20, style:'cadre'})

<a name="set_width_staff_texte"></a>
####Définir la largeur du texte

On peut définir la largeur de la boite contenant le texte à l'aide de la propriété `width`&nbsp;:

    STAFF(1).write("Texte à largeur", {width:<nombre de pixels>})
  
  
<a name="set_style_staff_texte"></a>
####Utiliser un style de texte

Pour la cohérence de l'affichage, on peut utiliser quelques styles de texte prédéfinis en réglant la propriété `style` des paramètres optionnels&nbsp;:

    STAFF(1).write("Mon texte stylisé", {style:'<style(s) à utiliser>'})

Si plusieurs styles doivent être combinés, les séparer par des espaces. Par exemple&nbsp;:

    STAFF(2).write("Plusieurs styles compatibles", {style:'cadre exergue italic'})

**Liste des styles**&nbsp;:
  
    italic    Place le texte en italique
    cadre     Place un cadre autour du texte
    exergue   Met le texte en exergue (gras)
    
<a name="set_texte_staff_down"></a>
####Positionner le texte en dessous de la portée
  
  DEFAULT('staff_text_up', false)

  Pour le replacer en haut&nbsp;:
  
  DEFAUT('staff_text_up')
  
  
<a name="remove_staff"></a>
###Supprimer une portée

Comme pour tout objet de l'animation, on supprime une portée à l'aide de la méthode `remove`&nbsp;:

    NEW_STAFF(SOL)
    # => Crée une premiere portée
    STAFF(1).remove()
    # => Détruit la première portée

Attention cependant à un certain point&nbsp;: chaque fois qu'une portée supérieure est supprimée, l'indice des portées suivante est modifiée, pour tenir compte SEULEMENT des portées de l'animation courante.

Donc, si l'on a deux portées et que l'on veut les détruire les deux, le code suivant produira une erreur&nbsp;:

    NEW_STAFF(SOL)
    NEW_STAFF(FA)
    ....
    STAFF(1).remove()
    STAFF(2).remove()
    => !ERREUR : la première portée ayant été détruite, la portée d'indice `2` n'existe pas !

Il convient donc écrire&nbsp;:

    STAFF(1).remove()
    STAFF(1).remove()

Ou pour la clarté du code&nbsp;:

    STAFF(2).remove()
    STAFF(1).remove()
    # => OK

Il en va de même, évidemment pour l'écriture de tout autre élément sur une portée après la suppression de portée supérieures.
  
---------------------------------------------------------------------

<a name="les_gammes"></a>
##Les gammes

###Table des matières

* [Introduction](#introduction_gammes)
* [Paramètres de définition des gammes](#parametres_gammes)
* [Utilisation des notes de la gammes](#utilisation_notes_gammes)

<a name="introduction_gammes"></a>
###Introduction
On peut produire en un seul pas une gamme à l'aide de la commande :

    <var>=SCALE(<tonalité>[, <paramters>])

* `<var>` est un nom de variable quelconque
* `<tonalité>` est la tonalité exprimée par une seule lettre (anglaise) de "a" (la) à "g" (sol). On peut ajouter toutes les altérations voulues (cf. [Les altérations](#les_alterations)). Noter que par défaut, suivant la portée active, l'animation affiche ses notes à la hauteur où elles produiront le moins de lignes supplémentaires.
* `<parameters>` est une liste de paramètres optionnels. Cf. ci-dessous.
  
<a name="parametres_gammes"></a>
###Paramètres de définition des gammes

Ils constituent le second argument de la commande `SCALE`, après la note de la tonalité.

C'est un objet de propriétés&nbsp;:

    maGamme=SCALE('a',{
      octave : 2,
      for    : 5,
      etc.
    })

####Liste des propriétés

<dl>
  <dt>type : {String}</dt>
  <dd>Le type de gamme, parmi : 'MAJ' : Gamme majeure (défaut), 'min_h' : Mineure harmonique, 'min_ma' : MINeure Mélodique Ascendante, 'min_md' : MINeure Mélodique Descendante.
  </dd>
  <dt>octave : {Number}</dt>
  <dd>L'octave à laquelle il faut affiche la gamme. Par défaut, celui qui produira le moins de ligne supplémentaires, donc celui dont le plus grand nombre de notes se trouve *dans* la portée.
  </dd>
  <dt>staff : {Number}</dt>
  <dd>L'indice de la portée sur laquelle il faut écrire la gamme. Par défaut, la portée active.</dd>
  <dt>offset : {Number}</dt>
  <dd>Le décalage horizontal entre chaque note de la gamme.</dd>
  <dt>asc : {Boolean}</dt>
  <dd>Si TRUE (défaut), la gamme sera ascendante, sinon, elle descendra.</dd>
  <dt>speed</dt>
  <dd>La vitesse d'affichage de la gamme. La valeur correspond au nombre de notes qui seront afficher par seconde. Donc utiliser une valeur entre 0.01 et 1 pour afficher moins d'une note par seconde. Par exemple, la valeur `0.5` affichera 1 note toutes les deux secondes.</dd>
  <dt>for : {Number}</dt>
  <dd>Le nombre de notes de la gamme à afficher. Par défaut, 8 pour pouvoir les afficher toutes, de la tonique à la tonique.</dd>
  <dt>from : {Number}</dt>
  <dd>La première note de la gamme de laquelle partir (1-start)</dd>
</dl>

<a name="utilisation_notes_gammes"></a>
###Utilisation des notes de la gamme

Comme pour tout “groupe de notes” (accord, motif, etc.) les notes de la gamme peuvent être ensuite traitées séparément grâce à la méthode `note` appelé sur l'objet (ici appelée sur la gamme)

Soit une gamme&nbsp;:

    maGamme=SCALE('d')

On récupère ses notes par&nbsp;:

    maGamme.note(<indice note>)
  
Pour connaitre les différents moyens de faire référence aux notes, cf. [Référence aux notes d'un objet pluri-notes](#reference_note_objet_pluri_notes)
  
Par exemple, si je veux poser un texte sur la deuxième note&nbsp;:
  
    maGamme.note(2).write("Une seconde !")

Comme pour tout “groupe de notes”, si l'on veut mettre un élément (note) du groupe dans une variable, ce code n'est pas possible&nbsp;:

    maNote=maGamme.note(2)
    maNote.write("Une seconde !") # => # ERREUR #

Pour ce faire, il faut impérativement utiliser&nbsp;:

    maNote=Anim.Objects.maGamme.note(2)
    maNote.write("Une seconde !")


---------------------------------------------------------------------

<a name="les_textes"></a>
##Les Textes

###Table des matières

* [Introduction aux textes](#intro_textes)
* [Créer une boite de texte](#create_tbox)
* [Créer des sous-titres ou des doublages)](#creer_captions)
* [Créer un texte pour un objet musical](#create_texte)
  * [Types spéciaux de texte (Accords, harmonie, cadences, etc.)](#types_speciaux_texte)
  * [Créer un texte pour l'animation](#create_texte_animation)
  * [Créer un texte pour un objet](#create_texte_objet)
  * [Créer un texte pour la portée (section “Portée”)](#ecrire_texte_portee)
* [Définir les positions des textes](#set_position_texte)
* [Supprimer un texte](#supprimer_texte)
  * [Supprimer le texte d'un objet](#supprimer_texte_objet)
* [Exporter le texte de l'animation](#exporter_doublage)
* [Exporter les sous-titres de l'animation](#exporter_sous_titres)

<a name="intro_textes"></a>
###Introduction

Il existe trois sortes de textes dans Staves&nbsp;: 

* [Les textes “portés” par les notes](#create_texte), les portées, les accords, tous les objets musicaux en somme, et  comme les harmonies, les accords. De façon générale, ils sont créés à l'aide de la méthode `write` appelée sur l'objet (p.e. `maNote.write(....)`) ainsi que tous les méthodes-raccourcis comme la méthode `chord` qui permet d'écrire le nom de l'accord (p.e. `monAccord.chord("Do min.")`)&nbsp;;
* [Les textes de sous-titre ou de doublage](#creer_captions) qui permettent, comme leur nom l'indique, de créer des sous-titres ou des doublages à dire sur l'animation&nbsp;;
* [les “TBox(es)”, les boites de texte](#create_tbox), indépendantes des objets musicaux, qui permettent d'afficher des textes à l'écran de façon indépendante des objets musicaux, avec un style propre.


<a name="create_tbox"></a>
###Créer une boite de texte

Une “TBox”, une boite de texte, est un texte indépendant de l'animation, qui permet d'afficher un texte à n'importe quel endroit de l'animation, avec le style défini.

* [Créer (instancier) la boite de texte](#instanciate_tbox)
* [Définir les valeurs par défaut des boites de texte](#set_prefs_tboxes)
* [Définir l'aspect de la boite de texte](#set_style_tbox)
* [Styles de textes des boites de texte](#tbox_styles_textes)
* [Définir les dimensions de la boite de texte](#set_dimensions_tbox)
* [Régler l'alignement du texte dans la boite](#tbox_text_alignement)
* [Animer les boites de texte](#animate_tbox)


<a name="instanciate_tbox"></a>
####Instancier la boite de texte

Une boite de texte (une “TBox”) se créer avec la commande `TBOX`

    <variable> = TBOX("<Le texte>"[, <parametres>])

Par défaut, une boite de texte apparaitra toujours au milieu de l'écran, sur un fond translucide, avec un caractère lisible.

**`<parametres>`** peut être un “Hash” (`{<propriété>:<valeur>, <propriété>:<valeur> etc.}`) ou un “String” (une chaine de caractère). Si c'est un String, c'est le nom d'un style prédéfini de texte.
  
Par exemple&nbsp;:

    monGrandTitre = TBOX("Mon grand titre en petites capitales", grand_titre)

*Voir tous les [Styles de texte des boites de texte](#tbox_styles_textes).*

Pour créer le texte sans l'afficher, ajouter le paramètre `hidden` à true&nbsp;:

    txt = TBOX("Mon texte masqué", {hidden:true})
    
Cela permet par exemple de créer tous les textes au début du code de l'animation pour pouvoir en disposer ensuite grâce à la méthode `show`&nbsp;:

    txt.show()
    
Ou de faire apparaitre le texte lentement&nbsp;:

    txt = TBOX("Mon texte apparait lentement", {hidden:true}).show({duree:4})
    # => Le texte apparait en 4 secondes
    
Un autre paramètre intéressant à la création est le paramètre `wait` (cf. [Le paramètre spécial `wait`](#parametre_special_wait)). Voir aussi [le paramètre spécial `duree`](#parametre_special_duree).

<a name="set_prefs_tboxes"></a>
####Définir les valeurs par défaut des boites de texte

Toutes les valeurs par défaut se règlent à l'aide de la commande `DEFAULT`.

    DEFAULT('tbox_font_family', "<police à utiliser>")
    DEFAULT('tbox_font_size', <nombre de point de la taille de police>)
    DEFAULT('tbox_padding', <nombre de pixel de marge intérieure>)
    DEFAULT('text_color', '<couleur par défaut du texte>')
    DEFAULT('tbox_background', "<couleur de background par défaut>")
    DEFAULT('tbox_border', "<bord par défaut des boites de texte>")
  
<a name="set_style_tbox"></a>
####Définir le style de la boite de texte

...
#####Définir la couleur de fond translucide

Pour définir la couleur de fond translucide (noire par défaut), on utilise le paramètre `background`.

    tbox1 = TBOX("Mon texte", {background:<couleur #RRVVBB ou constante>})

Si la boite est déjà créée :

    tbox1.set({background:<couleur>})
  
On peut jouer aussi sur l'opacité avec le paramètre `opacity`. Une opacité de 1 rendra complètement opaque le fond (aucune transparence), une opacité de 0.xx où `xx` est un nombre créera la transparence maximale.

    tbox1 = TBOX("mon texte", {opacity:<nombre de 0 à 1>})
    
Si la boite est déjà créée&nbsp;:
    
    tbox1.set({opacity:<nombre de 0 à 1>})
    
<a name="set_dimensions_tbox"></a>
####Définir les dimensions de la boite de texte

On définit les dimensions de la TBox à l'aide des paramètres `width` et `height`. Noter que par défaut la hauteur s'adaptera au texte contenu, mais pas la largeur, qui occupera la moitié de la largeur de l'écran.

    boiteDimensionnee = TBOX("Une boite dimensionnée", {width:600, height:200})
    # Une boite de texte qui fera 600 par 200 pixels.

**Redéfinir les dimensions en cours d'animation**

C'est la méthode `set` qui permet de modifier tous les paramètres de la TBox, à commencer par les dimensions.

On peut redéfinir ces dimensions de deux manières&nbsp;: de façon absolue ou de façon relative.

On redéfinit les dimensions de façon absolue avec les paramètres `width` et `height`&nbsp;:

    maBoite.set({width:<nouvelle largeur>, height:<nouvelle hauteur>})
  
On redéfinit les dimensions de façon relative avec les paramètres `offset_width` et `offset_heigth`&nbsp;:

    <tbox>.set({
      offset_width  : <différence avec largeur courante>,
      offset_height : <différence avec hauteur courante>
    })

Par exemple&nbsp;:

    maboite.set({offset_width:20, offset_height:-11})
    # => La boite sera allongée de 20 pixels et la hauteur sera raccourcie de 11 pixels


<a name="tbox_text_alignement"></a>
####Définir l'alignement du texte dans la boite

Par défaut, l'alignement du texte est centré. On peut modifier cette alignement en utilisant le paramètre `align` en lui donnant la valeur “left” (alignement à gauche), “right” (alignement à droite), “justify” (justification) et “center” (pour revenir au center).

Par exemple&nbsp;:

    monTexte = TBOX("Mon texte aligné à gauche.", {align:left})

<a name="tbox_styles_textes"></a>
###Styles de textes des boites de textes

Ces valeurs peuvent définir la propriété `style` dans les paramètres envoyés à TBOX (2e argument) ou servir de 2e argument si aucune autre propriété ne doit être définie.

Par exemple&nbsp;:

    monTexte = TBOX("Mon petit texte", {style:small})

Ou&nbsp;:

    monTexte = TBOX("Mon autre petit texte", small)

**Liste des styles pré-définis**

    grand_titre       Un grand titre pour l'animation
    chapitre          Un titre de chapitre
    titre             Un autre titre dans un chapitre.
    small             Un petit texte
    tiny              Un texte minuscule
    copyright         La marque du copyright
    
<a name="animate_tbox"></a>
###Animer les boites de texte

On peut animer les boites de texte avec la méthode `set` qui peut en redéfinir tous les paramètres.

Par exemple, si la boite possède un fond opaque noir (background:black, opacity:1) et qu'on veut le changer en fond rouge d'opacité 0.5, on utilise&nbsp;:

    # -- Définition/création de la boite --
    maBoite = TBOX("Ma boite", {background:black, opacity:1})
    ...
    ...
    maBoite.set({background:red, opacity:0.5})
    # Anime la boite en modifiant la couleur de fond (en vrai fondu) et son opacité


####Déplacer les boites de texte

On peut utiliser la [méthode universelle `move`] pour déplacer les boites, mais on peut également utiliser là aussi la méthode `set`&nbsp;:

Déplacement vers des coordonnées absolues&nbsp;:

    maBox.set({x:<valeur horizontale>, y:<valeur verticale>, duree:<en x secondes>})
    
… ou en coordonnées relatives&nbsp;:

    maBox.set({
      offset_x    : <nombre de pixels de déplacement horizontal>,
      offset_y    : <nombre de pixels de déplacement vertical>
    })




---------------------------------------------------------------------

<a name="create_texte"></a>
###Créer un texte

<a name="types_speciaux_texte"></a>
####Types spéciaux de texte

Par défaut, un texte est "normal", il s'écrit tel qu'il est défini.

Mais il existe des types qui peuvent être définis grâce à la propriété `type` envoyée en paramètres&nbsp;:

<dl>
  <dt>chord</dt>
  <dd>Le type `chord` permet d'écrire un accord au-dessus de l'élément porteur du texte. Il est stylisé en conséquence. Cf. <a href="#text_chord">Écrire un accord</a>.</dd>
  <dt>harmony</dt>
  <dd>Écrit le texte sous la portée, sous forme d'une marque d'harmonie.<br>Si le texte se finit par un certain nombre de "*" ou de "•", ils sont considérés comme des renversements de l'accord et traités visuellement comme tels. Cf. <a href="#text_harmonie">Écrire l'harmonie</a>.</dd>
  <dt>cadence</dt>
  <dd>Écrit le texte sous la portée, à la position courante, sous forme de marque cadentielle (donc avec des traits "__|" pour marquer la fin de la partie). Cf. <a href="#text_cadence">Écrire une cadence</a>.</dd>
  <dt>modulation</dt>
  <dd>Écrit le texte pour une modulation, au-dessus de la portée et de travers. Cf. <a href="#text_modulation">Écrire une modulation</a>.</dd>
  <dt>part</dt>
  <dd>Pour la marque d'une partie. Cf. <a href="#text_partie">Écrire une marque de partie<a></dd>
</dl>

<a name="text_harmonie"></a>
###Écrire l'harmonie

Pour indiquer une harmonie, par exemple pour indiquer que l'accord est un premier degré sous la forme de son deuxième renversement&nbsp;:

    monAccord=CHORD('g4 c5 e5')
    monAccord.write("I**",{type:harmony})

Il existe aussi le raccourci&nbsp;:

    monAccord.harmony("I**")

*Pour le positionnement de la marque, cf. [Position des textes d'harmonie et de cadence](#prefs_position_harmony).*


<a name="text_cadence"></a>
###Écrire une cadence

Pour indiquer une **CADENCE** avec la méthode `write`&nbsp;:

    monAccord.write("I", {type:cadence, type_cadence:<type de la cadence>})

Mais cette méthode peut être grandement simplifiée en utilisant la méthode `cadence`&nbsp;:

    monAccord.cadence("I", {type:<type de la cadence>})

*Noter qu'ici le `type_cadence` de la méthode `write` a été remplacé par `type`.*

Les cadences possibles sont&nbsp;:

    parfaite        V I
    italienne       II|IV|VI V I
    imparfaite      I V
    plagale         IV I
    picarde         V IMaj
    demie           II V
    rompue          V VI
    faureenne       I IV V

Noter que ce sont des constantes, on peut les utiliser sans guillemets. Par exemple&nbsp;:

    monAccord.cadence("I*", {type:imparfaite})

Pour une explication détaillée des cadences, cf. [Page wiki sur les cadences](http://fr.wikipedia.org/wiki/Cadence_(musique))

*Pour le positionnement de la marque, cf. [Position des textes d'harmonie et de cadence](#prefs_position_harmony).*

####Allonger la barre inférieure

Pour allonger la barre inférieur de la marque d'harmonie, on peut ajouter le paramètre `width` qui sera le nombre de pixels désiré. Par exemple&nbsp;:

    monAccord.write("I**", {type:cadence, width:100})
    OU
    monAccord.cadence("I**", {width:100})

####Marque à droite de la barre

Pour placer une marque à droite de la barre verticale, donc un texte concernant la suite, mettre ce texte entre crochets dans le texte de la cadence&nbsp;:

monAccord.cadence("I* [texte à droite]")

*Ça peut être par exemple l'index de l'accord dans l'harmonie suivante.*

<a name="text_chord"></a>
###Écrire un accord

Pour indiquer le **NOM DE L'ACCORD** au-dessus des notes (ou d'un autre objet)&nbsp;:

    monAccord.write("C", {type:chord})

… ou le raccourci `chord`&nbsp;:

    monAccord.chord("C")

*Pour le positionnement de la marque de l'accord cf. [Réglage de la position de l'accord](#prefs_position_chord).*


<a name="text_modulation"></a>
###Écrire une modulation

Pour écrire une modulation (au-dessus de la portée, nom de l'accord de travers), utiliser&nbsp;:

    <objet>.modulation(<nom>[, <parameters>])
  
Par exemple&nbsp;:
  
    monAccord = CHORD('c4 d4 fd4 a4')
    monAccord.modulation('Sol')

Ou&nbsp;:

    monAccord.write('Sol', {type:modulation})

**Texte sous la barre**

Le ton de la modulation est indiqué au-dessus de la barre transversal, mais un autre texte peut être écrit SOUS la barre. Pour ce faire, il suffit de le mettre entre crochets dans la définition de la modulation&nbsp;:

    monAccord.modulation('Sol [Dom de Dom]')

… produira quelque chose comme (mais incliné)&nbsp;:

    | SOL
    |---------
    | Dom de Dom
    |
    |

*Pour le positionnement de la marque de modulation cf. [Réglage de la position de la marque de modulation](#prefs_position_modulation).*

<a name="text_partie"></a>
###Écrire une marque de partie

Utiliser la méthode `part` sur un note, un accord etc. pour placer une marque de partie, avec en premier argument le nom de la partie et en second argument les paramètres optionnels.

    <porteur>.part(<nom de partie>[, <parametres>])

Par exemple&nbsp;:

    maMelodie = MOTIF('c3 c3 e3 d3 c3')
    maMelodie.note(3).part(coda)

… écrira la partie “CODA” sur la troisième note de la mélodie.

Autre exemple&nbsp;:

    STAFF(1).part(pont,{offset_x:10})

… écrira la marque de partie “PONT” sur la première portée (`STAFF(1)`) en la déplaçant de 10px vers la droite par rapport à la position courante du curseur de position.

####Paramètres

Comme pour la plupart des méthodes, les paramètres se mettent entre crochets. Ces paramètres sont les suivants&nbsp;:

PART("Refrain",{
  offset_x   : décalage horizontal de la marque,
  offset_y   : décalage vertical de la marque,
})

####Constantes partie

On peut utiliser ces constantes comme premier argument&nbsp;:

      La marque…            … écrira :
      ---------------------------------
      exposition            EXPOSITION
      expo                  EXPO.
      developpement         DÉVELOPPEMENT
      development           DEVELOPMENT
      dev                   DEV.
      pont                  PONT
      coda                  CODA
      themea                THÈME A
      tha                   TH. A
      themeb                THÈME B
      thb                   TH. B
      themec                THÈME C
      thc                   TH. C
      refrain               REFRAIN
      couplet               COUPLET

Si le nom de la partie n'est pas une constante, il faut la mettre entre guillemets.

####Réglage de la position de la marque de partie

On peut régler de façon absolue la marque de partie grâce à&nbsp;:

    DEFAULT('part_y', <position verticale>)
    DEFAULT('part_x', <position horizontale>)

On peut la définir par rapport au décalage actuel avec&nbsp;:
    
    DEFAULT('offset_part_y', <decalage vertical>)
    DEFAULT('offset_part_x', <decalage horizontal>)

On peut bien entendu, très ponctuellement, ajuster la position de la marque dans les paramètres envoyés à la méthode `part` (second argument), avec `offset_x` et `offset_y`.

*Comme pour tout décalage vertical, une valeur positive éloigne de la portée tandis qu'une valeur négative rapproche de la portée.*

<a name="create_texte_animation"></a>
###Créer un texte pour l'animation

Utiliser la commande&nbsp;:

    WRITE("<le texte>")
  
<a name="create_texte_objet"></a>
####Créer un texte pour un objet

Pour associer un texte à un objet, il faut bien sûr créer l'objet puis ensuite appeler sa méthode `write` (écrire)&nbsp;:

    maNote=NOTE(a4)
    maNote.write("C'est un LA 4")

<a name="creer_captions"></a>
###Créer des sous-titres

* [La commande `CAPTION`](#commande_caption)
* [Utilisation de sous-titre au lieu de doublage](#use_caption_as_soustitres)
* [Désactiver les doublages en cours d'élaboration de l'animation](#caption_omit)
* [Affichage temporisé du doublage](#affichage_temporised_doublage)
* [Désactiver le doublage temporisé](#desactiver_temporize)]
* [Effacer le sous-titre ou le doublage](#effacer_caption)

<a name="commande_caption"></a>
####La commande `CAPTION`

On peut vouloir créer des sous-titres pour deux raisons principales&nbsp;:

1. Afficher des explications en même temps que l'animation joue (vrais sous-titres qui seront lisibles dans l'animation)&nbsp;;
2. Comme pour un doublage, afficher un texte qui sera lu au cours de l'animation, donc affiché hors animation (qui ne sera pas visible dans l'animation finale).

Pour ces deux utilisations, on utilise la commande&nbsp;:

    CAPTION(<texte>[, <parameters>])
  
Cette commande affiche le texte `<texte>` à l'écran en respectant les paramètres optionnels `<parameters>`.

<a name="use_caption_as_soustitres"></a>
####Utilisation de sous-titres au lieu de doublages

Par défaut, le texte s'affichera comme un **texte de doublage**, donc hors du cadre de l'animation. Pour utiliser vraiment, PENDANT TOUTE L'ANIMATION, le texte en sous-titre (à l'intérieur de l'animation), alors définir&nbsp;:

    DEFAULT('caption', true)

On peut également définir localement qu'un texte doit être un doublage ou non grâce à la propriété `caption` dans les paramètres&nbsp;:

    CAPTION("Mon doublage", {caption:false})
    ou
    CAPTION("Mon doublage", {doublage:true})

    CAPTION("Mon sous-titre", {caption:true})

De façon encore plus simple, on peut envoyer un deuxième argument `true` pour dire que c'est un sous-titre ou `false` pour dire que c'est un texte de doublage. Mais dans ce cas, bien entendu, aucun autre paramètre ne peut être transmis contrairement aux syntaxes précédentes.

Par exemple&nbsp;:

    CAPTION("Mon doublage", false)

    CAPTION("Mon sous-titre", true)

<a name="affichage_temporised_doublage"></a>
####Affichage temporisé du doublage

Il est possible, au lieu d'afficher le texte des doublages comme un bloc, de les faire apparaitre petit à petit, au rythme de la parole.

Pour ce faire, ajouter au début de l'animation (ou à l'endroit où devra être activé cette fonctionnalité)&nbsp;:

    DEFAULT('caption_timer', true)

On peut régler le débit de parole avec&nbsp;:

    DEFAULT('caption_debit', <valeur>)
  
… où `<valeur>` est 1 par défaut, et le débit augmente à mesure que la valeur augmente et diminue quand la valeur se trouve entre 0 et 1 (p.e. `0.5` pour aller deux fois moins vite).
  
Quand le doublage est temporisé, on peut ajouter le paramètres `wait` au 2e argument de la commande `CAPTION`, ce qui aura pour effet de ne faire à l'étape suivante que lorsque tout le texte aura été dit.

    CAPTION("Mon doublage temporisé", {wait:true})
    
Dans le cas contraire, l'animation passera à l'étape suivante tout en écrivant le texte de façon temporisé.

####Affichage temporisé sur étapes suivantes

Plutôt que d'attendre la fin de l'écriture du doublage, on peut vouloir que l'animation joue certaines étapes sur l'écriture du doublage (donc sur le texte qui sera dit). Mais dans ce cas, si les étapes prennent moins de temps que l'écriture du doublage, et qu'un autre doublage est appelé, le premier doublage sera avorté, coupé avant la fin.

On peut remédier à cela grâce à la commande&nbsp;:

    WAIT_CAPTION

… *(qu'on peut obtenir en autocomplétion par `waic[TAB]`)* qui va attendre, après les étapes d'animation, la fin de l'écriture du doublage avant de passer à la suite.

Par exemple&nbsp;:

    # Il faut que les doublages soient "temporisés"
    DEFAULT('caption_timer', true)
    
    # ....
    CAPTION("Ceci est un doublage qui sera dit sur les étapes suivantes.")
    
    # Puisque CAPTION ci-dessus ne définit pas le paramètre {wait:true}, les
    # étapes suivantes seront jouées pendant que le doublage s'affichera
    maGamme = SCALE('c')
    maGamme.note([1,3,5]).surround()
    
    # Même si les deux étapes ci-dessus se terminent avant le doublage, on
    # attendra ici la fin de l'écriture du doublage avant de de passer à la suite
    WAIT_CAPTION


<a name="caption_omit"></a>
####Désactivation des doublages en cours d'élaboration de l'animation

Lorsqu'on est en train de mettre sur pied l'animation, il peut être intéressant de déactiver les doublages lorsqu'ils sont temporisés avec un paramètre `wait` à `true` qui fait attendre la fin de l'affichage.

Pour les désactiver, actionner le menu “Options > Omettre les doublages”.

Pour remettre cette fonction en route, actionner le menu devenu “Options > Jouer les doublages”.

<a name="desactiver_temporize"></a>
####Désactiver le doublage temporisé

Pour désactiver le double temporisé à un moment de l'animation, écrire à l'endroit où la fonctionnalité doit être désactivée&nbsp;:

    DEFAULT('caption_timer', false)

Noter aussi qu'on peut demander, pour se concentrer sur l'animation, demander à l'application d'omettre les doublages (cf. [Omettre les doublages](#caption_omit))

<a name="effacer_caption"></a>
####Effacer le sous-titre ou le doublage
Pour effacer le sous-titre ou le doublage, appeler la méthode sans argument ou utiliser un texte vide en premier argument. Par exemple, pour effacer le sous-titre actif&nbsp;:

    CAPTION("", {caption:true})
    CAPTION("", true)
    
Pour effacer le doublage&nbsp;:

    CAPTION()

<a name="set_position_texte"></a>
###Définition des position des textes

On peut définir les positions de façon générale, dans les préférences. Cf. [Réglage des valeurs par défaut](#set_preferences). Par défaut, les réglages sont pensés pour être efficace dans la plupart des situations, mais on peut avoir à les affiner dans les cas spéciaux.

On peut également modifier la position d'un texte en particulier. Pour cela voir&nbsp;:
* [Modifier la position verticale](#modify_vertical_position_texte)&nbsp;;
* [Modifier la position horizontale](#modify_horizontal_position_texte))&nbsp;;
* [Modifier la portée du texte](#modify_staff_of_texte).

<a name="modify_vertical_position_texte"></a>
####Modification de la position verticale

La position verticale peut se régler avec la propriété `offset_y` définie dans le second argument des méthodes de texte.

Par exemple&nbsp;:

    STAFF(1).write("Mon texte décalé", {offset_y: 50})

Cela aura pour effet de monter le texte de 50px par rapport à sa position "naturelle".

*Noter pour tous ces réglages qu'une valeur positive ÉLOIGNE toujours le texte de la portée tandis qu'une valeur négative le RAPPROCHE.*

Autre exemple pour place plus bas un texte d'harmonie d'un accord&nbsp;:

    monAccord = CHORD('2:g3 2:b3 d3 g3')
    monAccord.harmony("I", {offset_y:20})

La marque "I" de l'harmonie sera placé 20 pixels sous sa position naturelle.

<a name="modify_horizontal_position_texte"></a>
####Modifier la position horizontale

Définir la propriété `offset_x` dans les paramètres (2e argument) des méthodes de texte (`write`, `harmony`, etc.)

Par exemple pour écrire le texte 100px plus à gauche sur la deuxième portée&nbsp;:

    STAFF(2).write("Mon texte décalé", {offset_x:-100})

Pour placer le texte d'une cadence 20 pixels plus loin (plus à droite)&nbsp;:

    monAccord = CHORD('g3 b3 d3')
    monAccord.cadence("I", {type:parfaite, offset_x:20})

Bien entendu, on peut combiner la décalage horizontal et vertical&nbsp;:

    monAccord.chord("Cm7", {offset_y:10, offset_x:20})

… en évitant toutefois de trop modifier localement les valeurs, ce qui donnerait un moins bon aspect à l'animation. Il vaut mieux trouver des réglages généraux qui conviennent à la situation.

<a name="modify_staff_of_texte"></a>
####Modifier la portée du texte

Par défaut, la portée du texte est celle de son “possesseur” (l'accord, la note, etc.) ou le cas échéant la portée courante.

On peut néanmoins définir explicitement la portée de référence en définissant la propriété `staff` dans les paramètres envoyés à la méthode de texte (2e argument), avec en valeur l'indice (à partir de 1 et du haut) de la portée.

Par exemple, imaginons deux portées, avec comme portée active la portée 1, c'est-à-dire celle du haut. Sur cette portée, on écrit un accord, et on veut écrire en dessous la cadence. Mais on aimerait que cette cadence, au lieu d'apparaitre sous la première portée (qui est la portée de l'accord qui porte le texte), devra apparaitre sous la deuxième. Voici le code&nbsp;:

    NEW_STAFF(SOL)
    NEW_STAFF(FA)
    ACTIVE_STAFF(1)
    monAccord = CHORD('c4 g4 e4')
    monAccord.cadence("I", {staff:2, type:plagale})


<a name="supprimer_texte"></a>
###Supprimer un texte

<a name="supprimer_texte_objet"></a>
####Supprimer un texte d'objet

Pour supprimer le texte de l'objet, c'est-à-dire de le faire disparaitre de l'affichage, utiliser la méthode `hide` (cache le texte sans le détruire) ou `remove` (détruit l'objet DOM du texte) de l'objet&nbsp;:

    <note>.texte[<type>].hide() / remove()

Où `<type>` est le type de texte&nbsp;:
  
* 'regular' pour un texte normal (sans type)
* 'chord'   pour un accord
* 'cadence' pour une cadence
* 'harmony' pour une harmonie
* 'modulation' pour une modulation.
  
Par exemple&nbsp;:
  
    maNote=NOTE(a4)
    # Écrire le texte
    maNote.write("C'est un LA 4")
    # Attendre 2 secondes
    WAIT(2)
    # Supprimer le texte
    maNote.texte['regular'].hide()
  
Noter que cette méthode supprime l'affichage du texte, mais l'objet `texte` existe toujours pour l'objet et on peut le ré-utiliser plus tard, par exemple avec&nbsp;:

    maNote.texte['regular'].show()

… qui ré-affichera ce texte.

En revanche, si on utilise&nbsp;:

    maNote.texte['regular'].remove()

… alors l'objet sera vraiment détruit.


<a name="exporter_doublage"></a>
###Exporter le doublage d'une animation

On peut exporter tout le doublage d'une animation dans un unique fichier grâce au menu «&nbsp;Outils > Exporter le doublage&nbsp;».

Le texte est alors placé dans un fichier portant le même nom que l'animation, avec “-dbl” ajouté au nom.

Noter que seuls les textes de doublage sous exporté, pas sous-titres. Pour exporter les sous-titres, cf. la section suivante.


<a name="exporter_sous_titres">
###Exporter les sous-titres de l'animation

On peut exporter tous les sous-titres de l'animation dans un unique fichier grâce au menu «&nbsp;Outils > Exporter les sous-titres&nbsp;».

Les sous-titres sont placés dans un fichier portant le même nom que l'animation, avec "-stt" ajouté au nom.

---------------------------------------------------------------------

<a name="les_images"></a>
##Les images

###Table des matières

* [Ajouter une image](#insertion_image)
* [Modifier la taille de l'image](#modify_taille_image)
* [Modifier la position de l'image](#modify_position_image)
* [Déplacer l'image](#move_image)
* [Faire un zoom dans l'image](#zoom_image)
* [Modifier le cadrage de l'image](#modify_cadrage_image)
* [Bordure de couleur ou flou autour de l'image](#bordure_flou_image)
* [Modifier la source de l'image](#modify_source_image)
* [Ne pas construire l'image lors de l'instanciation](#dont_build_image)

<a name="insertion_image"></a>
###Ajouter une image

On peut insérer n'importe quelle image dans l'animation, par exemple une partition, grâce à la commande :

    IMAGE(<parametres>)
  
Par exemple&nbsp;:
  
    monImage = IMAGE({url:'path/to/monimage.png'})

Les paramètres peuvent être les suivants&nbsp;:

    monImg=IMAGE({
      url           : {String} <chemin vers image> ATTRIBUT OBLIGATOIRE
      x             : {Number} <position horizontale dans l'animation>
      y             : {Number} <position verticale dans l'animation>
      width         : {Number} <taille de l'image|auto>
      height        : {Number} <hauteur de l'image|auto>
      zoom          : {Number} Le pourcentage de zoom (surclasse width et height)
      // Propriétés pour le fond
      padding       : {Number} La marge autour de l'image (bordure)
      bg_color      : {String} La couleur de fond de l'image et de la bordure
      bg_opacity    : {Float}  Opacité de la marge (0 -> 1)
      bg_image      : {Boolean} Si false, le fond de l'image n'est pas opaque.
      // Propriétés pour le cadrage
      cadre_width   : {Number} <largeur de la portion à prendre dans l'image>
      cadre_height  : {Number} <hauteur de la portion à prendre dans l'image>
      inner_x       : {Number} <décalage horizontal de la portion d'image>
      inner_y       : {Number} <décalage vertical de la portion d'image
    })

* *Note&nbsp;: Toutes les mesures s'expriment en pixels (mais sans 'px', juste le nombre de pixels).*

* Noter que si `width` et `height` ne sont pas fournis, c'est la taille original de l'image qui sera prise en référence). Si une seule des deux valeurs est fournie, l'autre sera calculée en conséquence par rapport à la dimension originale (sans déformation).

Pour des informations concernant le “recadrage de l'image”, cf. [Modifier le cadrage de l'image](#modify_cadrage_image).

Noter que l'image est aussitôt construite est insérée dans l'animation avec les paramètres fournis, sauf si `build:false` est ajouté aux paramètres définissant l'image (cf. [Ne pas construire l'image](#dont_build_image)).

<a name="modify_taille_image"></a>
###Modifier la taille de l'image

Pour modifier la taille de l'image, on peut jouer sur les paramètres `width` et `height` ou le paramètre `zoom`.

Lorsque seule une des deux valeurs `width` ou `height` est fournie, la seconde est calculée en fonction de la taille originale de l'image pour n'obtenir aucune déformation.

Lorsque `zoom` est fourni, c'est une valeur proportionnelle qui détermine le grossissement ou la dimunie de l'image. La valeur `1` met l'image à sa taille normale, la valeur `2` doublera la taille de l'image tandis que `0.5` l'affichera deux fois plus petite.

<a name="modify_position_image"></a>
###Modifier la position de l'image

Pour modifier la position de l'image, il faut jouer sur les paramètres `y` (haut) et `x` (gauche) de ses paramètres optionnels. Par exemple&nbsp;:

    monImage=IMAGE({url:'path/to/image.png', y:100, x:200})

… placera l'image 100 pixels plus bas que le haut du cadre de l'animation et à 200 pixels du bord gauche.

Noter qu'il est extrêmement simple de connaitre les coordonnées de l'image&nbsp;: il suffit de la déplacer dans l'animation une fois qu'elle est affichée. Ses coordonnées s'affichent en bas de l'écran. Donc&nbsp;:

* Définir la commande d'affichage de l'image sans définir `y` et `x`&nbsp;;
* Faire jouer l'animation jusqu'au moment où l'image s'affiche&nbsp;;
* Se mettre en pause&nbsp;;
* Déplacer l'image au bon endroit&nbsp;;
* Relever les coordonnées qui s'affichent et définir `y` et `x` dans les paramètres de la commande IMAGE.

<a name="move_image"></a>
###Déplacer l'image

Pour déplacer l'image (pas la positionner mais l'animer en la changeant de place), utiliser sa méthode `move`&nbsp;:

    monImage = IMAGE({<parametres de l'image>})
    monImage.move({paramètres du déplacement})

On peut déplacer l'image en déterminant sa position finale à l'aide des paramètres `x` (position horizontale) et `y` (position verticale). La valeur est en pixels.

    monImage.move({x:300, y:100})

On peut déplacer l'image en déterminant le nombre de pixels de déplacement horizontal à l'aide de `for_x` ou vertical à l'aide de `for_y`&nbsp;:

    monImage.move({for_x:10, for_y:100})

Ou en combinant les deux formules&nbsp;:

    monImage.move({x:300, for_y:10})

On détermine le temps (durée) de déplacement de l'image à l'aide de la propriété `duree` qui détermine le nombre de secondes que mettra l'image pour atteindre sa nouvelle position (2 secondes par défaut)&nbsp;:

    monImage.move({for_x:10, for_y:100, duree:1})


<a name="zoom_image"></a>
###Zoom dans l'image

On peut faire un zoom dans l'image à l'aide de la méthode `zoom`&nbsp;:

    monImage = IMAGE({... définition ...})
    ...
    monImage.zoom(<paramètres du zoom>)
    # => Zoom dans l'image
    
Pour le zoom le plus simple, un argument unique, de type nombre, va indiquer le taux de grossissement ou de diminution de l'image (par rapport à la taille initiale). La valeur `1` fait revenir l'image à sa taille initiale, la valeur `2` double la taille de l'image, la valeur `0.5` diminue de moitié la taille de l'image. 

Avec cet argument unique, le grossissement se fait avec un centre au centre de l'image.

Par exemple&nbsp;:

    monImage.zoom(3)
    # => Grossis 3 fois la taille originale de l'image
    
Pour exécuter un zoom plus complexe, on doit définir la largeur de portion d'image à voir au final, ainsi que le positionnement de l'image à l'aide des paramètres&nbsp;:

    width     Largeur d'image (en taille réelle)
    inner_x   Décalage horizontal par rapport au 0 de l'image
    inner_y   Décalage vertical par rapport au 0 de l'image

Par exemple&nbsp;:

    monImage.zoom({width:100, inner_x:10, inner_y:10})

Pour obtenir très facilement ces valeurs, il suffit d'éditer l'image en double-cliquant dessus (après avoir jouer l'animation jusqu'à la faire apparaitre), puis de grossir ou diminuer l'image à l'aide des boutons “+” et “-” (et les touches modificatrices), et de déplacer le cadre rouge (sans le redimensionner puisqu'il représente la taille actuelle du cadre) jusqu'à obtenir l'effet voulu.

Cliquer ensuite sur “code” et copier-coller les valeurs du champ “Données pour ZOOM”.


<a name="modify_cadrage_image"></a>
###Modifier le cadrage de l'image

Plutôt que d'insérer tout un tas d'images, par exemple une image par portée de la partition, il est plus intéressant d'importer comme image la partition entière puis ensuite de “zoomer” (ou “cadrer”) sur certaines parties de l'image pour n'en faire apparaitre qu'une partie.

C'est ici que le cadrage entre en jeu.

Pour recadrer ou cadrer une image&nbsp;:

Si l'image est affichée (par exemple en fin d'animation ou après une pause), il suffit de double-cliquer dessus pour l'éditer (*Noter qu'il ne faut pas que la grille soit affichée pour pouvoir double-cliquer sur l'image. Pour masquer la grille : “Options > Masquer la grille”*).

Dans le cas contraire&nbsp;:

* Activer le menu “Outils > Cadrage image...”&nbsp;;
* Si l'image n'apparait pas, cliquer le bouton “Chercher toutes les images dans le code”&nbsp;;
* Cliquer sur l'aperçu de l'image à recadrer.<br>=> La fenêtre de recadrage s'ouvre.
* Utiliser le cadre rouge pour choisir un portion de l'image, celle qui sera visible. On peut le déplacer en cliquant à l'intérieur du cadre rouge puis en glissant la souris et on peut changer sa taille à l'aide du coin en bas à droite&nbsp;;
* Cliquer ensuite sur le bouton outil (à droite) correspondant à la commande désirée (puisque plusieurs options sont possibles à ce niveau là, depuis le simple code pour instancier l'image avec ce cadrage jusqu'à la commande pour faire un travelling sur l'image).

<a name="travelling_image"></a>
###Effectuer un travelling dans l'image

Si le cadrage de l'image le permet (ie si l'image réelle est plus grande que le cadrage qui est fait dedans), on peut exécuter un travelling grâce à la méthode `travelling` appliquée à l'image créée.

Noter que le “travelling” n'est pas à confondre avec le déplacement de l'image. Dans un déplacement de l'image (cf. [Déplacer l'image](#move_image)), l'image  bouge dans le cadre de l'animation, change de position. Dans un “travelling”, l'image reste à la même position dans le cadre de l'animation, c'est son contenu qui se déplace, comme lors d'un travelling de cinéma.

Par exemple&nbsp;:

    monImage = IMAGE({<parametres pour définir l'url et le cadrage>})
    ...
    monImage.travelling({<parametres du travelling>})

Cette méthode attend des paramètres qui vont définir le travelling. Ces paramètres sont&nbsp;:

    <image>.travelling({
      x       : {Number} La nouvelle position horizontale du cadrage
      OU
      for_x   : {Number} Le nombre de pixels de déplacement horizontal

      y       : {Number} La nouvelle position verticale du cadrage
      OU
      for_y   : {Number} Le nombre de pixels de déplacement vertical
  
      width   : {Number} La largeur du nouveau cadre (optionnel)
      height  : {Number} La hauteur du nouveau cadre (optionnel)
      zoom    : {Number} Peut remplacer `width` et `height` (pourcentage)
      
      duree : {Number} La durée du travelling en secondes (2 par défaut).
    })


Noter que pour obtenir les nouvelles coordonnées du cadrage, il suffit&nbsp;:

* d'éditer l'image (en double-cliquant dessus ou en utilisant le menu “Outils > Cadrage image...”)&nbsp;;
* De déterminer le cadrage de fin du travelling&nbsp;;
* De demander le code (bouton “-> Code” de l'édition)&nbsp;;
* De copier-coller le code donné dans le cadre “Paramètres travelling”.

<a name="bordure_flou_image"></a>
###Bordure de couleur et flou autour de l'image

On peut définir une border de couleur et une opacité de cette bordure pour créer un effet de flou (transparence) autour de l'image.

Pour cela, on joue sur les paramètres&nbsp;:

    padding         Nombre de pixels de la bordure
    bg_color        La couleur de la bordure
    bg_opacity      L'opacité de cette bordure

Par exemple, pour créer une transparence blanche bien visible autour de l'image&nbsp;:

    monImage = IMAGE({url:'path/de/mon/image.png', padding:40, bg_color:40, bg_opacity:0.7})

Noter que par défaut, le fond de l'image sera lui aussi de la couleur `bg_color`, mais complètement opaque.

Pour empêcher ce comportement, ajouter le paramètre&nbsp;:

    bg_image:false

<a name="modify_source_image"></a>
###Modifier la source de l'image

Plutôt que de détruire une image pour la remplacer par une autre, on peut simplement changer la source de l'image courante.

On modifie la source (ie le fichier de l'image) à l'aide de sa méthode `src`&nbsp;:

    monImage = IMAGE({url:'path/to/image_1.png'})
    WAIT(2)
    monImage.src('path/to/image_2.png')

<a name="dont_build_image"></a>
###Ne pas construire l'image

Pour ne pas construire l'image lors de son instanciation (par exemple pour pouvoir mettre la liste des images en début de code), ajouter `build:false` aux paramètres&nbsp;:

    monImage = IMAGE({url:'path/to/monimage.png', build:false})

Puis ensuite, à l'endroit où l'image doit être construite, utiliser :

    monImage.build()

---------------------------------------------------------------------

<a name="les_fleches"></a>
##Les flèches

###Table des matières

* [Introduction aux flèches](#intro_fleches)
* [Associer une flèche à un objet](#associer_fleche_a_objet)
* [Définition de la flèche (paramètres)](#definition_arrow)
* [Méthodes d'animation des flèches](#methodes_animation_fleches)
* [Angle des flèches](#angle_des_fleches)
* [Détruire la flèche](#remove_arrow)
* [Flèches indépendantes](#fleches_independantes)

<a name="intro_fleches"></a>
###Introduction

On peut créer des flèches indépendantes (cf. [Flèches indépendantes](#fleches_independantes)) mais le plus judicieux est de les associer à des objets, à commencer par des notes ou des accords.

<a name="associer_fleche_a_objet"></a>
###Associer des flèches à un objet

Pour associer une flèche à un objet quelconque (p.e. une note) on utilise la méthode (de l'objet) :

    <objet>.arrow([<identifiant fleche>, ]<parameters>)

Par exemple, pour faire partir une flèche vers le bas depuis une note&nbsp;:

    maNote=NOTE(a4)
    maNote.arrow({color:red, angle:90})

… ce qui produira une flèche rouge, partant de la note avec un angle de 90 degré (cf. ci-dessous [les angles](#angle_des_fleches)).

On peut créer autant de flèches pour l'objet que l'on veut. Il suffit pour cela d'ajouter un identifiant (sans premier argument comme identifiant, c'est la flèche d'identifiant `0` qui est prise en compte).

Par exemple&nbsp;:

    maNote = NOTE(c4)
    maNote.arrow('droite rouge', {color:red, angle:0})
    maNote.arrow('bas verte', {color:green, angle:45})

On fait ensuite référence à ces différentes flèches en faisant référence à leur identifiant&nbsp;:

    maNote.arrow('bas verte').rotate(20)
    # => Tourne la flèche 'bas verte' à l'angle 20
    maNote.arrow('droite rouge').colorize(blue)
    # => Colore la flèche 'droite rouge' en bleu.

<a name="definition_arrow"></a>
###Définition de la flèche

Lors de la création de la flèche avec la méthode `arrow` (ou ARROW pour une [flèche indépendante](#fleches_independantes)) on peut envoyer ces paramètres optionnels à la méthode&nbsp;:

    <objet>.arrow(['<id flèche>',]{
      width     : {Number} longueur fleche en pixels
      angle     : {Number} Angle en degres
      color     : {String} La couleur (constante ou string)
      offset_x  : {Number} Décalage horizontal par rapport à position normale
      offset_y  : {Number} Décalage vertical par rapport à position normale
      y         : {Number} Placement vertical de la fleche (pixels)
      x         : {Number} Placement horizontal de la fleche (pixels)
      height    : {Number} Hauteur de la fleche
    })

**`<objet>`** est “l'objet porteur” de la flèche, c'est par exemple une note.**

    maNote = NOTE(a4)
    maNote.arrow('fleche vers droite', {angle:0})

**`<id flèche>`** est l'identifiant optionnel de la flèche, utile si l'objet porteur doit porter plusieurs flèches.

Les valeurs **y** et **x** sont calculées automatiquement pour que la flèche soit placée correctement suivant l'objet porteur. On peut ajuster ponctuellement la valeur avec **offset_x** et 
**offset_y**.

L'**angle** est de 0 degré par défaut, c'est-à-dire que la flèche sera horizontale et pointera à droite (pour une autre valeur cf. [Angle des flèches](#angle_des_fleches)).

Pour la définition de **color** (la couleur) cf. [les constantes couleurs](#constantes_couleurs).


<a name="methodes_animation_fleches"></a>
###Méthodes d'animation des flèches

* [Faire tourner la flèche](#arrow_rotate)
* [Changer la taille de la flèche](#method_arrow_size)
* [Déplacer la flèche](#method_move_arrow)
* [Modifier la couleur de la flèche](#modifier_color_arrow)

<a name="arrow_rotate"></a>
####Faire tourner la flèche

    <fleche>.rotate(<angle>)
  
Par exemple, pour une flèche associée à une note&nbsp;:

    maNote=NOTE(c4)
    maNote.arrow()
    maNote.arrow().rotate(45)

<a name="method_arrow_size"></a>
####Changer la taille (longueur) de la flèche

    <fleche>.size(<longueur de la fleche>)

Par exemple&nbsp;:
  
    maNote=NOTE(b4)
    maNote.arrow('growup', {color:bleu})
    maNote.arrow('growup').size(100)

Produira une animation qui fera s'allonger (ou se rétrécir) la flèche de sa longueur actuelle à la longueur `100px`.

Noter que cette méthode **crée réellement une animation** c'est-à-dire fait varier sous nos yeux la taille de la flèche. Si on veut définir la taille de la flèche au départ, utiliser plutôt le paramètre `width` dans les paramètres envoyés à la création de la flèche (cf. [définition de la flèche](#definition_arrow)).

<a name="method_move_arrow"></a>
####Déplacer la flèche

Une flèche se déplace à l'aide de la méthode&nbsp;:

    <objet>.<fleche>([<id>]).move(<parameters>)
  
… où les paramètres peuvent être&nbsp;:
  
    move({
      x : {Number} Déplacement horizontal (en pixels)
      y : {Number} Déplacement vertical (en pixels)
    })

Par exemple, si une flèche associée à une note doit se déplacer en descendant et en se déplaçant vers la droite&nbsp;:

    maNote=NOTE(g4)
    maNote.arrow('bouge')
    WAIT(2)
    maNote.arrow('bouge').move({x:50, y:50}) <--

Une valeur positives produira toujours un déplacement vers la droite (->) pour `x` et un déplacement vers le bas pour `y`, un valeur négative produira un déplacement vers la gauche (<-) pour `x` et un déplacement vers le haut pour `y`.

<a name="modifier_color_arrow"></a>
####Modifier la couleur de la flèche

Pour modifier la couleur de la flèche, utiliser la méthode `colorize` :

    <objet porteur>.arrow([<id>]).colorize(<couleur>)

Par exemple&nbsp;:
  
    monAccord = CHORD('c4 e4 g4')
    monAccord.arrow({color:green})
    # => Une première flèche verte
    monAccord.arrow().colorize(blue)
    # => La colorize en blue
    
Pour les constantes couleur utilisable cf. [les constantes couleurs](#constantes_couleurs).

<a name="angle_des_fleches"></a>
###Angle des flèches

Repère pour la définition de l'angle d'une flèche&nbsp;:

    angle = 0   => flèche horizontale pointant à droite
    angle = 90  => flèche verticale pointant en bas
    angle = -90 => flèche verticale pointant en haut
    angle = 180 => flèche horizontale pointant à gauche

Noter que pour les valeurs entre 90 et -90 (donc pointant vers la gauche), il faut modifier le `x` de la flèche pour qu'elle ne traverse pas la note.

<a name="remove_arrow"></a>
###Détruire la flèche

Pour détruire la flèche (la retirer de l'affichage), utiliser sa méthode `remove`.

Par exemple&nbsp;:

    maNote=NOTE(c3)
    maNote.arrow()
    WAIT(2)
    maNote.arrow().remove() <--


<a name="fleches_independantes"></a>
###Flèches indépendantes

[TODO]


---------------------------------------------------------------------

<a name="les_boites"></a>
##Les Boites et les cadre

Les boites (box) permettent de dessiner des boites et des cadres (de forme, de couleur et de tailles diverses) dans l'animation.

###Table des matières

* [Créer une boite](#create_a_box)
* [Tous les types de boite](#types_de_box)
* [Créer un cadre](#create_a_cadre)
* [Créer un segment "U"](#create_a_box_segment)

<a name="create_a_box"></a>
###Créer une boite

On crée une boite à l'aide de la commande&nbsp;:

    BOX(<parameters>)
  
`BOX` “hérite” des [méthodes et des propriétés universelles de boites](#box_methods_and_properties), donc peut être manipulé et défini avec ces méthodes et propriétés.

<a name="types_de_box"></a>
###Types de boites

<dl>
  <dt>type:plain</dt>
  <dd>Pour une boite pleine, qui recouvrira une portion de l'animation.</dd>
  <dt>type:cadre</dt>
  <dd>Pour dessiner un cadre dans l'animation. cf. <a href="#create_a_cadre">Créer un cadre</a>.</dd>
  <dt>type:segment</dt>
  <dd>Pour dessiner une forme de segment, c'est-à-dire une sorte de "U". cf. <a href="#create_a_box_segment">Créer un segment</a>.</dd>
</dl>

<a name="create_a_cadre"></a>
###Créer un cadre

On crée un cadre à l'aide de la commande&nbsp;:

    BOX({type:cadre[, <autres parametres>]})

On peut définir la largeur de bordure du cadre (3 pixels par défaut) à l'aide du paramètres `border` définissant le nombre de pixels.

Par exemple&nbsp;

    monCadre = BOX({type:cadre, border:10})
    # Pour un cadre de 10 pixels de large
  
Pour définir la couleur du cadre, définir le paramètre `color`.

Par exemple&nbsp;:

    cadreBleu = BOX({type:cadre, color:blue})

Pour les autres méthodes et propriétés cf. [Méthodes et des propriétés universelles de boites](#box_methods_and_properties).

<a name="create_a_box_segment"></a>
###Créer un segment "U"

Un “segment en U” est une forme qui ressemble à&nbsp;:

                          _             _____             ____
    |__________| (up)    |  (right)    |     | (down)         | (left)
                         |_                               ____|

C'est grâce au paramètre `dir` qu'on détermine l'orientation du “U”&nbsp;:

    seg = BOX({type:segment, dir:down})

Par défaut, un segment se présente avec les “fourches” vers le haut, comme un “U”, donc `dir:up` correspond à ne rien mettre du tout. 

On peut décider de l'épaisser des branches à l'aide de `border` (nombre de pixels). Par défaut, l'épaisseur et de 1 pixel.

Noter que le paramètre pour régler la longueur des fourches varie en fonction de l'orientation. Pour un "U" vers le haut ou vers le bas, c'est la hauteur du segment qui importe, donc le paramètre `height`&nbsp;:

    seg = BOX({type:segment, dir:down, height:20 /* fourches de 20 pixels */})

Pour un "U" à droite ou à gauche, c'est le paramètre `width` qui déterminera les longueurs de fourche.

Pour les autres méthodes et propriétés cf. [Méthodes et des propriétés universelles de boites](#box_methods_and_properties).


---------------------------------------------------------------------


<a name="background_animation"></a>
##Fond de l'animation

On peut définir le fond de l'animation avec la commande&nbsp;:

    BACKGROUND([<couleur>][, <parametres>])
  
… où **couleur** est une constante couleur CSS (p.e. 'blue' ou 'red') et `<parametrs>` sont les paramètres optionnels. La couleur peut être omise (un seul argument paramètres) ou être mise dans les paramètres avec&nbsp;:
  
    BACKGROUND({background:'<couleur>'})
  
`BACKGROUND` est un raccourci de `BOX` pour faire une boite qui occupe toute la surface de l'animation, avec un z-index de bas niveau. On peut donc utiliser les mêmes paramèters et les mêmes méthodes que [les boites](#les_boites).

---------------------------------------------------------------------

<a name="box_methods_and_properties"></a>
##Méthodes et propriétés universelles de boites

Tous les objets qui héritent de ces méthodes et propriétés peuvent les utiliser. Par exemples les [boites (Box)](#les_boites) et les [fond d'animation](#background_animation).

###Table des matières

**Propriétés de l'objet**

* [Résumé de toutes les propriétés](#bump_all_properties)
* [Effet de simultanéité](#bump_quasi_simultane)
* [La méthode `set`](#bump_set)
* [Régler la position horizontale](#bump_set_x)
* [Régler la position verticale](#bump_set_y)
* [Régler la position avant/arrière de l'objet](#bump_set_z)
* [Régler la largeur de l'objet](#bump_set_width)
* [Régler la hauteur de l'objet](#bump_set_height)
* [Régler la rotation de l'objet](#bump_set_rotation)
* [Régler la couleur de fond de l'objet](#bump_set_background)
* [Régler la couleur alternative pour le dégradé](#bump_set_gradient)
* [Régler l'opacité de l'objet (transparence)](#bump_set_opacity)

**Méthodes**

* [Résumé de toutes les méthodes](#bump_all_methods)
* [Modifier l'objet](#bump_set)
* [Fondu de l'objet](#bump_fading)
* [Déplacement de l'objet](#bump_moving)
* [Détruire l'objet](#bump_removing)

<a name="bump_all_properties"></a>
###Résumé de toutes les propriétés

    <var> = <OBJET>({
      x           : {Number} Position horizontale,
      y           : {Number} Position verticale,
      width       : {Number} Largeur,
      height      : {Number} Hauteur,
      z           : {Number} Placement devant/derrière,
      background  : {String} Couleur du fond,
      gradient    : {String} Couleur alternative pour le dégradé,
      opacity     : {Float}  Opacité,
      color       : {String} Couleur de la police ou du cadre,
      rotation    : {Number} L'angle (en degrés) à donner à la boite
      # Pour la méthode `set`
      x           : {Number} Position horizontale exacte
      offset_x    : {Number} Décalage horizontal
      y           : {Number} Position verticale exacte
      offset_y    : {Number} Décalage vertical
      width       : {Number} Largeur exacte
      offset_w    : {Number} Delta largeur (modification relative de la largeur)
      height      : {Number} Hauteur exacte
      offset_h    : {Number} Delta hauteur (modification relative de la hauteur)
      rotation    : {Number} Angle de rotation à donner
    })

<a name="bump_all_methods"></a>
###Résumé de toutes les méthodes

<dl>
  <dt>set</dt>
  <dd>Modifie une propriété quelconque ou plusieurs propriétés en même temps. cf. <a href="#bump_set">Modifier l'objet</a></dd>
  <dt>move</dt>
  <dd>Déplacement de l'objet. Cf. <a href="#bump_moving">Déplacer l'objet</a>. Noter qu'on peut objet la même chose avec `set`, avec la possibilité de modifier en même temps d'autres valeurs.</dd>
  <dt>fade</dt>
  <dd>Crée un fondu. cf. <a href="#bump_fading">Fondu de l'objet</a></dd>
</dl>



<a name="bump_quasi_simultane"></a>
###Effet de simultanéité

Un autre paramètre intéressant à la création d'un objet héritant des méthodes et propriétés universelles de boite est le paramètre `wait`. S'il est faux (false) cela permet de passer à l'étape suivante sans attendre la fin de l'apparition de l'objet.

Cela permet des effets pour l'apparition quasi-simultanée de plusieurs boites ou animations diverses. 

Par exemple&nbsp;:

    boite1 = TBOX("Un premier texte", {wait:false, duree:4})
    # La boite1 apparaitra en 4 secondes, mais on passe à la suite avant
    # la fin de son apparition
    boite2 = TBOX("Un autre texte", {wait:false, duree:3})
    # La boite2 apparaitra en 3 secondes mais on passe à la suite immédiatement
    boite3 = TBOX("Un troisième", {duree:2})
    # La boite3 apparaitra en 2 secondes, mais on attendra la fin de son apparition
    # pour passer à la suite.

<a name="bump_set_x"></a>
###Régler la position horizontale

On la règle avec le paramètre `x` en fournissant un nombre (l'unité sera le pixel).

Par exemple :

    maboite = BOX({x:100})

Pour obtenir cette position x, il suffit de déplacer l'objet (les coordonnées apparaissent dans la feedback en bas à gauche de l'écran). On peut également utiliser l'[Outil “Coordonnées”](#outil_coordonnees).

<a name="bump_set_y"></a>
###Régler la position verticale

On la règle avec le paramètre `y` en fournissant un nombre (l'unité sera le pixel).

Par exemple :

    maboite = BOX({y:100})

Pour obtenir cette position `y`, il suffit de déplacer l'objet (les coordonnées apparaissent dans la feedback en bas à gauche de l'écran). On peut également utiliser l'[Outil “Coordonnées”](#outil_coordonnees).

<a name="bump_set_z"></a>
###Régler la position du calque

On peut régler la position de l'objet par rapport aux autres objets, dans l'axe `z` (ie. devant ou derrière) à l'aide du paramètre `z`.

Par exemple&nbsp;:

    boitedevant   = BOX({z: 200})
    boitederriere = BOX({z: 10})
    # Même si elle a été créée après, `boitederriere` se retrouvera
    # derrière `boitedevant`.

<a name="bump_set_width"></a>
###Régler la largeur de l'objet

On la règle avec le paramètre `width` en fournissant un nombre (l'unité sera le pixel).

Par exemple :

    maboite = BOX({width:100})

On peut obtenir cette valeur `width` à l'aide de l'[Outil “Coordonnées”](#outil_coordonnees).

<a name="bump_set_height"></a>
###Régler la hauteur de l'objet

On la règle avec le paramètre `height` en fournissant un nombre (l'unité sera le pixel).

Par exemple :

    maboite = BOX({height:100})

On peut obtenir cette valeur `height` à l'aide de l'[Outil “Coordonnées”](#outil_coordonnees).

<a name="bump_set_rotation"></a>
###Régler la rotation de l'objet

On règle l'angle de rotation d'une boite à l'aide de la propriété `rotation`, qui définit l'angle à donner à la boite.

Par exemple&nbsp;:

    maBoite = BOX({x:100, y:50, width:50, height:50, rotation:-30})
    # => Produit une boite inclinée de 30 degrés
    
<a name="bump_set_background"></a>
###Régler la couleur de fond de l'objet

On la règle avec le paramètre `background` en fournissant une couleur ({String}). Soit une constante couleur CSS, soit une valeur hexadécimale précédée de '#' (p.e. `#FF0000`).

Par exemple&nbsp;:

    maboite = BOX({background:'blue'})

<a name="bump_set_gradient"></a>
###Créer un dégradé

On crée un dégradé en utilisant les propriétés `background` qui définit la couleur gauche de départ et `gradient` qui définit la couleur droite d'arrivée.

Par exemple :

    boitedegrade = BOX({background:'blue', gradient:'red'})

Ou&nbsp;:

    boitedegrade = BOX({background:'#00F', gradient:'#F00'})


<a name="bump_set_opacity"></a>
###Régler l'opacité de l'objet

On la règle à l'aide du paramètre `opacity` en donnant une valeur flottante de `0` (complètement translucide, donc invisible) à `1` (complètement opaque).

Par exemple&nbsp;:

    maboitetransparente = BOX({opacity:0.05})


<a name="bump_set"></a>
###Modifier l'objet

La méthode `set` invoquée sur l'objet permet de modifier n'importe quelle propriété et même plusieurs propriétés en même temps.

**Syntaxe 1**

    <objet>.set('<propriété>', <nouvelle valeur>[, <parametres optionnels>])

**Syntaxe 2**

    <objet>.set({<hash des propriétés>}[, <paramètres optionnels>])

Cf. les [Propriétés modifiable de l'objet](#bump_all_properties).

Par exemple, pour déplacer une boite pleine verticalement en modifiant son opacité&nbsp;:

    maPlainBox.set({y:200, opacity:0.08})

####Paramètres optionnels

Les deux paramètres optionnels sont `duree` qui détermine en combien de secondes devra se produire le changement et `wait` qui détermine soit que l'on doit passer tout de suite à l'étape suivante sans attendre la fin du changement (si `false`) soit le temps d'attente (si un nombre flottant ou entier de secondes).

Par exemple, pour modifier la position horizontale de l'objet (`x`) en 10 secondes et passer à l'étape suivante après 2 secondes&nbsp;:

    monObjet.set('x', 320, {duree:10, wait:2})

ou&nbsp;:

    monObjet.set({x:320}, {duree:10, wait:2})


<a name="bump_moving"></a>
###Déplacement de l'objet

L'objet héritant des méthodes universelles de boite peut être déplacé à l'aide de la méthode `move`.

Cette méthode reçoit principalement trois arguments&nbsp;: `x` qui détermine la nouvelle position horizontale, `y` qui définit la nouvelle position verticale et `duree` qui définit la durée que devra prendre le déplacement, en secondes.

Par exemple&nbsp;:

    maboite = BOX({x:100, y:10})
    WAIT(1)
    maboite.move({x:200, y:10, duree:10})
    # La boite se déplacera vers la droite en 10 secondes
    
**Autres paramètres**

On peut également utiliser les paramètres `for_x` et `for_y` pour indiquer le nombre de pixels de déplacement par rapport à la position courante.

Par exemple&nbsp;:

    maboite = BOX({x:100, y:20})
    WAIT(1)
    maboite.move({for_x:200, for_y:-10})
    # La boite se retrouvera à la position x = 300 (100 + 200) et à la
    # position y = 10 (20 - 10)

**Astuce pour définir le mouvement**

Pour définir de façon simple le mouvement, le plus aisé est de déterminer la position x/y d'arrivée (simplement en déplaçant l'objet pour en prendre les coordonnées), puis de retirer la valeur voulue pour définir le point de départ (entendu que souvent le point d'arrivée est plus important).

Par exemple&nbsp;:

Après déplacement, j'ai déterminé que mes coordonnées d'arrivée sont x=320 et y=144.

Donc je code =

    maboite.move({x:320, y:144})

Ensuite, j'ajoute la création de la boite AU-DESSUS de cette ligne avec un décalage&nbsp;:

    maboite = BOX({x:320 - 100, y: 144 - 60})
    WAIT(1)
    maboite.move({x:320, y:144})

<a name="bump_fading"></a>
###Fondu de l'objet

La méthode `fade` permet de fondre l'objet (noter que cela revient à faire un show ou hide très lent).

La méthode peut s'appeler sans argument, puisqu'elle détecte automatiquement le type de fondu (d'ouverture ou de fermeture) qu'il faut opérer.

Par exemple&nbsp;:

    maboite = BOX({hidden:true})
    # La boite sera masquée à la création grâce à `hidden:true`
    maboite.fade()
    # La boite apparaitra
    WAIT(2)
    # Et après 2 secondes…
    maboite.fade()
    # … la boite disparaitra


<a name="bump_removing"></a>
###Destruction de l'objet

On détruit l'objet comme les autres objets grâce à la méthode `remove`.

Par exemple&nbsp;:

    maBoite.remove()

Noter que la méthode passe à l'étape suivante sans attendre. Pour faire disparaitre l'objet de façon plus fluide, il est préférable d'appeler avant la méthode `hide` ou `fade`. Par exemple&nbsp;:

    maBoite.hide({duree:5})
    ... quelque chose qui se passe ici
    maBoite.remove()
    # Détruit la boite une fois qu'elle n'est plus visible à l'écran
    
---------------------------------------------------------------------

<a name="set_preferences"></a>
##Régler les valeurs par défaut

On peut régler à tout moment (et en particulier au début de l'animation) toutes les valeurs par défaut, particulièrement tout ce qui concerne les positionnements.

###Table des matières

* [Réglage de la vitesse](#prefs_speed)
* [Réglage du temps de décompte (section “Animation”)](#set_decompte)
* [Astuce pour le réglage des positions](#prefs_tips_reglage)
* [Réglage de la position des portées](#prefs_staves)
* [Réglage de la position horizontale initiale (curseur)](#prefs_x_start)
* [Réglage de l'avancée à chaque NEXT (curseur)](#prefs_set_next)
* [Position des textes d'harmonie et de cadence](#prefs_position_harmony)
* [Position des marques d'accord](#prefs_position_chord)
* [Position de la marque de modulation](#prefs_position_modulation)
* [Taille des notes](#prefs_note_size)
* [Ré-initialiser toutes les valeurs par défaut](#prefs_reinitialiser_default)

<a name="prefs_speed"></a>
###Réglage de la vitesse

    DEFAULT({speed: <coefficiant>})

Ou&nbsp;:

    DEFAULT('speed', <coefficiant>)

… où `<coefficiant>` est un nombre différent de zéro, qui accélère l'animation s'il est < 1 (p.e. `0.5`) et qui la ralentit s'il est supérieur à 1 (p.e. `5`)

**Pour remettre les valeurs par défaut**

    DEFAULT('speed')

<a name="prefs_tips_reglage"></a>
###Astuce pour le réglage des positions

Ci-dessous, on peut découvrir le fonctionnement de la commande `DEFAULT` pour redéfinir des valeurs de l'animation, et notamment des positionnements d'élément.

Pour pouvoir trouver la valeur-pixel à affecter, le mieux est de procéder ainsi&nbsp;:

1. Trouver dans ce manuel le paramètre à modifier pour obtenir le positionnement recherché.
2. Une fois ce paramètre déterminé, regarder sa valeur actuelle dans le bloc des infos de l'animation (qui doit se trouver en bas à droite de la page). Au bout d'une ligne commençant par ce paramètre, vous pouvez trouver sa valeur.
3. Ensuite, déplacer la règle de mesure (en bas à gauche de l'animation — l'animation, pas la page) à l'endroit du changement pour estimer les nouvelles valeurs à donner (50, 100 et 150 sont en pixels).
4. Régler le paramètre avec la valeur estimée et essayer.

Noter qu'on peut aussi, grâce à l'outil “Coordonnées” obtenir les coordonnées exacts des éléments à l'écran (cf. [Outil “Coordonnées”](#outil_coordonnees)).

<a name="prefs_staves"></a>
###Réglage de la position des portées

**Pour régler la position verticale de la première portée&nbsp;:**

    DEFAULT('staff_top', <nombre de pixels>)
  
Ou&nbsp;:

    DEFAULT({staff_top: <nombre de pixels>})
  
Pour remettre la valeur par défaut&nbsp;:
  
    DEFAULT('staff_top')
    
*Noter que si cette valeur est modifiée en cours d'animation (à la volée), cela affectera la position des portées suivantes.*

**Pour régler la position horizontale par défaut** (décalage par rapport à la marge gauche)

    DEFAULT('staff_left', <nombre pixels>)
  
Ou&nbsp;:

    DEFAULT({staff_left: <nombre pixels>})

Pour remettre la valeur par défaut&nbsp;:

    DEFAULT('staff_left')
  
**Pour régler l'espace vertical entre les portées&nbsp;:**

    DEFAULT('staff_offset', <nombre de pixels>)

Ou&nbsp;:

    DEFAULT({staff_offset: <nombre de pixels>})

Pour remettre la valeur par défaut&nbsp;:

    DEFAULT('staff_offset')

<a name="prefs_x_start"></a>
###Réglage de la position horizontale initiale

Cette position correspond à la position du “curseur”, c'est-à-dire l'endroit où seront marqués les premiers éléments sur la portée (hors clé, armure et métrique).

    DEFAULT('x_start', <nombre pixels>)

Ou&nbsp;:

    DEFAULT({x_start: <nombre pixels>})

Pour remettre la valeur par défaut&nbsp;:
  
    DEFAULT('x_start')

Pour déterminer facilement la valeur, cf. [Astuces pour le réglage des positions](#prefs_tips_reglage).

<a name="prefs_set_next"></a>
###Réglage de la position `next`

La position `next` détermine de combien de pixels le “curseur” se déplacera à droite lorsque la commande `NEXT` sera utilisée (déterminant la position où seront créés les prochains objets)

**Pour la régler de façon absolue**

    DEFAULT({next: <nombre pixels>})

Ou&nbsp;:

    DEFAULT('next', <nombre pixels>)
  
**Pour la régler de façon relative**

(par rapport au `next` courant)

    DEFAULT({offset_next: <nombre de pixels>})

Ou&nbsp;:

    DEFAULT('offset_next', <nombre pixels>)

**Pour remettre les valeurs par défaut**

    DEFAULT('next')
    DEFAULT('offset_next')

Pour déterminer facilement la valeur, cf. [Astuces pour le réglage des positions](#prefs_tips_reglage).

<a name="prefs_position_harmony"></a>
###Réglage de la position des textes d'harmonie et de cadence

*(Pour les marques d'harmonie et de cadence, cf. [Types spéciaux de texte](#types_speciaux_texte))*

**Pour la régler de façon absolue**

    DEFAULT({harmony: <nombre de pixels>})

Ou&nbsp;:

    DEFAULT('harmony', <nombre pixels>)

**Pour la régler de façon relative** (par rapport à décalage courant)

    DEFAULT({offset_harmony: <nombre de pixels>})

Ou&nbsp;:

    DEFAULT('offset_harmony', <nombre pixels>)

On peut utiliser aussi la commande spéciale&nbsp;:

    OFFSET_HARMONY(<nombre de pixels>)

**Pour remettre les valeurs par défaut**

    DEFAULT('harmony')
    DEFAULT('offset_harmony')

Pour déterminer facilement la valeur, cf. [Astuces pour le réglage des positions](#prefs_tips_reglage).

####Placement des textes d'harmonie et de cadenece sur une portée précise

Par défaut, les marques d'harmonie et de cadence se place sous la portée de l'objet qui possède ces textes (l'accord, la note, etc.). On peut cependant forcer l'affichage de ce texte, de façon générale (c'est-à-dire pour tous les textes d'harmonie et de cadence à partir de cette définition) grâce au réglage de&nbsp;:

    DEFAULT('staff_harmony', <indice portée>)

Par exemple, pour que ces textes s'affichent sur la 2e portée, même quand la première portée est active ou que l'objet qui porte le texte se trouve sur la première portée&nbsp;:

    DEFAULT('staff_harmony', 2)

Après cette définition, toutes les marques d'harmonie et de cadence se placeront sous la deuxième portée.

Par rappel, on peut aussi définir cette position au moment de la définition de l'harmonie ou de la cadence grâce à la propriété `staff` :

    monAccord.harmony("V**", {staff:2})

… mais ça ne modifie la position QUE pour cette marque d'harmonie.

<a name="prefs_position_chord"></a>
###Réglage de la position des marques d'accord

*(Pour les marques d'accords, cf. [Types spéciaux de texte](#types_speciaux_texte))*

**Pour régler la position de façon absolue**

    DEFAULT({chord: <nombre de pixels>})

Ou&nbsp;:

    DEFAULT('chord', <nombre pixels>)

**Pour régler la position de façon relative** (par rapport à décalage courant)

    DEFAULT({offset_chord: <nombre de pixels>})

Ou&nbsp;:

    DEFAULT('offset_chord', <nombre pixels>)

On peut utiliser aussi la commande spéciale&nbsp;:

    OFFSET_CHORD_MARK(<nombre de pixels>)

**Pour remettre les valeurs par défaut**

    DEFAULT('chord')
    DEFAULT('offset_chord')

Pour déterminer facilement la valeur, cf. [Astuces pour le réglage des positions](#prefs_tips_reglage).

<a name="prefs_position_modulation"></a>
###Réglage de la marque de modulation

Pour placer la marque de modulation, on peut utiliser pour la position verticale et la position horizontale une valeur absolue ou une valeur relative (relative aux positions actuelles).

**Régler la position horizontale absolue**

    DEFAULT('modulation_x', <nombre de pixels>)
  
Ce `<nombre de pixels>` sera retiré au `x`, donc si le nombre est positif, la marque recule vers la gauche.
  
Pour revenir à la position par défaut&nbsp;:
  
    DEFAULT('modulation_x')
  
Pour déterminer facilement la valeur, cf. [Astuces pour le réglage des positions](#prefs_tips_reglage).

  
**Régler la position horizontale relative**

Pour modifier la position relativement à la position courante&nbsp;:

    DEFAULT('offset_modulation_x', <nombre de pixels de decalage>)

**Régler la position verticale absolue**

    DEFAULT('modulation_y', <pixels par rapport au haut de la portée>)
  
**Régler la position verticale relative**

    DEFAULT('offset_modulation_y', <décalage par rapport à la position courante>)

Un nombre positif baissera la marque, un nombre négative la remontera.

**Régler la longueur du trait oblique**

    DEFAULT('modulation_width', <nombre de pixels>)

Ou&nbsp;:

    DEFAULT({modulation_width: <nombre de pixels>})

<a name="prefs_note_size"></a>
###Réglage de la taille des notes

*Note&nbsp;: C'est une donnée qu'il vaut mieux ne pas modifier puisqu'elle est calculée automatiquement par rapport à la taille de la portée.*

    DEFAULT('note_size', <hauteur en pixel (flottant)>)
  
Ou&nbsp;:
  
    DEFAULT({note_size: <hauteur en pixel>})
    
Pour remettre la valeur par défaut&nbsp;:
    
    DEFAULT('note_size')

<a name="prefs_reinitialiser_default"></a>
###Ré-initialiser toutes les valeurs par défaut

Pour remettre toutes les valeurs aux valeurs par défaut, utiliser la commande (SANS PARENTHÈSES)&nbsp;:

    RESET_PREFERENCES

---------------------------------------------------------------------

<a name="method_exec"></a>
##Exécuter du code

La commande `EXEC` permet d'exécuter du code. C'est une commande de débuggage.

Par exemple&nbsp;:

    EXEC('now_start()')
    # => Place un point de départ temporel
    ... animation ...
    EXEC('now()')
    # => Écrit en console le nombre de secondes et millisecondes écoulées
    #    depuis `now_start`

Pour écrire un message en console depuis le code, on peut utiliser&nbsp;:

    EXEC('dlog("<le message à écrire>")')

---------------------------------------------------------------------

<a name="lannexe"></a>
##Annexe

* [Constantes couleurs](#constantes_couleurs)

<a name="constantes_couleurs"></a>
###Constantes couleurs

La **color** (couleur) d'un objet quelconque est noire par défaut (une note, une flèche, etc.). 

Pour modifier sa couleur, on peut utiliser ces constantes couleur (les valeurs françaises sont des valeurs valides aussi)&nbsp;:

    black   noir
    white   blanc
    red     rouge
    blue    bleu
    green   vert
    grey    gris
    orange

    background_color    La couleur de fond de l'animation (blanc cassé)