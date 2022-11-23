import styled from "styled-components";

import { Avatar, Button, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import { MoreVert, Search } from "@material-ui/icons";

// # https://www.npmjs.com/package/email-validator:
import * as emailValidator from "email-validator";
import { auth } from "../firebase";

function SideBar() {
  const createChat = (e) => {
    const input = prompt("Please enter the user email, you wish to chat with");
    if (!input) return null;
    if (emailValidator.validate(input)) {
      // If valid we need to append chat to firestore!
    }
  };

  return (
    <Container>
      <Header>
        <UserAvatar onClick={() => auth.signOut()}></UserAvatar>
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
    </Container>
  );
}
export default SideBar;

const Container = styled.div`
  background: white;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
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
`;

const SidebarButton = styled(Button)`
  width: 100%;
  && {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;
