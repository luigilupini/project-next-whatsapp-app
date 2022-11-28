import Image from "next/image";
import { ThreeBounce } from "better-react-spinkit";
import styled from "styled-components";

function Loading() {
  return (
    <Wrapper>
      <Image
        src="/logo.png"
        width={120}
        height={120}
        alt="logo"
        priority={100}
        style={{ marginBottom: "30px" }}
      />
      <ThreeBounce size={15} color="#3CBC28" />
    </Wrapper>
  );
}

export default Loading;

const Wrapper = styled.div`
  background: #53656f;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
