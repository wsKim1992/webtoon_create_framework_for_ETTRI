import React,{useState,useCallback,createContext,useContext,useMemo,memo, useEffect, useReducer} from "react";
import {
  Table,
  Navbar,
  Collapse,
  Button,
  DropdownMenu,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownItem,
  Input,
  Label
} from "reactstrap";
import ClassList from "./ClassList/ClassList";
import s from "./Static.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";


/* objectList,classArr 은 나중에 이 component 에서 props 로 받을꺼임 */
const objectList = [
  {type:'polygon',number:'_29394737',nameClass:'plastic',classKey:'_9485869'},
  {type:'polygon',number:'_29394437',nameClass:'iron',classKey:'_9485872'},
  {type:'polygon',number:'_29394237',nameClass:'plastic-bag',classKey:'_9485870'},
]

const highClass={
  '생활폐기물_1':{subClassList:{'_9485869':'plastic','_9485870':'plastic-bag'}},
  '건설폐기물_1':{subClassList:{'_9485871':'wood','_9485872':'iron'}}
}

const classArr = {
  '_9485869':{color:'#eb3a34',nameClass:'plastic',highClassName:'생활폐기물_1'},
  '_9485870':{color:'#e65d0e',nameClass:'plastic-bag',highClassName:'생활폐기물_1'},
  '_9485871':{color:'#edc307',nameClass:'wood',highClassName:'건설폐기물_1'},
  '_9485872':{color:'#a0ed07',nameClass:'iron',highClassName:'건설폐기물_1'},
}


export const ClassContext = createContext(null);
const initialClassState = {classArr:classArr,highClass:highClass}
export const ADDSUBCLASS='addClass';
export const DELETESUBCLASS='deleteClass';
export const ADDHIGHCLASS='addHighClass';
export const DELETEHIGHCLASS='deleteHighClass';
export const MODIFYSUBCLASS = 'modifySubClass';
const classListReducer=(state,action)=>{
  const type = action.type;

  switch(type){
    case ADDSUBCLASS:{
      const {key,color,nameClass,highClassName}=action;
      const newClassArr = {...state.classArr};
      newClassArr[key]={color:color,nameClass:nameClass,highClassName:highClassName}
      
      const newHighClass= {...state.highClass};
      newHighClass[highClassName].subClassList[key]=nameClass;
      console.log(newHighClass[highClassName].subClassList[key]);
      return {...state,classArr:newClassArr,highClass:newHighClass};
    };
    case DELETESUBCLASS:{
      const key = action.keyProp;
      const newClassArr = {...state.classArr};
      const highClassName = newClassArr[key].highClassName;
      delete newClassArr[key];
      const newHighClass={...state.highClass}
      delete newHighClass[highClassName].subClassList[key];
      return {...state,classArr:newClassArr,highClass:newHighClass};
    };
    case DELETEHIGHCLASS:{
      const nameClass = action.nameClass;
      const newHighClass={...state.highClass}
      const newClassArr = {...state.classArr};
      Object.keys(newHighClass[nameClass].subClassList).forEach((v,i)=>{
        delete newClassArr[v];
      })
      delete newHighClass[nameClass];
      return {...state,highClass:newHighClass,classArr:newClassArr};
    }
    case ADDHIGHCLASS:{
      const nameClass = action.nameClass;
      const newHighClass={...state.highClass}
      newHighClass[nameClass]={subClassList:{}}
      return{...state,highClass:newHighClass}
    }
    case MODIFYSUBCLASS:{
      const {key,color,nameClass}=action;
      const newClassArr = {...state.classArr};
      newClassArr[key].color=color;
      newClassArr[key].nameClass=nameClass;
      return {...state,classArr:newClassArr};
    }
    default:return {...state};
  }
}

