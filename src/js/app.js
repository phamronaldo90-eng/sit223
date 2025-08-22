
/* Basic helpers and security-conscious rendering */
(function(){
  'use strict';

  // In-memory data to avoid fetch() on file://
  window.NEWS_DATA = (window.NEWS_DATA || []).concat([{"id": 1, "title": "Orientation Week Highlights", "date": "2025-08-01", "snippet": "Welcome events, campus tours, and club sign-ups.", "image": ""}, {"id": 2, "title": "Cybersecurity Workshop", "date": "2025-08-12", "snippet": "Hands-on demos: XSS prevention & secure coding.", "image": ""}, {"id": 3, "title": "Deakin Sports Day", "date": "2025-07-28", "snippet": "Join inter-faculty games and BBQ on the oval.", "image": ""}, {"id": 4, "title": "Scholarship Applications Open", "date": "2025-08-15", "snippet": "Merit and equity scholarships now accepting submissions.", "image": ""}, {"id": 5, "title": "Library Extended Hours", "date": "2025-08-18", "snippet": "Open until midnight during assessment period.", "image": ""}]);

  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return (root||document).querySelectorAll(sel); }
  function on(el, ev, fn){ el && el.addEventListener(ev, fn); }

  // Set element text content safely (no HTML injection)
  function setText(el, str){
    if(!el) return;
    el.textContent = (str ?? "").toString();
  }

  // Get URL param
  function getParam(name){
    const u = new URL(window.location.href);
    return u.searchParams.get(name);
  }

  // Format date as "DD Mon YYYY"
  function formatDate(iso){
    const d = new Date(iso + "T00:00:00");
    const day = String(d.getDate()).padStart(2, '0');
    const mons = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${day} ${mons[d.getMonth()]} ${d.getFullYear()}`;
  }

  // Sort data newest-first by ISO date
  function sortByDateDesc(arr){
    return [...arr].sort((a,b)=> (a.date < b.date ? 1 : -1));
  }

  // Build news cards (for home page)
  function renderNewsPreview(rootId, limit){
    const root = qs(rootId);
    if(!root) return;
    const data = sortByDateDesc(window.NEWS_DATA).slice(0, limit || 4);
    if(data.length === 0){
      const p = document.createElement('p');
      setText(p, "No news available.");
      root.appendChild(p);
      return;
    }
    const list = document.createElement('div');
    list.className = "grid";
    data.forEach(item => {
      const card = document.createElement('article');
      card.className = "card";
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = `news-detail.html?id=${encodeURIComponent(item.id)}`;
      setText(a, item.title);
      a.setAttribute('aria-label', `Read more about ${item.title}`);
      h3.appendChild(a);
      const meta = document.createElement('p');
      meta.className = "muted";
      setText(meta, formatDate(item.date));
      const snip = document.createElement('p');
      setText(snip, item.snippet);
      const read = document.createElement('a');
      read.href = `news-detail.html?id=${encodeURIComponent(item.id)}`;
      read.className = "read-more";
      setText(read, "Read more");
      card.appendChild(h3);
      card.appendChild(meta);
      card.appendChild(snip);
      card.appendChild(read);
      list.appendChild(card);
    });
    root.appendChild(list);
  }

  // Handle search form (home and search page)
  function attachSearch(formSel, inputSel){
    const form = qs(formSel);
    const input = qs(inputSel);
    const msg = qs('#searchMsg');

    if(!form || !input) return;

    on(form, 'submit', (e)=>{
      e.preventDefault();
      const raw = (input.value || "").trim();
      if(raw.length < 2){
        if(msg){ setText(msg, "Type at least 2 characters."); }
        input.focus();
        return;
      }
      // Navigate with encoded query param
      window.location.href = `search.html?q=${encodeURIComponent(raw)}`;
    });
  }

  // Populate search page with results
  function renderSearchPage(){
    const q = (getParam('q') || "").trim();
    const input = qs('#searchInput');
    const msg = qs('#searchMsg');
    const heading = qs('#resultsHeading');
    const list = qs('#resultsList');

    if(input){ input.value = q; }

    if(!q || q.length < 2){
      if(msg){ setText(msg, "Type at least 2 characters."); }
      return;
    }
    setText(heading, `Results for '${q}'`);

    const lc = q.toLowerCase();
    const matches = window.NEWS_DATA.filter(n =>
      (n.title||"").toLowerCase().includes(lc) ||
      (n.snippet||"").toLowerCase().includes(lc)
    );

    if(matches.length === 0){
      const li = document.createElement('li');
      setText(li, "No results found.");
      list.appendChild(li);
      return;
    }
    matches.forEach(n => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `news-detail.html?id=${encodeURIComponent(n.id)}`;
      setText(a, n.title);
      li.appendChild(a);
      const meta = document.createElement('span');
      meta.className = 'muted';
      setText(meta, ` — ${formatDate(n.date)}`);
      li.appendChild(meta);
      list.appendChild(li);
    });
  }

  // News detail page
  function renderNewsDetail(){
    const id = getParam('id');
    const item = window.NEWS_DATA.find(n => String(n.id) === String(id));
    const title = qs('#newsTitle');
    const date = qs('#newsDate');
    const body = qs('#newsBody');

    if(!item){
      setText(title, "News item not found");
      return;
    }
    setText(title, item.title);
    setText(date, formatDate(item.date));
    setText(body, item.snippet + " (This is a placeholder detail page.)");
  }

  // Export functions
  window.App = {
    qs, qsa, on, setText,
    attachSearch, renderNewsPreview,
    renderSearchPage, renderNewsDetail
  };
})();
