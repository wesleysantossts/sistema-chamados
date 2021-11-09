import { useContext } from "react";
import {AuthContext} from "../contexts/auth";
import { Route, Redirect } from "react-router-dom";


export default function RouteWrapper({
    // Adicionando partes dos parametros
        // isPrivate - usado para apontar se a página é privada ou não
    component: Component, isPrivate, ...rest
}){
    const { signed, loading } = useContext(AuthContext);
    
    // como importei pelo "useContext" esses states, não tenho mais necessidade de criar as "const" signed e loading neste arquivo
    // const loading = false;
    // const signed = false;

    // const history = useHistory();

    if(loading){
        return(
            <div></div>
        )
    };

    if(!signed && isPrivate){
        return <Redirect to="/" />
        // return history.replace("/")
    }
    
    if(signed && !isPrivate){
        return <Redirect to="/dashboard" />
        // return history.replace("/dashboard")
    }

    return(
        <Route
            {...rest}
            render={props => (
                <Component {...props} />
            )}
        />
    )
}