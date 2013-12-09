var ListSentOrderLinesWidget = DataTableWidget.extend({
    
    init: function(params) {
        this._super(params);
    },
    
    show: function() {
        this._fetchSentOrderLines();
        this._bindGUIEvents();
    },
    
    initView: function(data) {
        
        var self = this;
        self._createTableRootDOM(self.dom.containerID, self.dom.tableID);
        
        self.widget = $('#' + self.dom.tableID).dataTable({
            "asStripeClasses": [self.ui.rowClass],
            "bPaginate": false,
            "bLengthChange": false,
            "bFilter": true,
			"bDestroy": true,
            "iDisplayLength": 15,
            "bSort": true,
            "bInfo": false,
            "bAutoWidth": true,
            "sDom": "tip",
            "aoColumns": [
                { "mDataProp": "itemName", "sTitle": "Item", "sClass": self.ui.nameCellClass, "sWidth": "200px",},
                { "mDataProp": "itemQuantity", "sTitle": "Qty", "sDefaultContent": "", "sWidth": "100px"},
                { "mDataProp": "itemTableId", "sTitle": "Table No", "sWidth": "100px", "sType": "date"},
				//{ "mDataProp": "kot", "sTitle": "KOT", "sWidth": "50px"},
                { "mDataProp": "itemCreatedBy", "sTitle": "Steward", "sWidth": "100px"},
				//{ "mDataProp": "itemInTime", "sTitle": "Intime", "sWidth": "50px"},
				{ "mDataProp": "itemStatus", "sTitle": "Status", "sWidth": "200px"}
            ],
            "oLanguage": {
                "sZeroRecords": "No Pending Items"
            }
        });
        
        if (data) {
            self.addData(data, false);  
            
            self.widget.fnDraw();
        }
    },
    
    /*
     * If anything special has to be done to the datum that goes in to the data-table model, it 
     * should be done here.
     * */
    _addDatumToTable: function(datum) {
			var status = "<button type='button' id="+datum.id+" class='btn btn-primary'>"+datum.itemStatus+"</span>";
			datum.itemStatus = status;
            return datum;
    },
	_startTimer: function(){
		var self = this;
		
		self.dom.timer = $.timer(30000, function() {
		
		self.widget.fnClearTable();
		
			$.ajax({
				type: 'get',
				url: self.url.restURL,
				dataType: 'json',
				async: false,
				data:{
					'Authorization' : 'Basic VG9pdEFkbWluOnRvaXRhZG1pbg=='
				},
				success: function(response) {
					self.initView($.parseJSON(response.data));
				},
				error: function (response) {
				}
			});
		});
	},
    _fetchSentOrderLines: function() {
		var self = this;
		$.ajax({
				type: 'get',
				url: this.url.restURL,
				dataType: 'json',
				async: false,
				data:{
					'Authorization' : 'Basic VG9pdEFkbWluOnRvaXRhZG1pbg=='
				},
				success: function(response) {
					self.initView($.parseJSON(response.data));
				},
				error: function (response) {
				}
		});

    },
	_changeKotItemStatus: function(itemId, itemStatus) {
		var status;
		if(itemStatus === 'SENT') {
			status = 'INPROGRESS';
		} else if(itemStatus === 'INPROGRESS') {
			status = 'PREPARED';
		} else if(itemStatus === 'PREPARED') {
			status = 'INTRANSIT';
		} else {
			return;
		}
		var requestParams = {
			orderLineId: itemId,
			orderLineStatus: status,
			Authorization: 'Basic VG9pdEFkbWluOnRvaXRhZG1pbg==',
			isKotCall: 'true'
		};
		
		$.ajax({
			type: 'get',
			url: this.url.restURL,
			dataType: 'json',
			async: false,
			data: requestParams,
			success: function(data) {
				console.log(data);
			},
			error: function (response) {
			}
		});
	},
    _bindGUIEvents: function() {
        var self = this;
		$("#organizations-list-table tbody tr").find('button').on('click', function(){
			self._changeKotItemStatus(this.id, this.textContent);
		});
		self.dom.timerButton.on('click', function(){
			self._startTimer();
		});
        self._bindSearchEvents();
    }
    
});