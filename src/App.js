import {BrowserRouter,Route, Routes,} from "react-router-dom";

import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from "./pages/login_page";
import DashBoardPage from './pages/dashboard_page';
import UserInfoPage from "./pages/user_info_page";
import SalePage from "./pages/sale_page";
import TransactionPage from "./pages/transaction_page";
import MarketingPage from "./pages/marketing_page";

function App() {
  return (
   <BrowserRouter basename="/admin">
    <Routes>
      <Route path="/" element={<LoginPage/>} />
      <Route path="/DashBoard" element={<DashBoardPage/>}/>
      <Route path="/UserInfo" element={<UserInfoPage/>}/>
      <Route path="/Sale" element={<SalePage/>}/>
      <Route path="/Transaction" element={<TransactionPage/>}/>
      <Route path="/Marketing" element={<MarketingPage/>}/>
    </Routes>
   </BrowserRouter>
  );
}

export default App;
