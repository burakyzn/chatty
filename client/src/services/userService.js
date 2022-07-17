import api from "../core/api"

const apis = Object.freeze({
  UPLOAD_AVATAR : '/user/avatar',
  DETAILS : '/user'
})

const userService = {
  userDetails: async () => {
    return await api.get(apis.DETAILS)
      .then(response => response.data)
      .then(response => {
        if(!response.success)
          throw {code: response.code, message: response.message};
        return response;
      });
  },
  uploadAvatar: async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);

    return await api.post(apis.UPLOAD_AVATAR, formData)
      .then(response => response.data)
      .then(response => {
        if(!response.success)
          throw {code: response.code, message: response.message};
        return response;
      })
  }
};

export default userService;