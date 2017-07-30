HomerDashboard = (function(){
	
	// constructor
	return function(homerDashboardData){
		this.class = 'homer-dashboard'; // name of class HomerDashboard should search for
		this.entity = document.querySelector(`.${this.class}[data-target="${homerDashboardData.name}"]`); 
		
		this.show = function(){
			try{
				if(!this.entity) throw 'entity not found';
			}catch(e){
				console.log('Cannot show dashboard caused by: ', e);
			}
		}
	}
})();

HomerDashboardData = (function(){
	
	return function(dataTarget){
		this.name = dataTarget;
	}
})();