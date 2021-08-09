import React ,{useState,memo, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import s from './ListGroup.module.scss';
import { Collapse } from 'reactstrap';
import Pallete from './Pallete/Pallete'
import ControllBold from './ControllBold/ControllBold';

const ListGroup = memo(({toolInfo,color,id})=>{
    const [isCollapse,setIsCollapse]=useState(false);
    const {haveChild} = toolInfo;
    const {fontClass,toolType,toolName,shape}=toolInfo;
    const onClickList = (e)=>{
        console.log(`Clicked ${id}`);
        setIsCollapse(prevState=>!prevState);
    }

    return (
        <React.Fragment>
            <li className={[s.headerLink].join(' ')} onClick={onClickList}>
                <a style={color&&{color:color}}>
                    <FontAwesomeIcon className={s.icon} icon={fontClass}/>
                </a>
            </li>
            {
                haveChild
                &&
                toolType==='historyList'
                &&
                <Collapse className={s.panel} isOpen={isCollapse}>
                    <ul>
                        {
                            toolInfo.fontClassList
                            &&
                            toolInfo.fontClassList.map((value,key)=>(
                                <ListGroup key={key} toolInfo={{haveChild:false,fontClass:value,toolType:'history'}} />
                            ))
                        }
                    </ul>
                </Collapse>
            }
            {
                haveChild
                &&
                toolType==='pallete'
                &&
                <Collapse className={s.color_picker_panel} isOpen={isCollapse}>
                    <Pallete/>
                </Collapse>
            }
            {
                haveChild
                &&
                toolType==='bolderness'
                &&
                <Collapse className={s.ControllBold_wrap} isOpen={isCollapse}>
                    <ControllBold boldness={12.5}/>
                </Collapse>
            }
        </React.Fragment>
    )
})

ListGroup.propTypes={
    toolInfo:PropTypes.object.isRequired,
    haveChild:PropTypes.bool,
    color:PropTypes.string,
    id:PropTypes.number
}


export default ListGroup;