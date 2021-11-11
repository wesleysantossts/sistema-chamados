import {useState, useContext} from "react";
import { AuthContext } from "../../contexts/auth"
import {Link} from "react-router-dom";
import logo from "../../assets/img/logo.png";

import {toast} from "react-toastify";

function SignUp() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const { signUp } = useContext(AuthContext);

  // o "form" manda um evento como parametro, posso usar o método "preventDefault()" nesse evento para a tela não recarregar (e os dados inseridos no formulario sumirem) quando eu enviar o formulário 
  function handleAdd(e){
    e.preventDefault();

    if(!!nome && !!email && !!senha){
      signUp(nome, email, senha);
      // toast.success("Usuário cadastrado com sucesso!");

      return
    }

    toast.error("Você deixou de inserir algum dado!")
  };

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt={"Sistema logo"}/> 
        </div>
        <form onSubmit={handleAdd}>
          <h1>Cadastrar</h1>
          <input type="text" placeholder="Seu nome" value={nome} onChange={(e)=> setNome(e.target.value)} />
          <input type="text" placeholder="E-mail" value={email} onChange={(e)=> setEmail(e.target.value)}/>
          <input type="password" placeholder="******" value={senha} onChange={(e)=> setSenha(e.target.value)} />

          <button type="submit">Cadastrar</button>
        </form>
        
        <Link to="/">Já tem uma conta? Entre</Link>
      </div>
    </div>
  );
}

export default SignUp;