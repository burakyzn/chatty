import React from 'react';
import clsx from 'clsx';
import {
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  List,
  Divider,
  IconButton,
  Badge,
  Icon,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  ListItemAvatar,
  Avatar,
  colors,
  Grid
} from '@material-ui/core';
import {
  Menu,
  ChevronLeft,
  ChevronRight
} from '@material-ui/icons';
import { 
  makeStyles, 
  useTheme 
} from '@material-ui/core/styles';
import { 
  SET_NICKNAME, 
  SET_AVATAR_IMG, 
  GET_ROOM_LIST,
  GET_PUBLIC_MESSAGE_LIST,
  GET_PRIVATE_MESSAGE_LIST
} from '../core/apis.js';
import './main.css';
import axios from 'axios';
import {socket} from '../index';

const BASE_API = process.env.REACT_APP_API_BASE;
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  inline: {
    display: 'inline',
  },
}));

export default function MainScreen() {
  const classes = useStyles();
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = React.useState(true);
  const [onlineUsers, setOnlineUsers] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [allMessage, setAllMessage] = React.useState([]);
  const [nickname, setNickname] = React.useState('');
  const [openNicknameModal, setOpenNicknameModal] = React.useState(true);
  const [openAvatarModal, setOpenAvatarModal] = React.useState(false);
  const [openCreateRoomModal, setOpenCreateRoomModal] = React.useState(false);
  const [openRoomsModal, setOpenRoomsModal] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [avatar, setAvatar] = React.useState(null);
  const [avatarURL, setAvatarURL] = React.useState(null);
  const [selectedChat, setSelectedChat] = React.useState('public');
  const [rooms, setRooms] = React.useState([]);
  const [myRooms, setMyRooms] = React.useState([]);
  const [createRoomName, setCreateRoomName] = React.useState('');
  const [getPrivateMessage, setGetPrivateMessage] = React.useState([]);
  const messageRef = React.useRef(null);

  const formStyle = {
    background: "rgba(0, 0, 0, 0.15)",
    padding: "0.25rem",
    position: "fixed",
    bottom: "0",
    left: openDrawer === true ? "240px" : "0",
    right: "0",
    display: "flex",
    height: "3rem",
    boxSizing: "border-box",
    backdropFilter: "blur(10px)"
  }

  React.useEffect(() => {
    socket.on("onlineusers", data => {
      setOnlineUsers(data.userList);
    });
  }, []);

  React.useEffect(() => {
    socket.on("my room list", data => {
      setMyRooms(data.myRoomList);
    });
  }, []);
  
  React.useEffect(() => {
    socket.on("chat message", msg => {
      console.log(msg);
      setAllMessage(allMessage => [...allMessage, msg]);
    });
  }, []);

  React.useEffect(() => {
    axios(BASE_API + GET_PUBLIC_MESSAGE_LIST)
    .then((result)=>{
      if(result.data.messageList.length > 0)
        setAllMessage(result.data.messageList);
    });
  }, []);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleCreateRoomModalOpen = () => {
    setOpenCreateRoomModal(true);
  };

  const handleCreateRoomModalClose = () => {
    if(createRoomName === ''){
      setIsAlertOpen(true);
    }else{
      let _content = {
        'room' : createRoomName,
        'nickname' : nickname
      }
      socket.emit('create room', _content);
      setOpenCreateRoomModal(false);
    }
  };

  const handleNicknameDialogClose = () => {
    if(nickname.length > 0 || nickname.length < 11){
      axios(BASE_API + SET_NICKNAME,{
        params : {
          p_nickname : nickname
        }
      })
      .then((result)=>{
        if(result.data.result === true){
          socket.emit('newuser', nickname);
          setOpenNicknameModal(false);
        } else {
          setIsAlertOpen(true);
        }
      });
    }
  };

  const handleRoomsDialogButton = (roomName) => {
    let content = {
      'room' : roomName,
      'nickname' : nickname 
    }
    socket.emit('join room', content);
    setOpenRoomsModal(false);
  }

  const handleRoomsDialogClose = () => {
    setOpenRoomsModal(false);
  };

  const handleRoomsDialogOpen = () => {
    axios(BASE_API + GET_ROOM_LIST, {
      params : {
        'p_nickname' : nickname
      }
    })
    .then((result)=>{
      if(result.data.result === true){
        setRooms([...result.data.roomList]);
        setOpenRoomsModal(true);
      } else {
        console.log('Room list error');
      }
    });
  };

  const handleAvatarDialogClose = () => {
    if(openAvatarModal === true){
      setOpenAvatarModal(false);
    }else{
      setOpenAvatarModal(true);
    }
  };

  const handleNicknameDialogEnter = (event) => {
    if (event.key === 'Enter') {
      handleNicknameDialogClose();
    }
  }

const handleCreateRoomDialogEnter = (event) => {
  if (event.key === 'Enter') {
    handleCreateRoomModalClose();
  }
}

  const onAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
  }

  const uploadAvatarImage = (event) => {
    event.preventDefault();
    if(process.env.NODE_ENV === 'production'){
      console.log('Canli ortam profil resmi yuklenememektedir.')
      return;
    } else {
      const formData = new FormData();
      formData.append('avatar', avatar);
      formData.append('nickname', nickname);
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      };
      axios.post(BASE_API + SET_AVATAR_IMG, formData, config)
        .then((result) => {
          if (result.data.result === 'null') {
            console.log("basarisiz");
          } else {
            setAvatarURL(result.data.result);
            setOpenAvatarModal(false);
          }
        }).catch((error) => {});
    }
  };

  const sendMessageHandlerEnter = (event) => {
    if (event.key === 'Enter') {
      sendMessageHandler();
      event.preventDefault();
    }
  }

  const sendRoomMessageHandler = () => {
    let content = {
      'to' : selectedChat,
      'message' : message
    }
    socket.emit('chat room message', content);
    setMessage('');
  }

  const sendMessageHandler = () => {
    if(selectedChat === 'public'){
      let content = {
        'to' : selectedChat,
        'message' : message
      };
     socket.emit('chat message', content);
     setMessage('');
    } else {
      sendRoomMessageHandler();
    }
  }

  const removeRoomOfUser = () => {
    let content = { 
      'room' : selectedChat,
      'nickname' : nickname
    }
    socket.emit('delete user from room', content);

    setSelectedChat('public');
  }

  React.useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [allMessage]);

  const msgAlerts = (text) => {
    let tmp = true;
    allMessage.forEach(msg => {
      if(msg.to === text){
        if(selectedChat !== text && msg.read === false && msg.sender !== nickname){
          tmp = false;
        }
      }
    })
    return(tmp);
  }

  const msgAlertsPrivate = (text) => {
    let tmp = true;
    allMessage.forEach(msg => {
      if(msg.nickname === text){
        if(selectedChat !== text && msg.read === false && msg.nickname !== nickname && msg.to === nickname){
          tmp = false;
        }
      }
    })
    return(tmp);
  }

  const getPreviousPrivateMessages = (to) => {
    axios(BASE_API + GET_PRIVATE_MESSAGE_LIST,{
      params : {
        'p_from'  : nickname,
        'p_to'    : to
      }
    })
    .then((result)=>{
      if(result.data.messageList.length > 0 && (getPrivateMessage.indexOf(result.data.messageId) === -1)){
        setGetPrivateMessage(getPrivateMessage => [...getPrivateMessage,result.data.messageId]);
        setAllMessage(allMessage => [...allMessage, ...(result.data.messageList)]);
      }
    });
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: openDrawer,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, openDrawer && classes.hide)}
          >
            <Menu />
          </IconButton>
          <Grid container justify = "flex-start">
            <Typography variant="h6" noWrap>
              {selectedChat === 'public' ? 'Genel Chat' : selectedChat}
            </Typography>
          </Grid>
          {selectedChat === 'public' ? null : (
            <Grid container justify = "flex-end">
              <Button variant="contained" color="secondary" component="span" style={{ margin: 10 }} onClick={ removeRoomOfUser }>
                Odadan Ayrıl
              </Button>
            </Grid>)
          }
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={openDrawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
        <Divider />
        <Grid container justify = "center">
          <Avatar alt={ nickname } src={ avatarURL } style={{ height: 80, width: 80, margin:10 }} onClick={ setOpenAvatarModal } />
        </Grid>
        <Grid container justify = "center">
          {nickname}
        </Grid>
        <Divider />
        <Button variant="contained" color="primary" component="span" style={{ margin: 10 }} onClick={ handleRoomsDialogOpen }>
          Bir Odaya Katıl
        </Button>
        <Divider />
        <Button variant="contained" color="primary" component="span" style={{ margin: 10 }} onClick={ handleCreateRoomModalOpen }>
          Oda Oluştur
        </Button>
        <Divider />
        <List style={{ margin: 0, padding: 0 }}>
          {['Genel Chat'].map((text, index) => {
            return(
              <ListItem button key={text} onClick={()=>{ 
                let tmp = [];
                  allMessage.forEach(msg => {
                    for (let i = 0; i < allMessage.length; i++){
                      if(allMessage[i].to === 'public' && allMessage[i].read === false){
                        tmp.push(allMessage[i]);
                      }
                    }

                    for(let a = 0; a < tmp.length; a++){
                      tmp[a].read = true;
                    }
                  })
                  for (let i = 0; i < allMessage.length; i++){
                    for(let a = 0; a < tmp.length; a++){
                      if(allMessage[i] === tmp[a]){
                        let _tmp = allMessage;
                        _tmp[i].read = true;
                        setAllMessage(_tmp);
                      }
                    }
                  }

                setSelectedChat('public') 
                }}>
                <Badge color="secondary" variant="dot" invisible={ msgAlerts('public') }>
                  <ListItemText primary='Genel Chat' />
                </Badge>
              </ListItem>
            )})}
        </List>
        <Divider />
        <Typography
          component="span"
          variant="subtitle2"
          color="textPrimary"
          align='center'
          style={{ fontSize:20 }}
        >
          Odalar
        </Typography>
        <List>
          {[...myRooms].map((text, index) => {
            return(
              <ListItem button key={text} onClick={()=>{ 
                let tmp = [];
                allMessage.forEach(msg => {
                  for (let i = 0; i < allMessage.length; i++){
                    if(allMessage[i].to === text && allMessage[i].read === false){
                      tmp.push(allMessage[i]);
                    }
                  }

                  for(let a = 0; a < tmp.length; a++){
                    tmp[a].read = true;
                  }
                })
                for (let i = 0; i < allMessage.length; i++){
                  for(let a = 0; a < tmp.length; a++){
                    if(allMessage[i] === tmp[a]){
                      let _tmp = allMessage;
                      _tmp[i].read = true;
                      setAllMessage(_tmp);
                    }
                  }
                }

                setSelectedChat(text)
                }}>
                      <Badge color="secondary" variant="dot" invisible={ msgAlerts(text) }>
                        <ListItemText primary={text} />
                      </Badge>
                    </ListItem>
              )
              
            }
          )}
        </List>
        <Divider />
        <List>
          {onlineUsers.map((item, index) => (
            <ListItem button key={item.socketID} onClick={() => {
              if(item.nickname !== nickname){
              let tmp = [];
                allMessage.forEach(msg => {
                  for (let i = 0; i < allMessage.length; i++){
                    if(allMessage[i].nickname === item.nickname && allMessage[i].read === false && allMessage[i].to === nickname){
                      tmp.push(allMessage[i]);
                    }
                  }

                  for(let a = 0; a < tmp.length; a++){
                    tmp[a].read = true;
                  }
                })
                for (let i = 0; i < allMessage.length; i++){
                  for(let a = 0; a < tmp.length; a++){
                    if(allMessage[i] === tmp[a]){
                      let _tmp = allMessage;
                      _tmp[i].read = true;
                      setAllMessage(_tmp);
                    }
                  }
                }

              
                setSelectedChat(item.nickname)
                getPreviousPrivateMessages(item.nickname);
              }
              }}>

              <Badge color="secondary" variant="dot" invisible={ msgAlertsPrivate(item.nickname) }>
              <Icon className="fas fa-circle" style={{'color': colors.green[500] }} />
                <ListItemText primary={item.nickname} style={{marginLeft : 10}} />
              </Badge>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Dialog open={openNicknameModal} onClose={handleNicknameDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Kullanıcı Adı Seçimi</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bir kullanıcı adı seçmelisin. 10 Karakterden büyük olamaz.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Kullanıcı adı"
            type="email"
            fullWidth
            onChange={event => setNickname(event.target.value)}
            onKeyDown={handleNicknameDialogEnter}
            required
          />
          {isAlertOpen === true ? <DialogContentText style={{color : "red"}}>Başka bir kullanıcı adı seçmelisin!</DialogContentText> : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNicknameDialogClose} color="primary">
            Tamam
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAvatarModal} onClose={ handleAvatarDialogClose } aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Profil Fotoğrafı Yükle</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Profil fotoğrafını değiştirmek için resim yükleyiniz.
          </DialogContentText>
          <form onSubmit={ uploadAvatarImage } method="post" enctype="multipart/form-data">
            <Grid container>
              <Grid item xs={6}>
              <input
                    className={classes.input}
                    id="contained-button-file"
                    multiple
                    name="avatar" type="file" onChange={ onAvatarChange }
                    style = {{display : "none"}}
                  />
                  <label htmlFor="contained-button-file">
                    <Button variant="contained" color="primary" component="span">
                      Dosya Seç
                    </Button>
                  </label>
              </Grid>
              <Grid item xs={6} direction="row-reverse" style={{direction : "rtl"}}>
                <Button style={{marginLeft : "50px"}} type="submit" variant="contained" color="primary">
                  Yükle
                </Button>
              </Grid>
              <Grid item xs={12}>
                {avatar != null ? <p>{avatar.name}</p> : null}
              </Grid>
              <Grid item xs={12}>
                {process.env.NODE_ENV === 'production' ? <p>Canlı ortamda profil fotografi yüklenmesi engellenmiştir.</p> : null}
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={ openCreateRoomModal } onClose={ handleCreateRoomModalClose } aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Oda Oluştur</DialogTitle>
        <DialogContent>
          <DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="room_name"
            label="Oda adı"
            type="text"
            fullWidth
            onChange={ event => setCreateRoomName(event.target.value) }
            onKeyDown={ handleCreateRoomDialogEnter }
            required
          />
          </DialogContentText>
          {isAlertOpen === true ? <DialogContentText style={{color : "red"}}>Bir oda adı girmelisin!</DialogContentText> : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={ handleCreateRoomModalClose } color="primary">
            Tamam
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={ openRoomsModal } onClose={ handleRoomsDialogClose } aria-labelledby="form-dialog-title" fullWidth maxWidth="sm">
        <DialogTitle id="form-dialog-title">Odaya Katıl</DialogTitle>
        <DialogContent>
          <DialogContentText>
          <List>
          {rooms.map((text, index) => (
            <ListItem>
              <Button key={text} variant="contained" color="primary" component="span" style={{ marginRight: 10 }} onClick={()=> {
                handleRoomsDialogButton(text);
              }} >
                +
              </Button>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ handleRoomsDialogClose } color="primary">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: openDrawer,
        })}
      >
      <div className={classes.drawerHeader} />
      <ul id="messages">
        {allMessage.map((content, index) => (
          <List disablePadding ref={messageRef}>
            {(content.to === nickname && content.nickname === selectedChat) || 
            (content.nickname === nickname && content.to === selectedChat) || 
            (content.to === selectedChat)?
              <ListItem key={index} style={{ padding: 0, paddingLeft: 15 }}>
              {(() => {
                if(content.system === true){
                  return("");
                }else{
                  let tmp = [];
                  allMessage.forEach(msg => {
                    for (let i = 0; i < allMessage.length; i++){
                      if(allMessage[i].to === selectedChat && allMessage[i].read === false){
                        tmp.push(allMessage[i]);
                      }
                    }
                  })
                  for (let i = 0; i < allMessage.length; i++){
                    for(let a = 0; a < tmp.length; a++){
                      if(allMessage[i] === tmp[a]){
                        let _tmp = allMessage;
                        _tmp[i].read = true;
                        setAllMessage(_tmp);
                      }
                    }
                  }

                  return(
                    <ListItemAvatar>
                      <Avatar alt={ content.nickname } src={ content.avatar } />
                    </ListItemAvatar>
                  );
                }
              })()
              }
              <ListItemText
                style={{ padding: 0 }}
                primary={content.nickname}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body1"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {content.msg}
                    </Typography>
                  </React.Fragment>
                }
               />
            </ListItem> : null
            }
          </List>
        ))}
      </ul>
      <form id="form" action="" style={formStyle}>
        <input type="text" id="input" autoComplete="off" value={message} onChange={event => setMessage(event.target.value)} onKeyDown={sendMessageHandlerEnter} />
        <button type="button" onClick={sendMessageHandler} id="submit">Gönder</button>
      </form>
      </main>
    </div>
  );
}