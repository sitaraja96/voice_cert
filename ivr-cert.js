require('dotenv').config();
const Nexmo = require('nexmo');
const app = require('express')();
const bodyParser = require('body-parser')
const origin_phone_number = process.env.VIRTUAL_NUMBER;
const sales_office_number = process.env.TO_NUMBER;
app.use(bodyParser.json())

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const dates = ["Monday", "Tuesday" , "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

var date = new Date();

//Add extra code that you create in this exercise here! 	
const onInboundCall = (request, response) => {

    const ncco = [
        {
          action: 'talk',
          text: `Hello, this is my attempt at a certification. Captain's log ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}, it's a ${dates[date.getDay()-1]} and the time now is ${date.getHours()} ${date.getMinutes()}.
           To speak with another officer on board the bridge, press 1. For counsellor Troy, press 2. For First Officer Riker, press 3. If you want to hear something not-so-groovy, press 4.`,
          bargeIn: true
        },
        {
            action: 'input',
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/dtmf`],
            timeOut: 15,
            maxDigits: 1,
            submitOnHash: true
        }
      ]
      response.json(ncco)
}


const onInput = (request, response) => {
    const dtmf = request.body.dtmf
    var ncco;

    switch(dtmf){
        case "1":
            ncco = [
                {
                action: 'talk',
                text: `We are now connecting you to an officer who will be able to help.`
                },
                {
                    action: 'connect',
                    from: origin_phone_number,
                    endpoint: 
                    [
                        {
                          "type": "phone",
                          "number": sales_office_number
                        }
                    ]

                }
            ]
            response.json(ncco)
            break;
        case "2":
            ncco = 
            [
                {
                    action: 'talk',
                    text: 'You have asked to speak with counsellor troy, please input your 5 digit account number followed by the HASH key.',
                    bargeIn: true
                },
                {
                    action: 'input',
                    eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/accountInput`],
                    timeOut: 20,
                    maxDigits: 5,
                    submitOnHash: true
                }
            ]
            response.json(ncco)
            break;
        case "3":
            ncco =
            [
                {
                    action: 'talk',
                    text: 'You have asked to speak with First Officer Riker. Unfortunately he is currently unavailable. Please leave a message after the tone.'
                },
                {
                    action: 'record',
                    beepStart: true,
                    eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/recordingFinished`],
                    endOnSilence: 3
                }
            ]
            response.json(ncco)
            break;
        case "4":
            ncco =
            [
                {
                    action: 'talk',
                    text: '4 selected. This is not grrovy. We will play you an MP3 file.'
                },
                {
                    action: "stream",
                    streamUrl: ["https://nexmo-community.github.io/ncco-examples/assets/voice_api_audio_streaming.mp3"]
                }
            ]
            response.json(ncco)
            break;
        default:
            ncco = [
                {
                    action: 'talk',
                    text: 'I did not catch that. Byeeeeeeee'
                }
            ];
            response.json(ncco);
            break;
    }
}

const onEvent =(request, response) =>{
    response.status(200).send();
}

const onAccountInput =(request, response) =>{
    const dtmf = request.body.dtmf
    const input = dtmf.split('').join(' ');
    const ncco = 
    [
        {
            action: 'talk',
            text: 'Your account number is: ' + input + ' your case has been added and is being actively triaged by counselor troy. You will be contacted with an update to your case in 24 hours'
        }
    ];
    response.json(ncco);
    response.status(200).send();
  }


const nexmo = new Nexmo({
apiKey: process.env.API_KEY,
apiSecret: process.env.API_SECRET,
applicationId: process.env.APPLICATION_ID,
privateKey: process.env.PRIVATE_KEY_PATH
})
  

const onRecordingFinished = (request, response) =>{
    console.log(request.body.recording_url)
    //Additional storing audio files
    nexmo.files.save(request.body.recording_url,'test.mp3',(err, res) => {
        if(err) { console.error(err); }
        else {
            console.log(res);
        }
        });

    response.status(200).send();
}

app
  .get('/webhooks/answer', onInboundCall) //This is link to application. 
  .post('/webhooks/dtmf', onInput)
  .post('/webhooks/events', onEvent)
  .post('/webhooks/accountInput', onAccountInput)
  .post('/webhooks/recordingFinished', onRecordingFinished)

app.listen(3000)