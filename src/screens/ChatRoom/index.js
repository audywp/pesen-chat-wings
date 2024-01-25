import React, {useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import Auth from '@react-native-firebase/auth';
import {
  ACCESS_TOKEN,
  NOTIFICATION_URL,
  connection,
} from '../../helpers/config/db';
import {getUser} from '../../helpers/function/getUser';
import messaging from '@react-native-firebase/messaging';

export default function ChatRoom({route}) {
  const friendPhoneNumber = route.params.selectedFriend;

  const currentUser = Auth().currentUser;

  const chatId = `${friendPhoneNumber}${currentUser.phoneNumber}`
    .split('')
    .sort()
    .join('');

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const listenChat = connection
      .ref(`chat/${chatId}`)
      .on('value', async payload => {
        const data = payload?.val() ? Object.values(payload.val()) : [];
        setMessages(
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        );
      });

    return listenChat;
  }, [chatId]);

  const onSend = async (message = []) => {
    const hallo = messaging().isDeviceRegisteredForRemoteMessages;
    console.log(hallo, 'hallo');
    const me = await getUser(currentUser.phoneNumber);
    const friend = await getUser(friendPhoneNumber);
    const body = {
      message: {
        token: friend.FCMToken,
        data: {},
        notification: {
          body: message[0].text,
          title: me.displayName,
        },
      },
    };
    console.log(body, 'body');
    const res = await fetch(NOTIFICATION_URL, {
      method: 'POST',
      headers: {Authorization: `Bearer ${ACCESS_TOKEN}`},
      body: JSON.stringify(body),
    });
    console.log(await res.json(), 'Res');

    connection.ref(`chat/${chatId}`).push({
      _id: message[0]._id, // ini id dari setiap chat
      text: message[0].text,
      createdAt: `${new Date()}`,
      user: {
        _id: me.phoneNumber, // id pengirim pesan
        avatar: me.photoURL,
        name: me.displayName,
      },
    });
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={message => onSend(message)}
      user={{
        _id: currentUser.phoneNumber,
      }}
    />
  );
}
