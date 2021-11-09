import {useState} from "react";
import firebase from "../../services/firebaseConnection";

import Header from "../../components/Header";
import Title from "../../components/Title";

import "./customers.css";
import { FiUser } from "react-icons/fi";
import { toast } from "react-toastify"

export default function Customers(){
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");

  async function handleAdd(e){
    e.preventDefault();

    if(!!nomeFantasia && !!cnpj && !!endereco){
      await firebase.firestore().collection("customers")
      .add({
        nomeFantasia: nomeFantasia,
        cnpj: cnpj,
        endereco: endereco
      })
      .then(()=>{
        toast.info("Empresa cadastrada com sucesso!");
        setNomeFantasia("");
        setCnpj("");
        setEndereco("");
      })
      .catch((error)=>{
        console.error(error);
        toast.warning("Erro ao cadastrar a empresa.");
      })
    } else {
      toast.error("Preencha todos os campos.")
    }
  };

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Clientes">
          <FiUser size={24} />
        </Title>
      </div>
      <div className="container content customerContainer">
        <form className="form-profile customers" onSubmit={handleAdd}>
          <label>Empresa</label><br/>
          <input type="text" placeholder="Nome da empresa" value={nomeFantasia} onChange={(e)=> setNomeFantasia(e.target.value)}/><br/>
          <label>CNPJ</label><br/>
          <input type="tel" placeholder="Seu cnpj" value={cnpj} onChange={(e)=> setCnpj(e.target.value)}/><br/>
          <label>Endereço</label><br/>
          <input type="text" placeholder="Endereço da empresa" value={endereco} onChange={(e)=> setEndereco(e.target.value)}/><br/>

          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>    
  )
}