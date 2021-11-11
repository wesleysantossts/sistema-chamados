import {createContext, useState, useEffect} from "react";
import firebase from "../services/firebaseConnection";
import { toast } from "react-toastify";

export const AuthContext = createContext({});

export default function AuthProvider({children}){
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (function loadStorage(){
      const storageUser = localStorage.getItem("SistemaUser");

      if(storageUser){
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
      setLoading(false);
    })()
  }, [])

  //> Criando a permanência dos dados

  function storageUser(data){
    localStorage.setItem("SistemaUser", JSON.stringify(data))
  };

  //> Cadastrando um novo usuário

  async function signUp(nome, email, password){
    setLoadingAuth(true);

    await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(async (value)=>{
      let uid = value.user.uid;

      await firebase.firestore().collection("users")
      .doc(uid).set({
        nome: nome,
        avatarUrl: null
      })
      .then(()=>{
        const data = {
          uid: uid,
          nome: nome,
          email: value.user.email,
          avatarUrl: null
        }

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        toast.success("Usuário cadastrado com sucesso!")
      })
    })
    .catch((error)=> console.error("DEU RUIM!!!", error));
    toast.error("Ops! Algo deu errado.")
  };

  //> Logando o usuário
  async function signIn(email, password){
    setLoadingAuth(true);

    await firebase.auth().signInWithEmailAndPassword(email, password)
    .then(async (value)=>{
      let uid = value.user.uid;

      const userProfile = await firebase.firestore().collection("users")
      .doc(uid).get();

      let data = {
        uid: uid,
        nome: userProfile.data().nome,
        avatarUrl: userProfile.data().avatarUrl,
        email: value.user.email
      };

      setUser(data);
      storageUser(data);
      setLoading(false);
      toast.success("Bem-vindo de volta!")
    })
    .catch((error)=> {
      console.error("DEU RUIM!!!", error);
      setLoadingAuth(false);
      toast.error("Ops! Algo deu errado. Tente novamente.")
    })
  }

  //> Deslogando o usuário

  async function signOut(){
    await firebase.auth().signOut();
    localStorage.removeItem("SistemaUser");
    setUser(null);
    toast.success("Até a próxima!")
    setLoadingAuth(false)
  }

  return(
    // !!user - as "!!" na frente da variavel transforma o resultado em booleano, isto é, se tiver algo dentro de "user" retornará true, se não tiver algo dentro de "user" retornará false
    <AuthContext.Provider value={{signed: !!user, user, setUser, loading, setLoading, loadingAuth, signUp, signOut, signIn, storageUser}}>
      {children}
    </AuthContext.Provider>
  )
}