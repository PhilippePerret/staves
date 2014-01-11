<?php
  
?>
<section id="tools">
  
  <select id="animations" onchange="$.proxy(Anim.load, Anim, this.value)()"></select>
  
  <input id="btn_save_anim" type="button" value="Sauver" onclick="$.proxy(Anim.save, Anim)()" />
  <input id="btn_reload_anim" type="button" value="Reload" onclick="$.proxy(Anim.reload, Anim)()" />
  
  <div>
    <input type="button" value="Sauver comme…" onclick="$.proxy(Anim.save_as, Anim)()" />
    <input type="text" id="animation_name" style="width:200px;" onfocus="this.select()" />
    <input type="button" value="Aide" onclick="aide()" />
  </div>
</section>

<!-- La règle à mesurer, mais posée où on veut -->
<div id="regle">
  <div id="regle50" class="mesregle">50</div>
  <div id="regle100" class="mesregle">100</div>
  <div id="regle150" class="mesregle">150</div>
  <div class="divregle" style="width:50px;"></div>
  <div class="divregle" style="width:100px;left:50px;"></div>
  <div class="divregle" style="width:150px;left:150px;"></div>
</div>