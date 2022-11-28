import styled from "styled-components";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

import moment from "moment";

function Message({ user, message }) {
  console.log("%c <Message /> ", "color: yellow", {
    user,
    message,
  });
  const [authUser] = useAuthState(auth);
  // Logic to determine if message styling is for a sender or receiver:
  const TypeOfMessage = user === authUser.email ? Sender : Receiver;
  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </Timestamp>
      </TypeOfMessage>
    </Container>
  );
}

export default Message;

const Container = styled.div``;

const MessagePopup = styled.p`
  color: black;
  font-size: small;
  width: fit-content;
  padding: 15px;
  padding-bottom: 26px;
  border-radius: 8px;
  min-width: 60px;
  position: relative;
  text-align: right;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
`;

const Sender = styled(MessagePopup)`
  margin-left: auto;
  background: #d9fdd3;
`;

const Receiver = styled(MessagePopup)`
  margin-right: auto;
  background: #ffffff;
`;

const Timestamp = styled.span`
  color: gray;
  position: absolute;
  font-size: 8px;
  padding: 10px;
  bottom: 0;
  right: 0;
  text-align: right;
`;
