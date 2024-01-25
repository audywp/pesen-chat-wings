import {connection} from '../config/db';

export const getUser = async phoneNumber => {
  const user = await connection.ref(`/users/${phoneNumber}`).once('value');

  return user.val();
};
