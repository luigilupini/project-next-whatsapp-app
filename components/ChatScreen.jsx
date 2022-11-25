import { useState } from "react";
import { useRouter } from "next/router";

import styled from "styled-components";
import Message from "./Message";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";

import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile,
  InsertEmoticonRounded,
  MicNoneRounded,
  MoreVert,
} from "@material-ui/icons";

import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getRecipientEmail } from "../utils/getRecipientEmail";

function ChatScreen({ recipient, chat, messages }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [input, setInput] = useState("");

  // # [Working with sub-collection to existing doc] (https://stackoverflow.com/questions/70551249/firebase-v9-add-subcollection-to-existing-doc):
  const docRef = doc(db, "chats", router.query.id); // doc in chats collection
  const colRef = collection(docRef, "messages"); // messages sub-collection
  const q = query(colRef, orderBy("timestamp", "asc"));
  const [snapshotQy] = useCollection(q);

  const showMessages = () => {
    // ! client-side render (mount only):
    if (snapshotQy?.docs.length) {
      console.log("%c <ChatScreen /> (CSR) ", "color: yellow");
      return snapshotQy.docs.map((message) => {
        return (
          <Message
            key={message.id}
            user={message.data().user}
            message={{
              ...message.data(),
              timestamp: message.data().timestamp?.toDate().getTime(),
            }}
          />
        );
      });
      // ! server-side render (pre-rendered):
    } else {
      console.log("%c <ChatScreen /> (SSR) ", "color: yellow");
      const convert = JSON.parse(messages);
      return convert.map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  // ! update & add operations:
  const sendMessage = async (e) => {
    e.preventDefault();
    const usersRef = collection(db, "users");
    const userRef = doc(usersRef, user.uid);
    await setDoc(userRef, { lastSeen: serverTimestamp() }, { merge: true })
      .then((doc) => console.log("%c setDoc user.uid: ", "color: green"))
      .catch((error) => console.error(error));

    const chatsRef = collection(db, "chats");
    const chatRef = doc(chatsRef, router.query.id);
    const messagesRef = collection(chatRef, "messages");
    await addDoc(messagesRef, {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    })
      .then((doc) => console.log("%c addDoc: ", "color: green", doc.path))
      .catch((error) => console.error(error));

    setInput("");
  };

  return (
    <Container>
      <Header>
        <Avatar />

        <HeaderInformation>
          <h3>{recipient}</h3>
          <p>Last seen ...</p>
        </HeaderInformation>

        <HeaderIcon>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </HeaderIcon>
      </Header>

      {/* display messages in here: */}
      <MessageContainer>
        {showMessages()}
        <EndOfMessage />
      </MessageContainer>
      <InputContainer>
        <InsertEmoticonRounded />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <MicNoneRounded />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div`
  border-right: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
`;

const Header = styled.div`
  position: sticky;
  background: white;
  color: black;
  z-index: 100;
  top: 0;
  display: flex;
  /* padding: 11px; */
  padding-left: 5px;
  align-items: center;
  /* justify-content: space-between; */
  border-bottom: 1px solid whitesmoke;
  box-shadow: 0px 4px 14px -3px rgb(0, 0, 0, 0.2);
`;

const HeaderInformation = styled.div`
  flex: 1;
  margin-left: 15px;
  > h3 {
    /* font-size: 14px; */
    margin-bottom: 3px;
  }
  > p {
    /* margin-top: -1px; */
    /* font-size: 14px; */
    color: gray;
  }
`;

const HeaderIcon = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  min-height: 90vh;
`;

// Here we auto scroll to this empty container:
const EndOfMessage = styled.div``;

const InputContainer = styled.form`
  color: gray;
  background: white;
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 10px;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  position: sticky;
  margin: 0px 5px;
  bottom: 0;
  align-items: center;
  padding: 10px;
  background: whitesmoke;
  border: none;
  border-radius: 5px;
`;
