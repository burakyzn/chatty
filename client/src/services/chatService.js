import api from "../core/api"

const apis = Object.freeze({
  PUBLIC_MESSAGES : '/chat/publicMessages',
  PRIVATE_MESSAGES : '/chat/privateMessages'
})

const chatService = {
  getPublicMessages: async () => {
    return await api.get(apis.PUBLIC_MESSAGES)
      .then(response => response.data)
      .then(response => {
        if(!response.success)
          throw {code: response.code, message: response.message};
        return response;
      })
  },
  getPrivateMessages: async (nickname) => {
    let url = `${apis.PRIVATE_MESSAGES}/${nickname}`;
    
    return await api.get(url)
      .then(response => response.data)
      .then(response => {
        if(!response.success)
          throw {code: response.code, message: response.message};
        return response;
      })
  }
};

export default chatService;