import {EventEmitter} from "events";
import dispatcher from "../dispatchers/dispatcher";
class MarioStores extends EventEmitter{
	constructor(){
		super();
		this.initData();
	}
	initData(){
		this.food=[];
		this.marioPos={
			x:0,
			y:0
		};
		this.direction="";
		this.numberOfRow=0;
		this.numberOfCol=0;
		this.start = false;
		this.moves = 0;
	}
	generateRandomFoodPositions(numberOfRow,numberOfCol){
		numberOfRow = parseInt(numberOfRow);
        numberOfCol = parseInt(numberOfCol);
        let cellLimit = (numberOfCol+numberOfRow)/2;
        cellLimit = parseInt(cellLimit);
        
        while(this.food.length<cellLimit){
        	let xCord = Math.floor(Math.random()*numberOfRow) + 1;
        	let yCord = Math.floor(Math.random()*numberOfCol) + 1;
        	let cord = xCord + "-" + yCord;
        	if(this.food.indexOf(cord)===-1){
        		this.food.push(cord);
        	}
		}
		this.numberOfRow=numberOfRow;
		this.numberOfCol=numberOfCol;
        this.marioPos.x = Math.floor(Math.random()*numberOfRow) + 1;
        this.marioPos.y = Math.floor(Math.random()*numberOfCol) + 1;
        let marioPos = this.marioPos.x + "-" + this.marioPos.y
		if(this.food.indexOf(marioPos)!==-1){
			this.food.splice(this.food.indexOf(marioPos),1);
		}
	}
	getCells(type){
		
		return this[type];
	}
	updateMarioCord(dir,update){
		if(this.food.length===0){
			this.emit('change','GAME_OVER');
			return false;
		}
		this.direction=dir;
		if(update === undefined){
			this.moves++;
			if(!this.start)
				this.start = true;
			else
				return false;
		}
		if(dir==='R'){
			if(this.marioPos.y<this.numberOfCol){
				this.marioPos.y = this.marioPos.y+1;
			}else{
				this.direction='L';
			}
		}else if(dir==='L'){
			if(this.marioPos.y!==1){
				this.marioPos.y = this.marioPos.y-1;
			}else{
				this.direction='R';
			}
		}else if(dir==='U'){
			if(this.marioPos.x!==1){
				this.marioPos.x = this.marioPos.x-1;
			}else{
				this.direction='D';
			}
		}else if(dir==='D'){
			if(this.marioPos.x!==this.numberOfRow){
				this.marioPos.x = this.marioPos.x+1;
			}else{
				this.direction='U';
			}
			
		}
		let marioPos = this.marioPos.x + "-" + this.marioPos.y
		if(this.food.indexOf(marioPos)!==-1){
			this.food.splice(this.food.indexOf(marioPos),1);
		}
		this.emit('change','MARIO_POS')
	}
	_handleActions(action){
		switch(action.type){
			case 'MARIO_ACTION':{
				this.updateMarioCord(action.direction);
				break;
			}
		}
	}
}

const marioStores = new MarioStores();
marioStores.setMaxListeners(Infinity);
dispatcher.register(marioStores._handleActions.bind(marioStores));
export default marioStores;
