import bot from './assets/bot.svg';
import user from './assets/user.svg';


const form = document.querySelector('form');
const chatContainer =  document.querySelector('#chat_container');

let loadInterval;

function loader(element){
  element.textContent = '';

  loadInterval = setInterval(()=>{
    element.textContent += '.';

    if(element.textContent === '...'){
      element.textContent = '';
    }
  }, 300)
}

function typeText(element, text){
  let index = 0;

  let interval = setInterval(() =>{
    if(index < text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }
  },20)
}

function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber =Math.ceil(Math.random(0,99999));
  const hexadecimalString = randomNumber.toString(16); 
  // return `id-${timestamp}-${hexadecimalString}`;
  return `id-${timestamp}`;
}

function chatStripe(isAi, value, uniqueId){
  return (
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat row">
          <div class="profile col-2">
            <img
              src="${isAi ? bot : user}"
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div class="message col-9" id=${uniqueId}>${value}</div>
          <button class="copyBtn col-1" onclick="copyToClipboard(${uniqueId})"><i class="fal fa-copy"></i></button>
        </div>
      </div>
    `
  )
}

const handleSubmit = async (e) =>{
  e.preventDefault();

  const data = new FormData(form);

  //user's chatstripes
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  //bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true," ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv)

//Fetch data from server for bot response

const response = await fetch('https://majhi-gpt.onrender.com',{
  method:'POST',
  headers:{
    'content-type':'application/json'
  },
  body: JSON.stringify({
    prompt:data.get('prompt')
  })
})

clearInterval(loadInterval);
messageDiv.innerHTML = '';

if(response.ok){
  const data = await response.json();
  const parsedData = data.bot.trim();

  typeText(messageDiv, parsedData);

}else{
  const err = await response.text();

  messageDiv.innerHTML = "Something went wrong!";
  alert(err);
}

}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e)=>{
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})

function copyToClipboard(element) {
  let id = "id"+element;
  console.log("123...",id);
  let copyText = document.getElementById(id).innerHTML;
  console.log("Text", copyText);
   /* Select text area by id*/
   var Text = document.getElementById(id);
   window.getSelection().selectAllChildren(Text);
   document.execCommand("Copy")
  
}


