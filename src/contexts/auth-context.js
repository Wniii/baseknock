import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { firestore } from "../pages/firebase";
import { query, collection, where, getDocs, doc, setDoc } from "firebase/firestore";



const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = window.sessionStorage.getItem('authenticated') === 'true';
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      const user = {
        id: '5e86809283e28b96d2d38537',
        avatar: '/assets/avatars/avatar-anika-visser.png',
        name: 'Anika Visser',
        email: 'anika.visser@devias.io'
      };

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const skip = () => {
    try {
      window.sessionStorage.setItem('authenticated', 'true');
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: '5e86809283e28b96d2d38537',
      avatar: '/assets/avatars/avatar-anika-visser.png',
      name: 'Anika Visser',
      email: 'anika.visser@devias.io'
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  };

  const signIn = async (u_email, u_password) => {
    try {
      // 连接数据库，检查用户是否存在
      const q = query(collection(firestore, "users"), where('u_email', '==', u_email), where('u_password', '==', u_password));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        // 用户不存在或密码错误
        throw new Error('Please check your email and password');
      }
  
      // 用户存在且密码正确，进行登录
      const user = {
        id: querySnapshot.docs[0].id, // 获取用户文档的ID
        email: querySnapshot.docs[0].data().u_email, // 获取用户的邮箱
        // 其他用户信息根据需要从数据库中获取
      };
  
      window.sessionStorage.setItem('authenticated', 'true');
  
      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: user
      });
    } catch (err) {
      console.error(err);
      throw new Error('Please check your email and password');
    }
  };
  

  const signUp = async (userId, password, email, userName, checkpsw ) => {
    try {
      
      await auth.signUp(values.u_id, values.u_password,values.u_checkpsw, values.u_name, values.u_email);
      await setDoc(doc(firestore, "users", userId), {
        u_id: userId,
        u_password: password,
        u_email: email,
        //p_id: playerId,
        u_name: userName,
        u_checkpsw: checkpsw,
      });
      router.push('/');
      alert("User document created successfully!");
    } 
    catch (error) {
      console.error("Error creating user document:", error);
      
      //throw new Error('Sign up is not implemented');
    }
    
  };

  const signOut = () => {
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