const TableStatic=memo(()=> {
  const [showClassList,setShowClassList]=useState(false);
  const [dropdownOpen,setDropdownOpen]=useState(false);
  const [ClassListState,classListDispatch]=useReducer(classListReducer,initialClassState);

  const data = useMemo(()=>{
    console.log(ClassListState);
    return {classArr:ClassListState.classArr,highClass:ClassListState.highClass,dispatch:classListDispatch}
  },[ClassListState]);

  const onSettingClicked=(event)=>{
    event.preventDefault();
    setShowClassList(!showClassList);
  }
  
  return (
    <ClassContext.Provider value={data}>
    <div className={s.root}>
      <Navbar className={s.classListNavBar}>
        <Button className={s.toggleClassListBtn} onClick={onSettingClicked}>
          <FontAwesomeIcon icon={faBars}/>
        </Button>
        <span>Class List 관리 & 설정</span>
        <Collapse className={s.collapse} isOpen={showClassList}>
          <ClassList/>
        </Collapse>
      </Navbar>
      <div className={`${s.overFlow}`}>
        <Table className={s.tableComponent} style={{width:'250px',height:'1000px',overflow:'scroll'}} className="table-striped table-lg mt-lg mb-0">
          <thead style={{fontSize:'10.5px',display:'block',width:'100%',height:'25.5px'}}>
            <tr style={{overflow:'hidden',display:'block',width:'100%',height:'25.5px'}}>
              <th style={{display:'flex',flexDirection:"row",alignContent:'center',justifyContent:'center',padding:'0',float:'left',width:'50px',height:'25.5px'}}>
                <div style={{textAlign:'center',width:'30px',height:'25.5px'}} className="abc-checkbox">
                  <Input
                    id="checkbox3_0"
                    type="checkbox"
                  />
                  <Label for="checkbox3_0" />
                </div>
              </th>
              <th style={{padding:'0',lineHeight:'25.5px',textAlign:'center',width:'50px',float:'left',height:'25.5px'}}>Type</th>
              <th style={{padding:'0',lineHeight:'25.5px',textAlign:'center',width:'50px',float:'left',height:'25.5px'}} >Number</th>
              <th style={{padding:'0',lineHeight:'25.5px',textAlign:'center',width:'80px',float:'left',height:'25.5px'}} >Class</th>
            </tr>
          </thead>
          <tbody style={{fontSize:'10.5px',display:'block',width:'100%',height:'25.5px'}}>
            {
              objectList.map((v,i)=>{
                return(<Tr key={`${v.number}`} idx={i} id={v.number} obj={v}/>)})
            }
          </tbody>
        </Table>
      </div>
    </div>
    </ClassContext.Provider>
  );  
})

const Tr=memo(({obj,id,idx})=>{
  const {type,number,nameClass}=obj;

  return(
    <tr style={{display:'block',width:'100%',height:'25.5px'}}>
      <td style={{display:'flex',flexDirection:"row",alignContent:'center',justifyContent:'center',padding:'0',float:'left',width:'50px',height:'25.5px'}}>
        <div style={{textAlign:'center',width:'30px',height:'25.5px'}} className="abc-checkbox">
          <Input
            id="checkbox3_1"
            type="checkbox"
          />
          <Label for="checkbox3_1" />
        </div>
      </td>
      <td style={{padding:'0',float:'left',lineHeight:'25.5px',textAlign:'center',width:'50px',float:'left',height:'25.5px'}}>{type}</td>
      <td style={{padding:'0',float:'left',lineHeight:'25.5px',textAlign:'center',width:'50px',float:'left',height:'25.5px'}}>#{idx}</td>
      <td style={{padding:'0',float:'left',lineHeight:'25.5px',textAlign:'center',width:'80px',float:'left',height:'25.5px'}}>
        <SelectClass nameClass={nameClass} id={id}/>
      </td>
    </tr>
  )
})

const SelectClass=memo(({nameClass,id})=>{
  const {classArr}=useContext(ClassContext);
  useEffect(()=>{
    const optionsArr=document.querySelector(`#${id}`).children;
    for(let i =0;i<optionsArr.length;i++){
      if(optionsArr[i].value===nameClass){optionsArr[i].selected=true; break;}
    }
  },[nameClass,classArr])

  return(
    <div className="float-right" style={{width:'80px',height:'25.5px',fontSize:'10.5px'}}>
      <Input id={id} type={"select"} style={{width:'80px',height:'25.5px',padding:'0px',fontSize:'10.5px'}}>
        {Object.values(classArr).map((v,idx)=>(
          v&&<option key={`${v.nameClass}_${idx}`} value={v.nameClass}>{v.nameClass}</option>
        ))}
      </Input>
    </div>
  )
})

export default TableStatic;
