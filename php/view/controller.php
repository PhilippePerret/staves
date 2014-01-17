<?php
  
?>
<section id="controller">
  <div id="decompte" style="display:none;"></div>
  <div class="buttons">
    <input type="hidden" id="play_type" value="all" />
    <span id="mark_play_type"></span>
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
      onclick="$.proxy(Anim.stop,Anim, true)()"
      style="cursor:pointer;visibility:hidden;"
      />
  </div>
  <div id="vitesse_animation" style="background-color:white"></div>
</section>