import React, { Component } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/react';
import { Card, Button, Table, Carousel, Modal, CloseButton } from "react-bootstrap";

import DashBoardDetail from "./modal_dashboard_detail";
import Constant from "../../util/constant_variables";
export default class DashBoard extends Component {
    constructor(props) {
        super(props);
         this.today=new Date()
        
        this.state = {
            selectDate: null,
            modalVisible: true,
            saleContents: [
                {
                    title: '판매건수 : 23건',
                    date: '2023-05-11',
                },
                {
                    title: '판매건수 : 23건',
                    date: '2023-05-13',
                }]
        }
    }
    componentDidMount(){
        this.setState({selectDate:Constant.DateToString(new Date())})
    }
    dateClicked = (info) => { //해당 날짜 클릭했을 경우
        this.setState({ modalVisible: true, selectDate: info.dateStr })
    }
    render() {
    
        return (
            <>
                <div className="background location">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView={'dayGridMonth'}
                        headerToolbar={
                            {
                                start: 'today',
                                center: 'title',
                                end: 'prev,next'
                            }
                        }
                        height={"85vh"}
                        dateClick={this.dateClicked}
                        events={this.state.saleContents}
                    />
                    {this.state.modalVisible && <DashBoardTopList selectDate={this.state.selectDate}/>}

                </div>

            </>

        );
    }
}

class DashBoardTopList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            priceTopList: [
                { name: "인제정비", price: 2554000, },
                { name: '부산정비', price: 203400 },
                { name: '마산정비', price: 232000 },
                { name: '김해정비', price: 12000 },
                { name: '울산정비', price: 15000 },
                { name: '포항정비', price: 2000 },
                { name: '부산정비', price: 2000 },
                { name: '부산정비', price: 2000 },
                { name: '부산정비', price: 2000 },
                { name: '서울정비', price: 2000 }]
        }
    }
    topLinkDetailClicked = () => {
        console.log()
        this.setState({ modalVisible: true })
    }
    render() {
        const selectDate = this.props.selectDate
        return (

            <Card style={{ marginLeft: 15, minWidth: '200px' }}>
                <Card.Header>
                    <Card.Title className="m-auto textcenter p-2" ><p className="m-auto fontSize">{selectDate}</p>TOP 10</Card.Title>
                </Card.Header>

                <Card.Body>
                    <Table className="height textcenter" >
                        <tbody>
                            {this.state.priceTopList.map((item, i) => 
                            
                            <tr valign="middle">
                            <td>{i + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                             </tr>
                            
                            
                            )}

                        </tbody>
                    </Table>
                </Card.Body>
                <Card.Footer className="p-3">
                    <Button onClick={this.topLinkDetailClicked} style={{ backgroundColor: '#F7F7F7', color: 'blue', borderColor: '#F7F7F7' }}>더보기</Button>
                    {this.state.modalVisible && <DashBoardDetail hideModal={() => { this.setState({ modalVisible: false }) }} />}
                </Card.Footer>
            </Card>

        )
    }
}

