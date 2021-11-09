import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";

import Header from "../../components/Header";
import Title from "../../components/Title";

import "./dashboard.css";
import { FiMessageSquare, FiPlus } from "react-icons/fi";

export default function Dashboard(){
  const [chamados, setChamados] = useState([]);

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
              </>
            )}
        </div>
      </div>
    )
  };