var DataTableWidget = Class.extend({
        
        widget: '',
        
        init: function(settings) {
                $.extend(true, this, settings);
        },
        
        emptyTable: function() {
                this.widget.fnClearTable();
        },
        
        addData: function(dataToBeAdded, doRedraw) {
                var self = this;
                var rowIdPrefix = self.ui.rowId; 
                
                var datums = [];

                var propertiesForTable = [];
                
                $.each(self.widget.fnSettings().aoColumns, function(index, item) {
                        propertiesForTable.push(item.mDataProp);
                });
                
                $.each(dataToBeAdded, function(id, datum) {
                        
                        self._addDatumToTable(datum);
                        
                        var valuesForTable = {};
                        $.each(propertiesForTable, function(index, key) {
                                valuesForTable[key] = datum[key];
                        });
                        
                        valuesForTable["DT_RowId"] = rowIdPrefix + datum.id;
                        
                        datums.push(valuesForTable);
                });
                
                self.widget.fnAddData(datums, false);
                
                if (doRedraw === undefined) {
                        doRedraw = true;
                }
                
                if (doRedraw) {
                        self.widget.fnDraw();        
                }
        },
        
        _createTableRootDOM: function(containerID, tableID) {
                $('#' + containerID)
                        .append( '<table class="table table-striped table-condensed" cellpadding="2" cellspacing="2" border="0" id="' + tableID + '"></table>');
        },
        
        /*
         * By default this is a global search box events. Global being searchable across all columns.
         * But if an int is provided as an input then it will apply the search only on that column.
         * */
        _bindSearchEvents: function(onColumnIndex, delayFilterBy) {
                
                var self = this;
                
                /*
                 * No need to bind search events if the search box does not exist.
                 * */
                if (!self.dom.search) {
                        return;
                }
                
                var searchColumnIndex = null;
                if (Math.ceil(onColumnIndex) === Math.floor(onColumnIndex)) {
                        searchColumnIndex = onColumnIndex;
                } 
                delayFilterBy = (typeof delayFilterBy === 'undefined') ? 100 : delayFilterBy;
                
                var searchTimeId = null; 
                var prevSearch = null;
                
                self.dom.search.input.on('keyup', function() {
                        var input = $(this);
                        
                        if (prevSearch === null || prevSearch != input.val()) {
                                window.clearTimeout(searchTimeId);
                                prevSearch = input.val();        
                                searchTimeId = window.setTimeout(function() {
                                        self.widget.fnFilter(input.val(), searchColumnIndex);
                                        if (self.scroll) {
                                                self.scroll.resize();                        
                                        }
                                }, delayFilterBy);
                        }
                        

                        input.removeClass("empty-query-error");
                });
                
                self.dom.search.reset.on('click', function() {
                        self.widget.fnFilter("", searchColumnIndex);
                        self.dom.search.input.val("");
                        if (self.scroll) {
                                self.scroll.resize();                        
                        }
                });
                /*
                 * This is used to prevent search forms from getting submitted. Search forms are used here 
                 * for in-page search. 
                 * */
                if (self.dom.container) {
                        self.dom.container.on("submit", "form.form-search", function(event) {
                                event.preventDefault();
                        });
                }
        
        },
        
        loadData: function(data) {},
        show: function() {},
        hide: function() {},
        initView: function() {},
        firePostLoadEvents: function() {}
});