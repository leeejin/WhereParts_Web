import React, { Component } from "react";
import { Container, Table } from "react-bootstrap";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import WebServiceManager from "../../util/webservice_manager";
import Constant from "../../util/constant_variables";
import PageHeader from "../../util/page_header";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ModalUserDetail from '../user_manager/modal_user_detail';
import ModalUserRegister from '../user_manager/modal_user_register'

import Pagenation2 from "../../util/pagenation2";

export default class UserManager extends Component {
    constructor(props) {
        super(props);


        this.approval = Constant.getApproval();
        this.sales = Constant.getSales();

        this.itemCountPerPage = 17; //한페이지당 보여질 리스트 갯수
        this.pageCountPerPage = 5;

        this.contents = []; //서버에서 가져온 원본 contents


        this.state = {
            modalVisible: false, //상품 모달

            userContents: [], //회원정보데이터
            item: [],
            selectedItemIndex: null,

            userRegisterModalVisible: false,
            approve: this.approval[0].value, //승인여부 드롭박스 All:전체 , 0:승인됨 , 1:승인안됨
            sale: this.sales[0].value, //판매건수 드롭박스 2:전체, max:높은순, min:낮은순

            date: 0,  // 0: 전체, 1:today, 2:month, 배열:기간
            dateRange: [], //기간 범위
            searchText: '',

            currentPage: 1,      // 현재 페이지 (setCurrentPage()에서 변경됨)
            offset: 0,            //현재페이지에서 시작할 item index


        }
    }

    componentDidMount() {
        this.callGetUsersAPI().then((response) => {
            console.log('user', response)
            this.contents = response;

            this.setState({ userContents: this.contents })
        })
    }

