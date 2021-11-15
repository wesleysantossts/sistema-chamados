import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import firebase from "../../services/firebaseConnection";
import { useHistory, useParams } from "react-router-dom";

import Header from "../../components/Header";
import Title from "../../components/Title";

import "./new.css";
import { FiPlusCircle } from "react-icons/fi";
import { toast } from "react-toastify"

export default function New(){
  const [cliente, setCliente] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(0);
  const [idCustomer, setIdCustomer] = useState(false);

  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Em aberto');
  const [complemento, setComplemento] = useState('');

  const [loadCustomers, setLoadCustomers] = useState(true);
  const { user } = useContext(AuthContext);

  const { id } = useParams();
  const history = useHistory();

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
        setLoadCustomers(false);

        if(id){
          loadId(lista)
        }
      })
      .catch((error)=>{ 
        console.log("DEU RUIM!!!", error);
        setCliente([{ id: "1", nomeFantasia: "" }]);
        setLoadCustomers(false);
      })
    };

    loadCustomer()
  }, [id]);

  async function loadId(lista){
    await firebase.firestore().collection("chamados").doc(id)
    .get()
    .then((snapshot)=>{
      setAssunto(snapshot.data().assunto);
      setStatus(snapshot.data().status);
      setComplemento(snapshot.data().complemento)

      // findIndex(item => condição) - método usado para encontrar o index do item desejado
      let index = lista.findIndex(item => item.id === snapshot.data().clienteId);

      setClienteSelecionado(index);
      setIdCustomer(true)
    })
    .catch((error)=>{
      console.log("Deu ruim", error);
      setIdCustomer(false)
    })
  };

  // Envento do formulário
  async function handleRegister(e){
    e.preventDefault();

    // se o usuário tiver escolhido a opção de editar o chamado
    if(idCustomer){
      await firebase.firestore().collection("chamados")
      .doc(id)
      .update({
        cliente: cliente[clienteSelecionado].nomeFantasia,
        clienteId: cliente[clienteSelecionado].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid
      })
      .then(()=>{
        toast.success("Chamado editado com sucesso!")
        setClienteSelecionado(0);
        setComplemento("");
        //> history.push(rota) - usado para redirecionar o cliente para uma rota desejada 
        history.push("/dashboard")
      })
      .catch((error)=> {
        toast.error("Chamado não atualizado. Tente mais tarde.")
        console.log(error)
      })

      return
    };

    await firebase.firestore().collection("chamados")
    .add({
      created: new Date(),
      cliente: cliente[clienteSelecionado].nomeFantasia,
      clienteId: cliente[clienteSelecionado].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userId: user.uid
    })
    .then(()=>{
      toast.success("Chamado registrado com sucesso!");
      setComplemento("");
      setClienteSelecionado(0);
    })
    .catch((error)=>{
      console.log("DEU RUIM!!!", error);
      toast.error("Ops! Parece que deu algum erro. Tente novamente mais tarde.");
    })
  };

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
            
            { idCustomer ? (
              <button type="submit">Editar</button> 
            ) : (
              <button type="submit">Registrar</button>
            )
            }
          </form> 
        </div>
      </div>
    </div>
  )
};