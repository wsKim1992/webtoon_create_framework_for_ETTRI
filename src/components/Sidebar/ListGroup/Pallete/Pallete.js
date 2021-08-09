import React,{memo} from 'react';
import ListGroup from '../ListGroup';
import { Container,Row,Col } from 'reactstrap';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
const Pallete=memo(()=>{
    const colorArr =[
        "#eb3a34","#e65d0e","#edc307","#a0ed07","#07f74b",
        "#07dff7","#0717f7","#9309e3","#f705e7","#f70279"
    ]

    const onClickColor = (e)=>{
        console.log('color');
    }

    console.log('pallete');
    return(
        <ul>
            {colorArr.map((v,idx)=>(
                <ListGroup onClick={onClickColor} key={`${v}_${idx}`} toolInfo={ {haveChild:false,fontClass:faCircle,toolType:'color'}} color={v} />
            ))}
        </ul>
    )
})

export default Pallete;