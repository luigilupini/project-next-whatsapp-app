import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import SideBar from "../../components/SideBar";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function ChatDetail(serverProps) {
  console.log("%c getServerSideProps (serverProps) ", "color: skyBlue", {
    serverProps, // We JSON parse this into a useable JS object.
  });
  const [recipient, setRecipient] = useState({});
  const router = useRouter();

  // ! read operation:
  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("email", "==", router.query.recipientEmail)
    );
    getDocs(q).then((snap) => {
      const snapshot = snap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setRecipient(snapshot[0]);
    });
  }, [router.query]);

  return (
    <Container>
      <Head>
        {recipient ? (
          <title>Chat with {recipient.email}</title>
        ) : (
          <title>Chat</title>
        )}
      </Head>
      <SideBar />

      <ChatContainer>
        <ChatScreen
          recipient={recipient}
          chatId={serverProps.chat}
          messages={serverProps.messages}
        />
      </ChatContainer>
    </Container>
  );
}

export async function getServerSideProps(context) {
  // # [Working with sub-collection to existing doc] (https://stackoverflow.com/questions/70551249/firebase-v9-add-subcollection-to-existing-doc):
  const chatsRef = doc(db, "chats", context.query.id);
  const chatRef = collection(chatsRef, "messages");
  const q = query(chatRef, orderBy("timestamp", "asc"));
  const messageSnap = await getDocs(q);
  const messages = messageSnap.docs
    .map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      };
    })
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));
  console.log("%c getDocs messages collection", "color: green", messages);
  const chatSnap = await getDoc(doc(chatRef));
  const chat = {
    ...chatSnap.data(),
    id: chatSnap.id,
  };
  console.log("%c getDoc chat document", "color: green", chat);
  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}

const Container = styled.div`
  display: flex;
  /* background: whitesmoke; */
`;
const ChatContainer = styled.div`
  color: whitesmoke;
  flex: 1;
  overflow: scroll;
  height: 100vh;
  /* Hide scrollbar for Chrome, Safari and Opera */
  /* https://www.w3schools.com/howto/howto_css_hide_scrollbars.asp */
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
