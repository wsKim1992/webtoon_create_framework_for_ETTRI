import React from "react";
import {
  Row,
  Col,
  Table,
  Navbar,
  NavbarToggler,
  Collapse,
  Progress,
  Button,
  Dropdown,
  DropdownMenu,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownItem,
  Input,
  Label,
  Badge,
} from "reactstrap";
import { Sparklines, SparklinesBars } from "react-sparklines";
import ClassList from "./ClassList/ClassList";
import s from "./Static.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";

class TableStatic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      /* tableStyles: [
        {
          id: 1,
          picture: require("../../../assets/tables/1.png"), // eslint-disable-line global-require
          description: "Palo Alto",
          info: {
            type: "JPEG",
            dimensions: "200x150",
          },
          date: new Date("September 14, 2012"),
          size: "45.6 KB",
          progress: {
            percent: 29,
            colorClass: "success",
          },
        },
        {
          id: 2,
          picture: require("../../../assets/tables/2.png"), // eslint-disable-line global-require
          description: "The Sky",
          info: {
            type: "PSD",
            dimensions: "2400x1455",
          },
          date: new Date("November 14, 2012"),
          size: "15.3 MB",
          progress: {
            percent: 33,
            colorClass: "warning",
          },
        },
        {
          id: 3,
          picture: require("../../../assets/tables/3.png"), // eslint-disable-line global-require
          description: "Down the road",
          label: {
            colorClass: "primary",
            text: "INFO!",
          },
          info: {
            type: "JPEG",
            dimensions: "200x150",
          },
          date: new Date("September 14, 2012"),
          size: "49.0 KB",
          progress: {
            percent: 38,
            colorClass: "inverse",
          },
        },
        {
          id: 4,
          picture: require("../../../assets/tables/4.png"), // eslint-disable-line global-require
          description: "The Edge",
          info: {
            type: "PNG",
            dimensions: "210x160",
          },
          date: new Date("September 15, 2012"),
          size: "69.1 KB",
          progress: {
            percent: 17,
            colorClass: "danger",
          },
        },
        {
          id: 5,
          picture: require("../../../assets/tables/5.png"), // eslint-disable-line global-require
          description: "Fortress",
          info: {
            type: "JPEG",
            dimensions: "1452x1320",
          },
          date: new Date("October 1, 2012"),
          size: "2.3 MB",
          progress: {
            percent: 41,
            colorClass: "primary",
          },
        },
      ], */
      checkboxes1: [false, true, false, false],
      checkboxes2: [false, false, false, false, false, false],
      checkboxes3: [false, false, false, false, false, false],
      dropdownOpen:false,
      showClassList:false,
    };

    this.checkAll = this.checkAll.bind(this);
  }
  toggle = ()=>{
    console.log('toggle clicked!!');
    console.log(this.state.dropdownOpen);
    this.setState({
    dropdownOpen:!this.state.dropdownOpen
  })}
  parseDate(date) {
    this.dateSet = date.toDateString().split(" ");

    return `${date.toLocaleString("en-us", { month: "long" })} ${
      this.dateSet[2]
    }, ${this.dateSet[3]}`;
  }

  checkAll(ev, checkbox) {
    const checkboxArr = new Array(this.state[checkbox].length).fill(
      ev.target.checked
    );
    this.setState({
      [checkbox]: checkboxArr,
    });
  }

  changeCheck(ev, checkbox, id) {
    //eslint-disable-next-line
    this.state[checkbox][id] = ev.target.checked;
    if (!ev.target.checked) {
      //eslint-disable-next-line
      this.state[checkbox][0] = false;
    }
    this.setState({
      [checkbox]: this.state[checkbox],
    });
  }
  onSettingClicked=(event)=>{
    event.preventDefault();
    this.setState({
      showClassList:!this.state.showClassList
    })
  }
  render() {
    return (
      <div className={s.root}>
        <Navbar className={s.classListNavBar}>
          <Button className={s.toggleClassListBtn} onClick={this.onSettingClicked}>
            <FontAwesomeIcon icon={faBars}/>
          </Button>
          <span>Class List 관리 & 설정</span>
          <Collapse className={s.collapse} isOpen={this.state.showClassList}>
            <ClassList/>
          </Collapse>
        </Navbar>
        <div className={`${s.overFlow}`}>
          <Table className={s.tableComponent} style={{width:'320px',height:'1000px',overflow:'scroll'}} className="table-striped table-lg mt-lg mb-0">
            <thead style={{fontSize:'12.5px',display:'block',width:'320px',height:'45px'}}>
              <tr style={{overflow:'hidden',display:'block',width:'320px',height:'45px'}}>
                <th style={{padding:'0',float:'left',width:'50px',height:'45px'}}>
                  <div style={{textAlign:'center',margin:'10px auto',width:'50px',height:'30px'}} className="abc-checkbox">
                    <Input
                      id="checkbox3_0"
                      type="checkbox"
                      checked={this.state.checkboxes3[0]}
                      onChange={(event) =>
                        this.checkAll(event, "checkboxes3")
                      }
                    />
                    <Label for="checkbox3_0" />
                  </div>
                </th>
                <th style={{padding:'0',lineHeight:'45px',textAlign:'center',width:'70px',float:'left',height:'45px'}}>Type</th>
                <th style={{padding:'0',lineHeight:'45px',textAlign:'center',width:'70px',float:'left',height:'45px'}} >Number</th>
                <th style={{padding:'0',lineHeight:'45px',textAlign:'center',width:'130px',float:'left',height:'45px'}} >Class</th>
              </tr>
            </thead>
            <tbody style={{fontSize:'12.5px',display:'block',width:'320px',height:'45px'}}>
              <tr style={{display:'block',width:'320px',height:'45px'}}>
                <td style={{padding:'0',float:'left',width:'50px',height:'45px'}}>
                  <div style={{textAlign:'center',margin:'10px auto',width:'50px',height:'30px'}} className="abc-checkbox">
                    <Input
                      id="checkbox3_1"
                      type="checkbox"
                      checked={this.state.checkboxes3[1]}
                      onChange={(event) =>
                        this.changeCheck(event, "checkboxes3",1)
                      }
                    />
                    <Label for="checkbox3_1" />
                  </div>
                </td>
                <td style={{padding:'0',float:'left',lineHeight:'45px',textAlign:'center',width:'70px',float:'left',height:'45px'}}>Polygon</td>
                <td style={{padding:'0',float:'left',lineHeight:'45px',textAlign:'center',width:'70px',float:'left',height:'45px'}} >#1</td>
                <td style={{padding:'0',float:'left',lineHeight:'45px',textAlign:'center',width:'130px',float:'left',height:'45px'}} >
                  <div className="float-right">
                    <UncontrolledButtonDropdown style={{width:'120px',height:'40px',margin:'2.5px auto'}}>
                      <DropdownToggle
                        color="inverse"
                        className="mr-xs"
                        size="sm"
                        caret
                      >
                        Plastic
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Plastic</DropdownItem>
                        <DropdownItem>Plastic-Bag</DropdownItem>
                        <DropdownItem>Paper</DropdownItem>
                        <DropdownItem>Scrap-Metal</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledButtonDropdown>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default TableStatic;
