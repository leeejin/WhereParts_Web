import React, { Component } from "react";
import { Carousel, Modal, CloseButton } from "react-bootstrap";
import WebServiceManager from "../../util/webservice_manager";
import Constant from "../../util/constant_variables";

export default class ModalGoodsDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goodsDetailContents: [],
            goodsImages: []
        }
    }
    componentDidMount() {
        this.callGetGoodsDetailAPI().then((response) => {
            this.setState({ goodsDetailContents: response });
        })
        
        this.callImageLengthAPI().then((response) => {
            for (let i = 1; i <= response.length; i++) {
                this.callGetImageAPI(i).then((response) => {
                    const images = this.state.goodsImages;
                    images.push(URL.createObjectURL(response))
                    this.setState({ goodsImages: images })
                });

            }

        })
    }
    
    async callGetGoodsDetailAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsDetail?login_id=3&id=" + this.props.goodsID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }
    async callImageLengthAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImageLength?id=" +this.props.goodsID)
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }
    async callGetImageAPI(position) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.props.goodsID + "&position=" + position);
        let response = await manager.start();
        if (response.ok) {
            return response.blob();
        }
    }
    render() {
        const item = this.props.item;
        return (
            <div className="modal w-100">
                <Modal.Dialog
                    size="lg"
                    centered>
                    <Modal.Header>
                        <Modal.Title>상세보기</Modal.Title>
                        <CloseButton onClick={this.props.hideButtonClicked} />
                    </Modal.Header>

                    <Modal.Body>
                        <Carousel interval={null}>
                            {this.state.goodsImages.map((item, i) => <Carousel.Item><img className="d-block w-100" height={'450px'} key={i} src={item} alt="이미지사진"/></Carousel.Item>)}
                        </Carousel>
                        <div className="topmenubar">
                            <table className="w-100">
                                <tbody>
                                    <tr>
                                        <th><p>id</p></th>
                                        <td><p>{this.state.goodsDetailContents.id}</p></td>
                                        <th><p>userID</p></th>
                                        <td><p>{this.state.goodsDetailContents.userID}</p></td>
                                    </tr>
                                    <tr>
                                        <th><p>name</p></th>
                                        <td><p>{this.state.goodsDetailContents.name}</p></td>
                                        <th><p>number</p></th>
                                        <td><p>{this.state.goodsDetailContents.number}</p></td>
                                    </tr>
                                    <tr>
                                        <th> <p>price</p></th>
                                        <td><p> {this.state.goodsDetailContents.price}</p></td>
                                        <th> <p>hashTag</p></th>
                                        <td><p>{this.state.goodsDetailContents.hashTag}</p></td>
                                    </tr>
                                    <tr>
                                        <th><p>quantity</p></th>
                                        <td><p>{this.state.goodsDetailContents.quantity}</p></td>
                                        <th><p>genuine</p></th>
                                        <td><p>{this.state.goodsDetailContents.genuine}</p></td>
                                    </tr>
                                    <tr>
                                        <th> <p>spec</p></th>
                                        <td><p>{this.state.goodsDetailContents.spec}</p></td>
                                        <th> <p>valid</p></th>
                                        <td><p>{this.state.goodsDetailContents.valid}</p></td>
                                    </tr>
                                    <tr>
                                        <th> <p>removeFlag</p></th>
                                        <td><p>{this.state.goodsDetailContents.removeFlag}</p></td>
                                        <th> <p>registerDate</p></th>
                                        <td><p>{this.state.goodsDetailContents.registerDate}</p></td>
                                    </tr>
                                </tbody>

                            </table>
                        </div>

                    </Modal.Body>
                </Modal.Dialog>


            </div>
        )
    }
}