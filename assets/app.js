(function(){
  var mq = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveal (stagger)
  if(!mq){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.hero-copy>*, .hero-media, .strip-in, .sec-head, .pain, .s-card, .offer, .method-punch, .final>*, .about-split, .tl, .value, .stat, .module, .day-panel.on, .fmt-toggle, .day-tabs').forEach(function(el,i){
      el.classList.add('reveal');
      el.style.transitionDelay = ((i%4)*0.09).toFixed(2)+'s';
      io.observe(el);
    });
  }

  // Nav condense + scroll progress
  var nav = document.querySelector('nav'), prog = document.getElementById('prog');
  function onScroll(){
    if(nav) nav.classList.toggle('scrolled', scrollY > 40);
    if(prog){ var h = document.documentElement.scrollHeight - innerHeight; prog.style.width = (h>0 ? (scrollY/h*100) : 0) + '%'; }
    var book=document.getElementById('book'); if(book) book.classList.toggle('show', scrollY > innerHeight*0.9);
  }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // Masquer les éléments flottants (RDV + chat) quand le footer est visible (évite le chevauchement)
  var foot=document.querySelector('footer');
  if(foot && 'IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      var vis=es[0].isIntersecting;
      var bk=document.getElementById('book'); if(bk) bk.classList.toggle('at-foot', vis);
      // Lya reste toujours visible (on ne la masque plus au footer)
    }, {threshold:0.01}).observe(foot);
  }

  // Count-up (supports multiple [data-count])
  document.querySelectorAll('[data-count]').forEach(function(cu){
    var target = +cu.dataset.count;
    var ob = new IntersectionObserver(function(x){
      if(x[0].isIntersecting){
        ob.disconnect();
        if(mq){ cu.textContent = target; return; }
        var n=0, step=function(){ n += Math.max(1, Math.ceil(target/38)); if(n>=target){ cu.textContent=target; } else { cu.textContent=n; requestAnimationFrame(step); } };
        step();
      }
    }, {threshold:1});
    ob.observe(cu);
  });

  // Marquee seamless clone
  var mt=document.getElementById('marqTrack'); if(mt){ mt.innerHTML += mt.innerHTML; }

  // Magnetic CTA (pointeur fin uniquement)
  if(!matchMedia('(pointer:coarse)').matches && !mq){
    document.querySelectorAll('.btn-primary:not(.book)').forEach(function(b){
      b.addEventListener('mousemove', function(e){ var r=b.getBoundingClientRect(); b.style.transform='translate('+((e.clientX-r.left-r.width/2)*0.25)+'px,'+((e.clientY-r.top-r.height/2)*0.35)+'px)'; });
      b.addEventListener('mouseleave', function(){ b.style.transform=''; });
    });
  }

  // Calculateur — impact de la neurovente sur ton CA (générique : solo ou équipe)
  var cr=document.getElementById('c-rdv'), cp=document.getElementById('c-panier'), ct=document.getElementById('c-taux'), out=document.getElementById('calc-result'), cur=0, raf;
  var RDV_UP=0.10, CLOSE_UP=5; // leviers neuro : +10% de RDV, +5 points de closing
  function fmt(n){ return Math.round(n).toLocaleString('fr-FR')+' €'; }
  function tween(to){ cancelAnimationFrame(raf); var from=cur, start=null; function fr(t){ if(!start)start=t; var p=Math.min((t-start)/500,1); cur=from+(to-from)*(1-Math.pow(1-p,3)); out.textContent=fmt(cur); if(p<1) raf=requestAnimationFrame(fr); else cur=to; } raf=requestAnimationFrame(fr); }
  function setTxt(id,v){ var el=document.getElementById(id); if(el) el.textContent=v; }
  function compute(){
    var rdv=+cr.value, panier=+cp.value, taux=+ct.value;
    setTxt('v-rdv', rdv);
    setTxt('v-panier', Math.round(panier).toLocaleString('fr-FR'));
    setTxt('v-taux', taux);
    var tNeuro=Math.min(taux+CLOSE_UP, 60);
    var rdvNeuro=rdv*(1+RDV_UP);
    var caNow=rdv*12*(taux/100)*panier;
    var caNeuro=rdvNeuro*12*(tNeuro/100)*panier;
    setTxt('cb-now', fmt(caNow));
    setTxt('cb-neuro', fmt(caNeuro));
    setTxt('cb-t1', taux);
    setTxt('cb-t2', tNeuro);
    tween(Math.max(0, caNeuro-caNow));
  }
  if(cr && cp && ct && out){
    [cr,cp,ct].forEach(function(s){ s.addEventListener('input', compute); });
    var io3=new IntersectionObserver(function(x){ if(x[0].isIntersecting){ compute(); io3.disconnect(); } }, {threshold:.35});
    io3.observe(document.querySelector('.calc-box'));
  }

  // Miniatures vidéo (poster Drive, visibles quand le dossier est partagé "tout le monde avec le lien")
  document.querySelectorAll('.vcard[data-vid]').forEach(function(c){
    var id=c.getAttribute('data-vid');
    var img=new Image();
    img.onload=function(){ c.classList.add('has-thumb'); c.style.backgroundImage="linear-gradient(180deg,rgba(19,19,58,.35),rgba(19,19,58,.82)), url('https://drive.google.com/thumbnail?id="+id+"&sz=w1000')"; };
    img.src='https://drive.google.com/thumbnail?id='+id+'&sz=w1000';
  });

  // Toggle e-learning / présentiel (page formation)
  document.querySelectorAll('[data-pane-group]').forEach(function(group){
    group.querySelectorAll('[data-pane-btn]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var id = btn.getAttribute('data-pane-btn');
        group.querySelectorAll('[data-pane-btn]').forEach(function(b){ b.classList.toggle('on', b===btn); });
        document.querySelectorAll('[data-pane]').forEach(function(p){ p.classList.toggle('on', p.getAttribute('data-pane')===id); });
      });
    });
  });

  // Day tabs (présentiel)
  document.querySelectorAll('[data-day-btn]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var id=btn.getAttribute('data-day-btn');
      document.querySelectorAll('[data-day-btn]').forEach(function(b){ b.classList.toggle('on', b===btn); });
      document.querySelectorAll('[data-day]').forEach(function(p){ p.classList.toggle('on', p.getAttribute('data-day')===id); });
    });
  });

  // Lightbox vidéo (embed Drive)
  var lb=document.getElementById('lb');
  if(lb){
    var lbFrame=document.getElementById('lbFrame'), lbClose=document.getElementById('lbClose');
    var openLb=function(id){ lbFrame.src='https://drive.google.com/file/d/'+id+'/preview'; lb.classList.add('open'); document.body.style.overflow='hidden'; };
    var closeLb=function(){ lb.classList.remove('open'); lbFrame.src=''; document.body.style.overflow=''; };
    document.querySelectorAll('[data-vid]').forEach(function(v){ v.addEventListener('click', function(e){ e.preventDefault(); openLb(v.getAttribute('data-vid')); }); });
    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', function(e){ if(e.target===lb) closeLb(); });
    addEventListener('keydown', function(e){ if(e.key==='Escape' && lb.classList.contains('open')) closeLb(); });
  }

  // Modales "En savoir plus" (ex : application Kliora)
  document.querySelectorAll('[data-modal]').forEach(function(btn){
    btn.addEventListener('click', function(){ var m=document.getElementById(btn.getAttribute('data-modal')); if(m){ m.classList.add('open'); document.body.style.overflow='hidden'; } });
  });
  document.querySelectorAll('.modal').forEach(function(m){
    function close(){ m.classList.remove('open'); document.body.style.overflow=''; }
    m.addEventListener('click', function(e){ if(e.target===m || e.target.classList.contains('modal-close')) close(); });
    addEventListener('keydown', function(e){ if(e.key==='Escape' && m.classList.contains('open')) close(); });
  });

  // Consentement cookies (RGPD) + Google Analytics chargé UNIQUEMENT après accord
  (function(){
    var GTM_ID = 'GTM-PDHDPP3K'; // conteneur Google Tag Manager de Persua
    function loadGTM(){
      if(window.__gtmLoaded) return; window.__gtmLoaded = true;
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',GTM_ID);
    }
    var consent = null;
    try { consent = localStorage.getItem('persua-consent'); } catch(e){}
    if(consent === 'granted') loadGTM();

    function decide(v){
      try { localStorage.setItem('persua-consent', v); } catch(e){}
      var b = document.getElementById('cookieBanner'); if(b) b.remove();
      if(v === 'granted') loadGTM();
    }
    function showBanner(){
      if(document.getElementById('cookieBanner')) return;
      var d = document.createElement('div'); d.id = 'cookieBanner'; d.className = 'cookie-banner';
      d.innerHTML = "<p>Nous utilisons des cookies de mesure d'audience (Google Analytics) pour comprendre comment le site est utilisé et l'améliorer. Vous pouvez accepter ou refuser. <a href=\"/confidentialite\">En savoir plus</a>.</p><div class=\"cb-btns\"><button class=\"cb-refuse\" type=\"button\">Refuser</button><button class=\"cb-accept\" type=\"button\">Accepter</button></div>";
      document.body.appendChild(d);
      d.querySelector('.cb-accept').addEventListener('click', function(){ decide('granted'); });
      d.querySelector('.cb-refuse').addEventListener('click', function(){ decide('denied'); });
    }
    // Bouton "modifier mes préférences" (utilisable depuis la page confidentialité)
    window.persuaCookiePrefs = function(){ try { localStorage.removeItem('persua-consent'); } catch(e){} showBanner(); };
    if(consent !== 'granted' && consent !== 'denied') showBanner();
  })();

  // Widget WhatsApp façon chat (Lya) avec questions rapides + réponses — toutes les pages
  (function(){
    if(document.querySelector('.wa-widget')) return;
    var PHONE='33749554615';
    function waLink(t){ return 'https://wa.me/'+PHONE+'?text='+encodeURIComponent(t); }
    var WA='<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-8.5 15.3L2 22l4.8-1.5A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.8.9.9-2.7-.2-.3A8 8 0 1112 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.5-.2-.3.2-.3.5-.9.1-.1 0-.3 0-.4 0-.1-.5-1.3-.7-1.7-.2-.4-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3-.7.7-.9 1.6-.5 2.7.5 1.4 1.5 2.5 2.9 3.3.5.3 1 .5 1.5.6.6.2 1.1.1 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.1-.4-.2z"/></svg>';
    var AVATAR='<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="lyaBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe6d2"/><stop offset="1" stop-color="#ffcdaf"/></linearGradient></defs><rect width="100" height="100" fill="url(#lyaBg)"/><path d="M23 58 C21 30 33 15 50 15 C67 15 79 30 77 58 C77 70 74 84 70 96 L64 96 C68 84 70 72 68 60 C58 66 42 66 32 60 C30 72 32 84 36 96 L30 96 C26 84 23 70 23 58 Z" fill="#4a3730"/><path d="M20 100 C22 78 34 70 50 70 C66 70 78 78 80 100 Z" fill="#2c2c4e"/><path d="M44 72 L50 84 L56 72 Z" fill="#f4f2f8"/><rect x="45" y="58" width="10" height="14" rx="4" fill="#f0c19c"/><ellipse cx="50" cy="47" rx="15.5" ry="17.5" fill="#f6cba4"/><path d="M34 42 C33 30 40 24 50 24 C60 24 67 30 66 42 C63 36 58 33 50 33 C42 33 37 36 34 42 Z" fill="#4a3730"/><circle cx="43.5" cy="47" r="1.7" fill="#3a2b28"/><circle cx="56.5" cy="47" r="1.7" fill="#3a2b28"/><path d="M40 43 Q43.5 41.5 47 43" stroke="#4a3730" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M53 43 Q56.5 41.5 60 43" stroke="#4a3730" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M45 54 Q50 58 55 54" stroke="#c47a5a" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="40" cy="52" r="2.4" fill="#f7a98a" opacity=".5"/><circle cx="60" cy="52" r="2.4" fill="#f7a98a" opacity=".5"/></svg>';
    // Réponses pré-écrites aux questions les plus fréquentes
    var QA=[
      {q:"Différence Académie / Mentorat ?", a:"L'Académie, c'est toute la méthode en autonomie : 34 leçons, accès à vie, 700 € HT (payable en 1, 2 ou 3 fois). Le Mentorat, c'est en plus un coaching 1:1 chaque semaine où on décortique tes vrais rendez-vous. Le Mentorat est sur candidature."},
      {q:"Combien ça coûte ?", a:"L'Académie : 700 € HT, accès à vie, payable en 1, 2 ou 3 fois. Le Mentorat 1:1 est sur candidature. Les formations en entreprise sont finançables via les OPCO."},
      {q:"C'est finançable OPCO ?", a:"Oui, pour les formations en entreprise (équipe). On s'appuie sur un partenaire de portage certifié Qualiopi le temps que notre propre certification soit finalisée."},
      {q:"L'Académie est-elle remboursable ?", a:"C'est un contenu numérique à accès immédiat : une fois l'accès ouvert, il n'est pas remboursable (tu le valides à l'achat). Le plus sûr avant d'acheter : faire le diagnostic gratuit, ou me poser ta question ici."},
      {q:"C'est pour qui ?", a:"Pour les dirigeants, indépendants et commerciaux qui vendent leur offre et veulent closer plus, sans forcer ni manipuler. Si tu vends au quotidien, c'est fait pour toi."},
      {q:"Comment se passe le Mentorat ?", a:"6 mois : un coaching 1:1 chaque semaine, tes vrais appels audités, l'accès à l'Espace Membre + l'IA neurovente, et un soutien WhatsApp 7/7. C'est sur candidature."}
    ];
    var w=document.createElement('div'); w.className='wa-widget';
    w.innerHTML=''+
      '<div class="wa-panel" role="dialog" aria-label="Chat avec Lya">'+
        '<div class="wa-head"><div class="wa-ava">'+AVATAR+'<span class="wa-on"></span></div>'+
        '<div class="wa-hid"><b>Lya</b><span>En ligne</span></div>'+
        '<button class="wa-xbtn" aria-label="Fermer">&times;</button></div>'+
        '<div class="wa-body" id="waBody">'+
          '<div class="wa-time">maintenant</div>'+
          '<div class="wa-typing" aria-hidden="true"><i></i><i></i><i></i></div>'+
          '<div class="wa-bubble wa-msg">Bonjour 👋\n\nUne question sur les offres, les prix, le financement ? Choisissez ci-dessous, je réponds tout de suite. Sinon, écrivez-moi.</div>'+
        '</div>'+
        '<div class="wa-chips" id="waChips"></div>'+
        '<a class="wa-cta" href="'+waLink("Bonjour Lya, j'ai une question sur Persua.")+'" target="_blank" rel="noopener">'+WA+'Échanger sur WhatsApp</a>'+
      '</div>'+
      '<button class="wa-launcher" aria-label="Ouvrir le chat WhatsApp"><span class="wa-dot">1</span>'+WA+'<span class="wa-close-ic">&times;</span></button>';
    document.body.appendChild(w);

    // Photo réelle de Lya si disponible (assets/brand/lya.jpg), sinon l'avatar dessiné reste
    var ava=w.querySelector('.wa-ava'), im=new Image();
    im.onload=function(){ var s=ava.querySelector('svg'); if(s) s.replaceWith(im); };
    im.src='assets/brand/lya.jpg';

    var launcher=w.querySelector('.wa-launcher'), xbtn=w.querySelector('.wa-xbtn');
    var typ=w.querySelector('.wa-typing'), msg=w.querySelector('.wa-msg');
    var body=w.querySelector('#waBody'), chips=w.querySelector('#waChips');
    var revealed=false, chipsBuilt=false;
    msg.classList.remove('show');

    function scrollDown(){ body.scrollTop=body.scrollHeight; }
    function addUser(t){ var d=document.createElement('div'); d.className='wa-msg-user'; d.textContent=t; body.appendChild(d); scrollDown(); }
    function addLya(t){ var d=document.createElement('div'); d.className='wa-bubble reply'; d.textContent=t; body.appendChild(d); scrollDown(); }
    function lyaAnswers(t){ var d=document.createElement('div'); d.className='wa-typing'; d.innerHTML='<i></i><i></i><i></i>'; body.appendChild(d); scrollDown();
      setTimeout(function(){ d.remove(); addLya(t); }, 1000); }
    function buildChips(){
      if(chipsBuilt) return; chipsBuilt=true;
      QA.forEach(function(item){
        var b=document.createElement('button'); b.type='button'; b.className='wa-chip'; b.textContent=item.q;
        b.addEventListener('click', function(){ addUser(item.q); lyaAnswers(item.a); });
        chips.appendChild(b);
      });
      var wa=document.createElement('a'); wa.className='wa-chip wa-chip-wa';
      wa.href=waLink("Bonjour Lya, j'ai une autre question sur Persua."); wa.target='_blank'; wa.rel='noopener';
      wa.textContent='J’ai une autre question 💬';
      chips.appendChild(wa);
    }

    function reveal(){
      if(revealed) return;
      setTimeout(function(){ typ.style.display='none'; msg.classList.add('show'); revealed=true; buildChips(); scrollDown(); }, 2000);
    }
    function open(){ w.classList.add('open'); reveal(); }
    function close(){ w.classList.remove('open'); }
    launcher.addEventListener('click', function(){ w.classList.contains('open') ? close() : open(); });
    xbtn.addEventListener('click', function(e){ e.stopPropagation(); close(); });
    addEventListener('keydown', function(e){ if(e.key==='Escape' && w.classList.contains('open')) close(); });

    // Ouverture auto une seule fois par session (effet accroche)
    try{
      if(!sessionStorage.getItem('lyaSeen')){
        setTimeout(function(){ if(!w.classList.contains('open')) open(); try{ sessionStorage.setItem('lyaSeen','1'); }catch(e){} }, 3500);
      }
    }catch(e){}
  })();

  // Before / After : curseur wipe (drag + tactile) + balayage démo au défilement (une fois)
  document.querySelectorAll('[data-ba]').forEach(function(ba){
    var after=ba.querySelector('.ba-after'), handle=ba.querySelector('.ba-handle'), dragging=false;
    if(!after || !handle) return;
    function set(p){ p=Math.max(4,Math.min(96,p)); after.style.clipPath='inset(0 0 0 '+p+'%)'; handle.style.left=p+'%';
      ba.classList.toggle('disc-b', p>72); ba.classList.toggle('disc-a', p<28); }
    set(50);
    function move(x){ var r=ba.getBoundingClientRect(); set((x-r.left)/r.width*100); }
    ba.addEventListener('mousedown', function(e){ dragging=true; move(e.clientX); e.preventDefault(); });
    addEventListener('mousemove', function(e){ if(dragging) move(e.clientX); });
    addEventListener('mouseup', function(){ dragging=false; });
    ba.addEventListener('touchstart', function(e){ dragging=true; move(e.touches[0].clientX); }, {passive:true});
    ba.addEventListener('touchmove', function(e){ if(dragging) move(e.touches[0].clientX); }, {passive:true});
    ba.addEventListener('touchend', function(){ dragging=false; });

    var swept=false, t0=null;
    function ez(p){ return p<.5 ? 2*p*p : 1-Math.pow(-2*p+2,2)/2; }
    function sweep(t){ if(t0===null) t0=t; var p=Math.min((t-t0)/2500,1), pos;
      if(p<.5){ pos = 32 + ez(p/.5)*(68-32); } else { pos = 68 + ez((p-.5)/.5)*(50-68); }
      if(!dragging){ set(pos); if(p<1) requestAnimationFrame(sweep); }
    }
    var ob=new IntersectionObserver(function(x){ if(x[0].isIntersecting && !swept){ swept=true; ba.classList.add('ba-live'); if(!mq) requestAnimationFrame(sweep); ob.disconnect(); } }, {threshold:.35});
    ob.observe(ba);
  });
})();
