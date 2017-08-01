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
			var highestValue = this.getHighestValue(homerDashboardData);
			var colorIndex = 0;
			for(label in homerDashboardData.chart){
				var entity = homerDashboardData.chart[label];
				var pointsQuantity = entity.points.length;
				var columnWidth = 100/pointsQuantity;
				var chartCenteringOffset = 0.5;
				
				var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
				group.append(
					...entity.points.map((value, index, points)=>{
						var previousPointIndex = points[index-1] ? index-1 : 0;
						var previousPoint = points[index-1] ? points[index-1] : value;
						return this.draw({value, index, chartCenteringOffset, columnWidth, highestValue, previousPoint, previousPointIndex, color: this.getColorByIndex(colorIndex)});
					})
				);
				colorIndex++;
				svg.append(group);
			}
			
			return svg;
		},
		chart(drawFunctionName){
			this.drawFunctionName = drawFunctionName;
		},
		getColorByIndex(index){
			return '#ed6e35 #259e00 #129fc7 #9612c7 #c71212 #12c7ba #c3c712'.split(' ')[index];
		},
		__proto__:{
			drawFunctionName: 'line',
			drawFunctions: {
				line: function({value, index, chartCenteringOffset, columnWidth, highestValue, previousPoint, previousPointIndex, color}){
					var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
					circle.setAttribute('r', 6);
					circle.setAttribute('fill', color);
					circle.setAttribute('cx', (index +chartCenteringOffset) *columnWidth +'%');
					circle.setAttribute('cy', 100 -value/highestValue*100 +'%');
					
					var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
					line.setAttribute('x1', (index +chartCenteringOffset) *columnWidth +'%');
					line.setAttribute('y1', 100 -value/highestValue*100 +'%');
					line.setAttribute('x2', (previousPointIndex +chartCenteringOffset) *columnWidth +'%');
					line.setAttribute('y2', 100 -previousPoint/highestValue*100 +'%');
					line.setAttribute('stroke', color);
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
					entity.points.forEach(value=>{
						if(highestValue < value) highestValue = value;
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
		
		this.chart = function(drawFunctionName){
			SVGRenderer.chart(drawFunctionName);
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
			build['column-left'].append.apply(build['column-left'], this.makeLeftColumn());
			build['bar-down'].append.apply(build['bar-down'], this.makeBarDown());
			build['legend'].append(this.makeLegend());
			build['number'].append(this.makeNumber());

			
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
		
		this.__proto__.makeLeftColumn = function(){
			var values = [];
			
			for(label in homerDashboardData.chart){
				var entity = homerDashboardData.chart[label];
				var highestValue = SVGRenderer.getHighestValue(homerDashboardData);
				
				values.push(...entity.points.map((value)=>{
					valueHTML = document.createElement('value');
					valueHTML.innerText = value;
					valueHTML.style.top = 100 -value/highestValue*100 +'%'
					return valueHTML;
				}));
			}
			
			return values;
		};
		
		this.__proto__.makeBarDown = function(){
			var labels = [];
			var chartCenteringOffset = 0.5;
			var columnWidth = 100/homerDashboardData.labels.length;
			
			for(index in homerDashboardData.labels){
				var label = homerDashboardData.labels[index];
				
				var labelHTML = document.createElement('label');
				labelHTML.innerText = `${homerDashboardData.labelPrefix} ${label} ${homerDashboardData.labelPostfix}`;
				labelHTML.style.left = (Number(index) +chartCenteringOffset) *columnWidth +'%'
				labels.push(labelHTML);
			}
			
			return labels;
		};
		
		this.__proto__.makeLegend = function(){
			var legend = document.createElement('ul');
			var colorIndex = 0;
			
			for(index in homerDashboardData.chart){
				
				li = document.createElement('li');
				li.style.color = SVGRenderer.getColorByIndex(colorIndex);
				
				span = document.createElement('span');
				span.style.color = '#333';
				span.innerText = `${index}`;
				
				li.append(span);
				legend.append(li);
				
				colorIndex++;
			}
			return legend;
		};
		
		this.__proto__.makeNumber = function(){
			var summary = 0;
			for(label in homerDashboardData.chart){
				var entity = homerDashboardData.chart[label];
				summary += entity.points.reduce((acumulator, value)=>{
					return acumulator + value;
				});
			};
			
			var div = document.createElement('div');
			var leftLabel = document.createElement('leftlabel');
			leftLabel.innerText = `${homerDashboardData.leftLabel}`;
			
			var summaryHTML = document.createElement('span');
			summaryHTML.innerText = `${summary}`;
			
			var textSummary = document.createElement('summary');
			textSummary.innerText = 'Summary';
			
			div.append(leftLabel, summaryHTML, textSummary);
			return div;
		}
	}
})();