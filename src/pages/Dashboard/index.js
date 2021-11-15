import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "../../services/firebaseConnection";

import Header from "../../components/Header";
import Title from "../../components/Title";
import Modal from "../../components/Modal";

import "./dashboard.css";
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from "react-icons/fi";
import {toast} from "react-toastify";
import {format} from "date-fns";

//- .orderBy(propriedade, asc/desc) - método usado para ordenar uma array a partir do valor de uma propriedade de um objeto, em ordem crescente (asc) ou decrescente (desc)
const listRef = firebase.firestore().collection("chamados").orderBy("created", "desc")

export default function Dashboard(){
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();


  useEffect(()=>{
    async function loadChamados(){
      //- .limit(qtdNumber) - método usado para limitar o número de items que retornará a cada consulta
      await listRef.limit(5)
      .get()
      .then((snapshot)=>{
        updateState(snapshot)
      })
      .catch((error)=>{
        console.error("Deu ruim.", error);
        toast.error("Erro ao fazer a consulta. Tente novamente mais tarde.");
        setLoadingMore(false)
      });
  
      setLoading(false)
    };
    
    // Pode-se escrever a função fora do bloco do useEffect e chamar a função aqui ao invés de escrever ela aqui dentro, isso para poder chamar ela em outros lugares do código também
    loadChamados()

    return() => {

    }
  }, []);

  

  async function updateState(snapshot){
    // snapshot.size - propriedade do snapshot que indica o tamanho dele
    const isCollectionEmpty = snapshot.size === 0;

    if(!isCollectionEmpty){
      let lista = [];

      snapshot.forEach((doc)=> {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          // format(propriedadeDesejada, formatoData("dd/mm/yyyy")) - função do "date-fns" para transformar o formato da data como o dev desejar
            //- não esquecer de colocar o método ".toDate()" depois da propriedade para funcionar
          createdFormated: format(doc.data().created.toDate(), "dd/MM/yyyy"),
          status: doc.data().status,
          complemento: doc.data().complemento
        })
      });

      // Pegando o último documento buscado
      const lastDoc = snapshot.docs[snapshot.docs.length -1]; 

      // Acrescentando aos chamados já chamados os novos chamados que acrescentar na lista quando selecionar a opção "carregar mais chamados"
      setChamados(chamados => [...chamados, ...lista]);
      setLastDocs(lastDoc)

    } else {
      setIsEmpty(true)
    }

    setLoadingMore(false)
  };

  //> botão carregar mais dados
  async function handleMore(){
    setLoadingMore(true);

    await listRef.startAfter(lastDocs).limit(5)
    .get()
    .then((snapshot)=>{ 
      updateState(snapshot); 
    })
  }

  //> Função do modal
  function togglePostModal(item){
    setShowPostModal(!showPostModal);
    setDetail(item);
  }



  if(loading){
    return(
      <div>
        <Header />
        <div className="content">
        <Title name="Chamados">
          <FiMessageSquare size={24} />
        </Title>

        <div className="container dashboard">
          <span>Buscando dados...</span>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header/>

      <div className="content">
        <Title name="Chamados">
          <FiMessageSquare size={24} />
        </Title>
      
        {chamados.length === 0 ? (
            <div className="container dashboard">
                <span> Você não possui nenhum chamado. </span>
                <Link to="/new" className="new">
                  <FiPlus size={24} color="white" />
                  Novo chamado
                </Link>
            </div>
          ) : (
            //- <></> - chamado de "Fragment", usado para quando não precisar de uma div/não ter nenhuma estilização 
            <>
              <Link to="/new" className="new">
                <FiPlus size={24} color="white" />
                Novo chamado
              </Link>

              <table>
                <thead>
                  <tr>
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((item, index)=>{
                    return(
                    <tr key={index}>
                      <td data-label="Cadastrado em">{item.createdFormated}</td>
                      <td data-label="Cliente">{item.cliente}</td>
                      <td data-label="Assunto">{item.assunto}</td>
                      <td data-label="Status">
                        {/* como usar a validação condicional no atributo */}
                        <span className="badge" style={{backgroundColor: (item.status === "Aberto") ? null : (item.status === "Progresso") ?  "#AAA" : (item.status === "Atendido") ? "#5cb85c" : "#F6a935"}}>{item.status}</span>
                      </td>
                      <td data-label="#">
                        <button className="action" style={{backgroundColor: "#3583f6"}} onClick={()=> togglePostModal(item)}>
                          <FiSearch color="white" />
                        </button>
                        <Link className="action2" style={{backgroundColor: "#F6a935"}} to={`/new/${item.id}`}>
                          <FiEdit2 color="white" />
                        </Link>
                      </td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>

              {loadingMore && <h3 style={{marginTop: 15}}>Buscando dados...</h3>}
              {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>}
            </>
          )}

          <div>
            {showPostModal && (
              <Modal 
                conteudo={detail}
                close={togglePostModal}
              />
            )}
          </div>
      </div>
    </div>
  )
};