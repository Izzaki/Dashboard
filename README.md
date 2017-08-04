**# README #**

Hello.

**# PREVIEW #**

![alt text](https://github.com/Izzaki/Dashboard/blob/master/preview.png)

**# INSTALLATION #**

Put these tags:

    <link href="HomerDashboard.css" rel="stylesheet"/>
    <script src="HomerDashboard.js"></script>

**# DATA #**

Input data going to show inside the chart has to match this schema:

    dto = {
		name: 'Revenue By Solution Line',
		description: 'Revenue per week',
		
		labelPrefix: 'Week',
		labelPostfix: '',
		labels: [48, 49, 50, 51, 52],
		
		leftLabel: '$',
		chart: {
			NetComp: {
				points: [125, 160, 200, 250, 310]
			},
			
			AnalyzerHR: {
				points: [75, 100, 130, 180, 230]
			},
			
			QuestionRight: {
				points: [25, 50, 70, 90, 140]
			}
		}
	};

Notice that the 'name' property of dto has to match HTML tag attribute 'data-name'.
So the HomerDashboard knows where to put the chart.

**# USAGE #**

At very first We should put HTML tag We mentioned above. This tells HomerDashboard where to put the chart.
So inside our HTML just write:

    <div class="homer-dashboard" data-name="Revenue By Solution Line"></div>

Make sure of correctness of your DTO object!

	hd = new HomerDashboard(dto);
	hd.show();
	
You have 2 chart modes to choose: line and graph. By default line mode is turned on.
To change mode use chart() method before calling show()

	hd = new HomerDashboard(dto);
	hd.chart('graph')
	hd.show();

That's it!
