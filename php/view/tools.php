<?php
/*
 Section "Tools" qui contient les différents éléments utiles pour la gestion
  générale, le choix d'une animation, l'enregistrement sous un autre nom, etc.
*/
?>
<section id="tools" style="display:none;">
  <div id="tool_animations" style="display:none;">
    <div class="titre">Choisir l'animation</div>
    <!-- Le menu contenant les animations courantes (et les dossier )-->
    <select id="folders_animations" onchange="$.proxy(UI.Tools.on_choose_folder, UI.Tools)()"></select>
    <select id="animations" size="10" ondblclick="$.proxy(UI.Tools.open_anim_or_folder, UI.Tools)()"></select>
  </div>
  <div id="tool_save_as" style="display:none;">
    <div class="titre">Dossier et nom de l'animation courante</div>
    <select id="animation_folder"></select>
    <input type="text" id="animation_name" style="width:calc(100% - 1em);" onfocus="this.select()" />
    <div class="small italic" style="padding:1em;margin-top:2em;border:1px solid #eee;">
      Pour créer un nouveau dossier, définir le nom comme<br />“dossier/subdossier/../nom animation”.<br />Mais noter que ce dossier sera créé en partant du dossier choisi dans le menu ci-dessus.
    </div>
  </div>
  
  <div class="buttons">
    <input type="button" class="fleft" value="Renoncer" onclick="$.proxy(UI.Tools.on_click_cancel, UI.Tools)()" />
    <input id="tools_btn_ok" type="button" value="OK" onclick="$.proxy(UI.Tools.on_click_ok, UI.Tools)()" />
  </div>
</section>

<!-- La règle à mesurer, draggable -->
<div id="regle"></div>