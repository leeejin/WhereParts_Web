import React, { Component } from "react";
import { Container, Table } from "react-bootstrap";
import PageHeader from "../../util/page_header";

import SalesDetailModal from "./modal_trans_detail";
import Constant from "../../util/constant_variables";
import Pagenation2 from "../../util/pagenation2";

export default class Transaction extends Component {
    constructor(props) {
        super(props);
     
        this.itemCountPerPage = 17; //한페이지당 보여질 리스트 갯수
        this.pageCountPerPage = 5;

        this.contents = []; //서버에서 가져온 원본 contents

        this.state = {
            modalVisible: false, //상품 모달

            selectList: ["배송전", "배송중", "배송완료", "거래완료"],
            selectValue: "배송전",
            transactionColmname: ["판매자", "품명", "구매자", "결제수단", "결제날짜", "주문번호"],
            salesContents: [],

            selectedItemIndex: null,

            date: 0,  // 0: 전체, 1:today, 2:month, 배열:기간
            searchText: '',
            currentPage: 1,      // 현재 페이지 (setCurrentPage()에서 변경됨)
            offset: 0            //현재페이지에서 시작할 item index
        }
    }
    componentDidMount() {
        this.contents = [{
            userID: "배송전 판매자",
            name: "품명",
            registerDate: "2020-05-30",
            price: 10000,
            quantity: 1
        }];

        this.setState({ salesContents: this.dataFiltering(0) });

    }
    //기간설정리스너
    onDateListener = (date) => {
        console.log('date', date)
        this.setState({ date: date })
        this.setState({ salesContents: this.dataFiltering(date, this.state.searchText) })
    }
    onDateRangeListener = (dates) => {
        this.setState({ date: dates })
        this.setState({ salesContents: this.dataFiltering(dates, this.state.searchText) });
    }
    searchTextListener = (text) => {

        this.setState({ searchText: text })
        this.setState({ salesContents: this.dataFiltering(this.state.date, text) })

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
       /*      
        filteredContents=filteredContents.filter((item) => {   
            console.log('keyword: ',text);
            console.log('item',item)
            if(item.companyNo.includes(text))
                return true
            }); */
        
        return filteredContents
    }
    //프로젝트 리스트에서 하나의 아이템을 선택하면 DetailPopup창을 띄우고 현재 선택된 아이템의 index 설정
    setItemIndex = (index) => {
        this.setState({
            modalVisible: !this.state.modalVisible,
            selectedItemIndex: index
        });
    }



    //Pagenation에서 몇페이지의 내용을 볼지 선택 (페이지를 선택하면 현재의 페이지에따라 offset 변경)
    setCurrentPage = (page) => {
        let lastOffset = (page - 1) * this.itemCountPerPage;
        this.setState({ currentPage: page, offset: lastOffset });
    };


    //라디오버튼리스너
    handleChange = (e) => {
        this.setState({ selectValue: e.target.value });
        console.log(`*****handleChange*****`);
        console.log(`선택한 값 : ${e.target.value}`);
    }
    render() {

        return (
            <Container>
                <nav className="topmenubar">
                    <div className="d-flex topmenubar">
                        {this.state.selectList.map((value, i) => (
                            <div style={{ marginRight: '15px' }} key={i}>
                                <input
                                    id={value}
                                    value={value}
                                    name="radio"
                                    type="radio"
                                    checked={this.state.selectValue === value}
                                    onChange={this.handleChange} />
                                <label htmlFor={value}> {value}</label>

                            </div>
                        ))}

                    </div>
                    <PageHeader onDateRangeListener={this.onDateRangeListener} onDateListener={this.onDateListener} searchTextListener={(text)=>this.searchTextListener(text)}/>
                </nav>
                {
                    this.state.modalVisible && <SalesDetailModal item={this.state.salesContents[this.state.selectedItemIndex]} hideButtonClicked={this.setItemIndex} />
                }

                <Table hover style={{ marginBottom: 5 }} >
                    <thead>
                        <tr>
                            {
                                this.state.transactionColmname.map((tcname, i) =>
                                    <th key={i}>{tcname}</th>
                                )
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.salesContents.length > 0 && this.state.salesContents.slice(this.state.offset, this.state.offset + this.itemCountPerPage).map((item, i) =>
                                <TransactionItem item={item} key={i} index={i} listener={this.setItemIndex} />)
                        }
                    </tbody>
                </Table>
                <footer className="w-100 p-2" style={{ textAlign: 'center' }}>
                    <Pagenation2 itemCount={1/*this.state.goodsContents.length*/} pageCountPerPage={this.pageCountPerPage} itemCountPerPage={this.itemCountPerPage} currentPage={this.state.currentPage} clickListener={this.setCurrentPage} />
                </footer>
            </Container>

        );
    }
}


class TransactionItem extends Component {
    constructor(props) {
        super(props);
    }
    onClickListener = () => {
        this.props.listener(this.props.index);
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
                <td>{item.quantity}</td>
            </tr>
        )
    }
}

