HomerDashboard = (function(){
	
	// constructor
	return function(homerDashboardData){
		this.class = 'homer-dashboard'; // name of class HomerDashboard should search for
		
		this.show = function(){
			
		}
	}
})();

HomerDashboardData = (function(){
	
	return function(dataTarget){
		this.name = dataTarget;
	}
})();