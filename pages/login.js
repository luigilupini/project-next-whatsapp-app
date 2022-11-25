import Head from "next/head";
import Image from "next/image";

import styled from "styled-components";
import { Button } from "@material-ui/core";

/* # https://firebase.google.com/docs/auth/web/google-signin#web-version-9_4:
`signInWithPopup` authenticates firebase client using a popup-based OAuth flow. If succeeds, returns the signed in user along with the provider's credential. Unsuccessful returns an error object containing info about the error. */
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

function Login() {
  const signIn = async () => {
    await signInWithPopup(auth, provider)
      .then(() => console.log("%c User signed-in", "color: lightblue"))
      .catch(alert);
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        <Logo
          src="/logo.png"
          width={300}
          height={300}
          alt="logo"
          priority={100}
        />
        <Button onClick={signIn} variant="outlined">
          Sign in with Google
        </Button>
      </LoginContainer>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  /* background: whitesmoke; */
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 100px;
  align-items: center;
  background: white;
  border-radius: 2vmax;
  box-shadow: 0px 4px 14px -3px rgb(0, 0, 0, 0.6);
`;

const Logo = styled(Image)`
  width: 200px;
  height: 200px;
  margin-bottom: 50px;
`;
