import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";

import "./header.css";
import { FiHome, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import avatar from "../../assets/img/avatar.png"

export default function Header(){
  const { user, signOut } = useContext(AuthContext);
  
  return(
    <div className="sidebar">
      <div>
        <img src={!!user.avatarUrl ? user.avatarUrl : avatar} alt="Foto avatar" />
      </div>

      <Link to="/dashboard"> 
        <FiHome color="rgba(255,255,255, 0.7)" size={24} />
        Chamados
      </Link>

      <Link to="/customers"> 
        <FiUser color="rgba(255,255,255, 0.7)" size={24} />
        Clientes
      </Link>

      <Link to="/profile"> 
        <FiSettings color="rgba(255,255,255, 0.7)" size={24} />
        Configurações
      </Link>
      
      <a onClick={signOut}> 
        <FiLogOut color="rgba(255,255,255, 0.7)" size={24} />
        Sair
      </a>
    </div>
  )
}