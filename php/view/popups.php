<?php
  // Les pop ups supérieurs
  /*
   * Notes
   * -----
   * Si un menu est ajouté, il suffit d'ajouter la méthode correspondant à son
   * `data-item` (très exactement le même nom) dans l'objet UI.Popups.Methods
   *
   */
?>
<section id="app_popups">
  
  <!-- MENU "Fichier" -->
  <ul id="popup_fichier" class="app_popup">
    <li class="first">Fichier</li>
    <li class="separateur"></li>
    <li data-item="reload">Recharger l'animation</li>
    <li data-item="open">Ouvrir…</li>
    <li data-item="save">Enregistrer</li>
    <li data-item="save_as">Enregistrer sous…</li>
    <li data-item="def_anim">Définir comme Anim par défaut</li>
  </ul>
  
  <!-- MENU "Options" -->
  <ul id="popup_options" class="app_popup">
    <li class="first">Options</li>
    <li class="separateur"></li>
    <li data-item="grid">Masquer la grille</li>
    <li data-item="fullscreen">Anim en plein écran</li>
  </ul>
  
  <!-- MENU "Outils" -->
  <ul id="popup_outils" class="app_popup">
    <li class="first">Outils</li>
    <li class="separateur"></li>
    <li data-item="infos">Informations courantes</li>
    <li data-item="cadrage">Cadrage image…</li>
    <li data-item="manual">Manuel d'utilisation</li>
  </ul>
</section>