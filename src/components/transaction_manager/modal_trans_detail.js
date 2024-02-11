import React, { Component } from "react";
import { Button, Carousel, Modal, CloseButton } from "react-bootstrap";


export default class SalesDetailModal extends Component {
    constructor(props) {
        super(props);
    }
    approve = () => {
        alert('알림문자를 보냈습니다.')
        this.props.hideButtonClicked()
    }
    render() {
        const item = this.props.item;
        return (
            <div className="modal w-100 height" >
                <Modal.Dialog
                    size="lg"
                    centered>
                    <Modal.Header>
                        <Modal.Title>상세보기</Modal.Title>
                        <CloseButton onClick={this.props.hideButtonClicked} />
                    </Modal.Header>

                    <Modal.Body>

                        <Carousel interval={null}>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100" height={'450px'}
                                    src="https://source.unsplash.com/collection/190727/1600x900"
                                    alt="First slide"
                                />
                            </Carousel.Item>
                        </Carousel>
                        <table className="topmenubar w-100">
                            <tbody>
                                <tr>
                                    <th><p>판매글 정보</p></th>
                                    <td><p>내용</p></td>
                                </tr>
                                <tr>
                                    <th><p>판매자에 대한 필요한 정보(주소)</p></th>
                                    <td><p>내용</p></td>
                                </tr>
                                <tr>
                                    <th><p>판매금액</p></th>
                                    <td><p>내용</p></td>
                                </tr>
                                <tr>
                                    <th><p>수량</p></th>
                                    <td><p>내용</p></td>
                                </tr>
                                <tr>
                                    <th><p>올린날짜</p></th>
                                    <td><p>내용</p></td>
                                </tr>
                            </tbody>

                        </table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => { this.approve() }}>알림</Button>
                    </Modal.Footer>
                </Modal.Dialog>


            </div>
        )
    }
}