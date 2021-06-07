# ✏️ Realtime Chat Application
This realtime chat application is a group project assignment for [network programming lecture](https://ebs.sakarya.edu.tr/Ders/Detay/531786).
This project is being developed using [React](https://reactjs.org), [Node.js](https://nodejs.org/en), [Express.js](https://expressjs.com/) [Socket.IO](https://socket.io), [Firebase](https://firebase.google.com).

# ⚙️ Install

Clone the project to your computer.
```
> git clone https://github.com/burakyzn/realtime-chat-app.git
```

Install required packages from npm
```
> npm install
> cd client
> npm install
```

Go to your firebase setting page and copy firebaseConfig from Config section. Create a file named serviceAccountKey.js and paste this copied code into it. The file should be placed in client>src>core.

![image](https://user-images.githubusercontent.com/44683436/121013663-cdb84600-c7a1-11eb-9e5c-616a0b19995d.png)

Download serviceAccountKey.json file from Project Settings -> Service Account -> Firebase SDK Admin menu.
The downloaded file should be placed in core folder.

![image](https://user-images.githubusercontent.com/44683436/121013806-fcceb780-c7a1-11eb-9882-56f226b76357.png)

# 💻 Run

Server
```
> node server.js
```

Client
```
> cd client
> npm start
```

## 🎯 Contributors
<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/burakyazan/"><img src="https://avatars.githubusercontent.com/u/44683436?v=4s=100" width="100px;" alt=""/><br /><sub><b>Burak Yazan</b></sub></a><br /></td>
    <td align="center"><a href="https://www.linkedin.com/in/berkaysahin3/"><img src="https://avatars.githubusercontent.com/u/23323317?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Berkay Şahin</b></sub></a><br /></td>
  </tr>
</table>

## 🚀 [Website For Chatting Online](https://realtimechatapp54.herokuapp.com/)

