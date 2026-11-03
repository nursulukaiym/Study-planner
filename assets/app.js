'use strict';
const $ = (selector) => document.querySelector(selector);
const authForm = $('#authForm');
if (authForm) {
  let mode = 'login';
  function setMode(next) {
    mode = next;
    $('#loginTab').classList.toggle('active', mode === 'login');
    $('#registerTab').classList.toggle('active', mode === 'register');
    $('#nameLabel').classList.toggle('hidden', mode === 'login');
    $('#name').required = mode === 'register';
    $('#formTitle').textContent = mode === 'login' ? 'Қош келдің!' : 'Аккаунт ашу';
    $('#formDesc').textContent = mode === 'login' ? 'Жоспарыңды жалғастыру үшін кір.' : 'Оқу жоспарыңды бірге бастайық.';
    $('#submitBtn').textContent = mode === 'login' ? 'Кіру' : 'Тіркелу';
    $('#authMessage').textContent = '';
  }
  $('#loginTab').addEventListener('click', () => setMode('login'));
  $('#registerTab').addEventListener('click', () => setMode('register'));
  authForm.addEventListener('submit', (event) => {
    event.preventDefault();
    $('#authMessage').textContent = 'Бұл — интерфейс үлгісі. Нақты тіркелу/кіру PHP және MySQL қосылғанда жұмыс істейді.';
  });
}
const taskForm = $('#taskForm');
if (taskForm) {
  const key = 'studyPlannerWeek9Tasks';
  let tasks;
  try { tasks = JSON.parse(localStorage.getItem(key)) || []; if (!Array.isArray(tasks)) tasks = []; }
  catch { tasks = []; }
  const today = new Date();
  $('#today').textContent = today.toLocaleDateString('kk-KZ', {day:'numeric', month:'long', year:'numeric'});
  $('#taskDate').value = [today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
  function save() { try { localStorage.setItem(key, JSON.stringify(tasks)); } catch { /* Storage may be unavailable. */ } }
  function render() {
    $('#totalCount').textContent = tasks.length;
    $('#doneCount').textContent = tasks.filter(t => t.done).length;
    $('#pendingCount').textContent = tasks.filter(t => !t.done).length;
    const filter = $('#filter').value;
    const visible = tasks.filter(t => filter === 'all' || (filter === 'done' ? t.done : !t.done));
    const list = $('#taskList'); list.replaceChildren();
    if (!visible.length) { const p = document.createElement('p'); p.className='empty'; p.textContent='Әзірге тапсырма жоқ 🌱'; list.append(p); return; }
    visible.forEach(t => {
      const item=document.createElement('div'); item.className='task'+(t.done?' done':'');
      const checkbox=document.createElement('input'); checkbox.type='checkbox'; checkbox.checked=!!t.done; checkbox.setAttribute('aria-label','Орындалды деп белгілеу'); checkbox.addEventListener('change',()=>{t.done=checkbox.checked;save();render();});
      const body=document.createElement('div');body.className='task-body';
      const title=document.createElement('div');title.className='task-title';title.textContent=t.title;
      const meta=document.createElement('div');meta.className='task-meta';meta.textContent=t.subject+' · '+t.date;
      body.append(title,meta);
      const del=document.createElement('button');del.className='delete';del.type='button';del.textContent='Өшіру';del.setAttribute('aria-label','Тапсырманы өшіру');del.addEventListener('click',()=>{tasks=tasks.filter(x=>x.id!==t.id);save();render();});
      item.append(checkbox,body,del);list.append(item);
    });
  }
  taskForm.addEventListener('submit',e=>{
    e.preventDefault();
    const title=$('#taskTitle').value.trim(),subject=$('#taskSubject').value.trim(),date=$('#taskDate').value;
    if(!title||!subject||!date)return;
    tasks.unshift({id:Date.now().toString(36)+Math.random().toString(36).slice(2),title,subject,date,done:false});
    save();taskForm.reset();render();
  });
  $('#filter').addEventListener('change',render);
  render();
}
