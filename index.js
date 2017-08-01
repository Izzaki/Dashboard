HomerDashboard = (function(){
	
	// dto entity
	HomerDashboardData = function(dto){
		Object.assign(this, dto);
	};

	// renderer
	SVGRenderer = {
		render(homerDashboardData){
			var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			var self = this;
			
			for(label in homerDashboardData.chart){
				var entity = homerDashboardData.chart[label];
				var pointsQuantity = entity.points.length;
				var highestValue = this.getHighestValue(homerDashboardData);
				var columnWidth = 100/pointsQuantity;
				var chartCenteringOffset = 0.5;
				
				var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
				group.append(
					...entity.points.map((point, index, points)=>{
						var previousPointIndex = points[index-1] ? index-1 : 0;
						var previousPoint = points[index-1] ? points[index-1] : point;
						return this.draw({point, index, chartCenteringOffset, columnWidth, highestValue, previousPoint, previousPointIndex});
					})
				);
				svg.append(group);
			}
			
			return svg;
		},
		chart(drawFunctionName){
			this.drawFunctionName = drawFunctionName;
		},
		__proto__:{
			drawFunctionName: 'line',
			drawFunctions: {
				line: function({point, index, chartCenteringOffset, columnWidth, highestValue, previousPoint, previousPointIndex}){
					var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
					circle.setAttribute('r', 6);
					circle.setAttribute('fill', 'green');
					circle.setAttribute('cx', (index +chartCenteringOffset) *columnWidth +'%');
					circle.setAttribute('cy', 100 -point.value/highestValue*100 +'%');
					
					var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
					line.setAttribute('x1', (index +chartCenteringOffset) *columnWidth +'%');
					line.setAttribute('y1', 100 -point.value/highestValue*100 +'%');
					line.setAttribute('x2', (previousPointIndex +chartCenteringOffset) *columnWidth +'%');
					line.setAttribute('y2', 100 -previousPoint.value/highestValue*100 +'%');
					line.setAttribute('stroke', 'green');
					line.setAttribute('stroke-width', '4');

					
					var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
					group.append(line, circle);
					
					return group;
				}
			},
			draw(data){
				return this.drawFunctions[this.drawFunctionName](data);
			},
			
			getHighestValue(homerDashboardData){
				highestValue = 0;
				for(label in homerDashboardData.chart){
					var entity = homerDashboardData.chart[label];
					highestValue = entity.points.reduce((highestValue, point)=>{
						if(highestValue < point.value || highestValue == undefined) return point.value;
					});
				}
				
				return highestValue;
			}
		},
	};
	
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
			build.chart.append(SVGRenderer.render(homerDashboardData));
			
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