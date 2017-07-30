HomerDashboard = (function(){
	
	// constructor
	return function(homerDashboardData){
		this.class = 'homer-dashboard'; // name of class HomerDashboard should search for
		this.entity = document.querySelector(`.${this.class}[data-target="${homerDashboardData.name}"]`); 
		this.body = {};
		
		this.show = function(){
			try{
				if(!this.entity) throw 'entity not found';
				this.build();
			}catch(e){
				console.log('Cannot show dashboard caused by: ', e);
			}
		};
		
		this.__proto__.build = function(){
			self = this;
			
			header = document.createElement('div');
			header.className = 'header';
			
			content = document.createElement('div');
			content.className = 'content';
			
			'column-left bar-down chart legend right-cell number'
				.split(' ')
				.forEach(className => {
					var element = document.createElement('div');
					element.className = className;
					content.appendChild(element);
				});
				
			this.entity.append(header, content);
		};
	}
})();

HomerDashboardData = (function(){
	
	return function(dataTarget){
		this.name = dataTarget;
	}
})();