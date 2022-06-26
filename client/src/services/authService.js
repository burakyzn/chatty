import api from "../core/api"
import {auth} from '../core/firebase'

const apis = Object.freeze({
  REGISTER : '/user/register',
  NICKNAME : '/user/nickname'
})

const authService = {
  register: async (nickname, email, password) => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then(async () => {
        return await api.post(apis.REGISTER, {nickname, email})
          .then(response => response.data)
          .then(response => {
            if(!response.success)
              throw {code: response.code, message: response.message};
            return response;
          })
      })
      .catch((error) => {
        throw {code: error.code, message: error.message};
      });
  },
  login: async (email, password) => {
    return auth
      .signInWithEmailAndPassword(email, password)
      .then(async (record) => ({
        nickname: record.user.displayName, 
        token : await record.user.getIdToken().then((token) => token)
      }))
      .catch((error) => {
        throw {code: error.code, message: error.message};
      });
  },
  nickname: async () => {
    return await api.get(apis.NICKNAME)
      .then(response => response.data)
      .then(response => {
        if(!response.success)
          throw {code: response.code, message: response.message};
        return response;
      });
  }
};

export default authService;