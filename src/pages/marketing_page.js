import React,{Component} from "react";
import Template from "../templates/consists"
import Marketing from "../components/marketing/marketing";

export default class MarketingPage extends Component{
   render(){
    return(
        <Template>
            <Marketing/>
        </Template>
    )
   }
}