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
  Grid,
  Container,
} from '@material-ui/core';
import { Menu, ChevronLeft, ChevronRight } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  AUTH_VERIFY,
  REGISTER,
  SET_AVATAR_IMG,
  GET_ROOM_LIST,
  GET_PUBLIC_MESSAGE_LIST,
  GET_PRIVATE_MESSAGE_LIST,
  GET_ROOM_MESSAGE_LIST,
} from '../core/apis.js';
import './main.css';
import axios from 'axios';
import { socket } from '../index';

import db from '../core/db';

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
  const [offlineUsers, setOfflineUsers] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [allMessage, setAllMessage] = React.useState([]);

  const [email, setEMail] = React.useState('');
  const [nickname, setNickname] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [firstname, setFirstname] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const [birthday, setBirthday] = React.useState('');

  const [openLoginModal, setOpenLoginModal] = React.useState(true);
  const [openRegisterModal, setOpenRegisterModal] = React.useState(false);
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
  const [getErrorMessage, setErrorMessage] = React.useState('');
  const messageRef = React.useRef(null);

  const formStyle = {
    background: 'rgba(0, 0, 0, 0.15)',
    padding: '0.25rem',
    position: 'fixed',
    bottom: '0',
    left: openDrawer === true ? '240px' : '0',
    right: '0',
    display: 'flex',
    height: '3rem',
    boxSizing: 'border-box',
    backdropFilter: 'blur(10px)',
  };

  React.useEffect(() => {
    socket.on('onlineusers', (data) => {
      setOnlineUsers(data.userList);
    });
  }, []);

  React.useEffect(() => {
    socket.on('offlineusers', (data) => {
      setOfflineUsers(data.userList);
    });
  }, []);

  React.useEffect(() => {
    socket.on('my room list', (data) => {
      setMyRooms(data.myRoomList);
    });
  }, []);

  React.useEffect(() => {
    socket.on('chat message', (msg) => {
      setAllMessage((allMessage) => [...allMessage, msg]);
    });
  }, []);

  React.useEffect(() => {
    axios(BASE_API + GET_PUBLIC_MESSAGE_LIST).then((result) => {
      if (result.data.messageList.length > 0) {
        setAllMessage(result.data.messageList);
      }
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
    if (createRoomName === '') {
      setIsAlertOpen(true);
    } else {
      db.auth()
        .currentUser.getIdToken()
        .then(function (idToken) {
          let _content = {
            room: createRoomName,
            nickname: nickname,
            token: idToken,
          };
          socket.emit('create room', _content);
          setOpenCreateRoomModal(false);
        })
        .catch(function (error) {
          setOpenLoginModal(true);
          setIsAlertOpen(true);
          setErrorMessage('Lütfen giriş yapınız.');
        });
    }
  };

  const handleLoginDialogClose = () => {
    if (email.length === 0) {
      setIsAlertOpen(true);
      setErrorMessage('Lütfen e-mail girin.');
      return;
    }

    if (password.length === 0) {
      setIsAlertOpen(true);
      setErrorMessage('Lütfen şifre girin.');
      return;
    }

    db.auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // let user = userCredential.user;
        let nick;
        let user = db.auth().currentUser;
        if (user != null) {
          user.providerData.forEach(function (profile) {
            nick = profile.displayName;
          });
        }
        setNickname(nick);
        user
          .getIdToken()
          .then(function (idToken) {
            const config = {
              headers: {
                'content-type': 'application/json',
                authorization: idToken,
              },
            };
            const data = {
              nickname: nick,
            };

            axios.post(BASE_API + AUTH_VERIFY, data, config).then((result) => {
              if (result.data.result === true) {
                socket.emit('newuser', nick);

                db.firestore()
                  .collection('users')
                  .doc(nick)
                  .get()
                  .then((doc) => {
                    if (doc.exists) {
                      let _content = {
                        avatar: doc.data().avatarURL,
                        nickname: nick,
                      };

                      const _config = {
                        headers: {
                          'content-type': 'application/json',
                        },
                      };
                      axios
                        .post(BASE_API + SET_AVATAR_IMG, _content, _config)
                        .then((result) => {})
                        .catch((error) => {});
                      setAvatarURL(doc.data().avatarURL);

                      setOpenLoginModal(false);
                    } else {
                      console.log('No such document!');
                    }
                  })
                  .catch((error) => {
                    console.log('Error getting document:', error);
                  });
              } else {
                setIsAlertOpen(true);
                setErrorMessage('Doğrulanmamış kullanıcı. Lütfen giriş yapın.');
              }
            });
          })
          .catch(function (error) {
            setIsAlertOpen(true);
            setErrorMessage('Sunucuya bağlanırken bir sorunla karşılaşıldı.');
          });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        setIsAlertOpen(true);
        if (errorCode === 'auth/wrong-password')
          setErrorMessage('E-Mail veya şifre yanlış.');
        else if (errorCode === 'auth/weak-password')
          setErrorMessage('Şifre en az 6 karakter olmalıdır.');
        else setErrorMessage(errorMessage);
      });
  };

  const handleLoginDialogEnter = (event) => {
    if (event.key === 'Enter') {
      handleLoginDialogClose();
    }
  };

  const handleLoginToRegisterButton = (event) => {
    setOpenLoginModal(false);
    setErrorMessage('');
    setOpenRegisterModal(true);
  };

  const handleRegisterDialogClose = () => {
    if (email.length === 0) {
      setIsAlertOpen(true);
      setErrorMessage('Lütfen E-Mail girin.');
      return;
    }

    if (nickname.length === 0 || nickname.length > 10) {
      setIsAlertOpen(true);
      if (nickname.length === 0) setErrorMessage('Lütfen kullanıcı adı girin.');
      else setErrorMessage('Kullanıcı adı 10 karakterden büyük olamaz.');
      return;
    }

    if (firstname.length === 0) {
      setIsAlertOpen(true);
      setErrorMessage('Lütfen adınızı girin.');
      return;
    }

    if (lastname.length === 0) {
      setIsAlertOpen(true);
      setErrorMessage('Lütfen soyadınızı girin.');
      return;
    }

    if (birthday === '') {
      setIsAlertOpen(true);
      setErrorMessage('Lütfen doğum tarihinizi girin.');
      return;
    }

    db.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // let user = userCredential.user;
        const config = {
          headers: {
            'content-type': 'application/json',
          },
        };

        const user_data = {
          email: email,
          nickname: nickname,
          first: firstname,
          last: lastname,
          born: birthday,
        };

        axios.post(BASE_API + REGISTER, user_data, config).then((result) => {
          if (result.data.result === true) {
            let user = db.auth().currentUser;
            user
              .updateProfile({
                displayName: nickname,
              })
              .then(function () {
                // Update successful.
              })
              .catch(function (error) {
                // An error happened.
              });

            socket.emit('newuser', nickname);
            setOpenRegisterModal(false);
          } else {
            setIsAlertOpen(true);
          }
        });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        setIsAlertOpen(true);
        if (errorCode === 'auth/email-already-in-use')
          setErrorMessage(
            'E-Mail başka bir kullanıcı tarafından kullanılmaktadır.'
          );
        else if (errorCode === 'auth/weak-password')
          setErrorMessage('Şifre en az 6 karakter olmalıdır.');
        else setErrorMessage(errorMessage);
      });
  };

  const handleRegisterToLoginButton = (event) => {
    setOpenLoginModal(true);
    setErrorMessage('');
    setOpenRegisterModal(false);
  };

  const handleRoomsDialogButton = (roomName) => {
    db.auth()
      .currentUser.getIdToken()
      .then(function (idToken) {
        let content = {
          room: roomName,
          nickname: nickname,
          token: idToken,
        };
        socket.emit('join room', content);
        setOpenRoomsModal(false);
      })
      .catch(function (error) {
        setOpenLoginModal(true);
        setIsAlertOpen(true);
        setErrorMessage('Lütfen giriş yapınız.');
      });
  };

  const handleRoomsDialogClose = () => {
    setOpenRoomsModal(false);
  };

  const handleRoomsDialogOpen = () => {
    axios(BASE_API + GET_ROOM_LIST, {
      params: {
        p_nickname: nickname,
      },
    }).then((result) => {
      if (result.data.result === true) {
        setRooms([...result.data.roomList]);
        setOpenRoomsModal(true);
      } else {
        console.log('Room list error');
      }
    });
  };

  const handleAvatarDialogClose = () => {
    if (openAvatarModal === true) {
      setOpenAvatarModal(false);
    } else {
      setOpenAvatarModal(true);
    }
  };

  const handleRegisterDialogEnter = (event) => {
    if (event.key === 'Enter') {
      handleRegisterDialogClose();
    }
  };

  const handleCreateRoomDialogEnter = (event) => {
    if (event.key === 'Enter') {
      handleCreateRoomModalClose();
    }
  };

  const onAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
  };

  const uploadAvatarImage = async (event) => {
    event.preventDefault();
    var user = db.auth().currentUser;

    if (user) {
      var letters = '0123456789ABCDEF';
      var rnd = '';
      for (var i = 0; i < 6; i++) {
        rnd += letters[Math.floor(Math.random() * 16)];
      }

      let _file = 'images/' + rnd + avatar.name;

      await db.storage().ref(_file).put(avatar);

      db.storage()
        .ref(_file)
        .getDownloadURL()
        .then((url) => {
          setAvatarURL(url);

          let content = {
            avatar: url,
            nickname: nickname,
          };

          const config = {
            headers: {
              'content-type': 'application/json',
            },
          };
          axios
            .post(BASE_API + SET_AVATAR_IMG, content, config)
            .then((result) => {
              db.firestore().collection('users').doc(nickname).set(
                {
                  avatarURL: url,
                },
                { merge: true }
              );

              setOpenAvatarModal(false);
            })
            .catch((error) => {});
        })
        .catch((e) => console.log('getting downloadURL of image error => ', e));
    } else {
    }
  };

  const sendMessageHandlerEnter = (event) => {
    if (event.key === 'Enter') {
      sendMessageHandler();
      event.preventDefault();
    }
  };

  const sendOfflineMessageHandler = () => {
    db.auth()
      .currentUser.getIdToken()
      .then(function (idToken) {
        let content = {
          to: selectedChat,
          message: message,
          token: idToken,
        };
        socket.emit('chat message offline', content);
        setMessage('');
      })
      .catch(function (error) {
        setOpenLoginModal(true);
        setIsAlertOpen(true);
        setErrorMessage('Lütfen giriş yapınız.');
      });
  };

  const sendRoomMessageHandler = () => {
    db.auth()
      .currentUser.getIdToken()
      .then(function (idToken) {
        let content = {
          to: selectedChat,
          message: message,
          token: idToken,
        };
        socket.emit('chat room message', content);
        setMessage('');
      })
      .catch(function (error) {
        setOpenLoginModal(true);
        setIsAlertOpen(true);
        setErrorMessage('Lütfen giriş yapınız.');
      });
  };

  const sendMessageHandler = () => {
    if (selectedChat === 'public') {
      db.auth()
        .currentUser.getIdToken()
        .then(function (idToken) {
          let content = {
            to: selectedChat,
            message: message,
            token: idToken,
          };
          socket.emit('chat message', content);
          setMessage('');
        })
        .catch(function (error) {
          setOpenLoginModal(true);
          setIsAlertOpen(true);
          setErrorMessage('Lütfen giriş yapınız.');
        });
    } else if (offlineUsers.indexOf(selectedChat) !== -1) {
      sendOfflineMessageHandler();
    } else {
      sendRoomMessageHandler();
    }
  };

  const removeRoomOfUser = () => {
    db.auth()
      .currentUser.getIdToken()
      .then(function (idToken) {
        let content = {
          room: selectedChat,
          nickname: nickname,
          token: idToken,
        };
        socket.emit('delete user from room', content);

        setSelectedChat('public');
      })
      .catch(function (error) {
        setOpenLoginModal(true);
        setIsAlertOpen(true);
        setErrorMessage('Lütfen giriş yapınız.');
      });
  };

  React.useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behaviour: 'smooth' });
    }
  }, [allMessage]);

  const msgAlerts = (text) => {
    let tmp = true;
    allMessage.forEach((msg) => {
      if (msg.to === text) {
        if (
          selectedChat !== text &&
          msg.read === false &&
          msg.sender !== nickname
        ) {
          tmp = false;
        }
      }
    });
    return tmp;
  };

  const msgAlertsPrivate = (text) => {
    let tmp = true;
    allMessage.forEach((msg) => {
      if (msg.nickname === text) {
        if (
          selectedChat !== text &&
          msg.read === false &&
          msg.nickname !== nickname &&
          msg.to === nickname
        ) {
          tmp = false;
        }
      }
    });
    return tmp;
  };

  const getPreviousPrivateMessages = (to) => {
    axios(BASE_API + GET_PRIVATE_MESSAGE_LIST, {
      params: {
        p_from: nickname,
        p_to: to,
      },
    }).then((result) => {
      let _data = result.data;

      if (
        _data.messageList.length > 0 &&
        getPrivateMessage.indexOf(_data.messageId) === -1
      ) {
        setGetPrivateMessage((getPrivateMessage) => [
          ...getPrivateMessage,
          _data.messageId,
        ]);

        let _allMessage = allMessage.filter((elem) => {
          return (
            elem.nickname !== nickname &&
            elem.to !== to &&
            elem.nickname !== to &&
            elem.to !== nickname
          );
        });

        setAllMessage(() => [..._data.messageList, ..._allMessage]);
      }
    });
  };

  const getPreviousRoomMessage = (room_name) => {
    axios(BASE_API + GET_ROOM_MESSAGE_LIST, {
      params: {
        p_room_name: room_name,
      },
    }).then((result) => {
      let _data = result.data;

      if (
        _data.messageList.length > 0 &&
        getPrivateMessage.indexOf(_data.messageId) === -1
      ) {
        setGetPrivateMessage((getPrivateMessage) => [
          ...getPrivateMessage,
          _data.messageId,
        ]);

        let _allMessage = allMessage.filter((elem) => {
          return (
            elem.nickname !== nickname &&
            elem.to !== room_name &&
            elem.nickname !== room_name &&
            elem.to !== nickname
          );
        });

        setAllMessage(() => [..._data.messageList, ..._allMessage]);
      }
    });
  };

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
          <Grid container justify="flex-start">
            <Typography variant="h6" noWrap>
              {selectedChat === 'public' ? 'Genel Chat' : selectedChat}
            </Typography>
          </Grid>

          {myRooms.map((content, index) => {
            return content === selectedChat ? (
              <Grid container justify="flex-end">
                <Button
                  variant="contained"
                  color="secondary"
                  component="span"
                  style={{ margin: 10 }}
                  onClick={removeRoomOfUser}
                >
                  Odadan Ayrıl
                </Button>
              </Grid>
            ) : null;
          })}
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
        <Grid container justify="center">
          <Avatar
            alt={nickname}
            src={avatarURL}
            style={{ height: 80, width: 80, margin: 10 }}
            onClick={setOpenAvatarModal}
          />
        </Grid>
        <Grid container justify="center">
          {nickname}
        </Grid>
        <Divider />
        <Button
          variant="contained"
          color="primary"
          component="span"
          style={{ margin: 10 }}
          onClick={handleRoomsDialogOpen}
        >
          Bir Odaya Katıl
        </Button>
        <Divider />
        <Button
          variant="contained"
          color="primary"
          component="span"
          style={{ margin: 10 }}
          onClick={handleCreateRoomModalOpen}
        >
          Oda Oluştur
        </Button>
        <Divider />
        <List style={{ margin: 0, padding: 0 }}>
          {['Genel Chat'].map((text, index) => {
            return (
              <ListItem
                button
                key={text}
                onClick={() => {
                  let tmp = [];
                  allMessage.forEach((msg) => {
                    for (let i = 0; i < allMessage.length; i++) {
                      if (
                        allMessage[i].to === 'public' &&
                        allMessage[i].read === false
                      ) {
                        tmp.push(allMessage[i]);
                      }
                    }

                    for (let a = 0; a < tmp.length; a++) {
                      tmp[a].read = true;
                    }
                  });
                  for (let i = 0; i < allMessage.length; i++) {
                    for (let a = 0; a < tmp.length; a++) {
                      if (allMessage[i] === tmp[a]) {
                        let _tmp = allMessage;
                        _tmp[i].read = true;
                        setAllMessage(_tmp);
                      }
                    }
                  }

                  setSelectedChat('public');
                }}
              >
                <Badge
                  color="secondary"
                  variant="dot"
                  invisible={msgAlerts('public')}
                >
                  <ListItemText primary="Genel Chat" />
                </Badge>
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <Typography
          component="span"
          variant="subtitle2"
          color="textPrimary"
          align="center"
          style={{ fontSize: 20 }}
        >
          Odalar
        </Typography>
        <List>
          {[...myRooms].map((text, index) => {
            return (
              <ListItem
                button
                key={text}
                onClick={() => {
                  let tmp = [];
                  allMessage.forEach((msg) => {
                    for (let i = 0; i < allMessage.length; i++) {
                      if (
                        allMessage[i].to === text &&
                        allMessage[i].read === false
                      ) {
                        tmp.push(allMessage[i]);
                      }
                    }

                    for (let a = 0; a < tmp.length; a++) {
                      tmp[a].read = true;
                    }
                  });
                  for (let i = 0; i < allMessage.length; i++) {
                    for (let a = 0; a < tmp.length; a++) {
                      if (allMessage[i] === tmp[a]) {
                        let _tmp = allMessage;
                        _tmp[i].read = true;
                        setAllMessage(_tmp);
                      }
                    }
                  }

                  setSelectedChat(text);
                  getPreviousRoomMessage(text);
                }}
              >
                <Badge
                  color="secondary"
                  variant="dot"
                  invisible={msgAlerts(text)}
                >
                  <ListItemText primary={text} />
                </Badge>
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <List>
          {onlineUsers.map((item, index) => (
            <ListItem
              button
              key={item.socketID}
              onClick={() => {
                if (item.nickname !== nickname) {
                  let tmp = [];
                  allMessage.forEach((msg) => {
                    for (let i = 0; i < allMessage.length; i++) {
                      if (
                        allMessage[i].nickname === item.nickname &&
                        allMessage[i].read === false &&
                        allMessage[i].to === nickname
                      ) {
                        tmp.push(allMessage[i]);
                      }
                    }

                    for (let a = 0; a < tmp.length; a++) {
                      tmp[a].read = true;
                    }
                  });
                  for (let i = 0; i < allMessage.length; i++) {
                    for (let a = 0; a < tmp.length; a++) {
                      if (allMessage[i] === tmp[a]) {
                        let _tmp = allMessage;
                        _tmp[i].read = true;
                        setAllMessage(_tmp);
                      }
                    }
                  }

                  setSelectedChat(item.nickname);
                  getPreviousPrivateMessages(item.nickname);
                }
              }}
            >
              <Badge
                color="secondary"
                variant="dot"
                invisible={msgAlertsPrivate(item.nickname)}
              >
                <Icon
                  className="fas fa-circle"
                  style={{ color: colors.green[500] }}
                />
                <ListItemText
                  primary={item.nickname}
                  style={{ marginLeft: 10 }}
                />
              </Badge>
            </ListItem>
          ))}
          {offlineUsers.map((item, index) => (
            <ListItem button key={index}>
              <Icon
                className="fas fa-circle"
                style={{ color: colors.grey[500] }}
              />
              <ListItemText
                onClick={() => {
                  setSelectedChat(item);
                  getPreviousPrivateMessages(item);
                }}
                primary={item}
                style={{ marginLeft: 10 }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Dialog
        open={openLoginModal}
        onClose={handleLoginDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Giriş Yap</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sohbete dahil olmak için giriş yapın.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="E-Mail"
            type="mail"
            fullWidth
            onChange={(event) => setEMail(event.target.value)}
            onKeyDown={handleLoginDialogEnter}
            required
          />

          <TextField
            margin="dense"
            id="password"
            label="Şifre"
            type="password"
            fullWidth
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={handleLoginDialogEnter}
            required
          />

          {isAlertOpen === true ? (
            <DialogContentText style={{ color: 'red' }}>
              {getErrorMessage}
            </DialogContentText>
          ) : null}

          <Typography
            component="span"
            variant="subtitle2"
            className={classes.inline}
            color="textPrimary"
          >
            Henüz kayıt olmadınız mı?
          </Typography>
          <Button onClick={handleLoginToRegisterButton} color="primary">
            Kayıt Ol
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginDialogClose} color="primary">
            Giriş
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRegisterModal}
        onClose={handleRegisterDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Kayıt Ol</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            Bir kullanıcı adı seçmelisin. 10 Karakterden büyük olamaz.
          </DialogContentText> */}
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="E-Mail"
            type="mail"
            fullWidth
            onChange={(event) => setEMail(event.target.value)}
            onKeyDown={handleRegisterDialogEnter}
            required
          />
          <Typography
            component="span"
            variant="caption"
            className={classes.inline}
            color="textPrimary"
          >
            Kullanıcı adı 10 karakterden büyük olamaz.
          </Typography>
          <TextField
            margin="dense"
            id="nickname"
            label="Kullanıcı adı"
            type="text"
            fullWidth
            onChange={(event) => setNickname(event.target.value)}
            onKeyDown={handleRegisterDialogEnter}
            required
          />

          <TextField
            margin="dense"
            id="password"
            label="Şifre"
            type="password"
            fullWidth
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={handleRegisterDialogEnter}
            required
          />

          <TextField
            margin="dense"
            id="name"
            label="Ad"
            type="text"
            fullWidth
            onChange={(event) => setFirstname(event.target.value)}
            onKeyDown={handleRegisterDialogEnter}
            required
          />

          <TextField
            margin="dense"
            id="surname"
            label="Soyad"
            type="text"
            fullWidth
            onChange={(event) => setLastname(event.target.value)}
            onKeyDown={handleRegisterDialogEnter}
            style={{ marginBottom: 20 }}
            required
          />
          <Typography
            component="span"
            variant="subtitle2"
            className={classes.inline}
            color="textPrimary"
          >
            Doğum Tarihi
          </Typography>
          <TextField
            margin="dense"
            id="birth"
            type="date"
            fullWidth
            onChange={(event) => setBirthday(event.target.value)}
            onKeyDown={handleRegisterDialogEnter}
            required
          />

          {isAlertOpen === true ? (
            <DialogContentText style={{ color: 'red' }}>
              {getErrorMessage}
            </DialogContentText>
          ) : null}

          <Typography
            component="span"
            variant="subtitle2"
            className={classes.inline}
            color="textPrimary"
          >
            Zaten üye misiniz?
          </Typography>
          <Button onClick={handleRegisterToLoginButton} color="primary">
            Giriş Yap
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRegisterDialogClose} color="primary">
            Kayıt Ol
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAvatarModal}
        onClose={handleAvatarDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Profil Fotoğrafı Yükle</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Profil fotoğrafını değiştirmek için resim yükleyiniz.
          </DialogContentText>
          <form
            onSubmit={uploadAvatarImage}
            method="post"
            enctype="multipart/form-data"
          >
            <Grid container>
              <Grid item xs={6}>
                <input
                  className={classes.input}
                  id="contained-button-file"
                  multiple
                  name="avatar"
                  type="file"
                  onChange={onAvatarChange}
                  style={{ display: 'none' }}
                  accept="image/png, image/gif, image/jpg, image/jpeg"
                />
                <label htmlFor="contained-button-file">
                  <Button variant="contained" color="primary" component="span">
                    Dosya Seç
                  </Button>
                </label>
              </Grid>
              <Grid
                item
                xs={6}
                direction="row-reverse"
                style={{ direction: 'rtl' }}
              >
                <Button
                  style={{ marginLeft: '50px' }}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
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

      <Dialog
        open={openCreateRoomModal}
        onClose={handleCreateRoomModalClose}
        aria-labelledby="form-dialog-title"
      >
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
              onChange={(event) => setCreateRoomName(event.target.value)}
              onKeyDown={handleCreateRoomDialogEnter}
              required
            />
          </DialogContentText>
          {isAlertOpen === true ? (
            <DialogContentText style={{ color: 'red' }}>
              Bir oda adı girmelisin!
            </DialogContentText>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateRoomModalClose} color="primary">
            Tamam
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRoomsModal}
        onClose={handleRoomsDialogClose}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="form-dialog-title">Odaya Katıl</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <List>
              {rooms.map((text, index) => {
                return text === 'public' ? null : (
                  <ListItem>
                    <Button
                      key={text}
                      variant="contained"
                      color="primary"
                      component="span"
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        handleRoomsDialogButton(text);
                      }}
                    >
                      +
                    </Button>
                    <ListItemText primary={text} />
                  </ListItem>
                );
              })}
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRoomsDialogClose} color="primary">
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
              content.to === selectedChat ? (
                <ListItem key={index} style={{ padding: 0, paddingLeft: 15 }}>
                  {(() => {
                    if (content.system === true) {
                      return '';
                    } else {
                      let tmp = [];
                      allMessage.forEach((msg) => {
                        for (let i = 0; i < allMessage.length; i++) {
                          if (
                            allMessage[i].to === selectedChat &&
                            allMessage[i].read === false
                          ) {
                            tmp.push(allMessage[i]);
                          }
                        }
                      });
                      for (let i = 0; i < allMessage.length; i++) {
                        for (let a = 0; a < tmp.length; a++) {
                          if (allMessage[i] === tmp[a]) {
                            let _tmp = allMessage;
                            _tmp[i].read = true;
                            setAllMessage(_tmp);
                          }
                        }
                      }

                      return (
                        <ListItemAvatar>
                          <Avatar alt={content.nickname} src={content.avatar} />
                        </ListItemAvatar>
                      );
                    }
                  })()}
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
                </ListItem>
              ) : null}
            </List>
          ))}
        </ul>
        <form id="form" action="" style={formStyle}>
          <input
            type="text"
            id="input"
            autoComplete="off"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={sendMessageHandlerEnter}
            maxLength={50}
          />
          <button type="button" onClick={sendMessageHandler} id="submit">
            Gönder
          </button>
        </form>
      </main>
    </div>
  );
}
