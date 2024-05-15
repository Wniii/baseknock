import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { firestore, firebaseApp } from "src/firebase";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import { query, collection, getDocs, doc, setDoc } from "firebase/firestore";

const auth = getAuth(firebaseApp);

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  currentUser: null,
  userId: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const { user, userId } = action.payload;
    return {
      ...state,
      isAuthenticated: !!user,
      isLoading: false,
      currentUser: user,
      userId: userId
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const { user, userId } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      currentUser: user,
      userId
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      currentUser: null,
      userId: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const AuthContext = createContext({ undefined });

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: { user, userId: user.uid }
        });
      } else {
        dispatch({ type: HANDLERS.INITIALIZE, payload: { user: null, userId: null } });
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: { user, userId: user.uid }
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error('Login failed');
    }
  };

  const signOut = () => {
    firebaseSignOut(auth).then(() => {
      dispatch({ type: HANDLERS.SIGN_OUT });
    }).catch((error) => {
      console.error('Sign out failed:', error);
    });
  };

  const signUp = async (email, password, userName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(firestore, "users", user.uid), {
        u_id: user.uid,
        u_email: email,
        u_name: userName
      });
      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: { user, userId: user.uid }
      });
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error('Registration failed');
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
