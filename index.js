HomerDashboard = (function(){
	
	// constructor
	return function(dto){
		homerDashboardData = new HomerDashboardData(dto);
		
		this.class = 'homer-dashboard'; // name of class HomerDashboard should search for
		this.entity = document.querySelector(`.${this.class}[data-name="${homerDashboardData.name}"]`); 
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
			var self = this;
			var build = {}; // div's pool
			
			'content header side-left side-right column-left chart bar-up bar-down legend number button'
				.split(' ')
				.forEach(className => {
					var element = document.createElement('div');
					element.className = className;
					build[className] = element;
				});
				
			build.header.innerText = homerDashboardData.name;
			build['bar-up'].innerText = homerDashboardData.description;
			
			build['side-left'].append(
				build['bar-up'],
				build['column-left'],
				build['chart'],
				build['bar-down'],
				build['legend']
			);
			
			build['side-right'].append(
				build['number'],
				build['button']
			);
			
			build.content.append(
				build['side-left'],
				build['side-right'],
			);
				
			this.entity.append(build.header, build.content);
		};
	}
})();

HomerDashboardData = (function(){
	
	return function(dto){
		Object.assign(this, dto);
	}
})();