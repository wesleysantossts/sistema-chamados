import Header from "../../components/Header";
import Title from "../../components/Title";

import "./new.css";
import { FiPlusCircle } from "react-icons/fi"

export default function New(){
  return(
    <div>
      <Header/>
      <div className="content">
        <Title name="Novo chamado">
          <FiPlusCircle size={24} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={()=>{}}>
            {/* select - tem que passar uma "key" como atributo */}
            <label>Cliente</label><br/>
            <select>
              <option key={1} value={1} checked>Escolha um cliente</option>
              <option value="">Supermercado</option>
            </select><br/>

            <label>Assunto</label><br/>
            <select>
              <option value="Suporte" checked>Suporte</option>
              <option value="Visita técnica">Visita técnica</option>
              <option value="Financeiro">Financeiro</option>
            </select><br/>
            
            <label>Status</label><br/>
            <div className="status">
              <input type="radio" name="radio" value="Em aberto" /><span>Em aberto</span>
              <input type="radio" name="radio" value="Progresso" /><span>Progresso</span>
              <input type="radio" name="radio" value="Atendido" /><span>Atendido</span>
              <br/>
            </div>

            <label>Complemento</label><br/>
            <textarea type="text" placeholder="Descreva seu problema (opcional)." name="message"></textarea><br/>

            <button type="submit">Salvar</button>
          </form> 
        </div>
      </div>
    </div>
  )
};