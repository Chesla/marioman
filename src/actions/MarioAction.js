import dispatcher from "../dispatchers/dispatcher";

export function getMarioDirection(dir){
	dispatcher.dispatch({
		type:'MARIO_ACTION',
		direction:dir
	})
}

