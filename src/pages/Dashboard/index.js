import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";

import Header from "../../components/Header";
import Title from "../../components/Title";

import "./dashboard.css";
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from "react-icons/fi";

export default function Dashboard(){
  const [chamados, setChamados] = useState([1]);

  const { signOut } = useContext(AuthContext);


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
                    <tr>
                      <td data-label="Cadastrado em">20/11/2021</td>
                      <td data-label="Cliente">Dev Master</td>
                      <td data-label="Assunto">Suporte</td>
                      <td data-label="Status">
                        <span className="badge" style={{backgroundColor: '#5cb85c'}}>Em aberto</span>
                      </td>
                      <td data-label="#">
                        <button className="action" style={{backgroundColor: "#3583f6"}}>
                          <FiSearch color="white" />
                        </button>
                        <button className="action" style={{backgroundColor: "#F6a935"}}>
                          <FiEdit2 color="white" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
        </div>
      </div>
    )
  };