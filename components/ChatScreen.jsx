import { useState } from "react";
import { useRouter } from "next/router";

import styled from "styled-components";
import Message from "./Message";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";

import { Avatar, IconButton } from "@material-ui/core";
import {
  EmojiEmotionsOutlined,
  Mic,
  MoreVert,
  SearchOutlined,
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

import TimeAgo from "timeago-react";
import { useRef } from "react";

function ChatScreen({ messages, recipient }) {
  const [input, setInput] = useState("");
  const endOfMessageRef = useRef(null);
  const [user] = useAuthState(auth);
  const router = useRouter();

  // ! read operation:
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

  // ! update & add operation:
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
    scrollToEnd();
  };

  const scrollToEnd = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient.photoUrl} referrerPolicy="no-referrer" />
        ) : (
          <Avatar>{recipient[0]}</Avatar>
        )}

        <HeaderInformation>
          <h3>{recipient.email}</h3>
          {recipient ? (
            <p>
              {" "}
              Last active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient.lastSeen.toDate()} />
              ) : (
                "Unknown"
              )}
            </p>
          ) : (
            <p>Loading last active state</p>
          )}
        </HeaderInformation>

        <HeaderIcon>
          <IconButton>
            <SearchOutlined style={{ color: "#53656f" }} />
          </IconButton>
          <IconButton>
            <MoreVert style={{ color: "#53656f" }} />
          </IconButton>
        </HeaderIcon>
      </Header>

      {/* display messages in here: */}
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessageContainer>
      <InputContainer>
        <EmojiEmotionsOutlined style={{ color: "#53656f" }} />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <Mic style={{ color: "#53656f" }} />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div`
  border-left: 1px solid #d1d7db;
  border-right: 1px solid #d1d7db;
  border-bottom: 1px solid #d1d7db;
`;

const Header = styled.div`
  position: sticky;
  background: #f1f2f5;
  color: black;
  z-index: 100;
  top: 0;
  display: flex;
  /* padding: 11px; */
  padding-left: 15px;
  align-items: center;
  /* justify-content: space-between; */
  /* box-shadow: 0px 4px 14px -3px rgb(0, 0, 0, 0.2); */
`;

const HeaderInformation = styled.div`
  padding: 9px;
  flex: 1;
  margin-left: 15px;
  > h3 {
    font-size: 14px;
    margin-bottom: 3px;
  }
  > p {
    margin-top: 6px;
    font-size: 12px;
    color: gray;
  }
`;

const HeaderIcon = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  min-height: 90vh;
`;

// Here we auto scroll to this empty containing placeholder:
const EndOfMessage = styled.div`
  margin-bottom: 20px;
`;

const InputContainer = styled.form`
  background: #f1f2f5;
  color: gray;
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 10px;
  z-index: 100;
`;

const Input = styled.input`
  background: white;
  flex: 1;
  position: sticky;
  margin: 0px 15px;
  bottom: 0;
  align-items: center;
  padding: 10px;
  border: none;
  border-radius: 5px;
`;
