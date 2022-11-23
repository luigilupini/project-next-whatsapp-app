export const getRecipientEmail = (users, user) =>
  users?.filter((userList) => userList !== user?.email)[0];
