import React,{memo} from 'react';
import ListGroup from '../ListGroup';
import { Container,Row,Col } from 'reactstrap';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
const Pallete=memo(({actionType})=>{
    const colorArr =[
        "#eb3a34","#e65d0e","#edc307","#a0ed07","#07f74b",
        "#07dff7","#0717f7","#9309e3","#f705e7","#f70279"
    ]

    return(
        <ul>
            {colorArr.map((v,idx)=>(
                <ListGroup key={`${v}_${idx}`} toolInfo={ {actionType:actionType,actImmediatly:true,haveChild:false,fontClass:faCircle,toolType:'color'}} color={v} />
            ))}
        </ul>
    )
})

export default Pallete;