<?php
/*
 Section "Tools" qui contient les différents éléments utiles pour la gestion
  générale, le choix d'une animation, l'enregistrement sous un autre nom, etc.
*/
?>
<section id="tools" style="display:none;">
  <div id="tool_animations" style="display:none;">
    <div class="titre">Choisir l'animation</div>
    <!-- Le menu contenant les animations courantes -->
    <select id="animations" onchange="$.proxy(Anim.load, Anim, this.value)()" size="10"></select>
  </div>
  <div id="tool_save_as" style="display:none;">
    <div class="titre">Définir le nom sous lequel doit être enregistré l'animation courante</div>
    <input type="text" id="animation_name" style="width:200px;" onfocus="this.select()" />
    <input type="button" value="Sauver" onclick="$.proxy(Anim.save_as, Anim)()" />
  </div>
  
  <div class="buttons">
    <input type="button" value="OK" onclick="$.proxy(UI.Tools.hide_section, UI.Tools)()" />
  </div>
</section>

<!-- La règle à mesurer, draggable -->
<div id="regle"></div>