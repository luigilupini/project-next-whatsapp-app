import Chat from "./Chat";
import styled from "styled-components";

import { Avatar, Button, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import { MoreVert, Search, Sms } from "@material-ui/icons";

// # https://www.npmjs.com/package/email-validator:
import * as emailValidator from "email-validator";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import { collection, addDoc, where, query } from "firebase/firestore";

function SideBar() {
  const [user] = useAuthState(auth);
  const userPhoto = user.photoURL;
  const chatRef = collection(db, "chats");
  const q = query(chatRef, where("users", "array-contains", user.email));
  const [chatsSnapshot] = useCollection(q);

  // Here we need to add the chats into our firestore `db` after validation.
  const createChat = async (e) => {
    const input = prompt("Please enter the user email, you wish to chat with");
    if (!input) return null;
    if (input === user.email) {
      console.log("%c 🙊 you can't chat with yourself!", "color: red");
      return; // exit condition
    }
    if (chatAlreadyExist(input)) {
      console.log("%c 🙊 already a user!", "color: red");
      return; // exit condition
    }
    if (!emailValidator.validate(input)) {
      console.log("%c 🙊 email not valid!", "color: red");
      return; // exit condition
    }
    // Finally if all is valid, we can then append this chat to firestore!
    const chatsRef = collection(db, "chats");
    await addDoc(chatsRef, {
      users: [user.email, input],
    })
      .then((doc) => console.log("%c addDoc chats", "color: green"))
      .catch((error) => console.error(error));
  };

  // Existing chat validation function:
  const chatAlreadyExist = (recipientEmail) => {
    /* Optional chaining `?` operator accesses an object's property or calls a function. If undefined or null, it returns that instead of an error. */
    return !!chatsSnapshot?.docs.find((chat) => {
      // Here we first filter from the snapshot all the users from each chat.
      // Then we check if the user is equal to the passing recipient email.
      const users = chat.data().users;
      return users.find((user) => user === recipientEmail)?.length > 0;
    });
  };
  return (
    <Container>
      <Header>
        <UserAvatar onClick={() => auth.signOut()} src={userPhoto}></UserAvatar>
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </IconsContainer>
      </Header>

      <SearchContainer>
        <Search />
        <SearchInput placeholder="Search in chats" />
      </SearchContainer>

      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

      {/* List of chatty users */}
      {chatsSnapshot?.docs.map((chat) => {
        // console.log(chat.data().users);
        return <Chat key={chat.id} id={chat.id} users={chat.data().users} />;
      })}
    </Container>
  );
}
export default SideBar;

const Container = styled.div`
  flex: 0.5;
  background: white;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;

  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  /* border-bottom: 1px solid whitesmoke; */
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  margin-left: 5px;
  outline-width: 0;
  border: none;
  flex: 1;
  font-size: 12px;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  && {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;