    //회원 정보 가져오는 API
    async callGetUsersAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetUsers", "post");
        manager.addFormData("data", { userID: 28, passwd: "9999" });
        let response = await manager.start();
        if (response.ok)
            return response.json();

    }
    //프로젝트 리스트에서 하나의 아이템을 선택하면 DetailPopup창을 띄우고 현재 선택된 아이템의 index 설정
    setItemIndex = (item) => {
        this.setState({
            modalVisible: !this.state.modalVisible,
            item: item
        });
    }
    //Pagenation에서 몇페이지의 내용을 볼지 선택 (페이지를 선택하면 현재의 페이지에따라 offset 변경)
    setCurrentPage = (page) => {
        let lastOffset = (page - 1) * this.itemCountPerPage;
        this.setState({ currentPage: page, offset: lastOffset });
    };


    //기간설정리스너
    onDateListener = (date) => {
        console.log('date', date)
        this.setState({ date: date })
        this.setState({ userContents: this.dataFiltering(date, this.state.searchText, this.state.approve, this.state.sale) })
    }
    onDateRangeListener = (dates) => {
        this.setState({ date: dates })
        this.setState({ userContents: this.dataFiltering(dates, this.state.searchText, this.state.approve, this.state.sale) });
    }
    //검색리스너
    searchTextListener = (text) => {
        this.setState({ searchText: text })
        this.setState({ userContents: this.dataFiltering(this.state.date, text, this.state.approve, this.state.sale) })
    }
    //승인여부리스너
    selectApproveListener = (value) => {
        this.setState({ approve: value })
        this.setState({ userContents: this.dataFiltering(this.state.date, this.state.searchText, value, this.state.sale) })
    }
    //판매건수 리스너
    selectSaleListener = (value) => {
        this.setState({ sale: value })
        this.setState({ userContents: this.dataFiltering(this.state.date, this.state.searchText, this.state.approve, value) })
    }

    //기간설정에 따른 데이터필터링
    dataFiltering(date, text, approve, sale) {
        console.log('date: ', date)
        console.log('text: ', text)
        console.log('approve: ', approve)
        console.log('sale: ', sale)
        let filteredContents = this.contents;

        filteredContents = filteredContents.filter((item) => {
            if (date === 1)
                return Constant.isSameDate(new Date(item.registerDate))
            else if (date === 2)
                return Constant.isSameMonth(new Date(item.registerDate))
            else if (date.length === 2)
                return new Date(item.registerDate) >= date[0] && new Date(item.registerDate) <= date[1]
            else
                return true

        })

        filteredContents = filteredContents.filter((item) => {
            console.log('keyword: ', text)
            if (item.companyNo.includes(text))
                return true
        });

        filteredContents = filteredContents.filter((item) => {
            if (approve === this.approval[0].value)
                return true;
            else
                return item.validate === approve
        })

        filteredContents = filteredContents.filter((item) => {
            if (sale === this.sales[0].value)
                return true;
            else
                return item.sale === sale
        })

        return filteredContents

    }
    render() {
        console.log('approval', this.state.approval)
        console.log('sale', this.state.sale)
        return (
            <div>
                {/* 서브탑메뉴바 영역 */}
                <Container>
                    <nav className="topmenubar">
                        <div className="d-flex topmenubar">
                            <Box style={{ marginRight: '15px' }} sx={{ minWidth: 190 }} >
                                <FormControl fullWidth>
                                    <InputLabel>승인여부</InputLabel>
                                    <Select
                                        value={this.state.approve}
                                        label="승인여부"
                                        onChange={(e) => this.selectApproveListener(e.target.value)}
                                    >
                                        {this.approval.map((item, i) => <MenuItem value={item.value} key={i}>{item.title}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* 승인됨을 클릭한 경우만 판매건수 콤보박스 활성화 */}
                            {this.state.approve === 0 &&
                                <Box style={{ marginRight: '15px' }} sx={{ minWidth: 190 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>판매건수</InputLabel>
                                        <Select
                                            value={this.state.sale}
                                            label="판매건수"
                                            onChange={(e) => this.selectSaleListener(e.target.value)}
                                        >
                                            {this.sales.map((item, i) => <MenuItem value={item.value} key={i}>{item.title}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Box>
                            }
                            <button className="darknavy" onClick={() => { this.setState({ userRegisterModalVisible: true }) }}><PersonAddIcon /></button>
                        </div>


                        <PageHeader onDateRangeListener={this.onDateRangeListener} onDateListener={this.onDateListener} searchTextListener={(text) => this.searchTextListener(text)} />


                    </nav>
                    {
                        this.state.userRegisterModalVisible && <ModalUserRegister hideButtonClicked={() => { this.setState({ userRegisterModalVisible: false }) }} />
                    }
                    {
                        this.state.modalVisible && <ModalUserDetail item={this.state.item} hideButtonClicked={this.setItemIndex} />
                    }
                    {/* 테이블 영역 */}
                    <Table hover style={{ marginBottom: 5 }}>
                        <thead>
                            <tr>
                                <th>상호</th>
                                <th>사업자번호</th>
                                <th>전화번호</th>
                                <th>가입일시</th>
                                <th>주소</th>
                                <th>가입승인</th>
                                <th>판매건수</th>
                            </tr>
                        </thead>
                        {/* 튜플영역을 map을 사용하여 하나씩 받아와 뿌려주도록 구성함 */}
                        <tbody>
                            {
                                this.state.userContents.slice(this.state.offset, this.state.offset + this.itemCountPerPage).map((item, i) =>
                                    <UserManagerItems item={item} key={i} listener={(item) => this.setItemIndex(item)} />)
                            }
                        </tbody>
                    </Table>
                    <footer className="w-100 p-2" style={{ textAlign: 'center' }}>
                        {this.state.userContents.length > 0 && (
                            <Pagenation2 itemCount={this.state.userContents.length} pageCountPerPage={this.pageCountPerPage} itemCountPerPage={this.itemCountPerPage} currentPage={this.state.currentPage} clickListener={this.setCurrentPage} />
                        )}</footer>

                </Container>
            </div>



        );
    }
}


//--------------------------------------------------------------------------------------------------------
// 테이블에 데이터를 뿌려주는 클래스
class UserManagerItems extends Component {
    constructor(props) {
        super(props);

    }
    onClickListener = () => {
        this.props.listener(this.props.item);
    }
    render() {
        const item = this.props.item;
        return (
            <tr onClick={this.onClickListener}>
                <td>{item.companyName}</td>
                <td>{item.companyNo}</td>
                <td>{item.companyTel}</td>
                <td>{item.registerDate}</td>
                <td>{item.companyAddress}</td>
                {/* 0:승인됨, 1:승인안됨 */}
                {item.validate === 0
                    ? (<td>O</td>)
                    : (<td>X</td>)
                }
                <td>{item.sale}</td>
            </tr>
        )

    }
}