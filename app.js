(() => {
  'use strict';
  const {apps,articles}=window.MRSTUDY_DATA;
  const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon=id=>`<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
  const date=s=>new Date(s+'T12:00:00').toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'});
  const storage={get(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}}};
  const stored=storage.get('mrstudy-saved',[]),saved=new Set(Array.isArray(stored)?stored.filter(v=>typeof v==='string'):[]);
  let appFilter='all',resultFilter='all',toastTimer,restoreHash='#trang-chu';
  const reader=$('#reader'),searchDialog=$('#search-dialog');
  const baseTitle=document.title;
  const saveKey=(type,id)=>`${type}:${id}`;
  const saveButton=(type,id,extra='')=>`<button class="save-button ${saved.has(saveKey(type,id))?'is-saved':''} ${extra}" data-save-type="${type}" data-save-id="${esc(id)}" aria-label="${saved.has(saveKey(type,id))?'Bỏ lưu':'Lưu'} ${type==='app'?'ứng dụng':'bài viết'}" aria-pressed="${saved.has(saveKey(type,id))}">${icon('bookmark')}${extra?' <span>'+ (saved.has(saveKey(type,id))?'Đã lưu':'Lưu bài')+'</span>':''}</button>`;
  function notify(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,2800)}
  function updateSaved(){
    $$('[data-save-id]').forEach(b=>{const isSaved=saved.has(saveKey(b.dataset.saveType,b.dataset.saveId));b.classList.toggle('is-saved',isSaved);b.setAttribute('aria-pressed',String(isSaved));b.setAttribute('aria-label',`${isSaved?'Bỏ lưu':'Lưu'} ${b.dataset.saveType==='app'?'ứng dụng':'bài viết'}`);if(b.classList.contains('reader-save'))$('span',b).textContent=isSaved?'Đã lưu':'Lưu bài'});
    $$('.save-count').forEach(x=>{x.textContent=saved.size;x.hidden=!saved.size});
  }
  function isStale(app){return Date.now()-new Date(app.checkedDate+'T00:00:00+07:00').getTime()>7*86400000}
  function appCard(app){return `<article class="app-card"><div class="app-card-top"><img class="app-icon" src="${app.icon}" alt="Biểu tượng ${esc(app.name)}" width="55" height="55"><div><h3><button data-app="${app.id}">${esc(app.name)}</button></h3><div class="app-category">${esc(app.categoryLabel)}</div></div></div>${saveButton('app',app.id)}<p class="app-card-description">${esc(app.description)}</p><div class="app-flags"><span class="free-tag">${isStale(app)?'Cần kiểm tra lại giá':'Miễn phí tải xuống'}</span><span class="app-platform">${esc(app.platforms)}</span></div><span class="iap-note">${app.iap?'Có mua trong ứng dụng':'Không ghi nhận mua trong ứng dụng khi kiểm tra'}</span><div class="app-card-bottom"><div class="app-price">0<small>đ</small><span class="app-price-caption">Khi kiểm tra ${date(app.checkedDate)}</span></div><a class="download-link" href="${app.url}" target="_blank" rel="noopener noreferrer" aria-label="Xem ${esc(app.name)} trên App Store">Xem App Store ${icon('diagonal')}</a></div></article>`}
  function renderApps(){
    const filtered=apps.filter(a=>appFilter==='all'||(appFilter==='limited'?a.limited:a.category===appFilter));
    $('#apps-grid').innerHTML=filtered.length?filtered.map(appCard).join(''):`<div class="empty-state">${icon('spark')}<h3>Chưa có ưu đãi có thời hạn được xác minh</h3><p>Khi có ứng dụng trả phí đang miễn phí và đã kiểm tra được ưu đãi, MRSTUDY sẽ chia sẻ tại đây. Trong lúc chờ, bạn có thể khám phá các app miễn phí tải xuống.</p><button class="button button-dark" data-reset-apps>Xem app miễn phí ${icon('arrow')}</button></div>`;
    $$('[data-app-filter]').forEach(b=>{const active=b.dataset.appFilter===appFilter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});
  }
  const artHTML={icloud:'<div class="large-cloud"><div class="cloud-storage"></div></div><span class="cloud-caption">HIỂU ĐÚNG · LƯU AN TÂM</span>',localsend:`<div class="send-device">${icon('folder')}</div><div class="send-phone">${icon('transfer')}</div>`,github:'<div class="code-window"><div class="code-dots"><i></i><i></i><i></i></div><div class="code-brand">Hello, GitHub.</div><span class="code-line"></span><span class="code-line"></span></div><span class="code-cursor">&lt;/&gt;</span>'};
  function articleCard(a){return `<article class="article-card"><a class="article-visual ${a.image?'news-visual':'art-'+a.art}" href="#bai-viet/${a.id}" aria-label="Đọc: ${esc(a.title)}">${a.image?`<img src="${a.image}" alt="${esc(a.title)} — ảnh từ Apple Newsroom" loading="lazy" width="600" height="338">`:artHTML[a.art]}</a>${saveButton('article',a.id)}<div class="article-meta"><span class="category-label">${esc(a.category)}</span><span>·</span><span>${a.readTime} phút đọc</span></div><h3><a href="#bai-viet/${a.id}">${esc(a.title)}</a></h3><p>${esc(a.description)}</p><div class="article-bottom"><span class="mini-avatar">M</span><span>MRSTUDY</span><span>·</span><time datetime="${a.date}">${date(a.date)}</time>${icon('diagonal')}</div></article>`}
  $('#knowledge-grid').innerHTML=articles.filter(a=>a.type==='knowledge').map(articleCard).join('');
  $('#news-grid').innerHTML=articles.filter(a=>a.type==='news').sort((a,b)=>b.date.localeCompare(a.date)).map(articleCard).join('');
  renderApps();updateSaved();
  const sourcesHTML=sources=>`<div class="reader-sources"><h3>Nguồn & đọc thêm</h3>${sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a>`).join('')}</div>`;
  const readerFooter=()=>`<div class="reader-footer"><button class="text-link" id="share-article">${icon('share')} Sao chép liên kết</button><a class="text-link" href="#app-mien-phi">Khám phá app miễn phí ${icon('arrow')}</a></div>`;
  function showReader(html,title){
    if(searchDialog.open)searchDialog.close();
    $('#reader-content').innerHTML=html;
    if(!reader.open)reader.showModal();
    reader.scrollTop=0;document.title=title+' — MRSTUDY';updateSaved();
  }
  function openArticle(a){showReader(`<article class="reader-body"><div class="reader-label">${esc(a.category)}</div><h1>${esc(a.title)}</h1><div class="reader-byline"><strong>MRSTUDY</strong><time datetime="${a.date}">${date(a.date)}</time><span>${a.readTime} phút đọc</span>${saveButton('article',a.id,'reader-save')}</div>${a.type==='deal'?'':`<p class="reader-description">${esc(a.description)}</p>`}${a.image?`<img class="reader-cover" src="${a.image}" alt="${esc(a.title)} — Apple Newsroom">`:''}<div class="article-body">${a.body}</div>${a.type==='deal'?'':sourcesHTML(a.sources)}${readerFooter()}</article>`,a.title)}
  function openApp(a){showReader(`<article class="reader-body"><img class="app-detail-icon" src="${a.icon}" alt="Biểu tượng ${esc(a.name)}"><div class="reader-label">Ứng dụng · ${esc(a.categoryLabel)}</div><h1>${esc(a.name)}</h1><div class="reader-byline"><strong>${esc(a.developer)}</strong><span>${esc(a.platforms)}</span>${saveButton('app',a.id,'reader-save')}</div><p class="reader-description">${esc(a.details)}</p><div class="detail-notice"><strong>Giá tải xuống: 0 đồng tại lần kiểm tra ${date(a.checkedDate)}.</strong><br>${a.iap?'Có mua trong ứng dụng. Giá tải xuống không đại diện cho mọi tính năng bên trong app.':'Trang App Store không ghi nhận mục mua trong ứng dụng khi kiểm tra.'}<br>${a.limited?'Ưu đãi có thời hạn; cần kiểm tra lại trước khi tải.':'Đây là ứng dụng miễn phí tải xuống, chưa phải ưu đãi giảm từ giá trả phí.'}${isStale(a)?'<br><strong>Thông tin giá đã quá 7 ngày. Vui lòng kiểm tra lại trên App Store.</strong>':''}</div><a class="button button-dark" href="${a.url}" target="_blank" rel="noopener noreferrer">Xem trên App Store ${icon('diagonal')}</a><div class="article-body"><h2>Thử bắt đầu từ đây</h2><ul>${a.tips.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>${sourcesHTML([{title:`${a.name} trên App Store Việt Nam`,url:a.url}])}${readerFooter()}</article>`,a.name)}
  function route(){
    const hash=location.hash;
    if(hash.startsWith('#bai-viet/')){const a=articles.find(a=>a.id===hash.slice(10));if(a)openArticle(a);else showReader('<div class="reader-body"><h1>Không tìm thấy bài viết</h1><p class="reader-description">Bài viết có thể đã được đổi liên kết.</p><a class="button button-dark" href="#trang-chu">Về trang chủ</a></div>','Không tìm thấy');return}
    if(hash.startsWith('#ung-dung/')){const a=apps.find(a=>a.id===hash.slice(10));if(a)openApp(a);return}
    if(hash==='#quyen-rieng-tu'){showReader('<article class="reader-body"><div class="reader-label">MRSTUDY</div><h1>Quyền riêng tư</h1><div class="article-body"><p>MRSTUDY lưu danh sách bài và ứng dụng bạn đánh dấu cùng lựa chọn giao diện trong bộ nhớ trình duyệt (localStorage). Dữ liệu này được giữ trên thiết bị, không được website gửi đến một hệ thống tài khoản.</p><p>Trang hiện không có biểu mẫu thu thập email, công cụ phân tích truy cập hay bình luận. Bạn có thể xóa dữ liệu lưu cục bộ bằng cách xóa dữ liệu trang trong trình duyệt.</p><p>Các liên kết App Store và nguồn tham khảo dẫn đến trang bên ngoài, có chính sách riêng. Nhà cung cấp dịch vụ lưu trữ website có thể xử lý nhật ký truy cập theo chính sách của họ.</p><p>Phông chữ, hình ảnh và mã hiển thị được phục vụ cùng trang web.</p></div></article>','Quyền riêng tư');return}
    if(reader.open)reader.close();document.title=baseTitle;restoreHash=hash||'#trang-chu';
  }
  function closeReader(){if(reader.open)reader.close();history.replaceState(null,'',location.pathname+location.search+restoreHash);document.title=baseTitle}
  $('#reader-close').addEventListener('click',closeReader);reader.addEventListener('cancel',e=>{e.preventDefault();closeReader()});
  window.addEventListener('hashchange',route);
  function openSearch(query='',filter='all'){
    if(reader.open)closeReader();resultFilter=filter;$('#search-input').value=query;
    $('#search-title').textContent=filter==='saved'?'Góc đã lưu của bạn':'Tìm điều bạn cần';
    if(!searchDialog.open)searchDialog.showModal();renderResults();$('#search-input').focus();
  }
  function renderResults(){
    const q=normalize($('#search-input').value.trim()),words=q.split(/\s+/).filter(Boolean);
    const all=[...articles.map(a=>({...a,resultType:a.type,keyType:'article',label:a.type==='deal'?'Ưu đãi ứng dụng':a.type==='news'?'Tin công nghệ':'Kiến thức',href:'#bai-viet/'+a.id})),...apps.map(a=>({...a,title:a.name,resultType:'app',keyType:'app',label:'Ứng dụng',href:'#ung-dung/'+a.id}))];
    const result=all.filter(a=>(resultFilter==='all'||(resultFilter==='saved'?saved.has(saveKey(a.keyType,a.id)):a.resultType===resultFilter))&&words.every(w=>normalize([a.title,a.description,a.categoryLabel||a.category,...(a.tags||[])].join(' ')).includes(w)));
    $$('[data-result-filter]').forEach(b=>{const active=b.dataset.resultFilter===resultFilter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});
    $('#search-results').innerHTML=result.length?`<div class="result-count">${result.length} ${resultFilter==='saved'?'mục đã lưu':'kết quả'}${q?' phù hợp':''}</div>`+result.map(a=>`<div class="search-result"><a href="${a.href}">${a.icon?`<img class="result-icon" src="${a.icon}" alt="">`:`<span class="result-icon">${icon(a.type==='news'?'file':'code')}</span>`}<div><span class="result-label">${a.label}</span><h3>${esc(a.title)}</h3><p>${esc(a.description)}</p></div></a>${saveButton(a.keyType,a.id)}</div>`).join(''):`<div class="empty-state">${icon(resultFilter==='saved'?'bookmark':'search')}<h3>${resultFilter==='saved'&&!q?'Chưa có gì trong góc đã lưu':'Chưa tìm thấy nội dung phù hợp'}</h3><p>${resultFilter==='saved'&&!q?'Chạm biểu tượng dấu trang trên bài viết hoặc ứng dụng để giữ lại ở thiết bị này.':'Thử từ khóa ngắn hơn, hoặc tìm “iPhone”, “GitHub”, “LocalSend”.'}</p></div>`;
  }
  $('#search-open').addEventListener('click',()=>openSearch());$('.saved-open').addEventListener('click',()=>openSearch('','saved'));
  $('#search-close').addEventListener('click',()=>searchDialog.close());$('#search-input').addEventListener('input',renderResults);
  $('#all-apps-link').addEventListener('click',e=>{e.preventDefault();openSearch('','app')});
  $('#privacy-open').addEventListener('click',()=>location.hash='#quyen-rieng-tu');
  document.addEventListener('click',async e=>{
    const save=e.target.closest('[data-save-id]');if(save){const key=saveKey(save.dataset.saveType,save.dataset.saveId),removing=saved.has(key);if(removing)saved.delete(key);else saved.add(key);const persisted=storage.set('mrstudy-saved',[...saved]);updateSaved();notify(persisted?(removing?'Đã bỏ lưu':'Đã lưu trên thiết bị này'):'Đã cập nhật trong phiên này; trình duyệt đang chặn lưu cục bộ.');if(searchDialog.open&&resultFilter==='saved')renderResults();return}
    const app=e.target.closest('[data-app]');if(app){location.hash='#ung-dung/'+app.dataset.app;return}
    const filter=e.target.closest('[data-app-filter]');if(filter){appFilter=filter.dataset.appFilter;renderApps();return}
    if(e.target.closest('[data-reset-apps]')){appFilter='all';renderApps();return}
    const result=e.target.closest('[data-result-filter]');if(result){resultFilter=result.dataset.resultFilter;renderResults();return}
    const search=e.target.closest('[data-search]');if(search){openSearch(search.dataset.search);return}
    const type=e.target.closest('[data-search-type]');if(type){openSearch('',type.dataset.searchType);return}
    if(e.target.closest('#share-article')){try{await navigator.clipboard.writeText(location.href);notify('Đã sao chép liên kết')}catch{notify('Bạn có thể sao chép liên kết trên thanh địa chỉ.')}return}
    if(e.target.closest('.search-result>a'))searchDialog.close();
    if(e.target.closest('#mobile-nav a')){$('#mobile-nav').hidden=true;$('#menu-toggle').setAttribute('aria-expanded','false')}
  });
  $('#menu-toggle').addEventListener('click',()=>{const expanded=$('#menu-toggle').getAttribute('aria-expanded')==='true';$('#menu-toggle').setAttribute('aria-expanded',String(!expanded));$('#mobile-nav').hidden=expanded});
  function setTheme(theme){document.documentElement.dataset.theme=theme;$('#theme-toggle').innerHTML=icon(theme==='dark'?'sun':'moon');$('#theme-toggle').setAttribute('aria-label',`Chuyển sang giao diện ${theme==='dark'?'sáng':'tối'}`)}
  setTheme(storage.get('mrstudy-theme','light')==='dark'?'dark':'light');$('#theme-toggle').addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';setTheme(theme);storage.set('mrstudy-theme',theme)});
  document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!reader.open){e.preventDefault();openSearch()}});
  [reader,searchDialog].forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){if(d===reader)closeReader();else d.close()}}}));
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){$$('.desktop-nav .nav-link').forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id))}})},{rootMargin:'-10% 0px -65% 0px',threshold:0});['trang-chu','kien-thuc','tin-tuc','app-mien-phi'].forEach(id=>observer.observe(document.getElementById(id)))}
  route();
})();
