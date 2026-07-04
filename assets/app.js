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

  // Calculateur — coût d'un commercial qui close trop bas (aversion à la perte)
  var cc=document.getElementById('c-cout'), cr=document.getElementById('c-rdv'), cp=document.getElementById('c-panier'), ct=document.getElementById('c-taux'), out=document.getElementById('calc-result'), cur=0, raf;
  function fmt(n){ return Math.round(n).toLocaleString('fr-FR')+' €'; }
  function tween(to){ cancelAnimationFrame(raf); var from=cur, start=null; function fr(t){ if(!start)start=t; var p=Math.min((t-start)/500,1); cur=from+(to-from)*(1-Math.pow(1-p,3)); out.textContent=fmt(cur); if(p<1) raf=requestAnimationFrame(fr); else cur=to; } raf=requestAnimationFrame(fr); }
  function setTxt(id,v){ var el=document.getElementById(id); if(el) el.textContent=v; }
  function compute(){
    var cout=+cc.value, rdv=+cr.value, panier=+cp.value, taux=+ct.value;
    setTxt('v-cout', Math.round(cout).toLocaleString('fr-FR'));
    setTxt('v-rdv', rdv);
    setTxt('v-panier', Math.round(panier).toLocaleString('fr-FR'));
    setTxt('v-taux', taux);
    var tNeuro=Math.min(Math.round(taux*1.37), 72);
    var coutAn=cout*12;
    var caNow=rdv*12*(taux/100)*panier;
    var caNeuro=rdv*12*(tNeuro/100)*panier;
    setTxt('cb-cout', fmt(coutAn));
    setTxt('cb-now', fmt(caNow));
    setTxt('cb-neuro', fmt(caNeuro));
    setTxt('cb-t1', taux);
    setTxt('cb-t2', tNeuro);
    tween(Math.max(0, caNeuro-caNow));
  }
  if(cc && cr && out){
    [cc,cr,cp,ct].forEach(function(s){ s.addEventListener('input', compute); });
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

  // Before / After slider + découverte éducative Système 1/2
  var baInsight=document.getElementById('baInsight');
  var baSteps=[
    "Système 2 (lent) : tu parles à la logique. Elle ne décide pas, elle ne fait que justifier après coup.",
    "Point de bascule : le cerveau émotionnel reprend la main. C'est là que le vrai « oui » se joue.",
    "Système 1 (rapide) : le client se projette, ressent, et se vend la solution à lui-même."
  ];
  document.querySelectorAll('[data-ba]').forEach(function(ba){
    var after=ba.querySelector('.ba-after'), handle=ba.querySelector('.ba-handle'), dragging=false;
    function set(p){ p=Math.max(2,Math.min(98,p)); after.style.clipPath='inset(0 0 0 '+p+'%)'; handle.style.left=p+'%';
      if(baInsight){ var s = p<38 ? 0 : (p<66 ? 1 : 2); if(baInsight.dataset.s!=s){ baInsight.dataset.s=s; baInsight.textContent=baSteps[s]; baInsight.parentElement.className='ba-insight s'+s; } }
    }
    set(50);
    function move(x){ var r=ba.getBoundingClientRect(); set((x-r.left)/r.width*100); }
    ba.addEventListener('mousedown', function(e){ dragging=true; move(e.clientX); e.preventDefault(); });
    addEventListener('mousemove', function(e){ if(dragging) move(e.clientX); });
    addEventListener('mouseup', function(){ dragging=false; });
    ba.addEventListener('touchstart', function(e){ move(e.touches[0].clientX); }, {passive:true});
    ba.addEventListener('touchmove', function(e){ move(e.touches[0].clientX); }, {passive:true});
  });
})();
