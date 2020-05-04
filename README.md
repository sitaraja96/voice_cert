# Vonage Voice API Certification Project



## Usage

Create an application on the Nexmo portal. Generate a private key and download it. Place the private key in the root directory.
Take note of the application_id. 

Update the .env file. Insert values for API_KEY, API_SECRET,APPLICATION_ID, VIRTUAL_NUMBER,TO_NUMBER. The directory of the private key has been defaulted to the root directory.

Install npm modules (from the root of the project)

```
npm install
```

To start the server (from the rootthis project)
```
node ivr-cert.js
```

Run ngrok application. Listen to port 3000
```
ngrok http 3000
```

Update the webhook url in your account setting for the above application. 
1) EVENT URL
```
https://29c8e05a.ngrok.io/webhooks/events
```
2) ANSWER URL
```
https://29c8e05a.ngrok.io/webhooks/answer
```

# After running the app
Not giving spoilers... Explore and enjoy! :)






