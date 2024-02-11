import React, { Component } from "react";
import { Container, Table } from "react-bootstrap";
import PageHeader from "../../util/page_header";
import WebServiceManager from "../../util/webservice_manager";
import Constant from "../../util/constant_variables";

import Pagenation2 from "../../util/pagenation2";
import ModalGoodsDetail from "./modal_sale_detail";

export default class Sale extends Component {
    constructor(props) {
        
        super(props);
      
        this.itemCountPerPage = 11; //한페이지당 보여질 리스트 갯수
        this.pageCountPerPage = 5;

        this.contents = []; //서버에서 가져온 원본 contents

        this.state = {
            modalVisible: false, //상품 모달

            goodsContents: [],           //검색 결과 Contents
            selectedgoodsID: null,

            date: 0,  // 0: 전체, 1:today, 2:month, 배열:기간
            searchText:'',

            currentPage: 1,      // 현재 페이지 (setCurrentPage()에서 변경됨)
            offset: 0            //현재페이지에서 시작할 item index
        }
    }

    componentDidMount() {
        this.callGetGoodsAPI().then((response) => {
            this.contents = response;
            this.setState({ goodsContents: response });
        });

    }
   
    //기간설정리스너
    onDateListener = (date) => {
        console.log('date', date)
        this.setState({date:date})
        this.setState({goodsContents:this.dataFiltering(date,this.state.searchText)})
    }
    onDateRangeListener = (dates) => {
        this.setState({date:dates})
        this.setState({ goodsContents:this.dataFiltering(dates,this.state.searchText) });
    }
    searchTextListener =(text)=>{

        this.setState({searchText:text})
        this.setState({goodsContents:this.dataFiltering(this.state.date,text)})
     
    }

     //기간설정에 따른 데이터필터링
    dataFiltering(date,text){
        console.log('date',date)
        console.log('text',text)
        let filteredContents=this.contents;
        
        filteredContents=filteredContents.filter((item)=>{
            if(date===1)
                return Constant.isSameDate(new Date(item.registerDate))
            else if(date===2)
                return Constant.isSameMonth(new Date(item.registerDate))
            else if(date.length===2)    
                return new Date(item.registerDate) >= date[0] && new Date(item.registerDate) <= date[1]
            else 
                return true
            
        }) 
            
        filteredContents=filteredContents.filter((item) => {   
            console.log('keyword: ',text);
            console.log('item',item)
            if(item.name.includes(text))
                return true
            });
        
        return filteredContents
    }
    //프로젝트 리스트에서 하나의 아이템을 선택하면 DetailPopup창을 띄우고 현재 선택된 아이템의 index 설정
    setItemIndex = (goodsID) => {
        this.setState({
            modalVisible: !this.state.modalVisible,
            selectedgoodsID: goodsID
        });
    }


    //Pagenation에서 몇페이지의 내용을 볼지 선택 (페이지를 선택하면 현재의 페이지에따라 offset 변경)
    setCurrentPage = (page) => {
        let lastOffset = (page - 1) * this.itemCountPerPage;
        this.setState({ currentPage: page, offset: lastOffset });
    };


   

    async callGetGoodsAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoods?login_id=1");
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }

    render() {
        return (
            <Container>
                <nav className="topmenubar">
                    <PageHeader onDateRangeListener={this.onDateRangeListener} onDateListener={this.onDateListener} searchTextListener={(text)=>this.searchTextListener(text)}/>

                </nav>
                {
                    this.state.modalVisible && <ModalGoodsDetail goodsID={this.state.selectedgoodsID} hideButtonClicked={()=>this.setState({ modalVisible: !this.state.modalVisible})} />
                }

                    <Table hover style={{ marginBottom: 5}}>
                        <thead>
                            <tr>
                                <th>판매자</th>
                                <th width={"20%"}>품명</th>
                                <th width={"20%"}>올린날짜</th>
                                <th>판매금액</th>
                                <th>수량</th>
                                <th>상품이미지</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.goodsContents.slice(this.state.offset, this.state.offset + this.itemCountPerPage).map((item, i) =>
                                    <SaleItem item={item} key={item.id} listener={(goodsID)=>this.setItemIndex(goodsID)} />)
                            }
                        </tbody>
                    </Table>

                    <footer className="w-100 p-2" style={{ textAlign: 'center' }}>
                        {this.state.goodsContents.length>0 &&
                        (<Pagenation2 itemCount={this.state.goodsContents.length} pageCountPerPage={this.pageCountPerPage} itemCountPerPage={this.itemCountPerPage} currentPage={this.state.currentPage} clickListener={this.setCurrentPage} />
                        )}
                        
                    </footer>

            </Container>

        );
    }
}

class SaleItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goodsFirstImageURI: '',
        }
    }
    componentDidMount() {
        console.log('itemID',this.props.item.id)
        this.callGetGoodsFirstImageAPI().then((response) => {
            console.log('response',response)
            this.setState({ goodsFirstImageURI: URL.createObjectURL(response) })
        })

    }
    
    onClickListener = () => {
        this.props.listener(this.props.item.id);
    }
    async callGetGoodsFirstImageAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.props.item.id + "&position=1");
        let response = await manager.start();
        if (response.ok) {
            return response.blob();
        }
    }
    render() {
   
        const item = this.props.item;
        return (
            <tr onClick={this.onClickListener}>
                <td>{item.userID}</td>
                <td>{item.name}</td>
                <td>{item.registerDate}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td width="100px">
                    <img alt="" height="50px" width="50px" src={this.state.goodsFirstImageURI} />
                </td>
            </tr>
        )
    }
}
