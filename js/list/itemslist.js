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
            "iDisplayLength": 15,
            "bSort": true,
            "bInfo": false,
            "bAutoWidth": true,
            "sDom": "tip",
            "aoColumns": [
                { "mDataProp": "itemName", "sTitle": "Item", "sClass": self.ui.nameCellClass, "sWidth": "100px",},
                { "mDataProp": "itemQuantity", "sTitle": "Qty", "sDefaultContent": "", "sWidth": "250px"},
                //{ "mDataProp": "itemDate", "sTitle": "Table No", "sWidth": "100px", "sType": "date"},
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
			var status = "<span style='background-color: #6cb33f; float:left; border-radius: 17px; margin-left: 0px; font-size: 12px !important; width: 40%; text-align: center;'>"+datum.itemStatus+"</span>";
			datum.itemStatus = status;
            return datum;
    },
    _fetchSentOrderLines: function() {
		var me = this;
        $.ajax({
			type: 'get',
			url: this.url.restURL,
			dataType: 'json',
			async: false,
			data:{
				'Authorization' : 'Basic VG9pdEFkbWluOnRvaXRhZG1pbg=='
			},
			success: function(data) {
				me.initView(data);
			},
			error: function (response) {
			}
		});
    },
    _bindGUIEvents: function() {
        var self = this;
        self._bindSearchEvents();
    }
    
});