#Staff Animation

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
* [Régler toutes les valeurs de l'animation](#set_preferences)


<a name="l_animation"></a>
##Animation

###Table des matières

* [Introduction](#intro_animation)
* [Composer le code de l'animation](#code_composition)
  * [Commentaires dans le code](#code_comments)
  * [Faire une pause](#pause_animation)
  * [Se déplacer sur la portée](#move_on_staff)
  * [Écrire un texte général](#texte_animation)
  * [Resetter l'animation](#reset_animation)
  * ["Nettoyer" l'animation (tout effacer)](#clean_animation)
* [Vitesse de l'animation](#vitesse_animation)
* [Jouer l'animation](#run_animation)
* [Enchainer des animations](#enchainer_animations)
* [Activer/désactiver le Mode “Flash](#mode_flash)
* [Définir le décompte de départ](#set_decompte)
* [Sauvegarde automatique](#autosave_code)
* [Ré-initialiser toutes les valeurs de préférences](#reiniti_preferences)
* [Définir l'animation courante comme animation par défaut](#set_anim_courante_as_default)

###Réinitialiser les préférences

<a name="intro_animation"></a>
###Introduction

Une animation est composée de `pas` (step) qui vont être exécutés l'un après l'autre, produisant des choses aussi diverses que&nbsp;:

* L'apparitioin d'une portée&nbsp;;
* L'écriture d'une note ou d'un accord sur la portée&nbsp;;
* Le déplacement de notes&nbsp;;
* L'écriture de textes explicatifs&nbsp;;
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
    WAIT(4)                 // 4 secondes avant de construire l'accord
    monAccord('c3 eb3 g3')
  
*Note&nbsp;: C'est un “pas” comme les autres, donc il doit être mis sur une ligne seule comme toute étape.*

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

Pour jouer l'animation, cliquer simplement sur le bouton “Play” ou sur la barre espace.

Si un autre choix que l'animation entière avait été fait, sélectionner l'item «&nbsp;Jouer tout&nbsp;» dans le menu «&nbsp;Animation&nbsp;» ou presser le raccourci clavier CMD+0.

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

<a name="enchainer_animations"></a>
###Enchainer des animations

Le code d'une animation pouvant très vite devenir conséquent, on peut enchainer très facilement des animations. Il suffit pour cela d'utiliser la commande&nbsp;:

    SUITE('<nom ou chemin de l'animation>)
    
On peut mettre cette commande où l'on veut dans le code, puisqu'elle ne sera interprétée qu'une fois l'animation courante exécutée. Il est donc possible de la mettre au début du code comme à la fin.

<a name="mode_flash"></a>
###Activer/désactiver le mode “Flash”

Le mode “Flash” permet de jouer très rapidement une partie de l'animation. C'est utile lorsqu'une partie est calée, mais qu'on ne veut pas la rejouer systématiquement au même rythme pour atteindre la portion en cours d'élaboration.

On peut aussi l'utiliser pour accélérer un ensemble de modifications qui pourraient se faire en même temps.

Pour passer en mode flash&nbsp;:

    MODE_FLASH        ou      FLASH

Pour stopper le mode flash et revenir à la vitesse normale

    STOP_MODE_FLASH   ou      STOP_FLASH

Dans ce cas, on met le code à passer entre&nbsp;:

    MODE_FLASH
    ..............
    ...  code  ...
    ...   à    ...
    ... passer ...
    ..............
    STOP_MODE_FLASH

*Noter que le résultat ne sera pas du tout le même que si l'on commentait les lignes de code à passer, puisque l'animation ne se trouverait peut-être pas dans le même état.*

<a name="set_decompte"></a>
###Régler le décompte

Par défaut, l'animation attend deux secondes avant de démarrer.

On peut régler sa valeur par&nbsp;:

DEFAULT('decomte', <nombre de secondes>)

*Mettre `0` pour supprimer tout décompte.*

<a name="autosave_code"></a>
###Sauvegarde automatique

En activant le menu “Options > Activer Auto-Save”, tous les modifications apportées au code seront automatiquement enregistrées.

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
* [Régler du pas entre chaque déplacement (NEXT())](#set_pas_next)
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

On peut également effectuer un déplacement précis en indiquant le nombre de pixels en argument.

    NEXT([<nombre pixels>])

Par exemple, pour déplacer le curseur de position de 100px vers la gauche (donc un retour en arrière)&nbsp;:

    NEXT(-100)
    // => les notes suivantes s'écriront 100px plus à gauche

<a name="set_pas_next"></a>
###Régler le pas entre chaque NEXT()

Cf. [Réglage de la position next](#prefs_set_next)

<a name="move_cursor_to_depart"></a>
###Revenir au début des portées (RESET_CURSOR)

Pour revenir au début des portées, on peut bien entendu utiliser la commande précédente avec un nombre négatif. Si l'on se trouve à la position 500, il suffit d'indiquer&nbsp;:

    NEXT(-500)

… pour se replacer au début.

Mais une commande permet d'effecter ce retour plus simplement, sans connaitre la position courante&nbsp;:

    RESET_CURSOR

Cela remet automatiquement le curseur au début, donc à gauche, en tenant compte des altérations et métriques que peuvent contenir les portées.

*Pour modifier cette position de début, utiliser la commande `DEFAULT('x_start', <nouvelle valeur>)` (cf. [Réglage de la position horizontale initiale (curseur)](#prefs_x_start)).*

<a name="set_cursor_to_position"></a>
###Placer le curseur à une position précise (SET_CURSOR)

Pour placer la curseur à une position précise, utiliser la commande&nbsp;:

    SET_CURSOR(<position left en pixel>)
    
Par exemple, pour se positionner à 100px exactement&nbsp;:

    SET_CURSOR(100)

Les prochains `NEXT()` partiront de cette nouvelle position.



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

<a name="designation_notes"></a>
###Désignation des notes

Les notes doivent être désignées par :

    <nom note><alteration><octave>

* On désigne le `nom des notes` par une seule lettre, anglaise, de "a" (la) à "g" (sol).
* L'altération est soit rien (note naturelle), soit un signe (cf. ci-dessous "b", "d", "x", ou "t").
* Vient ensuite l'octave, un nombre, négatif si nécessaire (*mais pour le moment, on va seulement jusqu'à l'octave 0, les autres ne sont pas gérés*).

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

    <nom variable note>.moveTo(<nouvelle note>[,<params>])
    
Exemple&nbsp;:

    maNote=NOTE(a4) // crée la note LA 4
    maNote.moveTo(g4) // descend la note vers SOL4

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
    nosi.moveTo(b2)
    # => Le si est déplacé mais le do
    #    reste décalé à droite

Dans ce cas (avant que ce bug #49 ne soit corrigé), on peut utiliser la méthode `update` sur la note pour la remettre bien en place&nbsp;:

    ...
    nosi.moveTo(b2)
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
* [Liste des paramètres optionnels](#parametres_motif)
* [Régler la distance entre les notes](#set_hoffset_notes_motif)
* [Modifier la vitesse d'affichage du motif](#regler_vitesse_affichage_motif)

<a name="creer_un_motif"></a>
###Créer un motif

monMotif = MOTIF('<suite de notes>'[, <parametres optionnels>])
  
Par exemple&nbsp;:

unMotif = MOTIF('c4 c4 c4 d4 e4 d4 c4 e4 d4 d4 c4')

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

    <nom accord>.note(<indice note>)
  
… où `<indice note>` est l'indice 1-start (1 = première note fournie).
  
Par exemple&nbsp;:

    accDom=CHORD('c3 eb3 g3')
    accDom.note(1).moveTo('c4')
    // Prends la première note (c3) et la déplace en c4.

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

<a name="chord_remove"></a>
###Destruction d'un accord

Pour détruire l'accord, utiliser&nbsp;:

    <nom variable accord>.remove()

---------------------------------------------------------------------

<a name="les_staves"></a>
##Les portées

###Table des matières

* [Créer une portée](#create_staff)
* [Activer une portée](#active_staff)
* [Récupérer une portée](#recuperer_staff)
* [Supprimer les lignes supplémentaires](#remove_suplines)
* [Placer un texte sur la portée](#ecrire_texte_portee)

<a name="create_staff"></a>
###Créer une portée

Pour créer une portée, utiliser le pas&nbsp;:

    NEW_STAFF(<cle>[, <params>])

… où `<cle>` peut être `SOL`, `FA`, `UT3`, `UT4`.
  
… et `<params>` peut contenir :
  
    NEW_STAFF(<cle>, {
      offset : decalage supplementaire par rapport à précédente (pixels)
    })
  
*Noter que par défaut, il y aura toujours un décalage entre deux portées créées, ce `offset` ne fait qu'aggrandir l'espacement (s'il est positif) ou le rétrécir (s'il est négatif)*

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
    note.moveTo(c5)

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
  
---------------------------------------------------------------------

<a name="les_gammes"></a>
##Les gammes

###Table des matières

* [Introduction](#introduction_gammes)
* [Paramètres de définition des gammes](#parametres_gammes)
* [Utilisation des notes de la gammes](#utilisation_notes_gammes)

<a name="introduction_gammes">
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
  <dd>Le décalage horizontal pour commencer la gamme. Par défaut le décalage courant (la position du “pointeur”).</dd>
  <dt>asc : {Boolean}</dt>
  <dd>Si TRUE (défaut), la gamme sera ascendante, sinon, elle descendra.</dd>
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
  
Cet `indice` est “1-start”, c'est-à-dire que la première note porte l'indice 1, la seconde note porte l'indice 2, etc.
  
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
* [Créer un texte](#create_texte)
  * [Types spéciaux de texte (Accords, harmonie, cadences, etc.)](#types_speciaux_texte)
  * [Créer un texte pour l'animation](#create_texte_animation)
  * [Créer un texte pour un objet](#create_texte_objet)
  * [Créer un texte pour la portée (section “Portée”)](#ecrire_texte_portee)
  * [Créer des sous-titres (réels ou doublage)](#creer_captions)
* [Définir les positions des textes](#set_position_texte)
* [Supprimer un texte](#supprimer_texte)
  * [Supprimer le texte d'un objet](#supprimer_texte_objet)


<a name="intro_textes"></a>
###Introduction

Les textes peuvent exister pour l'animation en général (ils sont alors écrits en haut à gauche et chaque nouveau texte remplace l'ancien), mais ils peuvent être associés aussi à tout objet de l'animation, note, portée, mesure, barre, etc.

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

*[La commande `CAPTION`](#commande_caption)
*[Utilisation de sous-titre au lieu de doublage](#use_caption_as_soustitres)
*[Affichage temporisé du doublage](#affichage_temporised_doublage)
*[Désactiver le doublage temporisé](#desactiver_doublage_temporised)]
*[Effacer le sous-titre ou le doublage](#effacer_caption)

<a name="commande_caption"></a>
####La commande `CAPTION`

On peut vouloir créer des sous-titres pour deux raisons principales&nbsp;:

1. Afficher des explications en même temps que l'animation joue (vrais sous-titres)&nbsp;;
2. Comme pour un doublage, afficher un texte qui sera lu au cours de l'animation, donc affiché hors animation.

Pour ces deux utilisations, on utilise la commande&nbsp;:

    CAPTION(<texte>[, <parameters>])
  
Cette commande affiche le texte `<texte>` à l'écran en respectant les paramètres optionnels `<parameters>`.

<a name="use_caption_as_soustitres"></a>
####Utilisation de sous-titres au lieu de doublages

Par défaut, le texte s'affichera comme un texte de doublage, donc hors de l'écran. Pour utiliser vraiment, PENDANT TOUTE L'ANIMATION, le texte en sous-titre (à l'intérieur de l'animation), alors définir&nbsp;:

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
  
Quand le doublage est temporisé, on peut ajouter le paramètres `wait` au 2e argument de la commande `CAPTION`, ce qui aura pour effet de faire patienter l'animation en attendant que le texte soit dit.

    CAPTION("Mon doublage temporisé", {wait:true})
    
Dans le cas contraire, l'animation passera à l'étape suivante tout en écrivant le texte de façon temporisé.

<a name="desactiver_doublage_temporised"></a>
####Désactiver le doublage temporisé

Pour désactiver le double temporisé à un moment de l'animation, écrire à l'endroit où la fonctionnalité doit être désactivée&nbsp;:

    DEFAULT('caption_timer', false)

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

Pour supprimer le texte de l'objet, c'est-à-dire de le faire disparaitre de l'affichage, utiliser la méthode `hide` (cacher) ou `remove` du texte de l'objet&nbsp;:

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

---------------------------------------------------------------------

<a name="les_images"></a>
##Les images

###Table des matières

* [Ajouter une image](#insertion_image)
* [Modifier la position de l'image](#modify_position_image)
* [Déplacer l'image](#move_image)
* [Modifier le cadrage de l'image](#modify_cadrage_image)
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
      url     : <chemin vers image> ATTRIBUT OBLIGATOIRE
      x       : <position horizontale dans l'animation>
      left    : // comme `x`, utiliser l'un ou l'autre
      y       : <position verticale dans l'animation>
      top     : // comme `y`, utiliser l'un ou l'autre
      width   : <taille de l'image|auto>      ATTRIBUT OBLIGATOIRE 
      height  : <hauteur de l'image|auto>     ATTRIBUT OBLIGATOIRE
      // Propriétés spéciales pour le cadrage, lorsque l'on ne veut pas
      // utiliser toute l'image, mais seulement une portion de l'image
      cadre_width     : <largeur de la portion à prendre dans l'image>
      cadre_height    : <hauteur de la portion à prendre dans l'image>
      cadre_offset_x  : <décalage horizontal de la portion d'image>
      cadre_offset_y  : <décalage vertical de la portion d'image
    })

*Note&nbsp;: Toutes les mesures s'expriment en pixels (mais sans 'px', juste le nombre de pixels).*

Noter que le `width` et le `height` sont obligatoires (c'est à moitié vrai, puisque s'ils ne sont pas fournis, c'est la taille de l'image qui est prise en référence). Leur valeur peut être `auto` et dans ce cas elle est calculée automatiquement par rapport à la valeur qui est fournie.

Pour des informations concernant le “recadrage de l'image”, cf. [Modifier le cadrage de l'image](#modify_cadrage_image).

Noter que l'image est aussitôt construite est insérée dans l'animation avec les paramètres fournis, sauf si `build:false` est ajouté aux paramètres définissant l'image (cf. [Ne pas construire l'image](#dont_build_image)).

<a name="modify_position_image"></a>
###Modifier la position de l'image

Pour modifier la position de l'image, il faut jouer sur les paramètres `top` (haut) et `left` (gauche) de ses paramètres optionnels. Par exemple&nbsp;:

    monImage=IMAGE({url:'path/to/image.png', top:100, left:200})

… placera l'image 100 pixels plus bas que le haut du cadre de l'animation et à 200 pixels du bord gauche.

Noter qu'il est extrêmement simple de connaitre les coordonnées de l'image&nbsp;: il suffit de la déplacer dans l'animation une fois qu'elle est affichée. Ses coordonnées s'affichent en bas de l'écran. Donc&nbsp;:

* Définir la commande d'affichage de l'image sans définir `top` et `left`&nbsp;;
* Faire jouer l'animation jusqu'au moment où l'image s'affiche&nbsp;;
* Se mettre en pause&nbsp;;
* Déplacer l'image au bon endroit&nbsp;;
* Relever les coordonnées qui s'affichent et définir `top` et `left` dans les paramètres de la commande IMAGE.

<a name="move_image"></a>
###Déplacer l'image

Pour déplacer l'image (pas la positionner mais l'animer en la changeant de place), utiliser sa méthode `move`&nbsp;:

    monImage = IMAGE({<parametres de l'image>})
    monImage.move({paramètres du déplacement})

On peut déplacer l'image en déterminant sa position finale à l'aide des paramètres `x` (position horizontale) et `y` (position verticale). La valeur est en pixels.

    monImage.move({x:300, y:100})

On peut déplacer l'image en déterminant le nombre de pixels de déplacement horizontal à l'aide de `x_for` ou vertical à l'aide de `y_for`&nbsp;:

    monImage.move({x_for:10, y_for:100})

Ou en combinant les deux formules&nbsp;:

    monImage.move({x:300, y_for:10})

On détermine le temps (durée) de déplacement de l'image à l'aide de la propriété `seconds` qui détermine le nombre de secondes que mettra l'image pour atteindre sa nouvelle position (2 secondes par défaut)&nbsp;:

    monImage.move({x_for:10, y_for:100, seconds:1})


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
      x_for   : {Number} Le nombre de pixels de déplacement horizontal

      y       : {Number} La nouvelle position verticale du cadrage
      OU
      y_for   : {Number} Le nombre de pixels de déplacement vertical
  
      width   : {Number} La largeur du nouveau cadre (optionnel)
      height  : {Number} La hauteur du nouveau cadre (optionnel)
      seconds : {Number} La durée du travelling en secondes (2 par défaut).
    })


Noter que pour obtenir les nouvelles coordonnées du cadrage, il suffit&nbsp;:

* d'éditer l'image (en double-cliquant dessus ou en utilisant le menu “Outils > Cadrage image...”)&nbsp;;
* De déterminer le cadrage de fin du travelling&nbsp;;
* De demander le code (bouton “-> Code” de l'édition)&nbsp;;
* De copier-coller le code donné dans le cadre “Paramètres travelling”.

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
On peut créer des flèches indépendantes (cf. [Flèches indépendantes](#fleches_independantes)) mais le plus judicieux est de les associer à des objets, à commencer par des notes.

<a name="associer_fleche_a_objet"></a>
###Associer une flèche à un objet

Pour associer une flèche à un objet quelconque (p.e. une note) on utilise la méthode (de l'objet) :

    arrow(<parameters>)

Par exemple, pour faire partir une flèche d'une note&nbsp;:

    maNote=NOTE(a4)
    maNote.arrow({color:red, angle:90})

… ce qui produira une flèche rouge, partant de la note avec un angle de 90 degré (cf. ci-dessous [les angles](#angle_des_fleches)).

<a name="definition_arrow"></a>
###Définition de la flèche

Lors de la création de la flèche avec la méthode `arrow` (ou ARROW pour une [flèche indépendante](#fleches_independantes)) on peut envoyer ces paramètres optionnels à la méthode&nbsp;:

    maNote.arrow({
      width:  {Number} longueur fleche en pixels
      angle:  {Number} Angle en degres
      color:  {String} La couleur (constante ou string)
      top:    {Number} Placement vertical de la fleche (pixels)
      left:   {Number} Placement horizontal de la fleche (pixels)
      height: {Number} Hauteur de la fleche
    })

Les valeurs **top** et **left** sont calculées automatiquement pour que la flèche soit placée correctement à droite de l'objet.

L'**angle** est de 0 degré par défaut, c'est-à-dire que la flèche sera horizontale et pointera à droite (pour une autre valeur cf. [Angle des flèches](#angle_des_fleches)).

La **color** (couleur) est noire par défaut. On peut utiliser toutes les constantes de couleur pré-définies, c'est-à-dire (les valeurs françaises sont des valeurs valides aussi)&nbsp;:

    black   noir
    red     rouge
    blue    bleu
    green   vert
    grey    gris
    orange

<a name="methodes_animation_fleches"></a>
###Méthodes d'animation des flèches

* [Faire tourner la flèche](#arrow_rotate)
* [Changer la taille de la flèche](#method_arrow_size)
* [Déplacer la flèche](#method_move_arrow)


<a name="arrow_rotate"></a>
####Faire tourner la flèche

    <fleche>.rotate(<angle>)
  
Par exemple, pour une flèche associée à une note&nbsp;:

    maNote=NOTE(c4)
    maNote.arrow()
    maNote.arrow.rotate(45)

<a name="method_arrow_size"></a>
####Changer la taille (longueur) de la flèche

    <fleche>.size(<longueur de la fleche>)

Par exemple&nbsp;:
  
    maNote=NOTE(b4)
    maNote.arrow({color:bleu})
    maNote.arrow.size(100)

Produira une animation qui fera s'allonger la flèche de sa longueur actuelle à la longueur `100px`.

Noter que cette méthode **crée réellement une animation** c'est-à-dire fait varier sous nos yeux la taille de la flèche. Si on veut définir la taille de la flèche au départ, utiliser plutôt le paramètre `width` dans les paramètres envoyés à la création de la flèche (cf. [définition de la flèche](#definition_arrow)).

<a name="method_move_arrow"></a>
####Déplacer la flèche

Une flèche se déplace à l'aide de la méthode&nbsp;:

    <fleche>.move(<parameters>)
  
… où les paramètres peuvent être&nbsp;:
  
    move({
      x : {Number} Déplacement horizontal (en pixels)
      y : {Number} Déplacement vertical (en pixels)
    })

Par exemple, si une flèche associée à une note doit se déplacer en descendant et en se déplaçant vers la droite&nbsp;:

    maNote=NOTE(g4)
    maNote.arrow()
    WAIT(2)
    maNote.arrow.move({x:50, y:50}) <--

Une valeur positives produira toujours un déplacement vers la droite (->) pour `x` et un déplacement vers le bas pour `y`, un valeur négative produira un déplacement vers la gauche (<-) pour `x` et un déplacement vers le haut pour `y`.

<a name="angle_des_fleches"></a>
###Angle des flèches

Repère pour la définition de l'angle d'une flèche&nbsp;:

    angle = 0   => flèche horizontale pointant à droite
    angle = 90  => flèche verticale pointant en bas
    angle = -90 => flèche verticale pointant en haut
    angle = 180 => flèche horizontale pointant à gauche

Noter que pour les valeurs entre 90 et -90 (donc pointant vers la gauche), il faut modifier le `left` de la flèche pour qu'elle ne traverse pas la note.

<a name="remove_arrow"></a>
###Détruire la flèche

Pour détruire la flèche (la retirer de l'affichage), utiliser sa méthode `remove`.

Par exemple&nbsp;:

    maNote=NOTE(c3)
    maNote.arrow()
    WAIT(2)
    maNote.arrow.remove() <--


<a name="fleches_independantes"></a>
###Flèches indépendantes

[TODO]

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
###Position de la marque de modulation

Pour placer la marque de modulation, on peut utiliser pour la position verticale et la position horizontale une valeur absolue ou une valeur relative (relative aux positions actuelles).

**Régler la position horizontale absolue**

    DEFAULT('modulation_x', <nombre de pixels>)
  
Ce `<nombre de pixels>` sera retiré au `left`, donc si le nombre est positif, la marque recule vers la gauche.
  
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

-
