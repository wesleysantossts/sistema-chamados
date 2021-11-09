import {useState, useContext} from "react";
import {Link} from "react-router-dom";
import { AuthContext } from "../../contexts/auth";

import logo from "../../assets/img/logo.png";
import "./sign.css";

function SignIn() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const { signIn, loadingAuth } = useContext(AuthContext);

  // o "form" manda um evento como parametro, posso usar o método "preventDefault()" nesse evento para a tela não recarregar (e os dados inseridos no formulario sumirem) quando eu enviar o formulário 
  function handleAdd(e){
    e.preventDefault();

    if(!!email && !!senha){
      signIn(email, senha);
    }
  };

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt={"Sistema logo"}/> 
        </div>
        <form onSubmit={handleAdd}>
          <h1>Entrar</h1>
          <input type="text" placeholder="E-mail" value={email} onChange={(e)=> {setEmail(e.target.value)}}/>
          <input type="password" placeholder="******" value={senha} onChange={(e)=> {setSenha(e.target.value)}} />

          <button type="submit">{loadingAuth ? "Carregando..." : "Acessar"}</button>
        </form>
        
        <Link to="/register">Criar uma conta</Link>
      </div>
    </div>
  );
}

export default SignIn;