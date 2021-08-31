import React,{useState,useRef,memo,useEffect,useContext} from 'react';
import { ClassContext,ADDHIGHCLASS, } from '../Static';
import { Input,Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
const AddClass=memo(()=>{

    const [classNameStr,setClassNameStr] = useState('');
    const {dispatch} = useContext(ClassContext);

    const onChangeClassName = (e)=>{
        setClassNameStr(e.target.value);
    }
    const onClickAddClassBtn=(event)=>{
        event.preventDefault();
        const nameClass = classNameStr;
        dispatch({type:ADDHIGHCLASS,nameClass});
        /* const id = `_${Date.now()}`;
        const obj = {id,nameClass:classNameStr};
        console.log(obj);
        dispatch({type:ADDCLASS,obj}); */
    }

    return(
        <React.Fragment>  
            <Input onChange={onChangeClassName} style={{width:'140px',height:'25.5px'}} type="text" className="typeClassName" placeholder="type Class Name"/>
            <Button style={{border:'none',backgroundColor:'#040620',width:'25.5px',height:'25.5px',display:'flex',
            flexDirection:'row',justifyContent:'center',alignContent:'center'}} id="addClassBtn" onClick={onClickAddClassBtn}>
                <FontAwesomeIcon icon={faPlus}/>
            </Button>
        </React.Fragment>
    )
})

export default AddClass;