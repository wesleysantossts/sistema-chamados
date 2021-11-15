/* eslint-disable jsx-a11y/anchor-is-valid */
import "./modal.css";
import {FiX} from "react-icons/fi";

export default function Modal({conteudo, close}){
  return(
    <div className="modal">
      <div className="conteudo">
        <button className="close" onClick={ close }>
          <FiX size={24} color="#FFF"/>
          Voltar
        </button>

        <div>
          <h2>Detalhes do chamado</h2>

          <div className="row">
            <span>
              Cliente: {conteudo.cliente}
            </span>
          </div>
          <div className="row">
            <span>
              Assunto: <a>{conteudo.assunto}</a>
            </span>
            <span>
              Cadastrado em: <a>{conteudo.createdFormated}</a>
            </span>
          </div>
          <div className="row">
            <span>
              Status: <a style={{color: "#FFF", paddingLeft: 3, paddingRight: 3, paddingTop: 2, paddingBottom: 2, borderRadius: 4, backgroundColor: (conteudo.status === "Aberto" ? null : (conteudo.status === "Progresso") ? "#AAA" : (conteudo.status === "Atendido") ? "#5cb85c" : 'orange')}}>{conteudo.status}</a>
            </span>
          </div>
            {conteudo.complemento !== "" && (
             <>
              <span>Complemento:</span><br/>
              <p>{conteudo.complemento}</p>
             </> 
            )}
        </div>
      </div>
    </div>
  )
}