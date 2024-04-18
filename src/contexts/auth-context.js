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
  currentUser: null
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
            currentUser: user
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
      try {
        const q = query(collection(firestore, "users")); // Query all users or your specific logic to get user data
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const user = {
            id: querySnapshot.docs[0].id,
            email: querySnapshot.docs[0].data().u_email,
            //team: querySnapshot.docs[0].data().u_team,
          };
  
          dispatch({
            type: HANDLERS.INITIALIZE,
            payload: user
          });
        } else {
          // No user found, handle this case
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Handle error, set appropriate authentication state
        dispatch({
          type: HANDLERS.INITIALIZE
        });
      }
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
    []
  );

  const skip = () => {
    try {
      window.sessionStorage.setItem('authenticated', 'true');
    } catch (err) {
      console.error(err);
    }
    const user = {
      id: querySnapshot.docs[0].id,
      email: querySnapshot.docs[0].data().u_email,
      team: querySnapshot.docs[0].data().u_team,
    };
    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  };

  const signIn = async (u_email, u_password) => {
    try {
      // 檢查是否存在
      const q = query(collection(firestore, "users"), where('u_email', '==', u_email), where('u_password', '==', u_password));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        // 用戶不存在或密碼錯誤
        throw new Error('Please check your email and password');
      }
  
      const user = {
        id: querySnapshot.docs[0].id, // 獲取用戶ID
        email: querySnapshot.docs[0].data().u_email, //獲取用戶email
        team: querySnapshot.docs[0].data().u_team, //獲取用戶team
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
  

  const signUp = async (password, email, userName, checkpsw ) => {
    try {
      const userId = uuidv4(); // 創建用戶唯一ID
      
      await auth.signUp(userId, password, checkpsw, userName, email); // 傳遞用戶相關信息進行註冊
      await setDoc(doc(firestore, "users", userId), { // 將用戶信息保存到 Firestore 中
        u_id: userId,
        u_password: password,
        u_email: email,
        u_name: userName,
        u_checkpsw: checkpsw,
        u_team: teamCodeName,
      });
      router.push('/'); // 成功註冊後，跳轉到首頁
      alert("User document created successfully!"); // 提示用戶註冊成功
    } 
    catch (error) {
      console.error("Error creating user document:", error); // 處理錯誤
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
