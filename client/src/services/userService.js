import api from "../core/api"

const apis = Object.freeze({
  GET_USERS: '/user',
  ME : '/user/me',
  UPLOAD_AVATAR : '/user/avatar',
  UPLOAD_ABOUT_ME: '/user/about-me'
})

const userService = {
  getUsers: async () => {
    return await api.get(apis.GET_USERS)
    .then(response => response.data)
    .then(response => {
      if(!response.success)
        throw {code: response.code, message: response.message};
      return response;
    });
  },
  userDetails: async () => {
    return await api.get(apis.ME)
      .then(response => response.data)
      .then(response => {
        if(!response.success)
          throw {code: response.code, message: response.message};
        return response;
      });
  },
  updateAvatar: async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);

    return await api.put(apis.UPLOAD_AVATAR, formData)
      .then(response => response.data)
      .then(response => {
        if(!response.success)
          throw {code: response.code, message: response.message};
        return response;
      })
  },
  updateAboutMe: async (aboutMe) => {
    return await api.put(apis.UPLOAD_ABOUT_ME, {aboutMe})
      .then(response => response.data)
      .then(response => {
        if(!response.success)
          throw {code: response.code, message: response.message};
        return response;
      })
  },
};

export default userService;