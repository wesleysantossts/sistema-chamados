import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import firebase from "../../services/firebaseConnection";

import Header from "../../components/Header";
import Title from "../../components/Title";

import "./new.css";
import { FiPlusCircle } from "react-icons/fi"

export default function New(){
  const [cliente, setCliente] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(0);

  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Em aberto');
  const [complemento, setComplemento] = useState('');

  const [loadCustomers, setLoadCustomers] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(()=>{
    async function loadCustomer(){
      await firebase.firestore().collection("customers")
      .get()
      .then((snapshot)=>{
        let lista = [];
        
        snapshot.forEach((doc)=>{
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia
          })
        });

        // Usado para organizar os items da lista em ordem alfabética (pelo nomeFantasia)
        lista.sort((a, b)=>{
          let nomeA = a.nomeFantasia
          let nomeB = b.nomeFantasia

          if(nomeA > nomeB){
            return 1
          } else if(nomeA < nomeB){
            return -1
          }

          return 0
        })

        if(lista.length === 0){
          console.log("Nenhuma empresa encontrada.")
          setCliente([{ id: "1", nomeFantasia: "" }]);
          setLoadCustomers(false);
          return
        }

        setCliente(lista);
        setLoadCustomers(false)
      })
      .catch((error)=>{ 
        console.log("DEU RUIM!!!", error);
        setCliente([{ id: "1", nomeFantasia: "" }]);
        setLoadCustomers(false);
      })
    };

    loadCustomer()
  }, [])

  // Envento do formulário
  function handleRegister(e){
    e.preventDefault()
  }

  // Chamado quando troca de assunto
  function handleChangeSelect(e){
    setAssunto(e.target.value);
  };

  // Chamado quando troca de status
  function HandleOptionChange(e){
    setStatus(e.target.value)
  };

  // Chamado quando troca o cliente
  function handleChangeCustomers(e){
    setClienteSelecionado(e.target.value)
  }

  return(
    <div>
      <Header/>
      <div className="content">
        <Title name="Novo chamado">
          <FiPlusCircle size={24} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            {/* select - tem que passar uma "key" como atributo */}
            <label>Cliente</label><br/>
            { loadCustomers ? (
              <>
              <input type="text" disabled={true} value="Carregando clientes..." /><br/>
              </>
            ) : (
              <>
              <select value={clienteSelecionado} onChange={handleChangeCustomers}>
                {cliente.map((item, index) => {
                  return (
                    <option key={item.id} value={index}>
                      {item.nomeFantasia}
                    </option>
                  )
                })}
              </select><br/>
              </>
            )}

            <label>Assunto</label><br/>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte" >Suporte</option>
              <option value="Visita técnica">Visita técnica</option>
              <option value="Financeiro">Financeiro</option>
            </select><br/>
            
            <label>Status</label><br/>
            <div className="status">
              <input type="radio" name="radio" value="Em aberto" onChange={HandleOptionChange} checked={ status === "Em aberto" } /><span>Em aberto</span>
              <input type="radio" name="radio" value="Progresso" onChange={HandleOptionChange} checked={ status === "Progresso" } /><span>Progresso</span>
              <input type="radio" name="radio" value="Atendido" onChange={HandleOptionChange} checked={ status === "Atendido" } /><span>Atendido</span>
              <br/>
            </div>

            <label>Complemento</label><br/>
            <textarea type="text" placeholder="Descreva seu problema (opcional)." name="message" value={complemento} onChange={(e)=> setComplemento(e.target.value)} /><br/>

            <button type="submit">Registrar</button>
          </form> 
        </div>
      </div>
    </div>
  )
};