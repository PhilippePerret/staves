<?php
  
?>
<section id="controller">
  <div class="buttons">
    <select id="play_type" onchange="$.proxy(Anim.onchange_play_type,Anim,this.value)()">
      <option value="all">Tout</option>
      <option value="selection">La sélection</option>
      <option value="repairs">Entre repères</option>
      <option value="from_cursor">Depuis curseur</option>
      <option value="stepbystep">Pas à pas</option>
    </select>
    <img id="btn_anim_start" 
      src="img/bouton/start.png"
      class="btn_controller"
      onclick="$.proxy(Anim.start,Anim)()" 
      style="cursor:pointer;" 
      />
    <img id="btn_anim_pause" 
      src="img/bouton/pause.png"
      class="btn_controller"
      onclick="$.proxy(Anim.pause,Anim)()" 
      style="cursor:pointer;display:none;" 
      />
    <img id="btn_anim_stop" 
      src="img/bouton/stop.png"
      class="btn_controller"
      onclick="$.proxy(Anim.stop,Anim)()"
      style="cursor:pointer;visibility:hidden;"
      />
  </div>
  <div id="vitesse_animation" style="background-color:white"></div>
</section>