/* PLUMBING_V 3 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'il-papiro-pizzeria',       // usato per localStorage lang
    /* NIENTE WhatsApp: la scheda Google non espone alcun mobile, solo il
       fisso 02 2579589. Cablare un wa.me su un fisso manderebbe le persone
       in un vicolo cieco. Resta il tel:. */
    whatsapp: {
      number: '',                     // '39xxxxxxxxxx' — vuoto = niente wiring
      message: 'Ciao! Vorrei informazioni.',
      ids: ['ctaPrenota', 'heroWhatsapp', 'doveWhatsapp', 'barWhatsapp'],
    },
    /* orari: per giorno (0=domenica) un array di finestre [inizio, fine]
       in minuti-stringa 'HH:MM'. Fine oltre '24:00' = scavalca mezzanotte
       (es. ['18:00','24:30'] = apre alle 18, chiude alle 00:30 del giorno
       dopo). Giorno chiuso = []. */
    /* Letti dalla tabella oraria di Google ESPANSA, 26/7/2026: aperti
       7 giorni su 7, finestre identiche tutti i giorni. */
    hours: {
      0: [['12:00', '15:00'], ['19:00', '23:30']],
      1: [['12:00', '15:00'], ['19:00', '23:30']],
      2: [['12:00', '15:00'], ['19:00', '23:30']],
      3: [['12:00', '15:00'], ['19:00', '23:30']],
      4: [['12:00', '15:00'], ['19:00', '23:30']],
      5: [['12:00', '15:00'], ['19:00', '23:30']],
      6: [['12:00', '15:00'], ['19:00', '23:30']],
    },
    hoursStatusId: 'orarioStato',     // elemento testo stato
    hoursTableSelector: '[data-day]', // righe/li con data-day da evidenziare
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 960,
    /* dizionario EN: SOLO overlay — l'HTML è la versione italiana.
       ⚠️ Il markup interno (<br>, <b>, <a>, <span>) va replicato IDENTICO,
       altrimenti al ritorno in italiano sparisce (bug i18n del 20/7). */
    EN: {
      'intro.skip': 'skip',
      'nav.impasti': 'Doughs', 'nav.menu': 'Menu', 'nav.mare': 'From the sea',
      'nav.dove': 'Find us', 'nav.recensioni': 'Reviews',
      'cta.chiama': 'Call us',

      'hero.occhiello': 'Pizzeria and restaurant · via Fratelli Bressan 11 · Precotto, Milan',
      'hero.sotto': 'Here pizza starts from ten different doughs.<br>One of them is the one you have always been told no to.',
      'hero.nota': 'The wordings above are the ones printed on our menu. For coeliac disease and intolerances, <a href="tel:+39022579589">please call before coming</a>: on the phone we will tell you what is available today.',

      'imp.01': 'sourdough',
      'imp.02': 'organic · sourdough',
      'imp.03': 'organic · yeast-free',
      'imp.04': 'organic · stone-ground',
      'imp.05': 'organic · sourdough · poppy seeds',
      'imp.06': 'no flour and no yeast · <b>suitable for coeliacs</b>',
      'imp.07': 'sourdough',
      'imp.08': 'organic · sourdough',
      'imp.09': '<b>suitable for coeliacs</b> · brewer’s yeast',
      'imp.10': 'highly digestible · sourdough',

      'manifesto.cit': '«I don’t eat flour, yeast or cheese… so I thought I would never eat pizza again. Instead, with plantain flour and vegan cheese, I went back to eating it.»',
      'manifesto.fonte': 'antonella cattaneo — Google review',
      'manifesto.coda': 'It is not a line we made up for this website. It is the reason we keep ten doughs in the kitchen instead of one.',

      'omb.occhiello': 'The gesture',
      'omb.titolo': 'One stem, ten rays',
      'omb.p1': 'The papyrus on our sign is built like this: a single stem that opens into a fan at the top. It is also the most honest way to explain how we work — one pizza, and ten ways to get there.',
      'omb.p2': 'Plantain contains neither flour nor yeast. Hemp and spelt carry sourdough. Vegetable charcoal is the dark one in the photo beside this text: people order it because they digest it better. The base changes, the wood-fired oven does not.',
      'omb.mini': 'Sizes: <b>33 cm</b> or <b>45 cm</b>, which our menu lists as «serves 4».',
      'omb.did': 'Dark dough, vegan toppings.',

      'carta.occhiello': 'The menu',
      'carta.titolo': 'The vegan list is not at the back',
      'carta.p': 'On almost every menu the word «vegan» shows up on the last page, under the side dishes. Here the two lists run side by side, because that is how you actually eat at a table where not everybody eats the same way.',
      'carta.classiche': 'Classic pizzas', 'carta.vegane': 'Vegan pizzas',
      'carta.nota': 'The full list is longer: more than fifty classic pizzas and about fifteen vegan ones, plus vegan starters, first courses, mains and desserts. <b>The set menu is 10 €</b> — first course, main and a side, or a pizza of your choice. The prices above are the ones published on our Google listing.',

      'p.margherita': 'buffalo mozzarella, cherry tomatoes, basil',
      'p.friarielli': 'mozzarella, sausage, Neapolitan broccoli rabe',
      'p.cheeseburger': 'fior di latte, burger, bacon, onion, olives, barbecue sauce',
      'p.bologna': 'fior di latte, mortadella, burrata, pistachio',
      'p.acquamarina': 'fior di latte, salmon, ricotta, pistachio',
      'p.nero': 'fior di latte, coppa, sun-dried tomatoes, burrata, pistachio',
      'p.delicata': 'buffalo mozzarella, yellow cherry tomatoes, pesto, burrata',
      'p.salsiccia': 'provola, sausage, mushrooms, yellow cherry tomatoes, burrata',
      'p.faraone': 'mozzarisella, rocket, fresh tomato, onions, falafel, tahini',
      'p.kebab': 'mozzarisella, onion, lettuce, soy kebab, ketchup',
      'p.vfriarielli': 'mozzarisella, broccoli rabe, olives, sun-dried tomatoes, walnuts',
      'p.genovese': 'tomato, potatoes, vegan pesto, plant-based cheese',
      'p.nonno': 'tomato, vegan stracchino, potatoes, onions, oregano',
      'p.vbologna': 'vegan mozzarella, vegan mortadella, chopped pistachio',
      'p.noci': 'mixed vegan cheeses, walnuts, truffle oil',
      'p.fruttariana': 'half with tomato and grilled vegetables, half with caponata vegetables',

      'far.occhiello': 'Where the name comes from',
      'far.titolo': 'The Faraone',
      'far.p1': 'Papiro is an Egyptian word before it is an Italian one, and the drawing on our sign is the plant itself. That root appears in a single place on the menu, but in two versions: the <b>Faraone</b>, with ricotta, rocket, fresh tomato, falafel, tahini and chilli; and the <b>Vega Faraone</b>, the same idea with nothing from an animal.',
      'far.p2': 'It is the only spot on the menu where the two kitchens really touch. The rest is broadly Italian: Roman in the pasta, Milanese in the mains, and far more about fish than you would expect.',
      'far.a': 'tomato, ricotta, rocket, fresh tomato, falafel, tahini, chilli',
      'far.b': 'mozzarisella, rocket, fresh tomato, onions, falafel, tahini',

      'mare.occhiello': 'What nobody expects',
      'mare.titolo': 'Inside the pizzeria there is a fish restaurant',
      'mare.p': 'Between first courses and mains there are more than twenty fish dishes. People who know us as «the pizzeria on via Bressan» often have no idea, and they keep having no idea because we never wrote it down anywhere.',
      'mare.nota': 'First courses from the sea are available with <b>gluten-free pasta</b>.',
      'm.papiro': 'langoustines, baby squid, bottarga',
      'm.scoglio': 'tomato, squid, mussels, clams, king prawns',
      'm.nero': 'prawns, burrata, cherry tomatoes, chopped pistachio',
      'm.astice': 'tomato, lobster, prawns',
      'm.capesante': 'three pieces, served in the shell',
      'm.grigliata': 'the most ordered dish in the evening',

      'gal.titolo': 'In the dining room and in the kitchen',
      'rec.occhiello': 'In their words',
      'rec.titolo': 'Nine hundred and twenty-three Google reviews',

      'dove.occhiello': 'Find us',
      'dove.titolo': 'Via Fratelli Bressan 11, Precotto',
      'dove.p': 'We are on the corner, with three windows on the street: <span class="nowrap">PIZZERIA</span> · <span class="nowrap">IL PAPIRO</span> · <span class="nowrap">RISTORANTE</span>. There is also an entrance from via Privata Licurgo 20. The nearest underground stop is <b>Precotto</b>, on the red line.',
      'dove.caption': 'Open every day, lunch and dinner',
      'dove.tel': 'Call: 02 2579589',
      'dove.indicazioni': 'Open directions',
      'g.lun': 'Monday', 'g.mar': 'Tuesday', 'g.mer': 'Wednesday', 'g.gio': 'Thursday',
      'g.ven': 'Friday', 'g.sab': 'Saturday', 'g.dom': 'Sunday',

      'faq.titolo': 'Questions we get on the phone',
      'faq.q1': 'How many different doughs do you have?',
      'faq.a1': 'Ten: classic, organic, kamut, wholewheat, multigrain, fresh plantain, hemp flour, wholewheat spelt, gluten-free and vegetable charcoal. Each one has its own leavening.',
      'faq.q2': 'Do you have pizzas suitable for coeliacs?',
      'faq.a2': 'Our menu marks two doughs as suitable for coeliacs: <b>fresh plantain</b>, which contains no flour and no yeast, and the <b>gluten-free</b> dough. Since these are intolerances, please call before coming: on the phone we will confirm what is available that day and how we work in the kitchen.',
      'faq.q3': 'Are the vegan pizzas a separate menu?',
      'faq.a3': 'No, they run alongside the classic ones: there is a whole list of vegan pizzas, plus vegan starters, first courses, mains and desserts. Vegan guests order from the menu like everybody else.',
      'faq.q4': 'Are you open on Sundays?',
      'faq.a4': 'Yes, we are open every day, Sundays included: lunch 12:00–15:00 and dinner 19:00–23:30.',
      'faq.q5': 'Is there a set menu?',
      'faq.a5': 'Yes, a 10-euro set menu with a first course, a main and a side; alternatively you can have it with a pizza of your choice. It is worth calling to ask what is on today.',
      'faq.q6': 'Do you only make pizza?',
      'faq.a6': 'No. Alongside pizza there is a fish kitchen with more than twenty dishes between first courses and mains, plus grilled meat and dishes from the Roman and Milanese tradition.',

      'foot.ind': 'Via Fratelli Bressan 11 — entrance also from via Privata Licurgo 20<br>20126 Milan · Precotto',
      'foot.orari': 'Every day<br>12:00 – 15:00 · 19:00 – 23:30',
      'foot.nota': 'Demonstration website built by Bespoke Studio from public data on the Google listing and the official menu. Prices and dough availability to be confirmed on site.',

      'bar.chiama': 'Call', 'bar.menu': 'Menu', 'bar.dove': 'Find us',
    },
  };
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    heroEntrance();
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 — il pannello si risolve da `aria-controls` (PLUMBING_V 3).
     Qui il drawer è `#mobile-menu`, separato dalla nav desktop `#mainNav`
     che su mobile è display:none: senza questa risoluzione il burger
     apriva un elemento nascosto e il menu non compariva. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    var en = root.lang === 'en';
    var txt;
    if (st.open) {
      txt = (en ? 'Open now' : 'Aperto ora') + ' · ' + (en ? 'closes at ' : 'chiude alle ') + st.closesAt;
    } else if (st.opensToday) {
      txt = (en ? 'Closed · opens today at ' : 'Chiuso · apre oggi alle ') + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = (en ? 'Closed · opens ' + DAYS_EN[st.opensDay] + ' at ' : 'Chiuso · apre ' + DAYS_IT[st.opensDay] + ' alle ') + st.opensAt;
    } else {
      txt = en ? 'Closed' : 'Chiuso';
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    root.lang = lang === 'en' ? 'en' : 'it';
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = lang === 'en' && SITE.EN[key] !== undefined ? SITE.EN[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      setLang(root.lang === 'en' ? 'it' : 'en');
    });
  }
  /* coppia di bottoni IT/EN (PLUMBING_V 3): il canone cablava solo il
     toggle singolo #langToggle e il cambio lingua restava morto. */
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    if (localStorage.getItem(SITE.slug + '-lang') === 'en') setLang('en');
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ═══════════════════════════════════════════════════════════════════
     FIRMA — L'OMBRELLA DEL PAPIRO
     Il marchio sull'insegna è un fusto che si apre a ventaglio. Qui il
     ventaglio si disegna in scrub mentre si scorre, un raggio per impasto.
     ⚠️ I raggi partono NASCOSTI dal CSS (stroke-dashoffset), quindi
     servono DUE reti di sicurezza, o con la CDN GSAP irraggiungibile
     restano invisibili per sempre (lezione Yum! Ramen #154):
       1. il ramo else qui sotto, se GSAP non c'è o è reduced-motion;
       2. il watchdog a 1,8s, se GSAP c'è ma ScrollTrigger non parte.
     ═══════════════════════════════════════════════════════════════════ */
  var raggi = Array.prototype.slice.call(
    document.querySelectorAll('#ventaglio .v-raggio, #ventaglio .v-stelo')
  );

  function apriVentaglio() {
    raggi.forEach(function (p) {
      p.style.strokeDasharray = 'none';
      p.style.strokeDashoffset = '0';
    });
  }

  if (raggi.length) {
    if (hasGsap && hasST && !reducedMotion) {
      raggi.forEach(function (p) {
        var L = p.getTotalLength();
        p.style.strokeDasharray = L;
        p.style.strokeDashoffset = L;
      });
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#ventaglio',
          start: 'top 82%',
          end: 'bottom 55%',
          scrub: 0.6,
        },
      });
      // il fusto per primo, poi i raggi che si aprono dal centro verso i lati
      tl.to(raggi[0], { strokeDashoffset: 0, ease: 'none', duration: 1 });
      var lati = raggi.slice(1).sort(function (a, b) {
        var c = 170;
        return Math.abs(a.getPointAtLength(a.getTotalLength()).x - c) -
               Math.abs(b.getPointAtLength(b.getTotalLength()).x - c);
      });
      tl.to(lati, { strokeDashoffset: 0, ease: 'none', duration: 2.4, stagger: 0.18 }, 0.7);
      // rete di sicurezza 2: se a 1,8s nessun raggio si è mosso, apri tutto
      setTimeout(function () {
        var fermo = raggi.every(function (p) {
          return parseFloat(p.style.strokeDashoffset || 0) > 0.5;
        });
        var visto = document.getElementById('ventaglio').getBoundingClientRect().top < window.innerHeight;
        if (fermo && visto) apriVentaglio();
      }, 1800);
    } else {
      apriVentaglio();
    }
  }

  /* entrata dell'indice degli impasti — è l'hero, quindi entra a fine intro.
     fromTo con immediateRender:false: lo stato "from" non viene applicato
     finché il tween non parte, così se GSAP salta le righe restano visibili
     (in CSS non sono mai nascoste). */
  window.bespokeHeroEntrance = function () {
    if (!hasGsap || reducedMotion) return;
    var righe = document.querySelectorAll('#impasti-indice .impasto');
    if (!righe.length) return;
    gsap.fromTo(righe,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.055, immediateRender: false }
    );
  };
})();
