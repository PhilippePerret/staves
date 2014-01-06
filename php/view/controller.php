<?php
  
?>
<section id="controller">
  <div class="buttons">
    <div style="display:inline-block;" class="fleft">
      <input type="checkbox" id="cb_mode_show_step" onclick="$.proxy(Anim.def_mode_show_step, Anim, this.checked)()" />
      <label for="cb_mode_show_step">Afficher courante</label>
    </div>
    <div style="display:inline-block;" class="fleft">
      <input type="checkbox" id="cb_mode_pas_a_pas" onclick="$.proxy(Anim.def_mode_pas_a_pas, Anim, this.checked)()" />
      <label for="cb_mode_pas_a_pas">Mode pas à pas</label>
    </div>
    <input id="btn_anim_start" type="button" value="Start" onclick="$.proxy(Anim.start,Anim)()" />
  </div>
  <div id="current_step" class="left" style="display:none;"></div>
</section>