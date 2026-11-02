/* Persua — preuve sociale partagée (vidéos + recommandations LinkedIn + avis Google).
   Injecté dans #rv-videos, #rv-linkedin, #rv-google sur chaque page. */
(function(){
  var VIDEOS = [
    {yt:'_-itOd0mNAw', name:'Un dirigeant', role:'Témoignage complet'},
    {id:'1AvuEGek8oPzh85sPKwdvQVNwaEMfaIQG', name:'Un consultant formateur en IA', role:'61-70% de closing'},
    {id:'1LZnNsq6VBbKmPYg0tIQ6JEnV-YShQo1x', name:'Un client accompagné', role:'25k€ en 2 semaines'},
    {id:'1bnY9OgGrm6RBP5nGLu2x7OysEeBxzmsM', name:'Un dirigeant d\'organisme de coaching', role:'CA ×3'},
    {id:'1QL7Xq8nZcmfqMu0zvqbO0fOT9oCKiAtk', name:'Un entrepreneur', role:'Témoignage vidéo'},
    {id:'11zvVtGSRz7pl812AlzoSd09WNDSfNfHj', name:'Un entrepreneur B2B', role:'Closing de 30 % à 65 %'},
    {id:'18q3DSwzn9mzeR8NxtkiG5q78CtuY-wpe', name:'Une entrepreneuse', role:'Indépendante'},
    {id:'1KgqJrmLLzmQJS6BNVMWuucb2dS4lsYiA', name:'Une coach en ligne', role:'15 000 abonnés'},
    {id:'1yUxPOuNqX3Ko0nrfAmi18452ipMzjl50', name:'Un dirigeant', role:'Témoignage vidéo'},
    {id:'1m1zfhMRzPiE0982gCojz0A5IuqQV0Bkr', name:'Un dirigeant', role:'Témoignage vidéo'},
    {id:'1thyx9-Nzoiglvk6WsD4MhN0WM9dQfinx', name:'Témoignage client', role:'Persua'},
    {id:'1HFVcpfh3MwMAmhbFg8FYfxlXH3ZknsIe', name:'Témoignage client', role:'Persua'}
  ];
  var LINKEDIN = [
    {name:'Une directrice régionale', title:'Hauts-de-France et Grand Est', text:"Si vous souhaitez un accompagnement d'une efficacité redoutable, ne cherchez plus : contactez Steven. Il sait allier structure, psychologie de vente, conseils, pédagogie, disponibilité et bonne humeur. Le tout pour un excellent coaching, donc n'hésitez pas."},
    {name:'Un consultant formateur', title:'Intelligence artificielle', text:"Je viens de la technique. Pour moi, un commercial c'était un mec en costume mal taillé qui baratine pour signer. Là, j'ai compris que la vente, faite proprement, c'est de la psycho, du cadre, de l'écoute et beaucoup de neurosciences. Du concret, du scientifique, appliqué direct en rendez-vous. Aujourd'hui je vends sans trahir, je close plus, et surtout, j'aime ça."},
    {name:'Un dirigeant d\'organisme de coaching', title:'+100 cadres & dirigeants accompagnés', text:"Steven m'a littéralement changé la vie. Pendant plus d'un an, il m'a accompagné pour développer mes compétences en vente et en business. Grâce à son accompagnement rigoureux et régulier, les résultats ont largement dépassé mes attentes. Aujourd'hui je suis libre et indépendant."},
    {name:'Un fondateur', title:'Partenaire sur une mission commune', text:"J'ai collaboré avec Steven sur une mission commune. Les résultats obtenus par son client ont été impressionnants, générant plus de 56 000 € de chiffre d'affaires. Je recommande vivement la méthode mise en place par Persua, qui couvre l'ensemble du pôle vente d'une entreprise."},
    {name:'Un fondateur', title:'Secteur du trading', text:"Je recommande vivement Steven pour la qualité de son accompagnement stratégique. Il a une capacité rare à transformer des concepts complexes en offres parfaitement structurées et prêtes pour le marché. Sa générosité dans le partage de son savoir en fait une référence inspirante."},
    {name:'Un entrepreneur', title:'Mentorat', text:"Je recommande vivement Steven pour la qualité de son Mentorat et son impact profond. Son soutien a transformé ma vision de l'entrepreneuriat et m'a permis de développer à la fois mon mental et mon activité. Un mentor engagé, inspirant et d'une grande valeur."},
    {name:'Un directeur général', title:'Secteur du trading', text:"Une très bonne expérience. Steven est une personne compétente et à l'écoute. Je suis persuadé qu'il est capable de répondre à vos besoins."},
    {name:'Un sparring partner', title:'Partenaire d\'entraînement', text:"Steven est une des rares personnes que j'ai rencontrées qui détient une compétence de vente exceptionnelle, un leadership remarquable, et qui les partage sans limites."}
  ];
  var GOOGLE = [
    {name:'Une cliente accompagnée', text:"Un accompagnement au top, personnalisé et adapté à chacun des interlocuteurs, peu importe leur expérience et leur profil. Une superbe pédagogie qui met en confiance."},
    {name:'Un entrepreneur accompagné', text:"Un formateur extrêmement à l'écoute. Depuis que je travaille avec lui, j'ai pris confiance en moi et je me suis réconcilié avec la vente."},
    {name:'Une professionnelle de la vente', text:"Steven partage une valeur immédiatement applicable. Ses explications nourrissent à la fois le besoin de sens et le besoin de concret."},
    {name:'Un entrepreneur', title:'Mentorat individuel', text:"J'ai été accompagné personnellement par Steven sur la vente de mon activité, et l'expérience a été extrêmement qualitative."},
    {name:'Une entrepreneuse', title:'Formation et coaching', text:"Foncez ! La formation que j'ai suivie avec Steven est claire, concrète et très enrichissante. Le coaching m'a permis de mieux comprendre les mécanismes de la vente."},
    {name:'Un client accompagné', text:"Steven est une belle personne : chaleureux, aimable, attentif et à l'écoute. Humble et très communicatif. Merci de ton attention."},
    {name:'Un consultant formateur', title:'Intelligence artificielle', text:"Foncez, c'est le meilleur ! J'ai pu me démarquer avec mes nouveaux résultats, le jour et la nuit."},
    {name:'Un client accompagné', text:"Approche originale et contenu surprenant d'efficacité. Je recommande vivement."},
    {name:'Une entrepreneuse', title:'Accompagnée à distance', text:"J'avais peur de me faire accompagner à distance sur ce type de sujet, ça peut impressionner. Finalement, aucun regret : ça marche très bien."},
    {name:'Un client accompagné', text:"Démarche très pro. Super sympa."}
  ];

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function initials(n){ var p=n.trim().split(/\s+/).filter(function(w){ return !/^(un|une|le|la|les|l'|d')$/i.test(w); }); return ((p[0]||n)[0]||'').toUpperCase(); }

  function openLb(id, isYt){
    var lb=document.getElementById('lb'), fr=document.getElementById('lbFrame');
    if(!lb||!fr) return;
    fr.src = isYt ? ('https://www.youtube.com/embed/'+id+'?autoplay=1&rel=0') : ('https://drive.google.com/file/d/'+id+'/preview');
    lb.classList.add('open'); document.body.style.overflow='hidden';
  }
  function renderVideos(el){
    el.innerHTML = VIDEOS.map(function(v){
      var href = v.yt ? ('https://youtu.be/'+v.yt) : ('https://drive.google.com/file/d/'+v.id+'/view');
      var attr = v.yt ? ('data-yt="'+v.yt+'"') : ('data-vid="'+v.id+'"');
      return '<a class="vcard" '+attr+' href="'+href+'" target="_blank" rel="noopener"><span class="vtag">Témoignage vidéo</span><span class="play"></span><span class="vn">'+esc(v.name)+'</span><span class="vr">'+esc(v.role)+'</span></a>';
    }).join('');
    var OV="linear-gradient(180deg,rgba(19,19,58,.35),rgba(19,19,58,.82)), ";
    el.querySelectorAll('.vcard').forEach(function(c){
      var yt=c.getAttribute('data-yt'), id=c.getAttribute('data-vid');
      c.addEventListener('click', function(e){ e.preventDefault(); openLb(yt||id, !!yt); });
      if(yt){ c.classList.add('has-thumb'); c.style.backgroundImage=OV+"url('https://img.youtube.com/vi/"+yt+"/hqdefault.jpg')"; }
      else if(id){ var im=new Image(); im.onload=function(){ c.classList.add('has-thumb'); c.style.backgroundImage=OV+"url('https://drive.google.com/thumbnail?id="+id+"&sz=w1000')"; }; im.src='https://drive.google.com/thumbnail?id='+id+'&sz=w1000'; }
    });
  }
  function card(r, src){
    return '<div class="rvcard"><div class="rvhead"><span class="rvav">'+esc(initials(r.name))+'</span><div class="rvid"><b>'+esc(r.name)+'</b>'+(r.title?'<span>'+esc(r.title)+'</span>':'')+'</div><span class="rvsrc rv-'+src+'" aria-hidden="true">'+(src==='li'?'in':'★')+'</span></div><p class="rvtxt">'+esc(r.text)+'</p></div>';
  }
  function renderCards(el, arr, src){ el.innerHTML = arr.map(function(r){ return card(r, src); }).join(''); }

  function collapse(el, count, limit, label){
    if(!el || count<=limit) return;
    el.classList.add('rvc');
    var wrap=document.createElement('div'); wrap.style.textAlign='center'; wrap.style.marginTop='24px';
    var btn=document.createElement('button'); btn.className='btn btn-ghost'; btn.textContent='Voir plus '+label+' ('+(count-limit)+')';
    btn.addEventListener('click', function(){
      var open=el.classList.toggle('rvc')===false;
      btn.textContent = open ? 'Voir moins' : ('Voir plus '+label+' ('+(count-limit)+')');
    });
    wrap.appendChild(btn); el.parentNode.insertBefore(wrap, el.nextSibling);
  }

  function init(){
    var v=document.getElementById('rv-videos'); if(v){ renderVideos(v); collapse(v, VIDEOS.length, 6, 'de vidéos'); }
    var li=document.getElementById('rv-linkedin'); if(li){ renderCards(li, LINKEDIN, 'li'); collapse(li, LINKEDIN.length, 6, 'de recommandations'); }
    var g=document.getElementById('rv-google'); if(g){ renderCards(g, GOOGLE, 'g'); collapse(g, GOOGLE.length, 6, "d'avis"); }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
