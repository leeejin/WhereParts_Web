import React, { Component } from "react";
import { Button, Modal, CloseButton, Form } from "react-bootstrap";
import WebServiceManager from "../../util/webservice_manager";
import Constant from "../../util/constant_variables";
import CompanyNoImage from "../../images/companyNo.png";
import NameCardImage from "../../images/nameCard.png";

//회원정보 등록 모달 클래스
export default class ModalUserRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyNo: '', //사업자등록 번호
            companyName: '', //회사상호명
            companyAddress: '', //사업자 주소
            passwd: '',     //비밀번호
            passwdOk: '', //비밀번호 확인
            companyNoImageURI: '', //사업자 등록증 사진
            nameCardImageURI: '', //명함 사진
            registerButtonVisible: false, //회원등록 버튼 활성화 체크변수
        }

    }

    //회원등록 활성화 함수
    onValueChange = (value) => {
        this.setState(value, () => {
            let isValidForm = true;

            if (this.state.companyNo.trim().replaceAll("-", "").length < 10) // 조건 필요시 추가
                isValidForm = false;
            if (this.state.passwd.trim().length === 0)
                isValidForm = false;
            if (this.state.passwdOk !== this.state.passwd)
                isValidForm = false;
            if (this.state.companyAddress.trim().length === 0)
                isValidForm = false;
            if (this.state.companyName.trim().length === 0)
                isValidForm = false;
            if ((this.state.companyNoImageURI === undefined) || ((this.state.companyNoImageURI === "")))
                isValidForm = false;
            if ((this.state.nameCardImageURI === undefined) || (this.state.nameCardImageURI === ""))
                isValidForm = false;

            this.setState({ registerButtonVisible: isValidForm })
        })

    }

    goAddUser = () => {
        this.callAddUserAPI().then((response) => {
            console.log('adduser', response);
            if (response.success === 0) {
                alert("이미 있는 사업자번호입니다");
            }
            else if (response.success === -1) {
                alert("서버 오류로 회원가입에 실패했습니다.");
            }
            else {
                alert('가입 신청 완료', '입력 된 내용 확인 후 승인이 완료됩니다.');
                this.props.hideButtonClicked()

            }
        })

    }
    addCompanyNoImage = (value) => {

        this.setState({ companyNoImageURI: value }, () => {
            console.log(value)
            if (this.state.companyNoImageURI) {
                this.goCompanyInfo(this.state.companyNoImageURI)
            }
            this.onValueChange()
        })
    }
    addNameCardImage = (value) => {

        this.setState({ nameCardImageURI: value }, () => {
            console.log(value)
            this.onValueChange()
        })
    }
    goCompanyInfo(imageURI) {
        this.callCompanyInfoAPI(imageURI).then((response) => {
            if (response.success === 0) {
                alert('사업자 인식 실패')
            }
            else
                this.setState({ companyNo: response.no, companyName: response.name, companyAddress: response.address })
            this.onValueChange();
        })
    }

    //회원정보 서버에 등록 API
    async callAddUserAPI() {
        const userData = {
            companyNo: this.state.companyNo.replace(/-/g, ''),
            companyName: this.state.companyName,
            companyAddress: this.state.companyAddress,
            passwd: this.state.passwd
        };


        let manager = new WebServiceManager(Constant.serviceURL + "/AddUser", "post");
        manager.addFormData("data", userData);
        manager.addBinaryData("file1", this.state.companyNoImageURI); //사업자 등록증 이미지
        manager.addBinaryData("file2", this.state.nameCardImageURI); //명함 이미지


        console.log(userData);
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }
    //사업자 등록증 이미지로 텍스트 분석하여 상호, 사업자번호, 소재지 가져오기
    async callCompanyInfoAPI(imageData) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetCompanyInfo", "post");
        manager.addBinaryData("file", imageData);
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }



    render() {

        return (
            <div className="modal w-100" >

                <Modal.Dialog
                    size="xl"
                    centered>
                    <Modal.Header>
                        <Modal.Title>회원등록</Modal.Title>
                        <CloseButton onClick={this.props.hideButtonClicked} />
                    </Modal.Header>
                    {/* 이미지 프리뷰 할지 고민중 */}
                    <Modal.Body>
                        <div className="fleft" style={{ width: '70%' }}>
                            <img

                                className="d-block w-50 fleft" height={'600px'}
                                src={this.state.companyNoImageURI ? URL.createObjectURL(this.state.companyNoImageURI) : CompanyNoImage}
                            />
                            <img
                                className="d-block w-50 fleft" height={'600px'}
                                src={this.state.nameCardImageURI ? URL.createObjectURL(this.state.nameCardImageURI) : NameCardImage}
                            />
                        </div>

                        <div className="fleft" style={{ width: '30%' }} >
                            <form>
                                {/* 이미지 파일 업로드 */}
                                <div className="background">
                                    <label>사업자등록증 파일</label>
                                    <Form.Control type="file" onChange={(e) => { this.addCompanyNoImage(e.target.files[0]) }} />
                                </div>
                                <div className="background">
                                    <label>명함 파일</label>
                                    <Form.Control type="file" onChange={(e) => { this.addNameCardImage(e.target.files[0]) }} />
                                </div>
                                {/* 회원정보 입력 */}
                                <div className="background" >
                                    <label>사업자등록 번호</label>
                                    <Form.Control
                                        type='text' value={this.state.companyNo} onChange={(e) => { this.onValueChange({ companyNo: e.target.value }) }}
                                    />
                                </div>
                                <div className="background" >
                                    <label>상호명</label>
                                    <Form.Control
                                        type='text' value={this.state.companyName} onChange={(e) => { this.onValueChange({ companyName: e.target.value }) }}
                                    />
                                </div>
                                <div className="background" >
                                    <label>사업자 주소</label>
                                    <Form.Control
                                        type='text' as="textarea" cols="2" value={this.state.companyAddress} onChange={(e) => { this.onValueChange({ companyAddress: e.target.value }) }}
                                    />
                                </div>
                                <div className="background" >
                                    <label>비밀번호</label>
                                    <Form.Control
                                        type='password' value={this.state.passwd} onChange={(e) => { this.onValueChange({ passwd: e.target.value }) }}
                                    />
                                </div>
                                <div className="background" >
                                    <label>비밀번호 확인</label>
                                    <Form.Control
                                        type='password' value={this.state.passwdOk} onChange={(e) => { this.onValueChange({ passwdOk: e.target.value }) }}
                                    />
                                    {this.state.passwdOk !== this.state.passwd && <div className="errorMessage">비밀번호가 다릅니다</div>}
                                </div>
                            </form>
                        </div>


                    </Modal.Body>
                    <Modal.Footer>
                        {this.state.registerButtonVisible === true ? <Button variant="primary" onClick={this.goAddUser} >회원등록</Button> : <Button variant="secondary" disabled >회원등록</Button>}

                    </Modal.Footer>
                </Modal.Dialog>

            </div >

        )
    }
}