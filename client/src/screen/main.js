import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { green } from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios';
import {socket} from '../index';
import './main.css';
import { SET_NICKNAME, SET_AVATAR_IMG } from '../core/apis.js';
import Grid from '@material-ui/core/Grid';

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
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [avatar, setAvatar] = React.useState(null);
  const [avatarURL, setAvatarURL] = React.useState(null);

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
    socket.on("chat message", msg => {
      setAllMessage(allMessage => [...allMessage, msg]);
    });
  }, []);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
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

  const onAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
  }

  const uploadAvatarImage = (event) => {
    event.preventDefault();
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
              if(result.data.result === 'null'){
                console.log("basarisiz");
              } else {
                setAvatarURL(result.data.result);
                setOpenAvatarModal(false);
              }
            }).catch((error) => {
        });
  };

  const sendMessageHandlerEnter = (event) => {
    if (event.key === 'Enter') {
      sendMessageHandler();
      event.preventDefault();
    }
  }

  const sendMessageHandler = () => {
    socket.emit('chat message', message);
    setMessage('');
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
            <MenuIcon />
          </IconButton>
          {/* <Typography variant="h6" noWrap>
            XXX Kullanicisi
          </Typography> */}
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
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <Grid container justify = "center">
          <Avatar alt={ nickname } src={ avatarURL } style={{ height: 80, width: 80, margin:10 }} onClick={ setOpenAvatarModal } />
        </Grid>
        <Divider />
        <List>
          {['Genel Chat'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {onlineUsers.map((item, index) => (
            <ListItem button key={item.socketID}>
              <Icon className="fas fa-circle" style={{ color: green[500] }} />
              <ListItemText primary={item.nickname} style={{marginLeft : 10}}/>
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

      <Dialog open={openAvatarModal} onClose={handleAvatarDialogClose} aria-labelledby="form-dialog-title">
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
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: openDrawer,
        })}
      >
      <div className={classes.drawerHeader} />
      <ul id="messages">
        {allMessage.map((content, index) => (
          <List disablePadding>
            <ListItem key={index} style={{ padding: 0, paddingLeft: 15 }}>
              {(() => {
                if(content.system === true){
                  return("");
                }else{
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
                    {/* {" — Wish I could come, but I'm out of town this…"} */}
                  </React.Fragment>
                }
               />
            </ListItem>
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