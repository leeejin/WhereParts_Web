import React,{Component} from "react";
import Template from "../templates/consists"
import Transaction from "../components/transaction_manager/home_transaction";

export default class TransactionPage extends Component{
   render(){
    return(
        <Template>
            <Transaction/>
        </Template>
    )
   }
}