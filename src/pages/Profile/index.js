import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import firebase from "../../services/firebaseConnection";

import Header from "../../components/Header";
import Title from "../../components/Title";

import "./profile.css";
import { FiSettings, FiUpload } from "react-icons/fi";
import avatar from "../../assets/img/avatar.png";
import { toast } from "react-toastify";

export default function Profile(){
  const { user, signOut, setUser, storageUser, loading, setLoading } = useContext(AuthContext);

  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);

  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);

  //> Função para mostrar o preview da imagem na tela
  function handleFile(e){
    console.log(e.target.files[0]);
    //- e.target.files[0] - usado para pegar o arquivo que foi inserido no input
    if(e.target.files[0]){
      const image = e.target.files[0];

      // .type - usado para saber o tipo de arquivo enviado
      if(image.type === "image/jpeg" || image.type === "image/png"){
        setImageAvatar(image);
        //- URL.createObjectURL(caminhoArquivo) - usado para criar uma URL para o arquivo apontado
        setAvatarUrl(URL.createObjectURL(e.target.files[0]));
      } else {
        toast.error("Envia uma imagem do tipo PNG ou JPEG.");
        setImageAvatar(null);
        return null
      }
    }
  };

  
  async function handleUpload(){
    const uid = user.uid;

    const uploadTask = await firebase.storage()
    //- .ref(nomePathCriado) - usado para criar a pasta onde serão salvos os arquivos do usuário no Storage 
    .ref(`images/${uid}/${imageAvatar.name}`)
    // .put(arquivo) - usado para apontar o arquivo que será feito o upload para a pasta; retorna um Promise 
    .put(imageAvatar)
    .then(async ()=>{
      toast.success("Foto enviada com sucesso!")

      await firebase.storage().ref(`images/${uid}`)
      //- .child(nomePathFilho) - usado para entrar na pasta filha do ref apontado
        // .getDownloadURL() - usado para obter o link da URL da imagem salva OU link do arquivo; retorna uma Promise (com um evento com a "url") 
      .child(imageAvatar.name).getDownloadURL()
      .then(async (url)=> {
        const urlFoto = url;

        await firebase.firestore().collection("users")
        .doc(uid)
        .update({
          avatarUrl: urlFoto,
          nome: nome
        })
        .then(()=>{
          const data = {
            ...user,
            avatarUrl: urlFoto,
            nome: nome
          };

          setUser(data);
          storageUser(data);
        })
      })
    })
  };

  async function handleSave(e){
    e.preventDefault();

    if(imageAvatar === null && nome !== ""){
      await firebase.firestore().collection("users")
      .doc(user.uid)
      .update({
        nome: nome
      })
      .then(()=>{
        let data = {
          ...user,
          nome: nome
        };

        setUser(data);
        storageUser(data);
      });

    } else if(nome !== "" && imageAvatar !== null){
      handleUpload();
    }
  };


  return(
    <div>
      <Header/>
      <div className="content">
        <Title name="Meu perfil">
          <FiSettings size={24} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleSave}>
            <label className="label-avatar">
              <span>
               <FiUpload color="#FFF" size={24}/>
              </span>

              <input type="file" accept="image/*" onChange={handleFile}/><br/>
              {avatarUrl ? 
              <img src={avatarUrl} alt="Foto de perfil" /> :
              <img src={avatar} alt="Foto de perfil" /> }
            </label>
            <label>Nome</label><br/>
            <input type="text" value={nome} onChange={(e)=> setNome(e.target.value)} /><br/>
            <label>E-mail</label><br/>
            {/* disabled={true} - usado para deixar o campo desabilitado, não permitindo edição */}
            <input type="text" value={email} disabled={true} /><br/>

            <button type="submit">{loading ? "Salvando..." : "Salvar"}</button>
          </form>
        </div>
        
        <div className="container">
          <button className="signout-btn" onClick={()=> signOut()}> Sair </button>
        </div>
      </div>
    </div>
  )
}