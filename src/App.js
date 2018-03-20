import React, { Component } from 'react';
import './App.css';
import MarioStores from './stores/marioStores';
export default class App extends Component {

    constructor(props){
        super(props);
        this.state={
            startGame:false,
            numberOfCol:0,
            numberOfRow:0,
            ask:false,
            endGame:false
        }
        this.keypress = this.keypress.bind(this);
        this._getAllMarioStores = this._getAllMarioStores.bind(this);
    }
    componentDidMount(){
        document.addEventListener('keydown',this.keypress);
        MarioStores.on('change',this._getAllMarioStores);
    }
    componentWillUnmount(){
        document.removeListener('keydown',this.keypress);
        MarioStores.removeListener('change',this._getAllMarioStores);
    }
    _getAllMarioStores(type){
        if(type=='GAME_OVER'){
            this.setState({
                endGame:true
            })
        }
    }
    keypress(event){
        switch(event.key){
            case 'ArrowRight' : MarioStores.updateMarioCord("R")
                                break;
            case 'ArrowLeft'  : MarioStores.updateMarioCord("L")
                                break;
            case 'ArrowUp' :    MarioStores.updateMarioCord("U")
                                break;
            case 'ArrowDown' :  MarioStores.updateMarioCord("D")
                                break;
        }
    }

    buildBlocks(){
        let {numberOfRow,numberOfCol}=this.state;
        let allBlock = [];
        let a = new Array(numberOfRow);
        for(let i=1;i<=numberOfRow;i++){
            a[i]= new Array(numberOfCol);
            let cardBlock = [];
            for(let j=1;j<=numberOfCol;j++){
                cardBlock.push(<BoardBlock key={`mario-${i}-${j}`} grid={{x:i,y:j}}/>);
            }
            allBlock.push(<div className="main-cnt">{cardBlock}</div>)
        }
        return allBlock;
    }
    
    render() {
        return (
            <div>
                {this.state.endGame ?
                        <div className="gameCnt over">
                            <div className="labelCnt over">
                                <label className="labelStyle">Number of Moves :</label>
                                <div className="inputStyle over">{MarioStores.getCells('moves')} </div>
                            </div>
                            <div className="labelCnt over">
                                <label className="labelStyle">Time Taken :</label>
                                <div className="inputStyle over">{MarioStores.getCells('moves')} </div>
                            </div>
                        </div>
                    :
                    <div className="gameCnt">
                        {!this.state.ask && !this.state.startGame?
                            <div className="entryButtonCnt">
                                <button 
                                        className="buttonStyle"
                                        onClick={()=>{
                                            this.setState({
                                                ask:true
                                            })}
                                        }
                                >   START GAME
                                </button>
                            </div>
                            :null
                        }
                        {this.state.ask && !this.state.startGame ?
                            <div className="entryCnt">
                                <div className="labelCnt">
                                    <label className="labelStyle start">Number of Rows</label>
                                    <input 
                                            className="inputStyle"
                                            type="text" 
                                            onChange={(event)=>{this.setState({numberOfRow:event.target.value})}} 
                                            value={this.state.numberOfRow}/>
                                </div>
                                <div className="labelCnt">
                                    <label className="labelStyle">Number of Columns</label>
                                    <input 
                                            className="inputStyle"
                                            type="text" 
                                            onChange={(event)=>{this.setState({numberOfCol:event.target.value})}} 
                                            value={this.state.numberOfCol}
                                        />
                                </div>
                                <button 
                                    className="buttonStyle"
                                    onClick={()=>{
                                        MarioStores.generateRandomFoodPositions(this.state.numberOfRow,this.state.numberOfCol);
                                        this.setState({
                                            startGame:true
                                        })
                                    }
                                    }
                                >   ENTER
                                </button>
                            </div> :
                            null
                        }
                        {this.state.ask && this.state.startGame?
                            <div className="blck-cnt">
                                    {this.buildBlocks()}
                            </div> 
                            :null
                        }
                    </div>
                }
            </div>
        );
    }
}

class BoardBlock extends Component {
    constructor(props){
        super(props);
        this.state={
            marioX:MarioStores.getCells('marioPos').x,
            marioY:MarioStores.getCells('marioPos').y
        }
        this.timer;
        this._getAllMarioStores = this._getAllMarioStores.bind(this);
    }
    componentDidMount(){
        MarioStores.on('change',this._getAllMarioStores);
    }
    componentWillUnmount(){
        MarioStores.removeListener('change',this._getAllMarioStores);
    }
    _getAllMarioStores(type){
        if(type=='MARIO_POS'){
            let {x,y} = MarioStores.getCells('marioPos');
            let {grid} = this.props;
            this.setState({
                marioX:x,
                marioY:y
            },()=>{
                if(grid.x === x && grid.y === y){
                    this.timer = setTimeout(()=>{
                        clearTimeout(this.timer);
                        MarioStores.updateMarioCord(MarioStores.getCells('direction'),true);
                    },1000);
                }
            });
        }
    }
    render(){
        let cords = `${this.props.grid.x}-${this.props.grid.y}`;
        let foods = MarioStores.getCells('food');
        let {marioX,marioY} = this.state;
        return(
            <div className="blockCnt">
                <div>{foods.indexOf(cords)!==-1?'food':''}</div>
                <div>{marioX==this.props.grid.x && marioY==this.props.grid.y ? 'Mario' :''}</div>
            </div>
        )
    }
}
