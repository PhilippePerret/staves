#Staff Animation

(Animation de portée)

Cette application permet de faire des animations musicales (écrites), à des fins pédagogiques, pour les insérer dans des screencasts.

* [Animation](#animation)
* [Les notes](#les_notes)
* [Les accords](#chords)
* [Les portées](#les_staves)
* [Les gammes](#les_gammes)
* [Les textes](#les_textes)


---------------------------------------------------------------------

<a name="animation"></a>
##Création d'une animation

###Table des matières

* [Introduction](#intro_animation)
* [Composer le code de l'animation](#code_composition)
  * [Commentaires dans le code](#code_comments)
  * [Faire une pause](#pause_animation)
  * [Avancer sur la portée](#left_staff)
  * [Écrire un texte général](#texte_animation)
  * [Resetter l'animation](#reset_animation)
  * ["Nettoyer" l'animation (tout effacer)](#clean_animation)

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

<a name="left_staff"></a>
####Se déplacer sur la portée

La commande pour écrire à la suite des dernières notes sur la portée, on utilise la commande&nbsp;:

    LEFT([<nombre pixels>])
  
Par défaut (sans argument), le déplacement sera de 40px (`Anim.defaut.hoffset`). Sinon, le déplacement sera de la valeur précisée.

Par exemple&nbsp;:

    LEFT() 
    // => les notes suivantes s'écriront 40px plus à gauche

    LEFT(100)
    // => les notes suivantes s'écriront 100px plus à gauche

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
* [Entourer une note (exergue plus forte)](#entourer_une_note)
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
  
* `b` pour bémol
* `t` (comme "ton") pour double bémol
* `d` pour dièse
* `x` pour double-dièse

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

    <variable name>=NOTE(<note>)
  
* `<variable>` peut avoir le nom qu'on veut, HORMIS un nom de constante, comme `a5`.
* La `<note>` peut être soit un string soit une constante (cf. [Désignation des notes](#designation_notes))
* Une telle séquence (un pas) ne doit pas comporter d'espaces.

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
    maNote.exergue()   # => note en couleur
    WAIT(4)
    maNote.unexergue()  # => etat normal

Cf. aussi [Entourer une note](#entourer_une_note) ci-dessous.

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


<a name="note_remove"></a>
###Détruire d'une note

Pour détruire la note (la supprimer de l'affichage, utiliser :

    <nom variable note>.remove()
  

---------------------------------------------------------------------

<a name="chords"></a>
##Les Accords

###Table des matières
*[Création d'un accord](#chord_creation)
*[Référence aux notes de l'accord](#chord_ref_note)
*[Destruction d'un accord](#chord_remove)

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

On fait appel aux notes de l'accord par :

    <nom accord>[<indice note>]
  
… où `<indice note>` est l'indice 1-start.
  
Par exemple&nbsp;:

    accDom=CHORD('c3 eb3 g3')
    accDom[1].moveTo('c4')
    // Prends la première note (c3) et la déplace en c4.
  
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
* [Supprimer les lignes supplémentaires](#remove_suplines)

<a name="create_staff"></a>
###Créer une portée

Pour afficher une portée, utiliser le pas&nbsp;:

    NEW_STAFF(<clé>)

… où `<cle>` peut être `SOL`, `FA`, `UT3`, `UT4`.
  
Par exemple&nbsp;:
  
    NEW_STAFF(SOL)
  
… qui affichera une portée en clé de sol en dessous de la dernière portée.

*Noter que cette portée deviendra la portée active, c'est-à-dire celle où seront placées les objets définis par la suite.*

<a name="active_staff"></a>
###Activer une portée

Activer une portée signifie que tous les pas suivants la viseront. Par exemple, les notes se déposent toujours sur la portée active.

    ACTIVE_STAFF(<indice de la portee>)
  
… où `<indice de la portee>` est son rang dans l'affichage, en partant de 1 et du haut. Donc la portée la plus en haut s'active par :
    
    ACTIVE_STAFF(1)
    
    
<a name="remove_suplines"></a>
###Supprimer des lignes supplémentaires

Pour le moment, la suppression de lignes supplémentaires n'est pas automatique, afin de laisser toute liberté à la programmation de l'animation.

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

Comme pour tout “groupe de notes” (accord, motif, etc.) les notes de la gamme peuvent être ensuite traitées séparément, comme des notes “normales”.

Soit une gamme&nbsp;:

    maGamme=SCALE('d')

On récupère ses notes par&nbsp;:

    maGamme[<indice note>]
  
Cet `indice` est “1-start”, c'est-à-dire que la première note porte l'indice 1, la seconde note porte l'indice 2, etc.
  
Par exemple, si je veux poser un texte sur la deuxième note&nbsp;:
  
    maGamme[2].write("Une seconde !")

Comme pour tout “groupe de notes”, si l'on veut mettre un élément (note) du groupe dans une variable, ce code n'est pas possible&nbsp;:

    maNote=maGamme[2]
    maNote.write("Une seconde !") # => # ERREUR #

Pour ce faire, il faut impérativement utiliser&nbsp;:

    maNote=Anim.Objects.maGamme[2]
    maNote.write("Une seconde !")
  

---------------------------------------------------------------------

<a name="les_textes"></a>
##Les Textes

###Table des matières

* [Introduction aux textes](#intro_textes)
* [Créer un texte](#create_texte)
  * [Créer un texte pour l'animation](#create_texte_animation)
  * [Créer un texte pour un objet](#create_texte_objet)
* [Supprimer un texte](#supprimer_texte)
  * [Supprimer le texte d'un objet](#supprimer_texte_objet)
  
<a name="intro_textes"></a>
###Introduction

Les textes peuvent exister pour l'animation en général (ils sont alors écrits en haut à gauche et chaque nouveau texte remplace l'ancien), mais ils peuvent être associés aussi à tout objet de l'animation, note, portée, mesure, barre, etc.

<a name="create_texte"></a>
###Créer un texte

<a name="create_texte_animation"></a>
####Créer un texte pour l'animation

Utiliser la commande&nbsp;:

    WRITE("<le texte>")
  
<a name="create_texte_objet"></a>
####Créer un texte pour un objet

Pour associer un texte à un objet, il faut bien sûr créer l'objet puis ensuite appeler sa méthode `write` (écrire)&nbsp;:

    maNote=NOTE(a4)
    maNote.write("C'est un LA 4")

<a name="supprimer_texte"></a>
###Supprimer un texte

<a name="supprimer_texte_objet"></a>
####Supprimer un texte d'objet

Pour supprimer le texte de l'objet, c'est-à-dire de le faire disparaitre de l'affichage, utiliser la méthode `hide` (cacher) du texte de l'objet&nbsp;:

    <note>.texte.hide()
  
Par exemple&nbsp;:
  
    maNote=NOTE(a4)
    # Écrire le texte
    maNote.write("C'est un LA 4")
    # Attendre 2 secondes
    WAIT(2)
    # Supprimer le texte
    maNote.texte.hide()
  
Noter que cette méthode supprime l'affichage du texte, mais l'objet `texte` existe toujours pour l'objet et on peut le ré-utiliser plus tard, par exemple avec&nbsp;:

    maNote.texte.show()

… qui ré-affichera ce texte.