import { createContext, useContext, useEffect, useState } from "react";
import { signInWithMoralis } from "@moralisweb3/client-firebase-evm-auth";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useWebSocketProvider } from "wagmi";
import { useAccount } from "wagmi";
import { auth, db, moralisAuth } from "~~/config/firebase";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

const AuthContext = createContext<any>({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const configuredNetwork = getTargetNetwork();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        loginWithWallet(connector).then(() => {
          console.log("User authenticated");
        });
      } catch (error) {
        console.error(error);
      }
    },

    onDisconnect() {
      logout();
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = (email: string, password: string) => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("User signed up");
        return createUserWithEmailAndPassword(auth, email, password);
      })
      .catch(error => {
        console.log(error.code, error.message);
      });
  };

  const login = (email: string, password: string) => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .catch(error => {
        console.log(error.code, error.message);
      });
  };

  const webSocketProvider = useWebSocketProvider({
    chainId: configuredNetwork.id,
  });

  const loginWithWallet = async () => {
    setPersistence(auth, browserLocalPersistence)
      .then(async () => {
        const userCredential = await signInWithMoralis(moralisAuth, {
          provider: webSocketProvider,
        });
        const userId = userCredential.credentials.user.displayName;
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await setDoc(doc(db, "users", userId), {
            address: userCredential.credentials.user.displayName,
          });
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      })
      .catch(error => {
        console.log(error.code, error.message);
      });
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithWallet, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
