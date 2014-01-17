<?php
  // Les pop ups supérieurs
  /*
   * Notes
   * -----
   * Si un menu est ajouté, il suffit d'ajouter la méthode correspondant à son
   * `data-item` (très exactement le même nom) dans l'objet UI.Popups.Methods
   *
   */

  // Command, Control, Alt, Entree, Escape
  function scut($nom)
  {
    return "<img src=\"../lib/img/clavier/K_${nom}.png\" />";
  }
  // ⌘ ⌥ ⌅ ⌫
?>
<section id="app_popups">
  
  <!-- MENU "Fichier" -->
  <ul id="popup_fichier" class="app_popup" style="width:80px">
    <li class="first">Fichier</li>
    <li class="separateur"></li>
    <li data-item="open"><span class="fright">⌘O</span>Ouvrir…</li>
    <li data-item="new"><span class="fright">⌘N</span>Nouvelle animation</li>
    <li data-item="reload"><span class="fright">⌘R</span>Recharger l'animation</li>
    <li class="separateur"></li>
    <li data-item="save"><span class="fright">⌘S</span>Enregistrer</li>
    <li data-item="save_as"><span class="fright">⇧⌘N</span>Enregistrer sous…</li>
    <li class="separateur"></li>
    <li data-item="def_anim">Définir comme Anim par défaut</li>
    <li class="last"></li>
  </ul>
  
  <!-- MENU "Options" -->
  <ul id="popup_options" class="app_popup" style="width:82px">
    <li class="first">Options</li>
    <li class="separateur"></li>
    <li data-item="autosave">Activer Auto-Save</li>
    <li data-item="grid">Masquer la grille</li>
    <li class="separateur"></li>
    <li data-item="fullscreen">Anim en plein écran</li>
    <li class="last"></li>
  </ul>
  
  <!-- MENU "Outils" -->
  <ul id="popup_outils" class="app_popup" style="width:82px">
    <li class="first">Outils</li>
    <li class="separateur"></li>
    <li data-item="infos">Informations courantes</li>
    <li data-item="coordonnees">Activer coordonnées</li>
    <li data-item="cadrage">Cadrage image…</li>
    <li class="separateur"></li>
    <li data-item="manual">Manuel d'utilisation</li>
    <li class="last"></li>
  </ul>
  
  <!-- Menu "Animation" -->
  <ul id="popup_animation" class="app_popup" style="width:104px">
    <li class="first">Animation</li>
    <li class="separateur"></li>
    <li data-item="play::all"><span class="fright">⌘0</span>Jouer tout</li>
    <li data-item="play::selection"><span class="fright">⌘1</span>Jouer la sélection</li>
    <li data-item="play::repairs"><span class="fright">⌘2</span>Jouer entre #!START et #!END</li>
    <li data-item="play::from_cursor"><span class="fright">⌘3</span>Jouer depuis le curseur</li>
    <li data-item="play::stepbystep"><span class="fright">⌘4</span>Jouer Pas à pas</li>
  </ul>
</section>