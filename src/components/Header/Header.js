<<<<<<< HEAD
import { connect } from "react-redux";
import React from "react";
import { withRouter } from "react-router";
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
} from "reactstrap";
import PowerIcon from "../Icons/HeaderIcons/PowerIcon";

import { logoutUser} from "../../actions/user";
import {
  openSidebar,
  closeSidebar,
  changeSidebarPosition,
  changeSidebarVisibility,
} from "../../actions/navigation";

import s from "./Header.module.scss";
import "animate.css";

class Header extends React.Component {

  constructor(props) {
    super(props);

    this.doLogout = this.doLogout.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.toggleMessagesDropdown = this.toggleMessagesDropdown.bind(this);
    this.toggleSupportDropdown = this.toggleSupportDropdown.bind(this);
    this.toggleSettingsDropdown = this.toggleSettingsDropdown.bind(this);
    this.toggleAccountDropdown = this.toggleAccountDropdown.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.toggleSearchOpen = this.toggleSearchOpen.bind(this);

    this.state = {
      visible: true,
      messagesOpen: false,
      supportOpen: false,
      settingsOpen: false,
      searchFocused: false,
      searchOpen: false,
      notificationsOpen: false,
    };
  }


  toggleNotifications = () => {
    this.setState({
      notificationsOpen: !this.state.notificationsOpen,
    });
  };

  onDismiss() {
    this.setState({ visible: false });
  }

  doLogout() {
    this.props.dispatch(logoutUser({history:this.props.history}));
=======
import React,{memo,useCallback,useContext} from "react";
import styled from "styled-components";
import {PenManagerContext,actions} from "../Layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import {INIT_CALL_API} from "../../reducers/callAPIReducer"
const HeaderContainer = styled.div`
  width:100%;height:65.5px;
  background-color:#4b544d;
  @media screen and (max-width:650px){
    height:50.5px;
>>>>>>> 59052bf7d4488ecf442a3ad8bcdd7f66cb23dc65
  }
`;

const HeaderWrapper = styled.div`
  width:calc(100% - 51px);height:100%;
  box-sizing:border-box;
  margin:0 auto;
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:space-between;
  .title-container{
    width:auto;height:100%;
    display: flex;
    align-items: center;
    .title-wrap{
      width:auto;height:auto;
      font-size:var(--main-title);
      font-weight:bold;
      color:#fff;
      text-align:center;
    }
  }
  .reset-button-container{
    width:auto;height:100%;
    .reset-button-wrapper{
      width:auto;height:100%;
      display:flex;align-items:center;
      .reset-button{
        display:block;
        width:auto;padding:5.5px 9.5px;
        background-color:#4b544d;
        color:#fff;border: 2.5px solid #bbc7be;
        border-radius:5.5px;
        font-size:var(--canvas-function-button);
        outline:0;
        &:hover{
          background-color:#bbc7be;
          color:#4b544d;border:none;
        }
      }
      .show-setting-button{
        display:none;
        background-color:#4b544d;
        color:#fff;border: 2.5px solid #bbc7be;
        border-radius:5.5px;
        padding:5.5px;
        margin-left:15.5px;
        outline:0;
        &:hover{
          background-color:#bbc7be;
          color:#4b544d;border:none;
        }
      }
    }
  }
  @media screen and (max-width:975px){
    .title-container{
      .title-wrap{
      }
    }
    .reset-button-container{
      .reset-button-wrapper{
        .reset-button{}
        .show-setting-button{
          display:block;       
        }
      }
    }
  }

  @media screen and (max-width:650px){
    .title-container{
      .title-wrap{
        font-size:var(--tablet-main-title);
      }
    }
    .reset-button-container{
      width:auto;height:100%;
      .reset-button-wrapper{
        .reset-button{
        }
        .show-setting-button{
        }
      }
    }
  }
  @media screen and (max-width:450px){
    width:calc(100% - 25px);
    .title-container{
      .title-wrap{
        font-size:var(--mobile-main-title);
      }
    }
  }
<<<<<<< HEAD

  render() {
    return (
      <Navbar className={/* `d-print-none ` */s.navbar} style={{width:this.props.headerWidth}}>
        <Nav className={s.saveAndMoveNav} variant="pills" as="ul">
          
          <NavItem as="li" className={s.saveButtonWrap}>
            웹툰 캐릭터 선화 제작 프레임워크
          </NavItem>
        </Nav>
        <div className={`d-print-none ${s.root}`}>
          <Nav className="ml-md-0">
            <Dropdown
              className="d-none d-sm-block"
              nav
              isOpen={this.state.settingsOpen}
              toggle={this.toggleSettingsDropdown}
            >
            </Dropdown>
            <Dropdown
              className="d-none d-sm-block"
              nav
              isOpen={this.state.supportOpen}
              toggle={this.toggleSupportDropdown}
            >
            </Dropdown>
            <NavItem>
              <NavLink
                onClick={this.doLogout}
                className={`${s.navItem} text-white`}
                href="#"
              >
                <PowerIcon className={s.headerIcon} />
              </NavLink>
            </NavItem>
          </Nav>
=======
`;

const Header = memo(({toggleShowSettingBar})=>{

  const {penStateDispatch} = useContext(PenManagerContext);
  const dispatch = useDispatch();

  const onClickInitialize = useCallback(()=>{
    penStateDispatch({type:actions.INIT});
    dispatch({type:INIT_CALL_API});
  },[])
  return (
    <HeaderContainer>
      <HeaderWrapper>
        <div className="title-container">
          <p className="title-wrap">
            사진으로 만화 생성하기
          </p>
>>>>>>> 59052bf7d4488ecf442a3ad8bcdd7f66cb23dc65
        </div>
        <div className="reset-button-container">
          <div className="reset-button-wrapper">
            <button onClick={onClickInitialize} className="reset-button">
              전체 초기화
            </button>
            <button onClick={toggleShowSettingBar} className="show-setting-button">
              <FontAwesomeIcon icon={faBars}/>
            </button>
          </div>
        </div>
      </HeaderWrapper>
    </HeaderContainer>
  )
})

export default Header;
