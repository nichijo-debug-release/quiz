// 日常デバッグ学会 ミニクイズ（3択）。問題は各ページの window.QUIZ、素材の場所は window.ASSET(名前) で受け取る
(function(){
const Z=window.QUIZ,Q=Z.questions,A=window.ASSET||(n=>'../../assets/'+n);
const wrap=document.querySelector('.wrap');
wrap.innerHTML='<div class="head"><img src="'+A('noel_face.png')+'" alt="ノエル"><div class="bubble" id="say"></div></div>'
 +'<div class="qt">'+Z.title+'</div><button id="snd">🔈 音を出す</button><div class="bar"><i id="prog" style="width:0"></i></div><div id="stage"></div>'
 +'<div class="small"><a href="https://note.com/ryosukewexer" target="_blank" rel="noopener">日常デバッグ学会</a>｜生活を1%ラクにする</div>';
const st=document.getElementById('stage'),say=document.getElementById('say'),pg=document.getElementById('prog'),sb=document.getElementById('snd');
let i=0,score=0,timer=0,miss=[],order=[];const WAIT=2600;

// 音：BGMは最初に押したときから（ブラウザの決まり）。効果音はその場で作る
const bgm=new Audio(A('bgm_cuban.mp3'));bgm.loop=true;bgm.volume=.35;let sndOn=false,touched=false;
function setSnd(on){sndOn=on;sb.textContent=on?'🔊 音あり':'🔈 音を出す';if(on){bgm.play().catch(()=>{})}else bgm.pause()}
sb.onclick=e=>{e.stopPropagation();touched=true;setSnd(!sndOn)};
document.addEventListener('click',()=>{if(!touched){touched=true;setSnd(true)}},true);
let AC=null;function ac(){if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();return AC}
function tone(f,t0,dur,vol){const c=ac(),o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=f;
 g.gain.setValueAtTime(0.0001,c.currentTime+t0);g.gain.exponentialRampToValueAtTime(vol,c.currentTime+t0+0.01);
 g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+t0+dur);o.connect(g).connect(c.destination);o.start(c.currentTime+t0);o.stop(c.currentTime+t0+dur+0.05)}
function buzz(t0,dur){const c=ac(),o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain();o.type='sawtooth';o.frequency.value=150;f.type='lowpass';f.frequency.value=900;
 g.gain.setValueAtTime(0.0001,c.currentTime+t0);g.gain.linearRampToValueAtTime(0.28,c.currentTime+t0+0.01);g.gain.setValueAtTime(0.28,c.currentTime+t0+dur-0.03);g.gain.linearRampToValueAtTime(0.0001,c.currentTime+t0+dur);
 o.connect(f).connect(g).connect(c.destination);o.start(c.currentTime+t0);o.stop(c.currentTime+t0+dur+0.02)}
function se(ok){if(!sndOn)return;try{if(ok){tone(1319,0,0.35,0.35);tone(1047,0.22,0.9,0.35)}else{buzz(0,0.16);buzz(0.22,0.5)}}catch(e){}}

function shuf(x){x=x.slice();for(let k=x.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[x[k],x[j]]=[x[j],x[k]]}return x}
function start(mix){i=0;score=0;miss=[];order=mix?shuf(Q.map((_,k)=>k)):Q.map((_,k)=>k);show()}
function card(a,tag){return '<a class="rec" href="'+a.u+'" target="_blank" rel="noopener"><span class="tag">'+tag+'</span><span class="rt">'+a.r+'</span><span class="rp">'+a.p+'</span><span class="go">記事を読む →</span></a>'}
function mini(list){return list.length?'<div class="more"><div class="mh">あわせて読みたい</div>'+list.map(c=>'<a href="'+c.u+'" target="_blank" rel="noopener">'+c.r+'</a>').join('')+'</div>':''}
function show(){document.querySelectorAll('.mark').forEach(m=>m.remove());
 pg.style.width=(i/Q.length*100)+'%';
 if(i>=Q.length){const n=Q.length,R=Z.rec;let H,rec;
  if(score===n){H={g:'noel_heart.gif',h:'おめでとう！',m:'全問正解。あなたは名誉会員です',c:'#e0457b',b:'もう一度あそぶ'};rec=card(R.all,'名誉会員へのおすすめ')}
  else if(score>0){H={g:'noel_wave.gif',h:'すごい！',m:score+'問正解。あと少しで全問正解',c:'#e4572e',b:'全問正解をめざす'};
   const m0=Q[miss[0]];rec=m0.u?card({r:m0.r,u:m0.u,p:'まちがえた問題の答え合わせ。'+m0.t},'答え合わせ'):card(R.some,'答え合わせのつづきに')}
  else{H={g:'noel_sad.gif',h:'もう一度チャレンジ！',m:'ノエルが泣いています…。答えは記事に書いてあります',c:'#4a78b8',b:'もう一度チャレンジ'};rec=card(R.zero,'はじめての人へ')}
  say.textContent=score+'/'+n+'問正解';
  st.innerHTML='<div class="res"><img src="'+A(H.g)+'" alt="ノエル"><div class="rh" style="color:'+H.c+'">'+H.h+'</div><div class="rm">'+H.m+'</div></div>'+rec+mini(Z.more||[])+'<button class="next" id="again">'+H.b+'</button>';
  document.getElementById('again').onclick=()=>start(true);
  if(score===n)confetti();return}
 const c=Q[order[i]];say.textContent="第"+(i+1)+"問";
 st.innerHTML='<div class="q">'+c.q+'</div>'+c.o.map((s,k)=>'<button class="opt" data-k="'+k+'">'+s+'</button>').join('');
 st.querySelectorAll('.opt').forEach(b=>b.onclick=()=>pick(+b.dataset.k));
}
function confetti(){const C=['#e0457b','#e4572e','#f2b134','#2e8b57','#4a78b8'];
 for(let k=0;k<40;k++){const e=document.createElement('i');e.className='cf';e.style.left=Math.random()*100+'%';e.style.background=C[k%5];e.style.animationDelay=Math.random()*.6+'s';wrap.appendChild(e);setTimeout(()=>e.remove(),3000)}}
function mark(ok,btn){const m=document.createElement('div');m.className='mark';
 m.innerHTML=ok?'<svg viewBox="0 0 100 100"><circle class="ln" cx="50" cy="50" r="38" fill="none" stroke="#2e8b57" stroke-width="12" stroke-linecap="round" transform="rotate(-90 50 50)"/></svg>'
 :'<svg viewBox="0 0 100 100"><line class="ln" x1="18" y1="18" x2="82" y2="82" stroke="#e4572e" stroke-width="13" stroke-linecap="round"/><line class="ln ln2" x1="82" y1="18" x2="18" y2="82" stroke="#e4572e" stroke-width="13" stroke-linecap="round"/></svg>';
 wrap.appendChild(m);setTimeout(()=>m.remove(),1200);btn.classList.add(ok?'hit':'shake')}
function pick(k){const c=Q[order[i]],ok=k===c.a;if(ok)score++;else miss.push(order[i]);
 st.querySelectorAll('.opt').forEach(b=>{b.disabled=true;const n=+b.dataset.k;if(n===c.a)b.style.borderColor='var(--ok)';else if(n===k)b.style.borderColor='var(--accent)'});
 se(ok);mark(ok,st.querySelector('.opt[data-k="'+k+'"]'));say.textContent=ok?"正解！":"おしい！";
 st.insertAdjacentHTML('beforeend','<div class="ans"><b>'+(ok?"正解":"答え")+'：'+c.o[c.a]+'</b><br>'+c.t+'<div class="tm"><i></i></div></div>');
 clearTimeout(timer);timer=setTimeout(()=>{i++;show()},WAIT)}
window.__quiz={start,get score(){return score},bgm};
start(false);
})();
