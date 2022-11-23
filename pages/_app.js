import { useEffect } from "react";
import "../styles/globals.css";
import Loading from "../components/Loading";
import Login from "./login";
/* # https://nextjs.org/docs/advanced-features/custom-app:
`_app.js` contains your whole app, meaning its rendered on all pages within your project. `index.js` will only render if you access / path of your website.

Next.js uses the `App` component to initialize pages. You can override it and control the page initialization and:

- Persist layouts between page changes
- Keeping state when navigating pages
- Custom error handling using componentDidCatch
- Inject additional data into pages
- Add global CSS

`Component` prop is the active page, so whenever you navigate between routes, your `Component` will change to the new page. Therefore, any props you send to `Component` will be received by the page. `pageProps` is an object with initial props that we want preloaded for our page. For example by a data fetch method, otherwise it's an empty object. */

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";

function MyApp({ Component, pageProps }) {
  /* # https://www.npmjs.com/package/react-firebase-hooks:
  This library explores how React Hooks can work to make integration with Firebase even more straightforward than it already is.
  
  React Firebase Hooks provides a convenience listener for Firebase Auth `auth` state. The hook wraps around the firebase `auth.onAuthStateChange` method to ensure that it is always up to date. */
  const [user, loading, error] = useAuthState(auth);

  const addUser = async (user) => {
    const userRef = collection(db, "users");
    let data = {
      userId: user.uid,
      email: user.email,
      lastSeen: serverTimestamp(),
      photoUrl: user.photoURL,
    };
    await setDoc(doc(userRef, user.uid), data, { merge: true })
      .then((userRef) => "Doc was added")
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (user) addUser(user);
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;
