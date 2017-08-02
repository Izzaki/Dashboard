HomerDashboard = (function(){
	
	// data entity
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
			var entityIndex = 0;
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
						return this.draw({
							value, 
							index, 
							chartCenteringOffset, 
							columnWidth, 
							highestValue, 
							previousPoint, 
							previousPointIndex, 
							color: this.getColorByIndex(colorIndex),
							entityIndex
						});
					})
				);
				colorIndex++;
				entityIndex++;
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
					circle.setAttribute('r', 7);
					circle.setAttribute('fill', color);
					circle.setAttribute('cx', (index +chartCenteringOffset) *columnWidth +'%');
					circle.setAttribute('cy', 100 -10 -value/highestValue*80 +'%');
					circle.setAttribute('value', value);
					
					var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
					line.setAttribute('x1', (index +chartCenteringOffset) *columnWidth-0.7 +'%');
					line.setAttribute('y1', 100 -10 -value/highestValue*80 +'%');
					line.setAttribute('x2', (previousPointIndex +chartCenteringOffset) *columnWidth+0.7 +'%');
					line.setAttribute('y2', 100 -10 -previousPoint/highestValue*80 +'%');
					line.setAttribute('stroke', color);
					line.setAttribute('stroke-width', '4');
					
					var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
					group.append(line, circle);
					
					return group;
				},
				graph: function({value, index, chartCenteringOffset, columnWidth, highestValue, entityIndex, color}){
					var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					rect.setAttribute('x', (index +chartCenteringOffset -0.2) *columnWidth-0.7 +entityIndex*columnWidth/5 -0.7 +'%');
					rect.setAttribute('y', 100 -10 -value/highestValue*80 +'%');
					rect.setAttribute('width', columnWidth/(Object.keys(homerDashboardData.chart).length*3) +'%');
					rect.setAttribute('height', 10 +value/highestValue*80 +'%');
					rect.setAttribute('fill', color);
					
					return rect;
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
				this.makeCirclesHoverable();
			}catch(e){
				console.log('Cannot show dashboard caused by: ', e);
			}
		};
		
		this.chart = function(drawFunctionName){
			SVGRenderer.chart(drawFunctionName);
		};
		
		this.__proto__ = {
			build: function(){
				var self = this;
				var build = {}; // div's pool
				
				'content header side-left side-right column-left chart bar-up bar-down legend number homer tooltip'
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
				this.tooltip = build['tooltip'];
				
				build['side-left'].append(
					build['bar-up'],
					build['column-left'],
					build['chart'],
					build['bar-down'],
					build['legend']
				);
				
				build['chart'].append(build['tooltip']);
				
				build['side-right'].append(
					build['number'],
					build['homer']
				);
				
				build.content.append(
					build['side-left'],
					build['side-right'],
				);
					
				this.entity.append(build.header, build.content);
			},
		
			// building elements
			makeLeftColumn: function(){
				var values = [];
				
				var entity = homerDashboardData.chart[label];
				var highestValue = SVGRenderer.getHighestValue(homerDashboardData);
					
				for(let i=1; i<=2; i++){
					valueHTML = document.createElement('value');
					valueHTML.innerText = highestValue* 1/i;
					valueHTML.style.top = 100-10 -80/i +'%'
					values.push(valueHTML);
				};
				valueHTML = document.createElement('value');
				valueHTML.innerText = homerDashboardData.leftLabel;
				valueHTML.style.bottom = 0 +'%';
				values.push(valueHTML);
				
				return values;
			},
			
			makeBarDown: function(){
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
			},
			
			makeLegend: function(){
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
			},
			
			makeNumber: function(){
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
			},
			
			makeCirclesHoverable: function(){
				this.entity.querySelectorAll('circle').forEach(circle=>{

					circle.onmouseover = (e)=>{
						this.drawTooltip({
							value: circle.getAttribute('value'),
							position: {x: e.layerX, y: e.layerY}
						});
					};
					
					circle.onmouseout = (e)=>{
						this.hideTooltip();
					};
				});
			},
			
			drawTooltip: function({value, position}){
				var tooltip = this.tooltip;
				tooltip.innerText = `${homerDashboardData.leftLabel}${value}`;
				tooltip.style.transform = `translate(${position.x}px, ${position.y}px)`;
				tooltip.style.opacity = 1;
				tooltip.style.display = 'block';
			},
			
			hideTooltip: function(){
				this.tooltip.style.opacity = 0;
				this.tooltip.style.display = 'none';
			}
		}
	}
})();