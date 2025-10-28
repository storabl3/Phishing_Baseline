const INBOX = document.getElementById('inbox');
const readerModal = document.getElementById('readerModal');
const mailSubject = document.getElementById('mailSubject');
const mailFrom = document.getElementById('mailFrom');
const mailBody = document.getElementById('mailBody');
const feedback = document.getElementById('feedback');

let currentMail = null;

// troque pela sua URL de Google Form prefilled (obter via "Get prefilled link")
const CRYPTPAD_PUBLIC_LINK = 'https://cryptpad.fr/form/#/2/form/view/6c6Q+xIgpqNMilHBEBIMjCGCVxZaeXQOT759ZP203aY?mailId=__MAIL_ID__';

fetch('emails.json')
  .then(r => r.json())
  .then(data => renderInbox(data))
  .catch(err => { INBOX.innerHTML = '<p>Erro ao carregar cenários.</p>'; console.error(err); });

function renderInbox(emails){
  INBOX.innerHTML = '';
  emails.forEach(m => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<strong>${m.subject}</strong><div class="sub">${m.from} — ${m.preview}</div>`;
    card.addEventListener('click', ()=> openMail(m));
    INBOX.appendChild(card);
  });
}

function openMail(mail){
  currentMail = mail;
  mailSubject.textContent = mail.subject;
  mailFrom.textContent = 'De: ' + mail.from;
  mailBody.textContent = mail.body;
  feedback.textContent = '';
  readerModal.classList.remove('hidden');
}

document.getElementById('closeModal').addEventListener('click', ()=> readerModal.classList.add('hidden'));
document.getElementById('btnPhish').addEventListener('click', ()=> giveFeedback(true));
document.getElementById('btnSafe').addEventListener('click', ()=> giveFeedback(false));
document.getElementById('btnReport').addEventListener('click', ()=> reportAction('Relatado'));

function giveFeedback(isPhish){
  if(!currentMail) return;
  if(isPhish){
    feedback.textContent = 'Este é um exemplo de phishing — motivos comuns: link suspeito, urgência, remetente diferente.';
  } else {
    feedback.textContent = 'Parece legítimo — verifique anexos e remetente antes de baixar.';
  }
  // opcional: registrar ação localmente (não envia senhas)
  console.log('acao', {mailId: currentMail.id, action: isPhish ? 'Phish' : 'Safe'});
}

function reportAction(action){
  if(!currentMail) return;
  // abre o Google Form prefilled (substituir placeholders)
  const url = CRYPTPAD_PUBLIC_LINK
    .replace('__MAIL_ID__', encodeURIComponent(currentMail.id));
      window.open(url, '_blank');
}
