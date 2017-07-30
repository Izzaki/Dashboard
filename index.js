HomerDashboard = (function(){
	
	// constructor
	return function(dto){
		homerDashboardData = new HomerDashboardData(dto);
		
		this.class = 'homer-dashboard'; // name of class HomerDashboard should search for
		this.entity = document.querySelector(`.${this.class}[data-target="${homerDashboardData.name}"]`); 
		this.body = {};
		
		this.show = function(){
			try{
				if(!this.entity) throw 'entity not found';
				this.build();
				this.entity.style.display = 'block';
			}catch(e){
				console.log('Cannot show dashboard caused by: ', e);
			}
		};
		
		this.__proto__.build = function(){
			self = this;
			
			header = document.createElement('div');
			header.className = 'header';
			header.innerText = homerDashboardData.name;
			
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
	
	return function(dto){
		Object.assign(this, dto);
	}
})();