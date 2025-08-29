const API_KEY='AIzaSyC_hxjGn7mrMI5I6qJbVCT5UG99qP-WN20'

const API_URL='https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'


const chatMessages=document.getElementById('chat-message');

const userInput=document.getElementById('user-input');

const sendButton=document.getElementById('send-button');

async function genrateresponse(prompt) {
    const response= await fetch(`${ API_URL}?key=${API_KEY}`,{
        method:'POST',
        headers:{
            'Content-type':'application/json',
        },
        body:JSON.stringify({
            contents:[
                {
                    parts:[
                        {
                            text:prompt
                        }
                    ]
                }
            ]
        })
    })
    if(!response.ok){
    throw new Error('Failed to give response ')
}

const data= await response.json()

return data.candidates[0].content.parts[0].text;
}

function cleanMarkdown(text){
    //defines a function `cleanMarkdown` to remove any markdown formattong
    // /(like headers, bold text,etc.) from the response.
    return text
    .replace(/#{1,6}\s?/g,'')
    //removes any markdown headers(e.g, #,##,###).
    .replace(/\*\*/g,'')
    //removes bold formatting(double asterrisks**)

    .replace(/\n{3,}/g,'\n\n')
    //limits excessive newlines to a maximum of two(replace more than two newlines with two ).

    .trim();
    //remove any whitespace from the start and end of the string.
}

function addMessage(message,isUser){
    const messageElement=document.createElement('div')
    messageElement.classList.add('message')

    messageElement.classList.add(isUser?'user-message' : 'bot-message')

    const profileImage= document.createElement('img')
    profileImage.classList.add('profile-image')

    profileImage.src=isUser ? 'images.jpeg' : 'istock.jpg'

    profileImage.alt=isUser? 'User' : 'bot'

    const messageContent =document.createElement('div')
    messageContent.classList.add('message-content')

    messageContent.textContent = message
    messageElement.appendChild(profileImage)
    messageElement.appendChild(messageContent)
    chatMessages.appendChild(messageElement)

    chatMessages.scrollTop=chatMessages.scrollHeight;
}

async function handleUserInput(){
    const userMessage =userInput.value.trim();

    if(userMessage){
        addMessage(userMessage,true)

        userInput.value=''
        sendButton.disabled=true

        userInput.disabled=true
    }
    try{
        const botMessage = await genrateresponse(userMessage)
        addMessage(cleanMarkdown(botMessage),false)
    }catch(error){
        console.error(error)
        addMessage('sorry i am unable to give response please try later',false)

    }
    finally{
        sendButton.disabled=false

        userInput.disabled=false

        userInput.focus()
    }
}

sendButton.addEventListener('click',handleUserInput)

userInput.addEventListener('keypress',(e)=>{
    if(e.key==='Enter' && !e.shiftKey){
        e.preventDefault();
        handleUserInput();
    }
})