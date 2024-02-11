import React, { Component } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/react';
import { Card, Button, Table, Carousel, Modal, CloseButton } from "react-bootstrap";


export default class DashBoardDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
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

    render() {

        return (
            <div className="modal width height" >

                <Modal.Dialog
                    centered>
                    <Modal.Header>
                        <Modal.Title>상세보기</Modal.Title>
                        <CloseButton onClick={this.props.hideModal} />
                    </Modal.Header>
                    <Modal.Body>
                        <Carousel interval={null}>
                            <Carousel.Item>
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
                            </Carousel.Item>
                        </Carousel>

                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                </Modal.Dialog>


            </div>
        )
    }
}