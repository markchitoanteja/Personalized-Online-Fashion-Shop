(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {

		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {

		var jq = require('jquery');

		if (typeof window === 'undefined') {
			module.exports = function (root, $) {
				if ( ! root ) {

					root = window;
				}

				if ( ! $ ) {
					$ = jq( root );
				}

				return factory( $, root, root.document );
			};
		}
		else {
			module.exports = factory( jq, window, window.document );
		}
	}
	else {

		window.DataTable = factory( jQuery, window, document );
	}
}(function( $, window, document ) {
	"use strict";

	var DataTable = function ( selector, options )
	{

		if (DataTable.factory(selector, options)) {
			return DataTable;
		}

		if (this instanceof DataTable) {
			return $(selector).DataTable(options);
		}
		else {

			options = selector;
		}

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.api = function ()
		{
			return new _Api( this );
		};

		this.each(function() {

			var o = {};
			var oInit = len > 1 ? 
				_fnExtend( o, options, true ) :
				options;

			var i=0, iLen;
			var sId = this.getAttribute( 'id' );
			var defaults = DataTable.defaults;
			var $this = $(this);

			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}

			$(this).trigger( 'options.dt', oInit );

			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );

			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );

			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ), true );

			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];

				if (
					s.nTable == this ||
					(s.nTHead && s.nTHead.parentNode == this) ||
					(s.nTFoot && s.nTFoot.parentNode == this)
				) {
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;

					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						new DataTable.Api(s).destroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}

				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}

			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}

			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId,
				colgroup: $('<colgroup>').prependTo(this),
				fastData: function (row, column, type) {
					return _fnGetCellData(oSettings, row, column, type);
				}
			} );
			oSettings.nTable = this;
			oSettings.oInit  = oInit;

			allSettings.push( oSettings );

			oSettings.api = new _Api( oSettings );

			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();

			_fnCompatOpts( oInit );

			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = Array.isArray(oInit.aLengthMenu[0])
					? oInit.aLengthMenu[0][0]
					: $.isPlainObject( oInit.aLengthMenu[0] )
						? oInit.aLengthMenu[0].value
						: oInit.aLengthMenu[0];
			}

			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );

			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"ajax",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"iStateDuration",
				"bSortCellsTop",
				"iTabIndex",
				"sDom",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				"caption",
				"layout",
				"orderDescReverse",
				"typeDetect",
				[ "iCookieDuration", "iStateDuration" ], 
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );

			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback );

			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );

			_fnBrowserDetect( oSettings );

			var oClasses = oSettings.oClasses;

			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.table );

			if (! oSettings.oFeatures.bPaginate) {
				oInit.iDisplayStart = 0;
			}

			if ( oSettings.iInitDisplayStart === undefined )
			{

				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}

			var defer = oInit.iDeferLoading;
			if ( defer !== null )
			{
				oSettings.deferLoading = true;

				var tmp = Array.isArray(defer);
				oSettings._iRecordsDisplay = tmp ? defer[0] : defer;
				oSettings._iRecordsTotal = tmp ? defer[1] : defer;
			}

			var columnsInit = [];
			var thead = this.getElementsByTagName('thead');
			var initHeaderLayout = _fnDetectHeader( oSettings, thead[0] );

			if ( oInit.aoColumns ) {
				columnsInit = oInit.aoColumns;
			}
			else if ( initHeaderLayout.length ) {
				for ( i=0, iLen=initHeaderLayout[0].length ; i<iLen ; i++ ) {
					columnsInit.push( null );
				}
			}

			for ( i=0, iLen=columnsInit.length ; i<iLen ; i++ ) {
				_fnAddColumn( oSettings );
			}

			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, columnsInit, initHeaderLayout, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );

			var rowOne = $this.children('tbody').find('tr').eq(0);

			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};

				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];

					if (! col) {
						_fnLog( oSettings, 0, 'Incorrect column count', 18 );
					}

					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );

						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
							col._isArrayHost = true;

							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}

			_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState );

			var features = oSettings.oFeatures;
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
			}

			if ( oInit.aaSorting === undefined ) {
				var sorting = oSettings.aaSorting;
				for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
					sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
				}
			}

			_fnSortingClasses( oSettings );

			_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
				if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
					_fnSortingClasses( oSettings );
				}
			} );

			var caption = $this.children('caption');

			if ( oSettings.caption ) {
				if ( caption.length === 0 ) {
					caption = $('<caption/>').appendTo( $this );
				}

				caption.html( oSettings.caption );
			}

			if (caption.length) {
				caption[0]._captionSide = caption.css('caption-side');
				oSettings.captionNode = caption[0];
			}

			if ( thead.length === 0 ) {
				thead = $('<thead/>').appendTo($this);
			}
			oSettings.nTHead = thead[0];
			$('tr', thead).addClass(oClasses.thead.row);

			var tbody = $this.children('tbody');
			if ( tbody.length === 0 ) {
				tbody = $('<tbody/>').insertAfter(thead);
			}
			oSettings.nTBody = tbody[0];

			var tfoot = $this.children('tfoot');
			if ( tfoot.length === 0 ) {

				tfoot = $('<tfoot/>').appendTo($this);
			}
			oSettings.nTFoot = tfoot[0];
			$('tr', tfoot).addClass(oClasses.tfoot.row);

			oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();

			oSettings.bInitialised = true;

			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );

			if ( oLanguage.sUrl ) {

				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json, oSettings.oInit.oLanguage );

						_fnCallbackFire( oSettings, null, 'i18n', [oSettings], true);
						_fnInitialise( oSettings );
					},
					error: function () {

						_fnLog( oSettings, 0, 'i18n file loading error', 21 );

						_fnInitialise( oSettings );
					}
				} );
			}
			else {
				_fnCallbackFire( oSettings, null, 'i18n', [oSettings], true);
				_fnInitialise( oSettings );
			}
		} );
		_that = null;
		return this;
	};

	DataTable.ext = _ext = {

		buttons: {},

		classes: {},

		builder: "-source-",

		errMode: "alert",

		feature: [],

		features: {},

		search: [],

		selector: {
			cell: [],
			column: [],
			row: []
		},

		legacy: {

			ajax: null
		},

		pager: {},

		renderer: {
			pageButton: {},
			header: {}
		},

		order: {},

		type: {

			className: {},

			detect: [],

			render: {},

			search: {},

			order: {}
		},

		_unique: 0,

		fnVersionCheck: DataTable.fnVersionCheck,

		iApiIndex: 0,

		sVersion: DataTable.version
	};

	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );

	$.extend( DataTable.ext.classes, {
		container: 'dt-container',
		empty: {
			row: 'dt-empty'
		},
		info: {
			container: 'dt-info'
		},
		layout: {
			row: 'dt-layout-row',
			cell: 'dt-layout-cell',
			tableRow: 'dt-layout-table',
			tableCell: '',
			start: 'dt-layout-start',
			end: 'dt-layout-end',
			full: 'dt-layout-full'
		},
		length: {
			container: 'dt-length',
			select: 'dt-input'
		},
		order: {
			canAsc: 'dt-orderable-asc',
			canDesc: 'dt-orderable-desc',
			isAsc: 'dt-ordering-asc',
			isDesc: 'dt-ordering-desc',
			none: 'dt-orderable-none',
			position: 'sorting_'
		},
		processing: {
			container: 'dt-processing'
		},
		scrolling: {
			body: 'dt-scroll-body',
			container: 'dt-scroll',
			footer: {
				self: 'dt-scroll-foot',
				inner: 'dt-scroll-footInner'
			},
			header: {
				self: 'dt-scroll-head',
				inner: 'dt-scroll-headInner'
			}
		},
		search: {
			container: 'dt-search',
			input: 'dt-input'
		},
		table: 'dataTable',	
		tbody: {
			cell: '',
			row: ''
		},
		thead: {
			cell: '',
			row: ''
		},
		tfoot: {
			cell: '',
			row: ''
		},
		paging: {
			active: 'current',
			button: 'dt-paging-button',
			container: 'dt-paging',
			disabled: 'disabled',
			nav: ''
		}
	} );

	var _ext; 
	var _Api; 
	var _api_register; 
	var _api_registerPlural; 

	var _re_dic = {};
	var _re_new_lines = /[\r\n\u2028]/g;
	var _re_html = /<([^>]*>)/g;
	var _max_str_len = Math.pow(2, 28);

	var _re_date = /^\d{2,4}[./-]\d{1,2}[./-]\d{1,2}([T ]{1}\d{1,2}[:.]\d{2}([.:]\d{2})?)?$/;

	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );

	var _re_formatted_numeric = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;

	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};

	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};

	var _numToDecimal = function ( num, decimalPoint ) {

		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};

	var _isNumber = function ( d, decimalPoint, formatted, allowEmpty ) {
		var type = typeof d;
		var strType = type === 'string';

		if ( type === 'number' || type === 'bigint') {
			return true;
		}

		if ( allowEmpty && _empty( d ) ) {
			return true;
		}

		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}

		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}

		return !isNaN( parseFloat(d) ) && isFinite( d );
	};

	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};

	var _htmlNumeric = function ( d, decimalPoint, formatted, allowEmpty ) {
		if ( allowEmpty && _empty( d ) ) {
			return true;
		}

		if (typeof d === 'string' && d.match(/<(input|select)/i)) {
			return null;
		}

		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted, allowEmpty ) ?
				true :
				null;
	};

	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;

		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}

		return out;
	};

	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;

		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ] && a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ] ) {
					out.push( a[ order[i] ][ prop ] );
				}
			}
		}

		return out;
	};

	var _range = function ( len, start )
	{
		var out = [];
		var end;

		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}

		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}

		return out;
	};

	var _removeEmpty = function ( a )
	{
		var out = [];

		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { 
				out.push( a[i] );
			}
		}

		return out;
	};

	var _stripHtml = function (input) {
		if (! input || typeof input !== 'string') {
			return input;
		}

		if (input.length > _max_str_len) {
			throw new Error('Exceeded max str len');
		}

		var previous;

		input = input.replace(_re_html, ''); 

		do {
			previous = input;
			input = input.replace(/<script/i, '');
		} while (input !== previous);

		return previous;
	};

	var _escapeHtml = function ( d ) {
		if (Array.isArray(d)) {
			d = d.join(',');
		}

		return typeof d === 'string' ?
			d
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;') :
			d;
	};

	var _normalize = function (str, both) {
		if (typeof str !== 'string') {
			return str;
		}

		var res = str.normalize
			? str.normalize("NFD")
			: str;

		return res.length !== str.length
			? (both === true ? str + ' ' : '' ) + res.replace(/[\u0300-\u036f]/g, "")
			: res;
	}

	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}

		var sorted = src.slice().sort();
		var last = sorted[0];

		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}

			last = sorted[i];
		}

		return true;
	};

	var _unique = function ( src )
	{
		if (Array.from && Set) {
			return Array.from(new Set(src));
		}

		if ( _areAllUnique( src ) ) {
			return src.slice();
		}

		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;

		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];

			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}

			out.push( val );
			k++;
		}

		return out;
	};

	var _flatten = function (out, val) {
		if (Array.isArray(val)) {
			for (var i=0 ; i<val.length ; i++) {
				_flatten(out, val[i]);
			}
		}
		else {
			out.push(val);
		}

		return out;
	}

	function _addClass(el, name) {
		if (name) {
			name.split(' ').forEach(function (n) {
				if (n) {

					el.classList.add(n);
				}
			});
		}
	}

	DataTable.util = {

		diacritics: function (mixed, both) {
			var type = typeof mixed;

			if (type !== 'function') {
				return _normalize(mixed, both);
			}
			_normalize = mixed;
		},

		debounce: function ( fn, timeout ) {
			var timer;

			return function () {
				var that = this;
				var args = arguments;

				clearTimeout(timer);

				timer = setTimeout( function () {
					fn.apply(that, args);
				}, timeout || 250 );
			};
		},

		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;

			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;

				if ( last && now < last + frequency ) {
					clearTimeout( timer );

					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},

		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		},

		set: function ( source ) {
			if ( $.isPlainObject( source ) ) {

				return DataTable.util.set( source._ );
			}
			else if ( source === null ) {

				return function () {};
			}
			else if ( typeof source === 'function' ) {
				return function (data, val, meta) {
					source( data, 'set', val, meta );
				};
			}
			else if (
				typeof source === 'string' && (source.indexOf('.') !== -1 ||
				source.indexOf('[') !== -1 || source.indexOf('(') !== -1)
			) {

				var setData = function (data, val, src) {
					var a = _fnSplitObjNotation( src ), b;
					var aLast = a[a.length-1];
					var arrayNotation, funcNotation, o, innerSrc;

					for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ ) {

						if (a[i] === '__proto__' || a[i] === 'constructor') {
							throw new Error('Cannot set prototype values');
						}

						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);

						if ( arrayNotation ) {
							a[i] = a[i].replace(__reArray, '');
							data[ a[i] ] = [];

							b = a.slice();
							b.splice( 0, i+1 );
							innerSrc = b.join('.');

							if ( Array.isArray( val ) ) {
								for ( var j=0, jLen=val.length ; j<jLen ; j++ ) {
									o = {};
									setData( o, val[j], innerSrc );
									data[ a[i] ].push( o );
								}
							}
							else {

								data[ a[i] ] = val;
							}

							return;
						}
						else if ( funcNotation ) {

							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]( val );
						}

						if ( data[ a[i] ] === null || data[ a[i] ] === undefined ) {
							data[ a[i] ] = {};
						}
						data = data[ a[i] ];
					}

					if ( aLast.match(__reFn ) ) {

						data = data[ aLast.replace(__reFn, '') ]( val );
					}
					else {

						data[ aLast.replace(__reArray, '') ] = val;
					}
				};

				return function (data, val) { 
					return setData( data, val, source );
				};
			}
			else {

				return function (data, val) { 
					data[source] = val;
				};
			}
		},

		get: function ( source ) {
			if ( $.isPlainObject( source ) ) {

				var o = {};
				$.each( source, function (key, val) {
					if ( val ) {
						o[key] = DataTable.util.get( val );
					}
				} );

				return function (data, type, row, meta) {
					var t = o[type] || o._;
					return t !== undefined ?
						t(data, type, row, meta) :
						data;
				};
			}
			else if ( source === null ) {

				return function (data) { 
					return data;
				};
			}
			else if ( typeof source === 'function' ) {
				return function (data, type, row, meta) {
					return source( data, type, row, meta );
				};
			}
			else if (
				typeof source === 'string' && (source.indexOf('.') !== -1 ||
				source.indexOf('[') !== -1 || source.indexOf('(') !== -1)
			) {

				var fetchData = function (data, type, src) {
					var arrayNotation, funcNotation, out, innerSrc;

					if ( src !== "" ) {
						var a = _fnSplitObjNotation( src );

						for ( var i=0, iLen=a.length ; i<iLen ; i++ ) {

							arrayNotation = a[i].match(__reArray);
							funcNotation = a[i].match(__reFn);

							if ( arrayNotation ) {

								a[i] = a[i].replace(__reArray, '');

								if ( a[i] !== "" ) {
									data = data[ a[i] ];
								}
								out = [];

								a.splice( 0, i+1 );
								innerSrc = a.join('.');

								if ( Array.isArray( data ) ) {
									for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
										out.push( fetchData( data[j], type, innerSrc ) );
									}
								}

								var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
								data = (join==="") ? out : out.join(join);

								break;
							}
							else if ( funcNotation ) {

								a[i] = a[i].replace(__reFn, '');
								data = data[ a[i] ]();
								continue;
							}

							if (data === null || data[ a[i] ] === null) {
								return null;
							}
							else if ( data === undefined || data[ a[i] ] === undefined ) {
								return undefined;
							}

							data = data[ a[i] ];
						}
					}

					return data;
				};

				return function (data, type) { 
					return fetchData( data, type, source );
				};
			}
			else {

				return function (data) { 
					return data[source];
				};
			}
		},

		stripHtml: function (mixed) {
			var type = typeof mixed;

			if (type === 'function') {
				_stripHtml = mixed;
				return;
			}
			else if (type === 'string') {
				return _stripHtml(mixed);
			}
			return mixed;
		},

		escapeHtml: function (mixed) {
			var type = typeof mixed;

			if (type === 'function') {
				_escapeHtml = mixed;
				return;
			}
			else if (type === 'string' || Array.isArray(mixed)) {
				return _escapeHtml(mixed);
			}
			return mixed;
		},

		unique: _unique
	};

	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};

		$.each( o, function (key) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);

			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;

				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );

		o._hungarianMap = map;
	}

	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}

		var hungarianKey;

		$.each( user, function (key) {
			hungarianKey = src._hungarianMap[ key ];

			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{

				if ( hungarianKey.charAt(0) === 'o' )
				{

					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );

					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}

	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};

	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );

		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}

		var searchCols = init.aoSearchCols;

		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}

		if (init.serverSide && ! init.searchDelay) {
			init.searchDelay = 400;
		}
	}

	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );

		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! Array.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}

	function _fnBrowserDetect( settings )
	{

		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;

			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: -1 * window.pageXOffset, 
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );

			var outer = n.children();
			var inner = outer.children();

			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;

			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;

			n.remove();
		}

		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}

	function _fnAddColumn( oSettings )
	{

		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol,
			searchFixed: {},
			colEl: $('<col>').attr('data-dt-column', iCol)
		} );
		oSettings.aoColumns.push( oCol );

		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	}

	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];

		if ( oOptions !== undefined && oOptions !== null )
		{

			_fnCompatCols( oOptions );

			_fnCamelToHungarian( DataTable.defaults.column, oOptions, true );

			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}

			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}

			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}

			var origClass = oCol.sClass;

			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );

			if (origClass !== oCol.sClass) {
				oCol.sClass = origClass + ' ' + oCol.sClass;
			}

			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}

		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );

		if ( oCol.mRender && Array.isArray( oCol.mRender ) ) {
			var copy = oCol.mRender.slice();
			var name = copy.shift();

			oCol.mRender = DataTable.render[name].apply(window, copy);
		}

		oCol._render = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;

		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;

		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );

			return oCol._render && type ?
				oCol._render( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};

		if ( typeof mDataSrc !== 'number' && ! oCol._isArrayHost ) {
			oSettings._rowReadObject = true;
		}

		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
		}
	}

	function _fnAdjustColumnSizing ( settings )
	{
		_fnCalculateColumnWidths( settings );
		_fnColumnSizes( settings );

		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '') {
			_fnScrollDraw( settings );
		}

		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}

	function _fnColumnSizes ( settings )
	{
		var cols = settings.aoColumns;

		for (var i=0 ; i<cols.length ; i++) {
			var width = _fnColumnsSumWidth(settings, [i], false, false);

			cols[i].colEl.css('width', width);
		}
	}

	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );

		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}

	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = aiVis.indexOf(iMatch);

		return iPos !== -1 ? iPos : null;
	}

	function _fnVisbleColumns( settings )
	{
		var layout = settings.aoHeader;
		var columns = settings.aoColumns;
		var vis = 0;

		if ( layout.length ) {
			for ( var i=0, ien=layout[0].length ; i<ien ; i++ ) {
				if ( columns[i].bVisible && $(layout[0][i].cell).css('display') !== 'none' ) {
					vis++;
				}
			}
		}

		return vis;
	}

	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];

		oSettings.aoColumns.map( function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );

		return a;
	}

	function _typeResult (typeDetect, res) {
		return res === true
			? typeDetect._name
			: res;
	}

	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, detectedType, cache;

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];

			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {

				if (! settings.typeDetect) {
					return;
				}

				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					var typeDetect = types[j];

					var oneOf = typeDetect.oneOf;
					var allOf = typeDetect.allOf || typeDetect;
					var init = typeDetect.init;
					var one = false;

					detectedType = null;

					if (init) {
						detectedType = _typeResult(typeDetect, init(settings, col, i));

						if (detectedType) {
							col.sType = detectedType;
							break;
						}
					}

					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						if (! data[k]) {
							continue;
						}

						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}

						if (oneOf && ! one) {
							one = _typeResult(typeDetect, oneOf( cache[k], settings ));
						}

						detectedType = _typeResult(typeDetect, allOf( cache[k], settings ));

						if ( ! detectedType && j !== types.length-3 ) {
							break;
						}

						if ( detectedType === 'html' && ! _empty(cache[k]) ) {
							break;
						}
					}

					if ( (oneOf && one && detectedType) || (!oneOf && detectedType) ) {
						col.sType = detectedType;
						break;
					}
				}

				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}

			var autoClass = _ext.type.className[col.sType];

			if (autoClass) {
				_columnAutoClass(settings.aoHeader, i, autoClass);
				_columnAutoClass(settings.aoFooter, i, autoClass);
			}

			var renderer = _ext.type.render[col.sType];

			if (renderer && ! col._render) {
				col._render = DataTable.util.get(renderer);

				_columnAutoRender(settings, i);
			}
		}
	}

	function _columnAutoRender(settings, colIdx) {
		var data = settings.aoData;

		for (var i=0 ; i<data.length ; i++) {
			if (data[i].nTr) {

				var display = _fnGetCellData( settings, i, colIdx, 'display' );

				data[i].displayData[colIdx] = display;
				_fnWriteCell(data[i].anCells[colIdx], display);

			}
		}
	}

	function _columnAutoClass(container, colIdx, className) {
		container.forEach(function (row) {
			if (row[colIdx] && row[colIdx].unique) {
				_addClass(row[colIdx].cell, className);
			}
		});
	}

	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, headerLayout, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;

		if ( aoCols ) {
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ ) {
				if (aoCols[i] && aoCols[i].name) {
					columns[i].sName = aoCols[i].name;
				}
			}
		}

		if ( aoColDefs )
		{

			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];

				var aTargets = def.target !== undefined
					? def.target
					: def.targets !== undefined
						? def.targets
						: def.aTargets;

				if ( ! Array.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}

				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					var target = aTargets[j];

					if ( typeof target === 'number' && target >= 0 )
					{

						while( columns.length <= target )
						{
							_fnAddColumn( oSettings );
						}

						fn( target, def );
					}
					else if ( typeof target === 'number' && target < 0 )
					{

						fn( columns.length+target, def );
					}
					else if ( typeof target === 'string' )
					{
						for ( k=0, kLen=columns.length ; k<kLen ; k++ ) {
							if (target === '_all') {

								fn( k, def );
							}
							else if (target.indexOf(':name') !== -1) {

								if (columns[k].sName === target.replace(':name', '')) {
									fn( k, def );
								}
							}
							else {

								headerLayout.forEach(function (row) {
									if (row[k]) {
										var cell = $(row[k].cell);

										if (target.match(/^[a-z][\w-]*$/i)) {
											target = '.' + target;
										}

										if (cell.is( target )) {
											fn( k, def );
										}
									}
								});
							}
						}
					}
				}
			}
		}

		if ( aoCols ) {
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ ) {
				fn( i, aoCols[i] );
			}
		}
	}

	function _fnColumnsSumWidth( settings, targets, original, incVisible ) {
		if ( ! Array.isArray( targets ) ) {
			targets = _fnColumnsFromHeader( targets );
		}

		var sum = 0;
		var unit;
		var columns = settings.aoColumns;

		for ( var i=0, ien=targets.length ; i<ien ; i++ ) {
			var column = columns[ targets[i] ];
			var definedWidth = original ?
				column.sWidthOrig :
				column.sWidth;

			if ( ! incVisible && column.bVisible === false ) {
				continue;
			}

			if ( definedWidth === null || definedWidth === undefined ) {
				return null; 
			}
			else if ( typeof definedWidth === 'number' ) {
				unit = 'px';
				sum += definedWidth;
			}
			else {
				var matched = definedWidth.match(/([\d\.]+)([^\d]*)/);

				if ( matched ) {
					sum += matched[1] * 1;
					unit = matched.length === 3 ?
						matched[2] :
						'px';
				}
			}
		}

		return sum + unit;
	}

	function _fnColumnsFromHeader( cell )
	{
		var attr = $(cell).closest('[data-dt-column]').attr('data-dt-column');

		if ( ! attr ) {
			return [];
		}

		return attr.split(',').map( function (val) {
			return val * 1;
		} );
	}

	function _fnAddData ( settings, dataIn, tr, tds )
	{

		var rowIdx = settings.aoData.length;
		var rowModel = $.extend( true, {}, DataTable.models.oRow, {
			src: tr ? 'dom' : 'data',
			idx: rowIdx
		} );

		rowModel._aData = dataIn;
		settings.aoData.push( rowModel );

		var columns = settings.aoColumns;

		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{

			columns[i].sType = null;
		}

		settings.aiDisplayMaster.push( rowIdx );

		var id = settings.rowIdFn( dataIn );
		if ( id !== undefined ) {
			settings.aIds[ id ] = rowModel;
		}

		if ( tr || ! settings.oFeatures.bDeferRender )
		{
			_fnCreateTr( settings, rowIdx, tr, tds );
		}

		return rowIdx;
	}

	function _fnAddTr( settings, trs )
	{
		var row;

		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}

		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}

	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		if (type === 'search') {
			type = 'filter';
		}
		else if (type === 'order') {
			type = 'sort';
		}

		var row = settings.aoData[rowIdx];

		if (! row) {
			return undefined;
		}

		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = row._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );

		if (type !== 'display' && cellData && typeof cellData === 'object' && cellData.nodeName) {
			cellData = cellData.innerHTML;
		}

		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}

		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {

			return cellData.call( rowData );
		}

		if ( cellData === null && type === 'display' ) {
			return '';
		}

		if ( type === 'filter' ) {
			var fomatters = DataTable.ext.type.search;

			if ( fomatters[ col.sType ] ) {
				cellData = fomatters[ col.sType ]( cellData );
			}
		}

		return cellData;
	}

	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;

		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}

	function _fnWriteCell(td, val)
	{
		if (val && typeof val === 'object' && val.nodeName) {
			$(td)
				.empty()
				.append(val);
		}
		else {
			td.innerHTML = val;
		}
	}

	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;

	function _fnSplitObjNotation( str )
	{
		var parts = str.match(/(\\.|[^.])+/g) || [''];

		return parts.map( function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}

	var _fnGetObjectDataFn = DataTable.util.get;

	var _fnSetObjectDataFn = DataTable.util.set;

	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}

	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}

	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;

		row._aSortData = null;
		row._aFilterData = null;
		row.displayData = null;

		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {

			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {

			var cells = row.anCells;
			var display = _fnGetRowDisplay(settings, rowIdx);

			if ( cells ) {
				if ( colIdx !== undefined ) {
					_fnWriteCell(cells[colIdx], display[colIdx]);
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						_fnWriteCell(cells[i], display[i]);
					}
				}
			}
		}

		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {

			cols[ colIdx ].sType = null;

			cols[ colIdx ].maxLenString = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
				cols[i].maxLenString = null;
			}

			_fnRowAttributes( settings, row );
		}
	}

	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;

		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];

		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');

				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};

		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = (cell.innerHTML).trim();

				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );

					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {

					if ( objectRead ) {
						if ( ! col._setter ) {

							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}

			i++;
		};

		if ( td ) {

			while ( td ) {
				name = td.nodeName.toUpperCase();

				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}

				td = td.nextSibling;
			}
		}
		else {

			tds = row.anCells;

			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}

		var rowNode = row.firstChild ? row : row.nTr;

		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );

			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}

		return {
			data: d,
			cells: tds
		};
	}

	function _fnGetRowDisplay (settings, rowIdx) {
		var rowModal = settings.aoData[rowIdx];
		var columns = settings.aoColumns;

		if (! rowModal.displayData) {

			rowModal.displayData = [];

			for ( var colIdx=0, len=columns.length ; colIdx<len ; colIdx++ ) {
				rowModal.displayData.push(
					_fnGetCellData( settings, rowIdx, colIdx, 'display' )
				);
			}
		}

		return rowModal.displayData;
	}

	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen, create,
			trClass = oSettings.oClasses.tbody.row;

		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');

			row.nTr = nTr;
			row.anCells = cells;

			_addClass(nTr, trClass);

			nTr._DT_RowIndex = iRow;

			_fnRowAttributes( oSettings, row );

			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
				create = nTrIn && anTds[i] ? false : true;

				nTd = create ? document.createElement( oCol.sCellType ) : anTds[i];

				if (! nTd) {
					_fnLog( oSettings, 0, 'Incorrect column count', 18 );
				}

				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};

				cells.push( nTd );

				var display = _fnGetRowDisplay(oSettings, iRow);

				if (
					create ||
					(
						(oCol.mRender || oCol.mData !== i) &&
						(!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
					)
				) {
					_fnWriteCell(nTd, display[i]);
				}

				_addClass(nTd, oCol.sClass);

				if ( oCol.bVisible && create )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && ! create )
				{
					nTd.parentNode.removeChild( nTd );
				}

				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}

			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', 'row-created', [nTr, rowData, iRow, cells] );
		}
		else {
			_addClass(row.nTr, trClass);
		}
	}

	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;

		if ( tr ) {
			var id = settings.rowIdFn( data );

			if ( id ) {
				tr.id = id;
			}

			if ( data.DT_RowClass ) {

				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;

				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}

			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}

			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}

	function _fnBuildHead( settings, side )
	{
		var classes = settings.oClasses;
		var columns = settings.aoColumns;
		var i, ien, row;
		var target = side === 'header'
			? settings.nTHead
			: settings.nTFoot;
		var titleProp = side === 'header' ? 'sTitle' : side;

		if (! target) {
			return;
		}

		if (side === 'header' || _pluck(settings.aoColumns, titleProp).join('')) {
			row = $('tr', target);

			if (! row.length) {
				row = $('<tr/>').appendTo(target)
			}

			if (row.length === 1) {
				var cells = $('td, th', row);

				for ( i=cells.length, ien=columns.length ; i<ien ; i++ ) {
					$('<th/>')
						.html( columns[i][titleProp] || '' )
						.appendTo( row );
				}
			}
		}

		var detected = _fnDetectHeader( settings, target, true );

		if (side === 'header') {
			settings.aoHeader = detected;
		}
		else {
			settings.aoFooter = detected;
		}

		$(target).children('tr').children('th, td')
			.each( function () {
				_fnRenderer( settings, side )(
					settings, $(this), classes
				);
			} );
	}

	function _fnHeaderLayout( settings, source, incColumns )
	{
		var row, column, cell;
		var local = [];
		var structure = [];
		var columns = settings.aoColumns;
		var columnCount = columns.length;
		var rowspan, colspan;

		if ( ! source ) {
			return;
		}

		if ( ! incColumns ) {
			incColumns = _range(columnCount)
				.filter(function (idx) {
					return columns[idx].bVisible;
				});
		}

		for ( row=0 ; row<source.length ; row++ ) {

			local[row] = source[row].slice().filter(function (cell, i) {
				return incColumns.includes(i);
			});

			structure.push( [] );
		}

		for ( row=0 ; row<local.length ; row++ ) {
			for ( column=0 ; column<local[row].length ; column++ ) {
				rowspan = 1;
				colspan = 1;

				if ( structure[row][column] === undefined ) {
					cell = local[row][column].cell;

					while (
						local[row+rowspan] !== undefined &&
						local[row][column].cell == local[row+rowspan][column].cell
					) {
						structure[row+rowspan][column] = null;
						rowspan++;
					}

					while (
						local[row][column+colspan] !== undefined &&
						local[row][column].cell == local[row][column+colspan].cell
					) {

						for ( var k=0 ; k<rowspan ; k++ ) {
							structure[row+k][column+colspan] = null;
						}

						colspan++;
					}

					var titleSpan = $('span.dt-column-title', cell);

					structure[row][column] = {
						cell: cell,
						colspan: colspan,
						rowspan: rowspan,
						title: titleSpan.length
							? titleSpan.html()
							: $(cell).html()
					};
				}
			}
		}

		return structure;
	}

	function _fnDrawHead( settings, source )
	{
		var layout = _fnHeaderLayout(settings, source);
		var tr, n;

		for ( var row=0 ; row<source.length ; row++ ) {
			tr = source[row].row;

			if (tr) {
				while( (n = tr.firstChild) ) {
					tr.removeChild( n );
				}
			}

			for ( var column=0 ; column<layout[row].length ; column++ ) {
				var point = layout[row][column];

				if (point) {
					$(point.cell)
						.appendTo(tr)
						.attr('rowspan', point.rowspan)
						.attr('colspan', point.colspan);
				}
			}
		}
	}

	function _fnDraw( oSettings, ajaxComplete )
	{

		_fnStart( oSettings );

		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( aPreDraw.indexOf(false) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}

		var anRows = [];
		var iRowCount = 0;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
		var columns = oSettings.aoColumns;
		var body = $(oSettings.nTBody);

		oSettings.bDrawing = true;

		if ( oSettings.deferLoading )
		{
			oSettings.deferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !ajaxComplete)
		{

			if (oSettings.iDraw === 0) {
				body.empty().append(_emptyRow(oSettings));
			}

			_fnAjaxUpdate( oSettings );
			return;
		}

		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;

			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}

				var nRow = aoData.nTr;

				for (var i=0 ; i<columns.length ; i++) {
					var col = columns[i];
					var td = aoData.anCells[i];

					_addClass(td, _ext.type.className[col.sType]); 
					_addClass(td, oSettings.oClasses.tbody.cell); 
				}

				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j, iDataIndex] );

				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			anRows[ 0 ] = _emptyRow(oSettings);
		}

		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );

		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );

		if (body[0].replaceChildren) {
			body[0].replaceChildren.apply(body[0], anRows);
		}
		else {
			body.children().detach();
			body.append( $(anRows) );
		}

		$(oSettings.nTableWrapper).toggleClass('dt-empty-footer', $('tr', oSettings.nTFoot).length === 0);

		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings], true );

		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}

	function _fnReDraw( settings, holdPosition, recompute )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;

		if (recompute === undefined || recompute === true) {

			_fnColumnTypes( settings );

			if ( sort ) {
				_fnSort( settings );
			}

			if ( filter ) {
				_fnFilterComplete( settings, settings.oPreviousSearch );
			}
			else {

				settings.aiDisplay = settings.aiDisplayMaster.slice();
			}
		}

		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}

		settings._drawHold = holdPosition;

		_fnDraw( settings );

		settings._drawHold = false;
	}

	function _emptyRow ( settings ) {
		var oLang = settings.oLanguage;
		var zero = oLang.sZeroRecords;
		var dataSrc = _fnDataSource( settings );

		if (
			(settings.iDraw < 1 && dataSrc === 'ssp') ||
			(settings.iDraw <= 1 && dataSrc === 'ajax')
		) {
			zero = oLang.sLoadingRecords;
		}
		else if ( oLang.sEmptyTable && settings.fnRecordsTotal() === 0 )
		{
			zero = oLang.sEmptyTable;
		}

		return $( '<tr/>' )
			.append( $('<td />', {
				'colSpan': _fnVisbleColumns( settings ),
				'class':   settings.oClasses.empty.row
			} ).html( zero ) )[0];
	}

	function _layoutItems (row, align, items) {
		if ( Array.isArray(items)) {
			for (var i=0 ; i<items.length ; i++) {
				_layoutItems(row, align, items[i]);
			}

			return;
		}

		var rowCell = row[align];

		if ( $.isPlainObject( items ) ) {

			if (items.features) {
				if (items.rowId) {
					row.id = items.rowId;
				}
				if (items.rowClass) {
					row.className = items.rowClass;
				}

				rowCell.id = items.id;
				rowCell.className = items.className;

				_layoutItems(row, align, items.features);
			}
			else {
				Object.keys(items).map(function (key) {
					rowCell.contents.push( {
						feature: key,
						opts: items[key]
					});
				});
			}
		}
		else {
			rowCell.contents.push(items);
		}
	}

	function _layoutGetRow(rows, rowNum, align) {
		var row;

		for (var i=0; i<rows.length; i++) {
			row = rows[i];

			if (row.rowNum === rowNum) {

				if (
					(align === 'full' && row.full) ||
					((align === 'start' || align === 'end') && (row.start || row.end))
				) {
					if (! row[align]) {
						row[align] = {
							contents: []
						};
					}

					return row;
				}
			}
		}

		row = {
			rowNum: rowNum	
		};

		row[align] = {
			contents: []
		};

		rows.push(row);

		return row;
	}

	function _layoutArray ( settings, layout, side ) {
		var rows = [];

		$.each( layout, function ( pos, items ) {
			if (items === null) {
				return;
			}

			var parts = pos.match(/^([a-z]+)([0-9]*)([A-Za-z]*)$/);
			var rowNum = parts[2]
				? parts[2] * 1
				: 0;
			var align = parts[3]
				? parts[3].toLowerCase()
				: 'full';

			if (parts[1] !== side) {
				return;
			}

			var row = _layoutGetRow(rows, rowNum, align);

			_layoutItems(row, align, items);
		});

		rows.sort( function ( a, b ) {
			var order1 = a.rowNum;
			var order2 = b.rowNum;

			if (order1 === order2) {
				var ret = a.full && ! b.full ? -1 : 1;

				return side === 'bottom'
					? ret * -1
					: ret;
			}

			return order2 - order1;
		} );

		if ( side === 'bottom' ) {
			rows.reverse();
		}

		for (var row = 0; row<rows.length; row++) {
			delete rows[row].rowNum;

			_layoutResolve(settings, rows[row]);
		}

		return rows;
	}

	function _layoutResolve( settings, row ) {
		var getFeature = function (feature, opts) {
			if ( ! _ext.features[ feature ] ) {
				_fnLog( settings, 0, 'Unknown feature: '+ feature );
			}

			return _ext.features[ feature ].apply( this, [settings, opts] );
		};

		var resolve = function ( item ) {
			if (! row[ item ]) {
				return;
			}

			var line = row[ item ].contents;

			for ( var i=0, ien=line.length ; i<ien ; i++ ) {
				if ( ! line[i] ) {
					continue;
				}
				else if ( typeof line[i] === 'string' ) {
					line[i] = getFeature( line[i], null );
				}
				else if ( $.isPlainObject(line[i]) ) {

					line[i] = getFeature(line[i].feature, line[i].opts);
				}
				else if ( typeof line[i].node === 'function' ) {
					line[i] = line[i].node( settings );
				}
				else if ( typeof line[i] === 'function' ) {
					var inst = line[i]( settings );

					line[i] = typeof inst.node === 'function' ?
						inst.node() :
						inst;
				}
			}
		};

		resolve('start');
		resolve('end');
		resolve('full');
	}

	function _fnAddOptionsHtml ( settings )
	{
		var classes = settings.oClasses;
		var table = $(settings.nTable);

		var insert = $('<div/>')
			.attr({
				id:      settings.sTableId+'_wrapper',
				'class': classes.container
			})
			.insertBefore(table);

		settings.nTableWrapper = insert[0];

		if (settings.sDom) {

			_fnLayoutDom(settings, settings.sDom, insert);
		}
		else {
			var top = _layoutArray( settings, settings.layout, 'top' );
			var bottom = _layoutArray( settings, settings.layout, 'bottom' );
			var renderer = _fnRenderer( settings, 'layout' );

			top.forEach(function (item) {
				renderer( settings, insert, item );
			});

			renderer( settings, insert, {
				full: {
					table: true,
					contents: [ _fnFeatureHtmlTable(settings) ]
				}
			} );

			bottom.forEach(function (item) {
				renderer( settings, insert, item );
			});
		}

		_processingHtml( settings );
	}

	function _fnLayoutDom( settings, dom, insert )
	{
		var parts = dom.match(/(".*?")|('.*?')|./g);
		var featureNode, option, newNode, next, attr;

		for ( var i=0 ; i<parts.length ; i++ ) {
			featureNode = null;
			option = parts[i];

			if ( option == '<' ) {

				newNode = $('<div/>');

				next = parts[i+1];

				if ( next[0] == "'" || next[0] == '"' ) {
					attr = next.replace(/['"]/g, '');

					var id = '', className;

					if ( attr.indexOf('.') != -1 ) {
						var split = attr.split('.');

						id = split[0];
						className = split[1];
					}
					else if ( attr[0] == "#" ) {
						id = attr;
					}
					else {
						className = attr;
					}

					newNode
						.attr('id', id.substring(1))
						.addClass(className);

					i++; 
				}

				insert.append( newNode );
				insert = newNode;
			}
			else if ( option == '>' ) {

				insert = insert.parent();
			}
			else if ( option == 't' ) {

				featureNode = _fnFeatureHtmlTable( settings );
			}
			else
			{
				DataTable.ext.feature.forEach(function(feature) {
					if ( option == feature.cFeature ) {
						featureNode = feature.fnInit( settings );
					}
				});
			}

			if ( featureNode ) {
				insert.append( featureNode );
			}
		}
	}

	function _fnDetectHeader ( settings, thead, write )
	{
		var columns = settings.aoColumns;
		var rows = $(thead).children('tr');
		var row, cell;
		var i, k, l, iLen, shifted, column, colspan, rowspan;
		var isHeader = thead && thead.nodeName.toLowerCase() === 'thead';
		var layout = [];
		var unique;
		var shift = function ( a, i, j ) {
			var k = a[i];
			while ( k[j] ) {
				j++;
			}
			return j;
		};

		for ( i=0, iLen=rows.length ; i<iLen ; i++ ) {
			layout.push( [] );
		}

		for ( i=0, iLen=rows.length ; i<iLen ; i++ ) {
			row = rows[i];
			column = 0;

			cell = row.firstChild;
			while ( cell ) {
				if (
					cell.nodeName.toUpperCase() == 'TD' ||
					cell.nodeName.toUpperCase() == 'TH'
				) {
					var cols = [];

					colspan = cell.getAttribute('colspan') * 1;
					rowspan = cell.getAttribute('rowspan') * 1;
					colspan = (!colspan || colspan===0 || colspan===1) ? 1 : colspan;
					rowspan = (!rowspan || rowspan===0 || rowspan===1) ? 1 : rowspan;

					shifted = shift( layout, i, column );

					unique = colspan === 1 ?
						true :
						false;

					if ( write ) {
						if (unique) {

							_fnColumnOptions( settings, shifted, $(cell).data() );

							var columnDef = columns[shifted];
							var width = cell.getAttribute('width') || null;
							var t = cell.style.width.match(/width:\s*(\d+[pxem%]+)/);
							if ( t ) {
								width = t[1];
							}

							columnDef.sWidthOrig = columnDef.sWidth || width;

							if (isHeader) {

								if ( columnDef.sTitle !== null && ! columnDef.autoTitle ) {
									cell.innerHTML = columnDef.sTitle;
								}

								if (! columnDef.sTitle && unique) {
									columnDef.sTitle = _stripHtml(cell.innerHTML);
									columnDef.autoTitle = true;
								}
							}
							else {

								if (columnDef.footer) {
									cell.innerHTML = columnDef.footer;
								}
							}

							if (! columnDef.ariaTitle) {
								columnDef.ariaTitle = $(cell).attr("aria-label") || columnDef.sTitle;
							}

							if ( columnDef.className ) {
								$(cell).addClass( columnDef.className );
							}
						}

						if ( $('span.dt-column-title', cell).length === 0) {
							$('<span>')
								.addClass('dt-column-title')
								.append(cell.childNodes)
								.appendTo(cell);
						}

						if ( isHeader && $('span.dt-column-order', cell).length === 0) {
							$('<span>')
								.addClass('dt-column-order')
								.appendTo(cell);
						}
					}

					for ( l=0 ; l<colspan ; l++ ) {
						for ( k=0 ; k<rowspan ; k++ ) {
							layout[i+k][shifted+l] = {
								cell: cell,
								unique: unique
							};

							layout[i+k].row = row;
						}

						cols.push( shifted+l );
					}

					cell.setAttribute('data-dt-column', _unique(cols).join(','));
				}

				cell = cell.nextSibling;
			}
		}

		return layout;
	}

	function _fnStart( oSettings )
	{
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var iInitDisplayStart = oSettings.iInitDisplayStart;

		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;

			oSettings.iInitDisplayStart = -1;
		}
	}

	function _fnBuildAjax( oSettings, data, fn )
	{
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			var status = oSettings.jqXHR
				? oSettings.jqXHR.status
				: null;

			if ( json === null || (typeof status === 'number' && status == 204 ) ) {
				json = {};
				_fnAjaxDataSrc( oSettings, json, [] );
			}

			var error = json.error || json.sError;
			if ( error ) {
				_fnLog( oSettings, 0, error );
			}

			if (json.d && typeof json.d === 'string') {
				try {
					json = JSON.parse(json.d);
				}
				catch (e) {

				}
			}

			oSettings.json = json;

			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR], true );
			fn( json );
		};

		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;

			var newData = typeof ajaxData === 'function' ?
				ajaxData( data, oSettings ) :  
				ajaxData;                      

			data = typeof ajaxData === 'function' && newData ?
				newData :
				$.extend( true, data, newData );

			delete ajax.data;
		}

		var baseAjax = {
			"url": typeof ajax === 'string' ?
				ajax :
				'',
			"data": data,
			"success": callback,
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR], true );

				if ( ret.indexOf(true) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}

				_fnProcessingDisplay( oSettings, false );
			}
		};

		if ( $.isPlainObject( ajax ) ) {
			$.extend( baseAjax, ajax )
		}

		oSettings.oAjaxData = data;

		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data, baseAjax], true );

		if ( typeof ajax === 'function' )
		{

			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else if (ajax.url === '') {

			var empty = {};

			DataTable.util.set(ajax.dataSrc)(empty, []);
			callback(empty);
		}
		else {

			oSettings.jqXHR = $.ajax( baseAjax );
		}

		if ( ajaxData ) {
			ajax.data = ajaxData;
		}
	}

	function _fnAjaxUpdate( settings )
	{
		settings.iDraw++;
		_fnProcessingDisplay( settings, true );

		_fnBuildAjax(
			settings,
			_fnAjaxParameters( settings ),
			function(json) {
				_fnAjaxUpdateDraw( settings, json );
			}
		);
	}

	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			colData = function ( idx, prop ) {
				return typeof columns[idx][prop] === 'function' ?
					'function' :
					columns[idx][prop];
			};

		return {
			draw: settings.iDraw,
			columns: columns.map( function ( column, i ) {
				return {
					data: colData(i, 'mData'),
					name: column.sName,
					searchable: column.bSearchable,
					orderable: column.bSortable,
					search: {
						value: preColSearch[i].search,
						regex: preColSearch[i].regex,
						fixed: Object.keys(column.searchFixed).map( function(name) {
							return {
								name: name,
								term: column.searchFixed[name].toString()
							}
						})
					}
				};
			} ),
			order: _fnSortFlatten( settings ).map( function ( val ) {
				return {
					column: val.col,
					dir: val.dir,
					name: colData(val.col, 'sName')
				};
			} ),
			start: settings._iDisplayStart,
			length: features.bPaginate ?
				settings._iDisplayLength :
				-1,
			search: {
				value: preSearch.search,
				regex: preSearch.regex,
				fixed: Object.keys(settings.searchFixed).map( function(name) {
					return {
						name: name,
						term: settings.searchFixed[name].toString()
					}
				})
			}
		};
	}

	function _fnAjaxUpdateDraw ( settings, json )
	{
		var data = _fnAjaxDataSrc(settings, json);
		var draw = _fnAjaxDataSrcParam(settings, 'draw', json);
		var recordsTotal = _fnAjaxDataSrcParam(settings, 'recordsTotal', json);
		var recordsFiltered = _fnAjaxDataSrcParam(settings, 'recordsFiltered', json);

		if ( draw !== undefined ) {

			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}

		if ( ! data ) {
			data = [];
		}

		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);

		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();

		_fnColumnTypes(settings);
		_fnDraw( settings, true );
		_fnInitComplete( settings );
		_fnProcessingDisplay( settings, false );
	}

	function _fnAjaxDataSrc ( settings, json, write )
	{
		var dataProp = 'data';

		if ($.isPlainObject( settings.ajax ) && settings.ajax.dataSrc !== undefined) {

			var dataSrc = settings.ajax.dataSrc;

			if (typeof dataSrc === 'string' || typeof dataSrc === 'function') {
				dataProp = dataSrc;
			}
			else if (dataSrc.data !== undefined) {
				dataProp = dataSrc.data;
			}
		}

		if ( ! write ) {
			if ( dataProp === 'data' ) {

				return json.aaData || json[dataProp];
			}

			return dataProp !== "" ?
				_fnGetObjectDataFn( dataProp )( json ) :
				json;
		}

		_fnSetObjectDataFn( dataProp )( json, write );
	}

	function _fnAjaxDataSrcParam (settings, param, json) {
		var dataSrc = $.isPlainObject( settings.ajax )
			? settings.ajax.dataSrc
			: null;

		if (dataSrc && dataSrc[param]) {

			return _fnGetObjectDataFn( dataSrc[param] )( json );
		}

		var old = '';

		if (param === 'draw') {
			old = 'sEcho';
		}
		else if (param === 'recordsTotal') {
			old = 'iTotalRecords';
		}
		else if (param === 'recordsFiltered') {
			old = 'iTotalDisplayRecords';
		}

		return json[old] !== undefined
			? json[old]
			: json[param];
	}

	function _fnFilterComplete ( settings, input )
	{
		var columnsSearch = settings.aoPreSearchCols;

		if ( _fnDataSource( settings ) != 'ssp' )
		{

			_fnFilterData( settings );

			settings.aiDisplay = settings.aiDisplayMaster.slice();

			_fnFilter( settings.aiDisplay, settings, input.search, input );

			$.each(settings.searchFixed, function (name, term) {
				_fnFilter(settings.aiDisplay, settings, term, {});
			});

			for ( var i=0 ; i<columnsSearch.length ; i++ )
			{
				var col = columnsSearch[i];

				_fnFilter(
					settings.aiDisplay,
					settings,
					col.search,
					col,
					i
				);

				$.each(settings.aoColumns[i].searchFixed, function (name, term) {
					_fnFilter(settings.aiDisplay, settings, term, {}, i);
				});
			}

			_fnFilterCustom( settings );
		}

		settings.bFiltered = true;

		_fnCallbackFire( settings, null, 'search', [settings] );
	}

	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;

		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];

			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];

				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}

			displayRows.length = 0;
			displayRows.push.apply(displayRows, rows);
		}
	}

	function _fnFilter( searchRows, settings, input, options, column )
	{
		if ( input === '' ) {
			return;
		}

		var i = 0;
		var matched = [];

		var searchFunc = typeof input === 'function' ? input : null;
		var rpSearch = input instanceof RegExp
			? input
			: searchFunc
				? null
				: _fnFilterCreateSearch( input, options );

		for (i=0 ; i<searchRows.length ; i++) {
			var row = settings.aoData[ searchRows[i] ];
			var data = column === undefined
				? row._sFilterRow
				: row._aFilterData[ column ];

			if ( (searchFunc && searchFunc(data, row._aData, searchRows[i], column)) || (rpSearch && rpSearch.test(data)) ) {
				matched.push(searchRows[i]);
			}
		}

		searchRows.length = matched.length;

		for (i=0 ; i<matched.length ; i++) {
			searchRows[i] = matched[i];
		}
	}

	function _fnFilterCreateSearch( search, inOpts )
	{
		var not = [];
		var options = $.extend({}, {
			boundary: false,
			caseInsensitive: true,
			exact: false,
			regex: false,
			smart: true
		}, inOpts);

		if (typeof search !== 'string') {
			search = search.toString();
		}

		search = _normalize(search);

		if (options.exact) {
			return new RegExp(
				'^'+_fnEscapeRegex(search)+'$',
				options.caseInsensitive ? 'i' : ''
			);
		}

		search = options.regex ?
			search :
			_fnEscapeRegex( search );

		if ( options.smart ) {

			var parts = search.match( /!?["\u201C][^"\u201D]+["\u201D]|[^ ]+/g ) || [''];
			var a = parts.map( function ( word ) {
				var negative = false;
				var m;

				if ( word.charAt(0) === '!' ) {
					negative = true;
					word = word.substring(1);
				}

				if ( word.charAt(0) === '"' ) {
					m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
				else if ( word.charAt(0) === '\u201C' ) {

					m = word.match( /^\u201C(.*)\u201D$/ );
					word = m ? m[1] : word;
				}

				if (negative) {
					if (word.length > 1) {
						not.push('(?!'+word+')');
					}

					word = '';
				}

				return word.replace(/"/g, '');
			} );

			var match = not.length
				? not.join('')
				: '';

			var boundary = options.boundary
				? '\\b'
				: '';

			search = '^(?=.*?'+boundary+a.join( ')(?=.*?'+boundary )+')('+match+'.)*$';
		}

		return new RegExp( search, options.caseInsensitive ? 'i' : '' );
	}

	var _fnEscapeRegex = DataTable.util.escapeRegex;

	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;

	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var column;
		var j, jen, filterData, cellData, row;
		var wasInvalidated = false;

		for ( var rowIdx=0 ; rowIdx<data.length ; rowIdx++ ) {
			if (! data[rowIdx]) {
				continue;
			}

			row = data[rowIdx];

			if ( ! row._aFilterData ) {
				filterData = [];

				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];

					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, rowIdx, j, 'filter' );

						if ( cellData === null ) {
							cellData = '';
						}

						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}

					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}

					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n\u2028]/g, '');
					}

					filterData.push( cellData );
				}

				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}

		return wasInvalidated;
	}

	function _fnInitialise ( settings )
	{
		var i;
		var init = settings.oInit;
		var deferLoading = settings.deferLoading;
		var dataSrc = _fnDataSource( settings );

		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}

		_fnBuildHead( settings, 'header' );
		_fnBuildHead( settings, 'footer' );

		_fnLoadState( settings, init, function () {

			_fnDrawHead( settings, settings.aoHeader );
			_fnDrawHead( settings, settings.aoFooter );

			var iAjaxStart = settings.iInitDisplayStart

			if ( init.aaData ) {
				for ( i=0 ; i<init.aaData.length ; i++ ) {
					_fnAddData( settings, init.aaData[ i ] );
				}
			}
			else if ( deferLoading || dataSrc == 'dom' ) {

				_fnAddTr( settings, $(settings.nTBody).children('tr') );
			}

			settings.aiDisplay = settings.aiDisplayMaster.slice();

			_fnAddOptionsHtml( settings );
			_fnSortInit( settings );

			_colGroup( settings );

			_fnProcessingDisplay( settings, true );

			_fnCallbackFire( settings, null, 'preInit', [settings], true );

			_fnReDraw( settings );

			if ( dataSrc != 'ssp' || deferLoading ) {

				if ( dataSrc == 'ajax' ) {
					_fnBuildAjax( settings, {}, function(json) {
						var aData = _fnAjaxDataSrc( settings, json );

						for ( i=0 ; i<aData.length ; i++ ) {
							_fnAddData( settings, aData[i] );
						}

						settings.iInitDisplayStart = iAjaxStart;

						_fnReDraw( settings );
						_fnProcessingDisplay( settings, false );
						_fnInitComplete( settings );
					}, settings );
				}
				else {
					_fnInitComplete( settings );
					_fnProcessingDisplay( settings, false );
				}
			}
		} );
	}

	function _fnInitComplete ( settings )
	{
		if (settings._bInitComplete) {
			return;
		}

		var args = [settings, settings.json];

		settings._bInitComplete = true;

		_fnAdjustColumnSizing( settings );

		_fnCallbackFire( settings, null, 'plugin-init', args, true );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', args, true );
	}

	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;

		_fnLengthOverflow( settings );

		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}

	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();

		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;

			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;

			if ( start < 0 )
			{
				start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else if ( action === 'ellipsis' )
		{
			return;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}

		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;

		_fnCallbackFire( settings, null, changed ? 'page' : 'page-nc', [settings] );

		if ( changed && redraw ) {
			_fnDraw( settings );
		}

		return changed;
	}

	function _processingHtml ( settings )
	{
		var table = settings.nTable;
		var scrolling = settings.oScroll.sX !== '' || settings.oScroll.sY !== '';

		if ( settings.oFeatures.bProcessing ) {
			var n = $('<div/>', {
					'id': settings.sTableId + '_processing',
					'class': settings.oClasses.processing.container,
					'role': 'status'
				} )
				.html( settings.oLanguage.sProcessing )
				.append('<div><div></div><div></div><div></div><div></div></div>');

			if (scrolling) {
				n.prependTo( $('div.dt-scroll', settings.nTableWrapper) );
			}
			else {
				n.insertBefore( table );
			}

			$(table).on( 'processing.dt.DT', function (e, s, show) {
				n.css( 'display', show ? 'block' : 'none' );
			} );
		}
	}

	function _fnProcessingDisplay ( settings, show )
	{

		if (settings.bDrawing && show === false) {
			return;
		}

		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}

	function _fnProcessingRun( settings, enable, run ) {
		if (! enable) {

			run();
		}
		else {
			_fnProcessingDisplay(settings, true);

			setTimeout(function () {
				run();

				_fnProcessingDisplay(settings, false);
			}, 0);
		}
	}

	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);

		var scroll = settings.oScroll;

		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}

		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses.scrolling;
		var caption = settings.captionNode;
		var captionSide = caption ? caption._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};

		if ( ! footer.length ) {
			footer = null;
		}

		var scroller = $( _div, { 'class': classes.container } )
			.append(
				$(_div, { 'class': classes.header.self } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.header.inner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.body } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);

		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.footer.self } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.footer.inner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}

		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;

		$(scrollBody).on( 'scroll.DT', function () {
			var scrollLeft = this.scrollLeft;

			scrollHead.scrollLeft = scrollLeft;

			if ( footer ) {
				scrollFoot.scrollLeft = scrollLeft;
			}
		} );

		$('th, td', scrollHead).on('focus', function () {
			var scrollLeft = scrollHead.scrollLeft;

			scrollBody.scrollLeft = scrollLeft;

			if ( footer ) {
				scrollBody.scrollLeft = scrollLeft;
			}
		});

		$(scrollBody).css('max-height', scrollY);
		if (! scroll.bCollapse) {
			$(scrollBody).css('height', scrollY);
		}

		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;

		settings.aoDrawCallback.push(_fnScrollDraw);

		return scroller[0];
	}

	function _fnScrollDraw ( settings )
	{

		var
			scroll         = settings.oScroll,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderInner = divHeader.children('div'),
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			footer         = settings.nTFoot && $('th, td', settings.nTFoot).length ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			headerCopy, footerCopy;

		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;

		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; 
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}

		table.children('thead, tfoot').remove();

		headerCopy = header.clone().prependTo( table );
		headerCopy.find('th, td').removeAttr('tabindex');
		headerCopy.find('[id]').removeAttr('id');

		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerCopy.find('[id]').removeAttr('id');
		}

		if (settings.aiDisplay.length) {

			var firstTr = null;

			for (i=settings._iDisplayStart ; i<settings.aiDisplay.length ; i++) {
				var idx = settings.aiDisplay[i];
				var tr = settings.aoData[idx].nTr;

				if (tr) {
					firstTr = tr;
					break;
				}
			}

			if (firstTr) {
				var colSizes = $(firstTr).children('th, td').map(function (vis) {
					return {
						idx: _fnVisibleToColumnIndex(settings, vis),
						width: $(this).outerWidth()
					}
				});

				for (var i=0 ; i<colSizes.length ; i++) {
					var colEl = settings.aoColumns[ colSizes[i].idx ].colEl[0];
					var colWidth = colEl.style.width.replace('px', '');

					if (colWidth !== colSizes[i].width) {
						colEl.style.width = colSizes[i].width + 'px';
					}
				}
			}
		}

		divHeaderTable
			.find('colgroup')
			.remove();

		divHeaderTable.append(settings.colgroup.clone());

		if ( footer ) {
			divFooterTable
				.find('colgroup')
				.remove();

			divFooterTable.append(settings.colgroup.clone());
		}

		$('th, td', headerCopy).each(function () {
			$(this.childNodes).wrapAll('<div class="dt-scroll-sizing">');
		});

		if ( footer ) {
			$('th, td', footerCopy).each(function () {
				$(this.childNodes).wrapAll('<div class="dt-scroll-sizing">');
			});
		}

		var isScrolling = Math.floor(table.height()) > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var paddingSide = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );

		var outerWidth = table.outerWidth();

		divHeaderTable.css('width', _fnStringToCss( outerWidth ));
		divHeaderInner
			.css('width', _fnStringToCss( outerWidth ))
			.css(paddingSide, isScrolling ? barWidth+"px" : "0px");

		if ( footer ) {
			divFooterTable.css('width', _fnStringToCss( outerWidth ));
			divFooterInner
				.css('width', _fnStringToCss( outerWidth ))
				.css(paddingSide, isScrolling ? barWidth+"px" : "0px");
		}

		table.children('colgroup').prependTo(table);

		divBody.trigger('scroll');

		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}

	function _fnCalculateColumnWidths ( settings )
	{

		if (! settings.oFeatures.bAutoWidth) {
			return;
		}

		var
			table = settings.nTable,
			columns = settings.aoColumns,
			scroll = settings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			visibleColumns = _fnGetColumns( settings, 'bVisible' ),
			tableWidthAttr = table.getAttribute('width'), 
			tableContainer = table.parentNode,
			i, column, columnIdx;

		var styleWidth = table.style.width;

		if ( ! styleWidth && ! tableWidthAttr) {
			table.style.width = '100%';
			styleWidth = '100%';
		}

		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}

		_fnCallbackFire(
			settings,
			null,
			'column-calc',
			{visible: visibleColumns},
			false
		);

		var tmpTable = $(table.cloneNode())
			.css( 'visibility', 'hidden' )
			.removeAttr( 'id' );

		tmpTable.append('<tbody>')
		var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );

		tmpTable
			.append( $(settings.nTHead).clone() )
			.append( $(settings.nTFoot).clone() );

		tmpTable.find('tfoot th, tfoot td').css('width', '');

		tmpTable.find('thead th, thead td').each( function () {

			var width = _fnColumnsSumWidth( settings, this, true, false );

			if ( width ) {
				this.style.width = width;

				if ( scrollX ) {
					$( this ).append( $('<div/>').css( {
						width: width,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
			else {
				this.style.width = '';
			}
		} );

		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			columnIdx = visibleColumns[i];
			column = columns[ columnIdx ];

			var longest = _fnGetMaxLenString(settings, columnIdx);
			var autoClass = _ext.type.className[column.sType];
			var text = longest + column.sContentPadding;
			var insert = longest.indexOf('<') === -1
				? document.createTextNode(text)
				: text

			$('<td/>')
				.addClass(autoClass)
				.addClass(column.sClass)
				.append(insert)
				.appendTo(tr);
		}

		$('[name]', tmpTable).removeAttr('name');

		var holder = $('<div/>').css( scrollX || scrollY ?
				{
					position: 'absolute',
					top: 0,
					left: 0,
					height: 1,
					right: 0,
					overflow: 'hidden'
				} :
				{}
			)
			.append( tmpTable )
			.appendTo( tableContainer );

		if ( scrollX && scrollXInner ) {
			tmpTable.width( scrollXInner );
		}
		else if ( scrollX ) {
			tmpTable.css( 'width', 'auto' );
			tmpTable.removeAttr('width');

			if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
				tmpTable.width( tableContainer.clientWidth );
			}
		}
		else if ( scrollY ) {
			tmpTable.width( tableContainer.clientWidth );
		}
		else if ( tableWidthAttr ) {
			tmpTable.width( tableWidthAttr );
		}

		var total = 0;
		var bodyCells = tmpTable.find('tbody tr').eq(0).children();

		for ( i=0 ; i<visibleColumns.length ; i++ ) {

			var bounding = bodyCells[i].getBoundingClientRect().width;

			total += bounding;

			columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding );
		}

		table.style.width = _fnStringToCss( total );

		holder.remove();

		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}

		if ( (tableWidthAttr || scrollX) && ! settings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+settings.sInstance, DataTable.util.throttle( function () {
					if (! settings.bDestroying) {
						_fnAdjustColumnSizing( settings );
					}
				} ) );
			};

			bindResize();

			settings._reszEvt = true;
		}
	}

	function _fnGetMaxLenString( settings, colIdx )
	{
		var column = settings.aoColumns[colIdx];

		if (! column.maxLenString) {
			var s, max='', maxLen = -1;

			for ( var i=0, ien=settings.aiDisplayMaster.length ; i<ien ; i++ ) {
				var rowIdx = settings.aiDisplayMaster[i];
				var data = _fnGetRowDisplay(settings, rowIdx)[colIdx];

				var cellString = data && typeof data === 'object' && data.nodeType
					? data.innerHTML
					: data+'';

				cellString = cellString
					.replace(/id=".*?"/g, '')
					.replace(/name=".*?"/g, '');

				s = _stripHtml(cellString)
					.replace( /&nbsp;/g, ' ' );

				if ( s.length > maxLen ) {

					max = cellString;
					maxLen = s.length;
				}
			}

			column.maxLenString = max;
		}

		return column.maxLenString;
	}

	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}

		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}

		return s.match(/\d$/) ?
			s+'px' :
			s;
	}

	function _colGroup( settings ) {
		var cols = settings.aoColumns;

		settings.colgroup.empty();

		for (i=0 ; i<cols.length ; i++) {
			if (cols[i].bVisible) {
				settings.colgroup.append(cols[i].colEl);
			}
		}
	}

	function _fnSortInit( settings ) {
		var target = settings.nTHead;
		var headerRows = target.querySelectorAll('tr');
		var legacyTop = settings.bSortCellsTop;
		var notSelector = ':not([data-dt-order="disable"]):not([data-dt-order="icon-only"])';

		if (legacyTop === true) {
			target = headerRows[0];
		}
		else if (legacyTop === false) {
			target = headerRows[ headerRows.length - 1 ];
		}

		_fnSortAttachListener(
			settings,
			target,
			target === settings.nTHead
				? 'tr'+notSelector+' th'+notSelector+', tr'+notSelector+' td'+notSelector
				: 'th'+notSelector+', td'+notSelector
		);

		var order = [];
		_fnSortResolve( settings, order, settings.aaSorting );

		settings.aaSorting = order;
	}

	function _fnSortAttachListener(settings, node, selector, column, callback) {
		_fnBindAction( node, selector, function (e) {
			var run = false;
			var columns = column === undefined
				? _fnColumnsFromHeader( e.target )
				: [column];

			if ( columns.length ) {
				for ( var i=0, ien=columns.length ; i<ien ; i++ ) {
					var ret = _fnSortAdd( settings, columns[i], i, e.shiftKey );

					if (ret !== false) {
						run = true;
					}					

					if (settings.aaSorting.length === 1 && settings.aaSorting[0][1] === '') {
						break;
					}
				}

				if (run) {
					_fnProcessingRun(settings, true, function () {
						_fnSort( settings );
						_fnSortDisplay( settings, settings.aiDisplay );

						_fnReDraw( settings, false, false );

						if (callback) {
							callback();
						}
					});
				}
			}
		} );
	}

	function _fnSortDisplay(settings, display) {
		if (display.length < 2) {
			return;
		}

		var master = settings.aiDisplayMaster;
		var masterMap = {};
		var map = {};
		var i;

		for (i=0 ; i<master.length ; i++) {
			masterMap[master[i]] = i;
		}

		for (i=0 ; i<display.length ; i++) {
			map[display[i]] = masterMap[display[i]];
		}

		display.sort(function(a, b){

			return map[a] - map[b];
		});
	}

	function _fnSortResolve (settings, nestedSort, sort) {
		var push = function ( a ) {
			if ($.isPlainObject(a)) {
				if (a.idx !== undefined) {

					nestedSort.push([a.idx, a.dir]);
				}
				else if (a.name) {

					var cols = _pluck( settings.aoColumns, 'sName');
					var idx = cols.indexOf(a.name);

					if (idx !== -1) {
						nestedSort.push([idx, a.dir]);
					}
				}
			}
			else {

				nestedSort.push(a);
			}
		};

		if ( $.isPlainObject(sort) ) {

			push(sort);
		}
		else if ( sort.length && typeof sort[0] === 'number' ) {

			push(sort);
		}
		else if ( sort.length ) {

			for (var z=0; z<sort.length; z++) {
				push(sort[z]); 
			}
		}
	}

	function _fnSortFlatten ( settings )
	{
		var
			i, k, kLen,
			aSort = [],
			extSort = DataTable.ext.type.order,
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [];

		if ( ! settings.oFeatures.bSort ) {
			return aSort;
		}

		if ( Array.isArray( fixed ) ) {
			_fnSortResolve( settings, nestedSort, fixed );
		}

		if ( fixedObj && fixed.pre ) {
			_fnSortResolve( settings, nestedSort, fixed.pre );
		}

		_fnSortResolve( settings, nestedSort, settings.aaSorting );

		if (fixedObj && fixed.post ) {
			_fnSortResolve( settings, nestedSort, fixed.post );
		}

		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];

			if ( aoColumns[ srcCol ] ) {
				aDataSort = aoColumns[ srcCol ].aDataSort;

				for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
				{
					iCol = aDataSort[k];
					sType = aoColumns[ iCol ].sType || 'string';

					if ( nestedSort[i]._idx === undefined ) {
						nestedSort[i]._idx = aoColumns[iCol].asSorting.indexOf(nestedSort[i][1]);
					}

					if ( nestedSort[i][1] ) {
						aSort.push( {
							src:       srcCol,
							col:       iCol,
							dir:       nestedSort[i][1],
							index:     nestedSort[i]._idx,
							type:      sType,
							formatter: extSort[ sType+"-pre" ],
							sorter:    extSort[ sType+"-"+nestedSort[i][1] ]
						} );
					}
				}
			}
		}

		return aSort;
	}

	function _fnSort ( oSettings, col, dir )
	{
		var
			i, ien, iLen,
			aiOrig = [],
			extSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;

		if (col !== undefined) {
			var srcCol = oSettings.aoColumns[col];
			aSort = [{
				src:       col,
				col:       col,
				dir:       dir,
				index:     0,
				type:      srcCol.sType,
				formatter: extSort[ srcCol.sType+"-pre" ],
				sorter:    extSort[ srcCol.sType+"-"+dir ]
			}];
			displayMaster = displayMaster.slice();
		}
		else {
			aSort = _fnSortFlatten( oSettings );
		}

		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];

			_fnSortData( oSettings, sortCol.col );
		}

		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{

			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ i ] = i;
			}

			if (aSort.length && aSort[0].dir === 'desc' && oSettings.orderDescReverse) {
				aiOrig.reverse();
			}

			displayMaster.sort( function ( a, b ) {
				var
					x, y, k, test, sort,
					len=aSort.length,
					dataA = aoData[a]._aSortData,
					dataB = aoData[b]._aSortData;

				for ( k=0 ; k<len ; k++ ) {
					sort = aSort[k];

					x = dataA[ sort.col ];
					y = dataB[ sort.col ];

					if (sort.sorter) {

						test = sort.sorter(x, y);

						if ( test !== 0 ) {
							return test;
						}
					}
					else {

						test = x<y ? -1 : x>y ? 1 : 0;

						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
				}

				x = aiOrig[a];
				y = aiOrig[b];

				return x<y ? -1 : x>y ? 1 : 0;
			} );
		}
		else if ( aSort.length === 0 ) {

			displayMaster.sort(function (x, y) {
				return x<y ? -1 : x>y ? 1 : 0;
			});
		}

		if (col === undefined) {

			oSettings.bSorted = true;
			oSettings.sortDetails = aSort;

			_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort] );
		}

		return displayMaster;
	}

	function _fnSortAdd ( settings, colIdx, addIndex, shift )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = asSorting.indexOf(a[1]);
			}

			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};

		if ( ! col.bSortable ) {
			return false;
		}

		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}

		if ( (shift || addIndex) && settings.oFeatures.bSortMulti ) {

			var sortIdx = _pluck(sorting, '0').indexOf(colIdx);

			if ( sortIdx !== -1 ) {

				nextSortIdx = next( sorting[sortIdx], true );

				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; 
				}

				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else if (shift) {

				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
			else {

				sorting.push( [ colIdx, sorting[0][1], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {

			nextSortIdx = next( sorting[0] );

			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {

			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	}

	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.order.position;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;

		if ( features.bSort && features.bSortClasses ) {

			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;

				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}

			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;

				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}

		settings.aLastSort = sort;
	}

	function _fnSortData( settings, colIdx )
	{

		var column = settings.aoColumns[ colIdx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;

		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, colIdx,
				_fnColumnIndexToVisible( settings, colIdx )
			);
		}

		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
		var data = settings.aoData;

		for ( var rowIdx=0 ; rowIdx<data.length ; rowIdx++ ) {

			if (! data[rowIdx]) {
				continue;
			}

			row = data[rowIdx];

			if ( ! row._aSortData ) {
				row._aSortData = [];
			}

			if ( ! row._aSortData[colIdx] || customSort ) {
				cellData = customSort ?
					customData[rowIdx] : 
					_fnGetCellData( settings, rowIdx, colIdx, 'sort' );

				row._aSortData[ colIdx ] = formatter ?
					formatter( cellData, settings ) :
					cellData;
			}
		}
	}

	function _fnSaveState ( settings )
	{
		if (settings._bLoadingState) {
			return;
		}

		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  $.extend({}, settings.oPreviousSearch),
			columns: settings.aoColumns.map( function ( col, i ) {
				return {
					visible: col.bVisible,
					search: $.extend({}, settings.aoPreSearchCols[i])
				};
			} )
		};

		settings.oSavedState = state;
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );

		if ( settings.oFeatures.bStateSave && !settings.bDestroying )
		{
			settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
		}	
	}

	function _fnLoadState ( settings, init, callback )
	{
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}

		var loaded = function(state) {
			_fnImplementState(settings, state, callback);
		}

		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );

		if ( state !== undefined ) {
			_fnImplementState( settings, state, callback );
		}

		return true;
	}

	function _fnImplementState ( settings, s, callback) {
		var i, ien;
		var columns = settings.aoColumns;
		settings._bLoadingState = true;

		var api = settings._bInitComplete ? new DataTable.Api(settings) : null;

		if ( ! s || ! s.time ) {
			settings._bLoadingState = false;
			callback();
			return;
		}

		var duration = settings.iStateDuration;
		if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
			settings._bLoadingState = false;
			callback();
			return;
		}

		var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
		if ( abStateLoad.indexOf(false) !== -1 ) {
			settings._bLoadingState = false;
			callback();
			return;
		}

		if ( s.columns && columns.length !== s.columns.length ) {
			settings._bLoadingState = false;
			callback();
			return;
		}

		settings.oLoadedState = $.extend( true, {}, s );

		_fnCallbackFire( settings, null, 'stateLoadInit', [settings, s], true );

		if ( s.length !== undefined ) {

			if (api) {
				api.page.len(s.length)
			}
			else {
				settings._iDisplayLength   = s.length;
			}
		}

		if ( s.start !== undefined ) {
			if(api === null) {
				settings._iDisplayStart    = s.start;
				settings.iInitDisplayStart = s.start;
			}
			else {
				_fnPageChange(settings, s.start/settings._iDisplayLength);
			}
		}

		if ( s.order !== undefined ) {
			settings.aaSorting = [];
			$.each( s.order, function ( i, col ) {
				settings.aaSorting.push( col[0] >= columns.length ?
					[ 0, col[1] ] :
					col
				);
			} );
		}

		if ( s.search !== undefined ) {
			$.extend( settings.oPreviousSearch, s.search );
		}

		if ( s.columns ) {
			for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
				var col = s.columns[i];

				if ( col.visible !== undefined ) {

					if (api) {

						api.column(i).visible(col.visible, false);
					}
					else {
						columns[i].bVisible = col.visible;
					}
				}

				if ( col.search !== undefined ) {
					$.extend( settings.aoPreSearchCols[i], col.search );
				}
			}

			if (api) {
				api.columns.adjust();
			}
		}

		settings._bLoadingState = false;
		_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
		callback();
	}

	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;

		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'https://datatables.net/tn/'+tn;
		}

		if ( ! level  ) {

			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;

			if ( settings ) {
				_fnCallbackFire( settings, null, 'dt-error', [ settings, tn, msg ], true );
			}

			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}

	function _fnMap( ret, src, name, mappedName )
	{
		if ( Array.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( Array.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );

			return;
		}

		if ( mappedName === undefined ) {
			mappedName = name;
		}

		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}

	function _fnExtend( out, extender, breakRefs )
	{
		var val;

		for ( var prop in extender ) {
			if ( Object.prototype.hasOwnProperty.call(extender, prop) ) {
				val = extender[prop];

				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && Array.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}

		return out;
	}

	function _fnBindAction( n, selector, fn )
	{
		$(n)
			.on( 'click.DT', selector, function (e) {
				fn(e);
			} )
			.on( 'keypress.DT', selector, function (e){
				if ( e.which === 13 ) {
					e.preventDefault();
					fn(e);
				}
			} )
			.on( 'selectstart.DT', selector, function () {

				return false;
			} );
	}

	function _fnCallbackReg( settings, store, fn )
	{
		if ( fn ) {
			settings[store].push(fn);
		}
	}

	function _fnCallbackFire( settings, callbackArr, eventName, args, bubbles )
	{
		var ret = [];

		if ( callbackArr ) {
			ret = settings[callbackArr].slice().reverse().map( function (val) {
				return val.apply( settings.oInstance, args );
			} );
		}

		if ( eventName !== null) {
			var e = $.Event( eventName+'.dt' );
			var table = $(settings.nTable);

			e.dt = settings.api;

			table[bubbles ?  'trigger' : 'triggerHandler']( e, args );

			if (bubbles && table.parents('body').length === 0) {
				$('body').trigger( e, args );
			}

			ret.push( e.result );
		}

		return ret;
	}

	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;

		if ( start >= end )
		{
			start = end - len;
		}

		start -= (start % len);

		if ( len === -1 || start < 0 )
		{
			start = 0;
		}

		settings._iDisplayStart = start;
	}

	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];

		if ( $.isPlainObject( renderer ) && renderer[type] ) {

			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {

			return host[renderer] || host._;
		}

		return host._;
	}

	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax ) {
			return 'ajax';
		}
		return 'dom';
	}

	function _fnMacros ( settings, str, entries )
	{

		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			max        = settings.fnRecordsTotal(),
			all        = len === -1;

		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, max ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) ).
			replace(/_ENTRIES_/g, settings.api.i18n('entries', '', entries) ).
			replace(/_ENTRIES-MAX_/g, settings.api.i18n('entries', '', max) ).
			replace(/_ENTRIES-TOTAL_/g, settings.api.i18n('entries', '', vis) );
	}

	var __apiStruct = [];

	var __arrayProto = Array.prototype;

	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = _pluck(settings, 'nTable');

		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oFeatures ) {

			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {

			idx = tables.indexOf(mixed);
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {

			jq = $(mixed).get();
		}
		else if ( mixed instanceof $ ) {

			jq = mixed.get();
		}

		if ( jq ) {
			return settings.filter(function (v, idx) {
				return jq.includes(tables[idx]);
			});
		}
	};

	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}

		var i;
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings.push.apply( settings, a );
			}
		};

		if ( Array.isArray( context ) ) {
			for ( i=0 ; i<context.length ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}

		this.context = settings.length > 1
			? _unique( settings )
			: settings;

		if ( data ) {

			if (data.length < 10000) {
				this.push.apply(this, data);
			}
			else {
				for (i=0 ; i<data.length ; i++) {
					this.push(data[i]);
				}
			}
		}

		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};

		_Api.extend( this, this, __apiStruct );
	};

	DataTable.Api = _Api;

	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},

		context: [], 

		count: function ()
		{
			return this.flatten().length;
		},

		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}

			return this;
		},

		eq: function ( idx )
		{
			var ctx = this.context;

			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},

		filter: function ( fn )
		{
			var a = __arrayProto.filter.call( this, fn, this );

			return new _Api( this.context, a );
		},

		flatten: function ()
		{
			var a = [];

			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},

		get: function ( idx )
		{
			return this[ idx ];
		},

		join:    __arrayProto.join,

		includes: function ( find ) {
			return this.indexOf( find ) === -1 ? false : true;
		},

		indexOf: __arrayProto.indexOf,

		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;

			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}

			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );

				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );

					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {

					ret = fn.call( apiInst, context[i], this[i], i );

					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'every' || type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {

					items = this[i];

					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}

					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];

						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}

						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}

			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},

		lastIndexOf: __arrayProto.lastIndexOf,

		length:  0,

		map: function ( fn )
		{
			var a = __arrayProto.map.call( this, fn, this );

			return new _Api( this.context, a );
		},

		pluck: function ( prop )
		{
			var fn = DataTable.util.get(prop);

			return this.map( function ( el ) {
				return fn(el);
			} );
		},

		pop:     __arrayProto.pop,

		push:    __arrayProto.push,

		reduce: __arrayProto.reduce,

		reduceRight: __arrayProto.reduceRight,

		reverse: __arrayProto.reverse,

		selector: null,

		shift:   __arrayProto.shift,

		slice: function () {
			return new _Api( this.context, this );
		},

		sort:    __arrayProto.sort,

		splice:  __arrayProto.splice,

		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},

		to$: function ()
		{
			return $( this );
		},

		toJQuery: function ()
		{
			return $( this );
		},

		unique: function ()
		{
			return new _Api( this.context, _unique(this.toArray()) );
		},

		unshift: __arrayProto.unshift
	} );

	function _api_scope( scope, fn, struc ) {
		return function () {
			var ret = fn.apply( scope || this, arguments );

			_Api.extend( ret, ret, struc.methodExt );
			return ret;
		};
	}

	function _api_find( src, name ) {
		for ( var i=0, ien=src.length ; i<ien ; i++ ) {
			if ( src[i].name === name ) {
				return src[i];
			}
		}
		return null;
	}

	window.__apiStruct = __apiStruct;

	_Api.extend = function ( scope, obj, ext )
	{

		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}

		var
			i, ien,
			struct;

		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];

			if (struct.name === '__proto__') {
				continue;
			}

			obj[ struct.name ] = struct.type === 'function' ?
				_api_scope( scope, struct.val, struct ) :
				struct.type === 'object' ?
					{} :
					struct.val;

			obj[ struct.name ].__dt_wrapper = true;

			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};

	_Api.register = _api_register = function ( name, val )
	{
		if ( Array.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}

		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;

		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];

			var src = _api_find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   [],
					type:      'object'
				};
				struct.push( src );
			}

			if ( i === ien-1 ) {
				src.val = val;
				src.type = typeof val === 'function' ?
					'function' :
					$.isPlainObject( val ) ?
						'object' :
						'other';
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};

	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );

		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );

			if ( ret === this ) {

				return this;
			}
			else if ( ret instanceof _Api ) {

				return ret.length ?
					Array.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : 
						ret[0] :
					undefined;
			}

			return ret;
		} );
	};

	var __table_selector = function ( selector, a )
	{
		if ( Array.isArray(selector) ) {
			var result = [];

			selector.forEach(function (sel) {
				var inner = __table_selector(sel, a);

				result.push.apply(result, inner);
			});

			return result.filter( function (item) {
				return item;
			});
		}

		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}

		var nodes = a.map( function (el) {
			return el.nTable;
		} );

		return $(nodes)
			.filter( selector )
			.map( function () {

				var idx = nodes.indexOf(this);
				return a[ idx ];
			} )
			.toArray();
	};

	_api_register( 'tables()', function ( selector ) {

		return selector !== undefined && selector !== null ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );

	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;

		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );

	[
		['nodes', 'node', 'nTable'],
		['body', 'body', 'nTBody'],
		['header', 'header', 'nTHead'],
		['footer', 'footer', 'nTFoot'],
	].forEach(function (item) {
		_api_registerPlural(
			'tables().' + item[0] + '()',
			'table().' + item[1] + '()' ,
			function () {
				return this.iterator( 'table', function ( ctx ) {
					return ctx[item[2]];
				}, 1 );
			}
		);
	});

	[
		['header', 'aoHeader'],
		['footer', 'aoFooter'],
	].forEach(function (item) {
		_api_register( 'table().' + item[0] + '.structure()' , function (selector) {
			var indexes = this.columns(selector).indexes().flatten();
			var ctx = this.context[0];

			return _fnHeaderLayout(ctx, ctx[item[1]], indexes);
		} );
	})

	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );

	_api_register( 'tables().every()', function ( fn ) {
		var that = this;

		return this.iterator('table', function (s, i) {
			fn.call(that.table(i), i);
		});
	});

	_api_register( 'caption()', function ( value, side ) {
		var context = this.context;

		if ( value === undefined ) {
			var caption = context[0].captionNode;

			return caption && context.length ?
				caption.innerHTML : 
				null;
		}

		return this.iterator( 'table', function ( ctx ) {
			var table = $(ctx.nTable);
			var caption = $(ctx.captionNode);
			var container = $(ctx.nTableWrapper);

			if ( ! caption.length ) {
				caption = $('<caption/>').html( value );
				ctx.captionNode = caption[0];

				if (! side) {
					table.prepend(caption);

					side = caption.css('caption-side');
				}
			}

			caption.html( value );

			if ( side ) {
				caption.css( 'caption-side', side );
				caption[0]._captionSide = side;
			}

			if (container.find('div.dataTables_scroll').length) {
				var selector = (side === 'top' ? 'Head' : 'Foot');

				container.find('div.dataTables_scroll'+ selector +' table').prepend(caption);
			}
			else {
				table.prepend(caption);
			}
		}, 1 );
	} );

	_api_register( 'caption.node()', function () {
		var ctx = this.context;

		return ctx.length ? ctx[0].captionNode : null;
	} );

	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}

				_fnReDraw( settings, paging===false );
			}
		} );
	} );

	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; 
		}

		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );

	_api_register( 'page.info()', function () {
		if ( this.context.length === 0 ) {
			return undefined;
		}

		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;

		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );

	_api_register( 'page.len()', function ( len ) {

		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}

		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );

	var __reload = function ( settings, holdPosition, callback ) {

		if ( callback ) {
			var api = new _Api( settings );

			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}

		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );

			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}

			_fnBuildAjax( settings, {}, function( json ) {
				_fnClearTable( settings );

				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}

				_fnReDraw( settings, holdPosition );
				_fnInitComplete( settings );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};

	_api_register( 'ajax.json()', function () {
		var ctx = this.context;

		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}

	} );

	_api_register( 'ajax.params()', function () {
		var ctx = this.context;

		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}

	} );

	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );

	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;

		if ( url === undefined ) {

			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];

			return $.isPlainObject( ctx.ajax ) ?
				ctx.ajax.url :
				ctx.ajax;
		}

		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
		} );
	} );

	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {

		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );

	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;

		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}

		for ( i=0, ien=selector.length ; i<ien ; i++ ) {

			a = selector[i] && selector[i].split && ! selector[i].match(/[[(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];

			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? (a[j]).trim() : a[j] );

				res = res.filter( function (item) {
					return item !== null && item !== undefined;
				});

				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}

		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}

		return _unique( out );
	};

	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}

		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}

		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};

	var _selector_first = function ( old )
	{
		var inst = new _Api(old.context[0]);

		if (old.length) {
			inst.push( old[0] );
		}

		inst.selector = old.selector;

		if (inst.length && inst[0].length > 1) {
			inst[0].splice(1);
		}

		return inst;
	};

	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;

		var
			search = opts.search,  
			order  = opts.order,   
			page   = opts.page;    

		if ( _fnDataSource( settings ) == 'ssp' ) {

			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}

		if ( page == 'current' ) {

			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			if ( search == 'none') {
				a = displayMaster.slice();
			}
			else if ( search == 'applied' ) {
				a = displayFiltered.slice();
			}
			else if ( search == 'removed' ) {

				var displayFilteredMap = {};

				for ( i=0, ien=displayFiltered.length ; i<ien ; i++ ) {
					displayFilteredMap[displayFiltered[i]] = null;
				}

				displayMaster.forEach(function (item) {
					if (! Object.prototype.hasOwnProperty.call(displayFilteredMap, item)) {
						a.push(item);
					}
				});
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if (! settings.aoData[i]) {
					continue;
				}

				if ( search == 'none' ) {
					a.push( i );
				}
				else { 
					tmp = displayFiltered.indexOf(i);

					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
		else if ( typeof order === 'number' ) {

			var ordered = _fnSort(settings, order, 'asc');

			if (search === 'none') {
				a = ordered;
			}
			else { 
				for (i=0; i<ordered.length; i++) {
					tmp = displayFiltered.indexOf(ordered[i]);

					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( ordered[i] );
					}
				}
			}
		}

		return a;
	};

	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var aoData = settings.aoData;

			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}

			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}

			if ( selInt !== null && rows.indexOf(selInt) !== -1 ) {

				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {

				return rows;
			}

			if ( typeof sel === 'function' ) {
				return rows.map( function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}

			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  
				var cellIdx = sel._DT_CellIndex;

				if ( rowIdx !== undefined ) {

					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel.parentNode ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}

			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {

				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}

			}

			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);

			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};

		var matched = _selector_run( 'row', selector, run, settings, opts );

		if (opts.order === 'current' || opts.order === 'applied') {
			_fnSortDisplay(settings, matched);
		}

		return matched;
	};

	_api_register( 'rows()', function ( selector, opts ) {

		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}

		opts = _selector_opts( opts );

		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );

		inst.selector.rows = selector;
		inst.selector.opts = opts;

		return inst;
	} );

	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );

	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );

	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );

	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );

	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );

	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;

		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}

		return new _Api( context, a );
	} );

	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		this.iterator( 'row', function ( settings, row ) {
			var data = settings.aoData;
			var rowData = data[ row ];

			var idx = settings.aiDisplayMaster.indexOf(row);
			if (idx !== -1) {
				settings.aiDisplayMaster.splice(idx, 1);
			}

			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}

			_fnLengthOverflow( settings );

			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}

			data[row] = null;
		} );

		return this;
	} );

	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];

				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];

					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}

				return out;
			}, 1 );

		var modRows = this.rows( -1 );
		modRows.pop();
		modRows.push.apply(modRows, newRows);

		return modRows;
	} );

	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );

	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;

		if ( data === undefined ) {

			return ctx.length && this.length && this[0].length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}

		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;

		if ( Array.isArray( data ) && row.nTr && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}

		_fnInvalidate( ctx[0], this[0], 'data' );

		return this;
	} );

	_api_register( 'row().node()', function () {
		var ctx = this.context;

		if (ctx.length && this.length && this[0].length) {
			var row = ctx[0].aoData[ this[0] ];

			if (row && row.nTr) {
				return row.nTr;
			}
		}

		return null;
	} );

	_api_register( 'row.add()', function ( row ) {

		if ( row instanceof $ && row.length ) {
			row = row[0];
		}

		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );

		return this.row( rows[0] );
	} );

	$(document).on('plugin-init.dt', function (e, context) {
		var api = new _Api( context );

		api.on( 'stateSaveParams.DT', function ( e, settings, d ) {

			var idFn = settings.rowIdFn;
			var rows = settings.aiDisplayMaster;
			var ids = [];

			for (var i=0 ; i<rows.length ; i++) {
				var rowIdx = rows[i];
				var data = settings.aoData[rowIdx];

				if (data._detailsShow) {
					ids.push( '#' + idFn(data._aData) );
				}
			}

			d.childRows = ids;
		});

		api.on( 'stateLoaded.DT', function (e, settings, state) {
			__details_state_load( api, state );
		});

		__details_state_load( api, api.state.loaded() );
	});

	var __details_state_load = function (api, state)
	{
		if ( state && state.childRows ) {
			api
				.rows( state.childRows.map(function (id) {

					return id.replace(/([^:\\]*(?:\\.[^:\\]*)*):/g, "$1\\:");
				}) )
				.every( function () {
					_fnCallbackFire( api.settings()[0], null, 'requestChild', [ this ] )
				});
		}
	}

	var __details_add = function ( ctx, row, data, klass )
	{

		var rows = [];
		var addRow = function ( r, k ) {

			if ( Array.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}

			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				r.setAttribute( 'data-dt-row', row.idx );
				rows.push( r );
			}
			else {

				var created = $('<tr><td></td></tr>')
					.attr( 'data-dt-row', row.idx )
					.addClass( k );

				$('td', created)
					.addClass( k )
					.html( r )[0].colSpan = _fnVisbleColumns( ctx );

				rows.push( created[0] );
			}
		};

		addRow( data, klass );

		if ( row._details ) {
			row._details.detach();
		}

		row._details = $(rows);

		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};

	var __details_state = DataTable.util.throttle(
		function (ctx) {
			_fnSaveState( ctx[0] )
		},
		500
	);

	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;

		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];

			if ( row && row._details ) {
				row._details.remove();

				row._detailsShow = undefined;
				row._details = undefined;
				$( row.nTr ).removeClass( 'dt-hasChild' );
				__details_state( ctx );
			}
		}
	};

	var __details_display = function ( api, show ) {
		var ctx = api.context;

		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];

			if ( row._details ) {
				row._detailsShow = show;

				if ( show ) {
					row._details.insertAfter( row.nTr );
					$( row.nTr ).addClass( 'dt-hasChild' );
				}
				else {
					row._details.detach();
					$( row.nTr ).removeClass( 'dt-hasChild' );
				}

				_fnCallbackFire( ctx[0], null, 'childRow', [ show, api.row( api[0] ) ] )

				__details_events( ctx[0] );
				__details_state( ctx );
			}
		}
	};

	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-sizing'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;

		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );

		if ( _pluck( data, '_details' ).length > 0 ) {

			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}

				api.rows( {page:'current'} ).eq(0).each( function (idx) {

					var row = data[ idx ];

					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );

			api.on( colvisEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}

				var row, visible = _fnVisbleColumns( ctx );

				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];

					if ( row && row._details ) {
						row._details.each(function () {
							var el = $(this).children('td');

							if (el.length == 1) {
								el.attr('colspan', visible);
							}
						});
					}
				}
			} );

			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}

				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i] && data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};

	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';

	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;

		if ( data === undefined ) {

			return ctx.length && this.length && ctx[0].aoData[ this[0] ]
				? ctx[0].aoData[ this[0] ]._details
				: undefined;
		}
		else if ( data === true ) {

			this.child.show();
		}
		else if ( data === false ) {

			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {

			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}

		return this;
	} );

	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' 
	], function () {         
		__details_display( this, true );
		return this;
	} );

	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' 
	], function () {         
		__details_display( this, false );
		return this;
	} );

	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' 
	], function () {           
		__details_remove( this );
		return this;
	} );

	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;

		if ( ctx.length && this.length && ctx[0].aoData[ this[0] ] ) {

			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );

	var __re_column_selector = /^([^:]+)?:(name|title|visIdx|visible)$/;

	var __columnData = function ( settings, column, r1, r2, rows, type ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column, type ) );
		}
		return a;
	};

	var __column_header = function ( settings, column, row ) {
		var header = settings.aoHeader;
		var target = row !== undefined
			? row
			: settings.bSortCellsTop 
				? 0
				: header.length - 1;

		return header[target][column].cell;
	};

	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			titles = _pluck( columns, 'sTitle' ),
			cells = DataTable.util.get('[].[].cell')(settings.aoHeader),
			nodes = _unique( _flatten([], cells) );

		var run = function ( s ) {
			var selInt = _intVal( s );

			if ( s === '' ) {
				return _range( columns.length );
			}

			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : 
					columns.length + selInt 
				];
			}

			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );

				return columns.map(function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							__column_header( settings, idx )
						) ? idx : null;
				});
			}

			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';

			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':

						if (match[1] && match[1].match(/^\d+$/)) {
							var idx = parseInt( match[1], 10 );

							if ( idx < 0 ) {

								var visColumns = columns.map( function (col,i) {
									return col.bVisible ? i : null;
								} );
								return [ visColumns[ visColumns.length + idx ] ];
							}

							return [ _fnVisibleToColumnIndex( settings, idx ) ];
						}

						return columns.map( function (col, idx) {

							if (! col.bVisible) {
								return null;
							}

							if (match[1]) {
								return $(nodes[idx]).filter(match[1]).length > 0 ? idx : null;
							}

							return idx;
						} );

					case 'name':

						return names.map( function (name, i) {
							return name === match[1] ? i : null;
						} );

					case 'title':

						return titles.map( function (title, i) {
							return title === match[1] ? i : null;
						} );

					default:
						return [];
				}
			}

			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}

			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return _fnColumnsFromHeader( this ); 
				} )
				.toArray();

			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}

			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};

		return _selector_run( 'column', selector, run, settings, opts );
	};

	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			cells, i, ien, tr;

		if ( vis === undefined ) {
			return col.bVisible;
		}

		if ( col.bVisible === vis ) {
			return false;
		}

		if ( vis ) {

			var insertBefore = _pluck(cols, 'bVisible').indexOf(true, column+1);

			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				if (data[i]) {
					tr = data[i].nTr;
					cells = data[i].anCells;

					if ( tr ) {

						tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
					}
				}
			}
		}
		else {

			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}

		col.bVisible = vis;

		_colGroup(settings);

		return true;
	};

	_api_register( 'columns()', function ( selector, opts ) {

		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}

		opts = _selector_opts( opts );

		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );

		inst.selector.cols = selector;
		inst.selector.opts = opts;

		return inst;
	} );

	_api_registerPlural( 'columns().header()', 'column().header()', function ( row ) {
		return this.iterator( 'column', function (settings, column) {
			return __column_header(settings, column, row);
		}, 1 );
	} );

	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( row ) {
		return this.iterator( 'column', function ( settings, column ) {
			var footer = settings.aoFooter;

			if (! footer.length) {
				return null;
			}

			return settings.aoFooter[row !== undefined ? row : 0][column].cell;
		}, 1 );
	} );

	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );

	_api_registerPlural( 'columns().render()', 'column().render()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return __columnData( settings, column, i, j, rows, type );
		}, 1 );
	} );

	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );

	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );

	_api_registerPlural( 'columns().init()', 'column().init()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column];
		}, 1 );
	} );

	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );

	_api_registerPlural( 'columns().titles()', 'column().title()', function (title, row) {
		return this.iterator( 'column', function ( settings, column ) {

			if (typeof title === 'number') {
				row = title;
				title = undefined;
			}

			var span = $('span.dt-column-title', this.column(column).header(row));

			if (title !== undefined) {
				span.html(title);
				return this;
			}

			return span.html();
		}, 1 );
	} );

	_api_registerPlural( 'columns().types()', 'column().type()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			var type = settings.aoColumns[column].sType;

			if (! type) {
				_fnColumnTypes(settings);
			}

			return type;
		}, 1 );
	} );

	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var that = this;
		var changed = [];
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} 

			if (__setColumnVis( settings, column, vis )) {
				changed.push(column);
			}
		} );

		if ( vis !== undefined ) {
			this.iterator( 'table', function ( settings ) {

				_fnDrawHead( settings, settings.aoHeader );
				_fnDrawHead( settings, settings.aoFooter );

				if ( ! settings.aiDisplay.length ) {
					$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
				}

				_fnSaveState( settings );

				that.iterator( 'column', function ( settings, column ) {
					if (changed.includes(column)) {
						_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
					}
				} );

				if ( changed.length && (calc === undefined || calc) ) {
					that.columns.adjust();
				}
			});
		}

		return ret;
	} );

	_api_registerPlural( 'columns().widths()', 'column().width()', function () {

		var columns = this.columns(':visible').count();
		var row = $('<tr>').html('<td>' + Array(columns).join('</td><td>') + '</td>');

		$(this.table().body()).append(row);

		var widths = row.children().map(function () {
			return $(this).outerWidth();
		});

		row.remove();

		return this.iterator( 'column', function ( settings, column ) {
			var visIdx = _fnColumnIndexToVisible( settings, column );

			return visIdx !== null ? widths[visIdx] : 0;
		}, 1);
	} );

	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );

	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );

	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];

			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );

	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );

	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $(_flatten( [], cells ));
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;

		var run = function ( s ) {
			var fnSelector = typeof s === 'function';

			if ( s === null || s === undefined || fnSelector ) {

				a = [];

				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];

					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};

						if ( fnSelector ) {

							host = data[ row ];

							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {

							a.push( o );
						}
					}
				}

				return a;
			}

			if ( $.isPlainObject( s ) ) {

				return s.column !== undefined && s.row !== undefined && rows.indexOf(s.row) !== -1 ?
					[s] :
					[];
			}

			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { 
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
					};
				} )
				.toArray();

			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}

			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};

		return _selector_run( 'cell', selector, run, settings, opts );
	};

	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {

		if ( $.isPlainObject( rowSelector ) ) {

			if ( rowSelector.row === undefined ) {

				opts = rowSelector;
				rowSelector = null;
			}
			else {

				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}

		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}

		var internalOpts = opts ? {
			page: opts.page,
			order: opts.order,
			search: opts.search
		} : {};

		var columns = this.columns( columnSelector, internalOpts );
		var rows = this.rows( rowSelector, internalOpts );
		var i, ien, j, jen;

		var cellsNoOpts = this.iterator( 'table', function ( settings, idx ) {
			var a = [];

			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}

			return a;
		}, 1 );

		var cells = opts && opts.selected ?
			this.cells( cellsNoOpts, opts ) :
			cellsNoOpts;

		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );

		return cells;
	} );

	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];

			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );

	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );

	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';

		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );

	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );

	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );

	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );

	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );

	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];

		if ( data === undefined ) {

			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}

		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );

		return this;
	} );

	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
		var args = Array.prototype.slice.call( arguments );

		if ( order === undefined ) {

			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}

		if ( typeof order === 'number' ) {

			order = [ [ order, dir ] ];
		}
		else if ( args.length > 1 ) {

			order = args;
		}

		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = Array.isArray(order) ? order.slice() : order;
		} );
	} );

	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener(settings, node, {}, column, callback);
		} );
	} );

	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;

			return Array.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}

		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );

	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;

		if ( ! dir ) {
			return this.iterator( 'column', function ( settings, idx ) {
				var sort = _fnSortFlatten( settings );

				for ( var i=0, ien=sort.length ; i<ien ; i++ ) {
					if ( sort[i].col === idx ) {
						return sort[i].dir;
					}
				}

				return null;
			}, 1 );
		}
		else {
			return this.iterator( 'table', function ( settings, i ) {
				settings.aaSorting = that[i].map( function (col) {
					return [ col, dir ];
				} );
			} );
		}
	} );

	_api_registerPlural('columns().orderable()', 'column().orderable()', function ( directions ) {
		return this.iterator( 'column', function ( settings, idx ) {
			var col = settings.aoColumns[idx];

			return directions ?
				col.asSorting :
				col.bSortable;
		}, 1 );
	} );

	_api_register( 'processing()', function ( show ) {
		return this.iterator( 'table', function ( ctx ) {
			_fnProcessingDisplay( ctx, show );
		} );
	} );

	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;

		if ( input === undefined ) {

			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.search :
				undefined;
		}

		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}

			if (typeof regex === 'object') {

				_fnFilterComplete( settings, $.extend( settings.oPreviousSearch, regex, {
					search: input
				} ) );
			}
			else {

				_fnFilterComplete( settings, $.extend( settings.oPreviousSearch, {
					search: input,
					regex:  regex === null ? false : regex,
					smart:  smart === null ? true  : smart,
					caseInsensitive: caseInsen === null ? true : caseInsen
				} ) );
			}
		} );
	} );

	_api_register( 'search.fixed()', function ( name, search ) {
		var ret = this.iterator( true, 'table', function ( settings ) {
			var fixed = settings.searchFixed;

			if (! name) {
				return Object.keys(fixed)
			}
			else if (search === undefined) {
				return fixed[name];
			}
			else if (search === null) {
				delete fixed[name];
			}
			else {
				fixed[name] = search;
			}

			return this;
		} );

		return name !== undefined && search === undefined
			? ret[0]
			: ret;
	} );

	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;

				if ( input === undefined ) {

					return preSearch[ column ].search;
				}

				if ( ! settings.oFeatures.bFilter ) {
					return;
				}

				if (typeof regex === 'object') {

					$.extend( preSearch[ column ], regex, {
						search: input
					} );
				}
				else {

					$.extend( preSearch[ column ], {
						search: input,
						regex:  regex === null ? false : regex,
						smart:  smart === null ? true  : smart,
						caseInsensitive: caseInsen === null ? true : caseInsen
					} );
				}

				_fnFilterComplete( settings, settings.oPreviousSearch );
			} );
		}
	);

	_api_register([
			'columns().search.fixed()',
			'column().search.fixed()'
		],
		function ( name, search ) {
			var ret = this.iterator( true, 'column', function ( settings, colIdx ) {
				var fixed = settings.aoColumns[colIdx].searchFixed;

				if (! name) {
					return Object.keys(fixed)
				}
				else if (search === undefined) {
					return fixed[name];
				}
				else if (search === null) {
					delete fixed[name];
				}
				else {
					fixed[name] = search;
				}

				return this;
			} );

			return name !== undefined && search === undefined
				? ret[0]
				: ret;
		}
	);

	_api_register( 'state()', function ( set, ignoreTime ) {

		if ( ! set ) {
			return this.context.length ?
				this.context[0].oSavedState :
				null;
		}

		var setMutate = $.extend( true, {}, set );

		return this.iterator( 'table', function ( settings ) {
			if ( ignoreTime !== false ) {
				setMutate.time = +new Date() + 100;
			}

			_fnImplementState( settings, setMutate, function(){} );
		} );
	} );

	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {

			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );

	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );

	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );

	DataTable.use = function (arg1, arg2) {

		var module = typeof arg1 === 'string'
			? arg2
			: arg1;
		var type = typeof arg2 === 'string'
			? arg2
			: arg1;

		if (module === undefined && typeof type === 'string') {
			switch (type) {
				case 'lib':
				case 'jq':
					return $;

				case 'win':
					return window;

				case 'datetime':
					return DataTable.DateTime;

				case 'luxon':
					return __luxon;

				case 'moment':
					return __moment;

				default:
					return null;
			}
		}

		if (type === 'lib' || type === 'jq' || (module && module.fn && module.fn.jquery)) {
			$ = module;
		}
		else if (type == 'win' || (module && module.document)) {
			window = module;
			document = module.document;
		}
		else if (type === 'datetime' || (module && module.type === 'DateTime')) {
			DataTable.DateTime = module;
		}
		else if (type === 'luxon' || (module && module.FixedOffsetZone)) {
			__luxon = module;
		}
		else if (type === 'moment' || (module && module.isMoment)) {
			__moment = module;
		}
	}

	DataTable.factory = function (root, jq) {
		var is = false;

		if (root && root.document) {
			window = root;
			document = root.document;
		}

		if (jq && jq.fn && jq.fn.jquery) {
			$ = jq;
			is = true;
		}

		return is;
	}

	DataTable.versionCheck = function( version, version2 )
	{
		var aThis = version2 ?
			version2.split('.') :
			DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;

		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;

			if (iThis === iThat) {
				continue;
			}

			return iThis > iThat;
		}

		return true;
	};

	DataTable.isDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;

		if ( table instanceof DataTable.Api ) {
			return true;
		}

		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;

			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );

		return is;
	};

	DataTable.tables = function ( visible )
	{
		var api = false;

		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}

		var a = DataTable.settings
			.filter( function (o) {
				return !visible || (visible && $(o.nTable).is(':visible')) 
					? true
					: false;
			} )
			.map( function (o) {
				return o.nTable;
			});

		return api ?
			new _Api( a ) :
			a;
	};

	DataTable.camelToHungarian = _fnCamelToHungarian;

	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), 
			jqRows = $(rows);

		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );

	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function (  ) {
			var args = Array.prototype.slice.call(arguments);

			args[0] = args[0].split( /\s/ ).map( function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );

			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );

	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );

	_api_register( 'error()', function (msg) {
		return this.iterator( 'table', function ( settings ) {
			_fnLog( settings, 0, msg );
		} );
	} );

	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );

	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );

	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );

	_api_register( 'trigger()', function ( name, args, bubbles ) {
		return this.iterator( 'table', function ( settings ) {
			return _fnCallbackFire( settings, null, name, args, bubbles );
		} ).flatten();
	} );

	_api_register( 'ready()', function ( fn ) {
		var ctx = this.context;

		if (! fn) {
			return ctx.length
				? (ctx[0]._bInitComplete || false)
				: null;
		}

		return this.tables().every(function () {
			if (this.context[0]._bInitComplete) {
				fn.call(this);
			}
			else {
				this.on('init.dt.DT', function () {
					fn.call(this);
				});
			}
		} );
	} );

	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;

		return this.iterator( 'table', function ( settings ) {
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = settings.aoData.map( function (r) { return r ? r.nTr : null; } );
			var orderClasses = classes.order;

			settings.bDestroying = true;

			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings], true );

			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}

			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);

			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}

			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}

			settings.colgroup.remove();

			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );

			$('th, td', thead)
				.removeClass(
					orderClasses.canAsc + ' ' +
					orderClasses.canDesc + ' ' +
					orderClasses.isAsc + ' ' +
					orderClasses.isDesc
				)
				.css('width', '');

			jqTbody.children().detach();
			jqTbody.append( rows );

			var orig = settings.nTableWrapper.parentNode;
			var insertBefore = settings.nTableWrapper.nextSibling;

			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();

			if ( ! remove && orig ) {

				orig.insertBefore( table, insertBefore );

				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.table );
			}

			var idx = DataTable.settings.indexOf(settings);
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );

	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
			var inst;
			var counter = 0;

			return this.iterator( 'every', function ( settings, selectedIdx, tableIdx ) {
				inst = api[ type ](selectedIdx, opts);

				if (type === 'cell') {
					fn.call(inst, inst[0][0].row, inst[0][0].column, tableIdx, counter);
				}
				else {
					fn.call(inst, selectedIdx, tableIdx, counter);
				}

				counter++;
			} );
		} );
	} );

	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );

		if ( resolved === undefined ) {
			resolved = def;
		}

		if ( $.isPlainObject( resolved ) ) {
			resolved = plural !== undefined && resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}

		return typeof resolved === 'string'
			? resolved.replace( '%d', plural ) 
			: resolved;
	} );

	DataTable.version = "2.1.8";

	DataTable.settings = [];

	DataTable.models = {};

	DataTable.models.oSearch = {

		"caseInsensitive": true,

		"search": "",

		"regex": false,

		"smart": true,

		"return": false
	};

	DataTable.models.oRow = {

		"nTr": null,

		"anCells": null,

		"_aData": [],

		"_aSortData": null,

		"_aFilterData": null,

		"_sFilterRow": null,

		"src": null,

		"idx": -1,

		displayData: null
	};

	DataTable.models.oColumn = {

		"idx": null,

		"aDataSort": null,

		"asSorting": null,

		"bSearchable": null,

		"bSortable": null,

		"bVisible": null,

		"_sManualType": null,

		"_bAttrSrc": false,

		"fnCreatedCell": null,

		"fnGetData": null,

		"fnSetData": null,

		"mData": null,

		"mRender": null,

		"sClass": null,

		"sContentPadding": null,

		"sDefaultContent": null,

		"sName": null,

		"sSortDataType": 'std',

		"sSortingClass": null,

		"sTitle": null,

		"sType": null,

		"sWidth": null,

		"sWidthOrig": null,

		maxLenString: null,

		searchFixed: null
	};

	DataTable.defaults = {

		"aaData": null,

		"aaSorting": [[0,'asc']],

		"aaSortingFixed": [],

		"ajax": null,

		"aLengthMenu": [ 10, 25, 50, 100 ],

		"aoColumns": null,

		"aoColumnDefs": null,

		"aoSearchCols": [],

		"bAutoWidth": true,

		"bDeferRender": true,

		"bDestroy": false,

		"bFilter": true,

		"bInfo": true,

		"bLengthChange": true,

		"bPaginate": true,

		"bProcessing": false,

		"bRetrieve": false,

		"bScrollCollapse": false,

		"bServerSide": false,

		"bSort": true,

		"bSortMulti": true,

		"bSortCellsTop": null,

		"bSortClasses": true,

		"bStateSave": false,

		"fnCreatedRow": null,

		"fnDrawCallback": null,

		"fnFooterCallback": null,

		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},

		"fnHeaderCallback": null,

		"fnInfoCallback": null,

		"fnInitComplete": null,

		"fnPreDrawCallback": null,

		"fnRowCallback": null,

		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {
				return {};
			}
		},

		"fnStateLoadParams": null,

		"fnStateLoaded": null,

		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {

			}
		},

		"fnStateSaveParams": null,

		"iStateDuration": 7200,

		"iDisplayLength": 10,

		"iDisplayStart": 0,

		"iTabIndex": 0,

		"oClasses": {},

		"oLanguage": {

			"oAria": {

				"orderable": ": Activate to sort",

				"orderableReverse": ": Activate to invert sorting",

				"orderableRemove": ": Activate to remove sorting",

				paginate: {
					first: 'First',
					last: 'Last',
					next: 'Next',
					previous: 'Previous',
					number: ''
				}
			},

			"oPaginate": {

				"sFirst": "\u00AB",

				"sLast": "\u00BB",

				"sNext": "\u203A",

				"sPrevious": "\u2039",
			},

			entries: {
				_: "entries",
				1: "entry"
			},

			"sEmptyTable": "No data available in table",

			"sInfo": "Showing _START_ to _END_ of _TOTAL_ _ENTRIES-TOTAL_",

			"sInfoEmpty": "Showing 0 to 0 of 0 _ENTRIES-TOTAL_",

			"sInfoFiltered": "(filtered from _MAX_ total _ENTRIES-MAX_)",

			"sInfoPostFix": "",

			"sDecimal": "",

			"sThousands": ",",

			"sLengthMenu": "_MENU_ _ENTRIES_ per page",

			"sLoadingRecords": "Loading...",

			"sProcessing": "",

			"sSearch": "Search:",

			"sSearchPlaceholder": "",

			"sUrl": "",

			"sZeroRecords": "No matching records found"
		},

		orderDescReverse: true,

		"oSearch": $.extend( {}, DataTable.models.oSearch ),

		layout: {
			topStart: 'pageLength',
			topEnd: 'search',
			bottomStart: 'info',
			bottomEnd: 'paging'
		},

		"sDom": null,

		"searchDelay": null,

		"sPaginationType": "",

		"sScrollX": "",

		"sScrollXInner": "",

		"sScrollY": "",

		"sServerMethod": "GET",

		"renderer": null,

		"rowId": "DT_RowId",

		"caption": null,

		iDeferLoading: null
	};

	_fnHungarianMap( DataTable.defaults );

	DataTable.defaults.column = {

		"aDataSort": null,
		"iDataSort": -1,

		ariaTitle: '',

		"asSorting": [ 'asc', 'desc', '' ],

		"bSearchable": true,

		"bSortable": true,

		"bVisible": true,

		"fnCreatedCell": null,

		"mData": null,

		"mRender": null,

		"sCellType": "td",

		"sClass": "",

		"sContentPadding": "",

		"sDefaultContent": null,

		"sName": "",

		"sSortDataType": "std",

		"sTitle": null,

		"sType": null,

		"sWidth": null
	};

	_fnHungarianMap( DataTable.defaults.column );

	DataTable.models.oSettings = {

		"oFeatures": {

			"bAutoWidth": null,

			"bDeferRender": null,

			"bFilter": null,

			"bInfo": true,

			"bLengthChange": true,

			"bPaginate": null,

			"bProcessing": null,

			"bServerSide": null,

			"bSort": null,

			"bSortMulti": null,

			"bSortClasses": null,

			"bStateSave": null
		},

		"oScroll": {

			"bCollapse": null,

			"iBarWidth": 0,

			"sX": null,

			"sXInner": null,

			"sY": null
		},

		"oLanguage": {

			"fnInfoCallback": null
		},

		"oBrowser": {

			"bScrollbarLeft": false,

			"barWidth": 0
		},

		"ajax": null,

		"aanFeatures": [],

		"aoData": [],

		"aiDisplay": [],

		"aiDisplayMaster": [],

		"aIds": {},

		"aoColumns": [],

		"aoHeader": [],

		"aoFooter": [],

		"oPreviousSearch": {},

		searchFixed: {},

		"aoPreSearchCols": [],

		"aaSorting": null,

		"aaSortingFixed": [],

		"sDestroyWidth": 0,

		"aoRowCallback": [],

		"aoHeaderCallback": [],

		"aoFooterCallback": [],

		"aoDrawCallback": [],

		"aoRowCreatedCallback": [],

		"aoPreDrawCallback": [],

		"aoInitComplete": [],

		"aoStateSaveParams": [],

		"aoStateLoadParams": [],

		"aoStateLoaded": [],

		"sTableId": "",

		"nTable": null,

		"nTHead": null,

		"nTFoot": null,

		"nTBody": null,

		"nTableWrapper": null,

		"bInitialised": false,

		"aoOpenRows": [],

		"sDom": null,

		"searchDelay": null,

		"sPaginationType": "two_button",

		pagingControls: 0,

		"iStateDuration": 0,

		"aoStateSave": [],

		"aoStateLoad": [],

		"oSavedState": null,

		"oLoadedState": null,

		"bAjaxDataGet": true,

		"jqXHR": null,

		"json": undefined,

		"oAjaxData": undefined,

		"sServerMethod": null,

		"fnFormatNumber": null,

		"aLengthMenu": null,

		"iDraw": 0,

		"bDrawing": false,

		"iDrawError": -1,

		"_iDisplayLength": 10,

		"_iDisplayStart": 0,

		"_iRecordsTotal": 0,

		"_iRecordsDisplay": 0,

		"oClasses": {},

		"bFiltered": false,

		"bSorted": false,

		"bSortCellsTop": null,

		"oInit": null,

		"aoDestroyCallback": [],

		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},

		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},

		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;

			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},

		"oInstance": null,

		"sInstance": null,

		"iTabIndex": 0,

		"nScrollHead": null,

		"nScrollFoot": null,

		"aLastSort": [],

		"oPlugins": {},

		"rowIdFn": null,

		"rowId": null,

		caption: '',

		captionNode: null,

		colgroup: null,

		deferLoading: null,

		typeDetect: true
	};

	var extPagination = DataTable.ext.pager;

	$.extend( extPagination, {
		simple: function () {
			return [ 'previous', 'next' ];
		},

		full: function () {
			return [ 'first', 'previous', 'next', 'last' ];
		},

		numbers: function () {
			return [ 'numbers' ];
		},

		simple_numbers: function () {
			return [ 'previous', 'numbers', 'next' ];
		},

		full_numbers: function () {
			return [ 'first', 'previous', 'numbers', 'next', 'last' ];
		},

		first_last: function () {
			return ['first', 'last'];
		},

		first_last_numbers: function () {
			return ['first', 'numbers', 'last'];
		},

		_numbers: _pagingNumbers,

		numbers_length: 7
	} );

	$.extend( true, DataTable.ext.renderer, {
		pagingButton: {
			_: function (settings, buttonType, content, active, disabled) {
				var classes = settings.oClasses.paging;
				var btnClasses = [classes.button];
				var btn;

				if (active) {
					btnClasses.push(classes.active);
				}

				if (disabled) {
					btnClasses.push(classes.disabled)
				}

				if (buttonType === 'ellipsis') {
					btn = $('<span class="ellipsis"></span>').html(content)[0];
				}
				else {
					btn = $('<button>', {
						class: btnClasses.join(' '),
						role: 'link',
						type: 'button'
					}).html(content);
				}

				return {
					display: btn,
					clicker: btn
				}
			}
		},

		pagingContainer: {
			_: function (settings, buttons) {

				return buttons;
			}
		}
	} );

	var _filterString = function (stripHtml, normalize) {
		return function (str) {
			if (_empty(str) || typeof str !== 'string') {
				return str;
			}

			str = str.replace( _re_new_lines, " " );

			if (stripHtml) {
				str = _stripHtml(str);
			}

			if (normalize) {
				str = _normalize(str, false);
			}

			return str;
		};
	}

	function __mld( dtLib, momentFn, luxonFn, dateFn, arg1 ) {
		if (__moment) {
			return dtLib[momentFn]( arg1 );
		}
		else if (__luxon) {
			return dtLib[luxonFn]( arg1 );
		}

		return dateFn ? dtLib[dateFn]( arg1 ) : dtLib;
	}

	var __mlWarning = false;
	var __luxon; 
	var __moment; 

	function resolveWindowLibs() {
		if (window.luxon && ! __luxon) {
			__luxon = window.luxon;
		}

		if (window.moment && ! __moment) {
			__moment = window.moment;
		}
	}

	function __mldObj (d, format, locale) {
		var dt;

		resolveWindowLibs();

		if (__moment) {
			dt = __moment.utc( d, format, locale, true );

			if (! dt.isValid()) {
				return null;
			}
		}
		else if (__luxon) {
			dt = format && typeof d === 'string'
				? __luxon.DateTime.fromFormat( d, format )
				: __luxon.DateTime.fromISO( d );

			if (! dt.isValid) {
				return null;
			}

			dt.setLocale(locale);
		}
		else if (! format) {

			dt = new Date(d);
		}
		else {
			if (! __mlWarning) {
				alert('DataTables warning: Formatted date without Moment.js or Luxon - https://datatables.net/tn/17');
			}

			__mlWarning = true;
		}

		return dt;
	}

	function __mlHelper (localeString) {
		return function ( from, to, locale, def ) {

			if ( arguments.length === 0 ) {
				locale = 'en';
				to = null; 
				from = null; 
			}
			else if ( arguments.length === 1 ) {
				locale = 'en';
				to = from;
				from = null;
			}
			else if ( arguments.length === 2 ) {
				locale = to;
				to = from;
				from = null;
			}

			var typeName = 'datetime' + (to ? '-' + to : '');

			if (! DataTable.ext.type.order[typeName + '-pre']) {
				DataTable.type(typeName, {
					detect: function (d) {

						return d === typeName ? typeName : false;
					},
					order: {
						pre: function (d) {

							return d.valueOf();
						}
					},
					className: 'dt-right'
				});
			}

			return function ( d, type ) {

				if (d === null || d === undefined) {
					if (def === '--now') {

						var local = new Date();
						d = new Date( Date.UTC(
							local.getFullYear(), local.getMonth(), local.getDate(),
							local.getHours(), local.getMinutes(), local.getSeconds()
						) );
					}
					else {
						d = '';
					}
				}

				if (type === 'type') {

					return typeName;
				}

				if (d === '') {
					return type !== 'sort'
						? ''
						: __mldObj('0000-01-01 00:00:00', null, locale);
				}

				if ( to !== null && from === to && type !== 'sort' && type !== 'type' && ! (d instanceof Date) ) {
					return d;
				}

				var dt = __mldObj(d, from, locale);

				if (dt === null) {
					return d;
				}

				if (type === 'sort') {
					return dt;
				}

				var formatted = to === null
					? __mld(dt, 'toDate', 'toJSDate', '')[localeString]()
					: __mld(dt, 'format', 'toFormat', 'toISOString', to);

				return type === 'display' ?
					_escapeHtml( formatted ) :
					formatted;
			};
		}
	}

	var __thousands = ',';
	var __decimal = '.';

	if (window.Intl !== undefined) {
		try {
			var num = new Intl.NumberFormat().formatToParts(100000.1);

			for (var i=0 ; i<num.length ; i++) {
				if (num[i].type === 'group') {
					__thousands = num[i].value;
				}
				else if (num[i].type === 'decimal') {
					__decimal = num[i].value;
				}
			}
		}
		catch (e) {

		}
	}

	DataTable.datetime = function ( format, locale ) {
		var typeName = 'datetime-' + format;

		if (! locale) {
			locale = 'en';
		}

		if (! DataTable.ext.type.order[typeName]) {
			DataTable.type(typeName, {
				detect: function (d) {
					var dt = __mldObj(d, format, locale);
					return d === '' || dt ? typeName : false;
				},
				order: {
					pre: function (d) {
						return __mldObj(d, format, locale) || 0;
					}
				},
				className: 'dt-right'
			});
		}
	}

	DataTable.render = {
		date: __mlHelper('toLocaleDateString'),
		datetime: __mlHelper('toLocaleString'),
		time: __mlHelper('toLocaleTimeString'),
		number: function ( thousands, decimal, precision, prefix, postfix ) {

			if (thousands === null || thousands === undefined) {
				thousands = __thousands;
			}

			if (decimal === null || decimal === undefined) {
				decimal = __decimal;
			}

			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}

					if (d === '' || d === null) {
						return d;
					}

					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
					var abs = Math.abs(flo);

					if (abs >= 100000000000 || (abs < 0.0001 && abs !== 0) ) {
						var exp = flo.toExponential(precision).split(/e\+?/);
						return exp[0] + ' x 10<sup>' + exp[1] + '</sup>';
					}

					if ( isNaN( flo ) ) {
						return _escapeHtml( d );
					}

					flo = flo.toFixed( precision );
					d = Math.abs( flo );

					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';

					if (intPart === 0 && parseFloat(floatPart) === 0) {
						negative = '';
					}

					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},

		text: function () {
			return {
				display: _escapeHtml,
				filter: _escapeHtml
			};
		}
	};

	var _extTypes = DataTable.ext.type;

	DataTable.type = function (name, prop, val) {
		if (! prop) {
			return {
				className: _extTypes.className[name],
				detect: _extTypes.detect.find(function (fn) {
					return fn._name === name;
				}),
				order: {
					pre: _extTypes.order[name + '-pre'],
					asc: _extTypes.order[name + '-asc'],
					desc: _extTypes.order[name + '-desc']
				},
				render: _extTypes.render[name],
				search: _extTypes.search[name]
			};
		}

		var setProp = function(prop, propVal) {
			_extTypes[prop][name] = propVal;
		};
		var setDetect = function (detect) {

			Object.defineProperty(detect, "_name", {value: name});

			var idx = _extTypes.detect.findIndex(function (item) {
				return item._name === name;
			});

			if (idx === -1) {
				_extTypes.detect.unshift(detect);
			}
			else {
				_extTypes.detect.splice(idx, 1, detect);
			}
		};
		var setOrder = function (obj) {
			_extTypes.order[name + '-pre'] = obj.pre; 
			_extTypes.order[name + '-asc'] = obj.asc; 
			_extTypes.order[name + '-desc'] = obj.desc; 
		};

		if (val === undefined) {
			val = prop;
			prop = null;
		}

		if (prop === 'className') {
			setProp('className', val);
		}
		else if (prop === 'detect') {
			setDetect(val);
		}
		else if (prop === 'order') {
			setOrder(val);
		}
		else if (prop === 'render') {
			setProp('render', val);
		}
		else if (prop === 'search') {
			setProp('search', val);
		}
		else if (! prop) {
			if (val.className) {
				setProp('className', val.className);
			}

			if (val.detect !== undefined) {
				setDetect(val.detect);
			}

			if (val.order) {
				setOrder(val.order);
			}

			if (val.render !== undefined) {
				setProp('render', val.render);
			}

			if (val.search !== undefined) {
				setProp('search', val.search);
			}
		}
	}

	DataTable.types = function () {
		return _extTypes.detect.map(function (fn) {
			return fn._name;
		});
	};

	var __diacriticSort = function (a, b) {
		a = a !== null && a !== undefined ? a.toString().toLowerCase() : '';
		b = b !== null && b !== undefined ? b.toString().toLowerCase() : '';

		return a.localeCompare(b, navigator.languages[0] || navigator.language, {
			numeric: true,
			ignorePunctuation: true,
		});
	}

	DataTable.type('string', {
		detect: function () {
			return 'string';
		},
		order: {
			pre: function ( a ) {

				return _empty(a) && typeof a !== 'boolean' ?
					'' :
					typeof a === 'string' ?
						a.toLowerCase() :
						! a.toString ?
							'' :
							a.toString();
			}
		},
		search: _filterString(false, true)
	});

	DataTable.type('string-utf8', {
		detect: {
			allOf: function ( d ) {
				return true;
			},
			oneOf: function ( d ) {

				return ! _empty( d ) && navigator.languages && typeof d === 'string' && d.match(/[^\x00-\x7F]/);
			}
		},
		order: {
			asc: __diacriticSort,
			desc: function (a, b) {
				return __diacriticSort(a, b) * -1;
			}
		},
		search: _filterString(false, true)
	});

	DataTable.type('html', {
		detect: {
			allOf: function ( d ) {
				return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1);
			},
			oneOf: function ( d ) {

				return ! _empty( d ) && typeof d === 'string' && d.indexOf('<') !== -1;
			}
		},
		order: {
			pre: function ( a ) {
				return _empty(a) ?
					'' :
					a.replace ?
						_stripHtml(a).trim().toLowerCase() :
						a+'';
			}
		},
		search: _filterString(true, true)
	});

	DataTable.type('date', {
		className: 'dt-type-date',
		detect: {
			allOf: function ( d ) {

				if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
					return null;
				}
				var parsed = Date.parse(d);
				return (parsed !== null && !isNaN(parsed)) || _empty(d);
			},
			oneOf: function ( d ) {

				return (d instanceof Date) || (typeof d === 'string' && _re_date.test(d));
			}
		},
		order: {
			pre: function ( d ) {
				var ts = Date.parse( d );
				return isNaN(ts) ? -Infinity : ts;
			}
		}
	});

	DataTable.type('html-num-fmt', {
		className: 'dt-type-numeric',
		detect: {
			allOf: function ( d, settings ) {
				var decimal = settings.oLanguage.sDecimal;
				return _htmlNumeric( d, decimal, true, false );
			},
			oneOf: function (d, settings) {

				var decimal = settings.oLanguage.sDecimal;
				return _htmlNumeric( d, decimal, true, false );
			}
		},
		order: {
			pre: function ( d, s ) {
				var dp = s.oLanguage.sDecimal;
				return __numericReplace( d, dp, _re_html, _re_formatted_numeric );
			}
		},
		search: _filterString(true, true)
	});

	DataTable.type('html-num', {
		className: 'dt-type-numeric',
		detect: {
			allOf: function ( d, settings ) {
				var decimal = settings.oLanguage.sDecimal;
				return _htmlNumeric( d, decimal, false, true );
			},
			oneOf: function (d, settings) {

				var decimal = settings.oLanguage.sDecimal;
				return _htmlNumeric( d, decimal, false, false );
			}
		},
		order: {
			pre: function ( d, s ) {
				var dp = s.oLanguage.sDecimal;
				return __numericReplace( d, dp, _re_html );
			}
		},
		search: _filterString(true, true)
	});

	DataTable.type('num-fmt', {
		className: 'dt-type-numeric',
		detect: {
			allOf: function ( d, settings ) {
				var decimal = settings.oLanguage.sDecimal;
				return _isNumber( d, decimal, true, true );
			},
			oneOf: function (d, settings) {

				var decimal = settings.oLanguage.sDecimal;
				return _isNumber( d, decimal, true, false );
			}
		},
		order: {
			pre: function ( d, s ) {
				var dp = s.oLanguage.sDecimal;
				return __numericReplace( d, dp, _re_formatted_numeric );
			}
		}
	});

	DataTable.type('num', {
		className: 'dt-type-numeric',
		detect: {
			allOf: function ( d, settings ) {
				var decimal = settings.oLanguage.sDecimal;
				return _isNumber( d, decimal, false, true );
			},
			oneOf: function (d, settings) {

				var decimal = settings.oLanguage.sDecimal;
				return _isNumber( d, decimal, false, false );
			}
		},
		order: {
			pre: function (d, s) {
				var dp = s.oLanguage.sDecimal;
				return __numericReplace( d, dp );
			}
		}
	});

	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}

		var type = typeof d;

		if (type === 'number' || type === 'bigint') {
			return d;
		}

		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}

		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}

			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}

		return d * 1;
	};

	$.extend( true, DataTable.ext.renderer, {
		footer: {
			_: function ( settings, cell, classes ) {
				cell.addClass(classes.tfoot.cell);
			}
		},

		header: {
			_: function ( settings, cell, classes ) {
				cell.addClass(classes.thead.cell);

				if (! settings.oFeatures.bSort) {
					cell.addClass(classes.order.none);
				}

				var legacyTop = settings.bSortCellsTop;
				var headerRows = cell.closest('thead').find('tr');
				var rowIdx = cell.parent().index();

				if (

					cell.attr('data-dt-order') === 'disable' ||
					cell.parent().attr('data-dt-order') === 'disable' ||

					(legacyTop === true && rowIdx !== 0) ||
					(legacyTop === false && rowIdx !== headerRows.length - 1)
				) {
					return;
				}

				$(settings.nTable).on( 'order.dt.DT column-visibility.dt.DT', function ( e, ctx ) {
					if ( settings !== ctx ) { 
						return;               
					}

					var sorting = ctx.sortDetails;

					if (! sorting) {
						return;
					}

					var i;
					var orderClasses = classes.order;
					var columns = ctx.api.columns( cell );
					var col = settings.aoColumns[columns.flatten()[0]];
					var orderable = columns.orderable().includes(true);
					var ariaType = '';
					var indexes = columns.indexes();
					var sortDirs = columns.orderable(true).flatten();
					var orderedColumns = _pluck(sorting, 'col');

					cell
						.removeClass(
							orderClasses.isAsc +' '+
							orderClasses.isDesc
						)
						.toggleClass( orderClasses.none, ! orderable )
						.toggleClass( orderClasses.canAsc, orderable && sortDirs.includes('asc') )
						.toggleClass( orderClasses.canDesc, orderable && sortDirs.includes('desc') );

					var isOrdering = true;

					for (i=0; i<indexes.length; i++) {
						if (! orderedColumns.includes(indexes[i])) {
							isOrdering = false;
						}
					}

					if ( isOrdering ) {

						var orderDirs = columns.order();

						cell.addClass(
							orderDirs.includes('asc') ? orderClasses.isAsc : '' +
							orderDirs.includes('desc') ? orderClasses.isDesc : ''
						);
					}

					var firstVis = -1; 

					for (i=0; i<orderedColumns.length; i++) {
						if (settings.aoColumns[orderedColumns[i]].bVisible) {
							firstVis = orderedColumns[i];
							break;
						}
					}

					if (indexes[0] == firstVis) {
						var firstSort = sorting[0];
						var sortOrder = col.asSorting;

						cell.attr('aria-sort', firstSort.dir === 'asc' ? 'ascending' : 'descending');

						ariaType = ! sortOrder[firstSort.index + 1] ? 'Remove' : 'Reverse';
					}
					else {
						cell.removeAttr('aria-sort');
					}

					cell.attr('aria-label', orderable
						? col.ariaTitle + ctx.api.i18n('oAria.orderable' + ariaType)
						: col.ariaTitle
					);

					if (orderable) {
						cell.find('.dt-column-title').attr('role', 'button');
						cell.attr('tabindex', 0)
					}
				} );
			}
		},

		layout: {
			_: function ( settings, container, items ) {
				var classes = settings.oClasses.layout;
				var row = $('<div/>')
					.attr('id', items.id || null)
					.addClass(items.className || classes.row)
					.appendTo( container );

				$.each( items, function (key, val) {
					if (key === 'id' || key === 'className') {
						return;
					}

					var klass = '';

					if (val.table) {
						row.addClass(classes.tableRow);
						klass += classes.tableCell + ' ';
					}

					if (key === 'start') {
						klass += classes.start;
					}
					else if (key === 'end') {
						klass += classes.end;
					}
					else {
						klass += classes.full;
					}

					$('<div/>')
						.attr({
							id: val.id || null,
							"class": val.className
								? val.className
								: classes.cell + ' ' + klass
						})
						.append( val.contents )
						.appendTo( row );
				} );
			}
		}
	} );

	DataTable.feature = {};

	DataTable.feature.register = function ( name, cb, legacy ) {
		DataTable.ext.features[ name ] = cb;

		if (legacy) {
			_ext.feature.push({
				cFeature: legacy,
				fnInit: cb
			});
		}
	};

	function _divProp(el, prop, val) {
		if (val) {
			el[prop] = val;
		}
	}

	DataTable.feature.register( 'div', function ( settings, opts ) {
		var n = $('<div>')[0];

		if (opts) {
			_divProp(n, 'className', opts.className);
			_divProp(n, 'id', opts.id);
			_divProp(n, 'innerHTML', opts.html);
			_divProp(n, 'textContent', opts.text);
		}

		return n;
	} );

	DataTable.feature.register( 'info', function ( settings, opts ) {

		if (! settings.oFeatures.bInfo) {
			return null;
		}

		var
			lang  = settings.oLanguage,
			tid = settings.sTableId,
			n = $('<div/>', {
				'class': settings.oClasses.info.container,
			} );

		opts = $.extend({
			callback: lang.fnInfoCallback,
			empty: lang.sInfoEmpty,
			postfix: lang.sInfoPostFix,
			search: lang.sInfoFiltered,
			text: lang.sInfo,
		}, opts);

		settings.aoDrawCallback.push(function (s) {
			_fnUpdateInfo(s, opts, n);
		});

		if (! settings._infoEl) {
			n.attr({
				'aria-live': 'polite',
				id: tid+'_info',
				role: 'status'
			});

			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );

			settings._infoEl = n;
		}

		return n;
	}, 'i' );

	function _fnUpdateInfo ( settings, opts, node )
	{
		var
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total
				? opts.text
				: opts.empty;

		if ( total !== max ) {

			out += ' ' + opts.search;
		}

		out += opts.postfix;
		out = _fnMacros( settings, out );

		if ( opts.callback ) {
			out = opts.callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}

		node.html( out );

		_fnCallbackFire(settings, null, 'info', [settings, node[0], out]);
	}

	var __searchCounter = 0;

	DataTable.feature.register( 'search', function ( settings, opts ) {

		if (! settings.oFeatures.bFilter) {
			return null;
		}

		var classes = settings.oClasses.search;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var input = '<input type="search" class="'+classes.input+'"/>';

		opts = $.extend({
			placeholder: language.sSearchPlaceholder,
			processing: false,
			text: language.sSearch
		}, opts);

		if (opts.text.indexOf('_INPUT_') === -1) {
			opts.text += '_INPUT_';
		}

		opts.text = _fnMacros(settings, opts.text);

		var end = opts.text.match(/_INPUT_$/);
		var start = opts.text.match(/^_INPUT_/);
		var removed = opts.text.replace(/_INPUT_/, '');
		var str = '<label>' + opts.text + '</label>';

		if (start) {
			str = '_INPUT_<label>' + removed + '</label>';
		}
		else if (end) {
			str = '<label>' + removed + '</label>_INPUT_';
		}

		var filter = $('<div>')
			.addClass(classes.container)
			.append(str.replace(/_INPUT_/, input));

		filter.find('label').attr('for', 'dt-search-' + __searchCounter);
		filter.find('input').attr('id', 'dt-search-' + __searchCounter);
		__searchCounter++;

		var searchFn = function(event) {
			var val = this.value;

			if(previousSearch.return && event.key !== "Enter") {
				return;
			}

			if ( val != previousSearch.search ) {
				_fnProcessingRun(settings, opts.processing, function () {
					previousSearch.search = val;

					_fnFilterComplete( settings, previousSearch );

					settings._iDisplayStart = 0;
					_fnDraw( settings );
				});
			}
		};

		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			0;

		var jqFilter = $('input', filter)
			.val( previousSearch.search )
			.attr( 'placeholder', opts.placeholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					DataTable.util.debounce( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'mouseup.DT', function(e) {

				setTimeout( function () {
					searchFn.call(jqFilter[0], e);
				}, 10);
			} )
			.on( 'keypress.DT', function(e) {

				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);

		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s && jqFilter[0] !== document.activeElement ) {
				jqFilter.val( typeof previousSearch.search !== 'function'
					? previousSearch.search
					: ''
				);
			}
		} );

		return filter;
	}, 'f' );

	DataTable.feature.register( 'paging', function ( settings, opts ) {

		if (! settings.oFeatures.bPaginate) {
			return null;
		}

		opts = $.extend({
			buttons: DataTable.ext.pager.numbers_length,
			type: settings.sPaginationType,
			boundaryNumbers: true,
			firstLast: true,
			previousNext: true,
			numbers: true
		}, opts);

		var host = $('<div/>')
			.addClass(settings.oClasses.paging.container + (opts.type ? ' paging_' + opts.type : ''))
			.append(
				$('<nav>')
					.attr('aria-label', 'pagination')
					.addClass(settings.oClasses.paging.nav)
			);
		var draw = function () {
			_pagingDraw(settings, host.children(), opts);
		};

		settings.aoDrawCallback.push(draw);

		$(settings.nTable).on('column-sizing.dt.DT', draw);

		return host;
	}, 'p' );

	function _pagingDynamic(opts) {
		var out = [];

		if (opts.numbers) {
			out.push('numbers');
		}

		if (opts.previousNext) {
			out.unshift('previous');
			out.push('next');
		}

		if (opts.firstLast) {
			out.unshift('first');
			out.push('last');
		}

		return out;
	}

	function _pagingDraw(settings, host, opts) {
		if (! settings._bInitComplete) {
			return;
		}

		var
			plugin = opts.type
				? DataTable.ext.pager[ opts.type ]
				: _pagingDynamic,
			aria = settings.oLanguage.oAria.paginate || {},
			start      = settings._iDisplayStart,
			len        = settings._iDisplayLength,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1,
			page = all ? 0 : Math.ceil( start / len ),
			pages = all ? 1 : Math.ceil( visRecords / len ),
			buttons = [],
			buttonEls = [],
			buttonsNested = plugin(opts)
				.map(function (val) {
					return val === 'numbers'
						? _pagingNumbers(page, pages, opts.buttons, opts.boundaryNumbers)
						: val;
				});

		buttons = buttons.concat.apply(buttons, buttonsNested);

		for (var i=0 ; i<buttons.length ; i++) {
			var button = buttons[i];

			var btnInfo = _pagingButtonInfo(settings, button, page, pages);
			var btn = _fnRenderer( settings, 'pagingButton' )(
				settings,
				button,
				btnInfo.display,
				btnInfo.active,
				btnInfo.disabled
			);

			var ariaLabel = typeof button === 'string'
				? aria[ button ]
				: aria.number
					? aria.number + (button+1)
					: null;

			$(btn.clicker).attr({
				'aria-controls': settings.sTableId,
				'aria-disabled': btnInfo.disabled ? 'true' : null,
				'aria-current': btnInfo.active ? 'page' : null,
				'aria-label': ariaLabel,
				'data-dt-idx': button,
				'tabIndex': btnInfo.disabled
					? -1
					: settings.iTabIndex
						? settings.iTabIndex
						: null, 
			});

			if (typeof button !== 'number') {
				$(btn.clicker).addClass(button);
			}

			_fnBindAction(
				btn.clicker, {action: button}, function(e) {
					e.preventDefault();

					_fnPageChange( settings, e.data.action, true );
				}
			);

			buttonEls.push(btn.display);
		}

		var wrapped = _fnRenderer(settings, 'pagingContainer')(
			settings, buttonEls
		);

		var activeEl = host.find(document.activeElement).data('dt-idx');

		host.empty().append(wrapped);

		if ( activeEl !== undefined ) {
			host.find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
		}

		if (
			buttonEls.length && 
			opts.buttons > 1 && 
			$(host).height() >= ($(buttonEls[0]).outerHeight() * 2) - 10
		) {
			_pagingDraw(settings, host, $.extend({}, opts, { buttons: opts.buttons - 2 }));
		}
	}

	function _pagingButtonInfo(settings, button, page, pages) {
		var lang = settings.oLanguage.oPaginate;
		var o = {
			display: '',
			active: false,
			disabled: false
		};

		switch ( button ) {
			case 'ellipsis':
				o.display = '&#x2026;';
				o.disabled = true;
				break;

			case 'first':
				o.display = lang.sFirst;

				if (page === 0) {
					o.disabled = true;
				}
				break;

			case 'previous':
				o.display = lang.sPrevious;

				if ( page === 0 ) {
					o.disabled = true;
				}
				break;

			case 'next':
				o.display = lang.sNext;

				if ( pages === 0 || page === pages-1 ) {
					o.disabled = true;
				}
				break;

			case 'last':
				o.display = lang.sLast;

				if ( pages === 0 || page === pages-1 ) {
					o.disabled = true;
				}
				break;

			default:
				if ( typeof button === 'number' ) {
					o.display = settings.fnFormatNumber( button + 1 );

					if (page === button) {
						o.active = true;
					}
				}
				break;
		}

		return o;
	}

	function _pagingNumbers ( page, pages, buttons, addFirstLast ) {
		var
			numbers = [],
			half = Math.floor(buttons / 2),
			before = addFirstLast ? 2 : 1,
			after = addFirstLast ? 1 : 0;

		if ( pages <= buttons ) {
			numbers = _range(0, pages);
		}
		else if (buttons === 1) {

			numbers = [page];
		}
		else if (buttons === 3) {

			if (page <= 1) {
				numbers = [0, 1, 'ellipsis'];
			}
			else if (page >= pages - 2) {
				numbers = _range(pages-2, pages);
				numbers.unshift('ellipsis');
			}
			else {
				numbers = ['ellipsis', page, 'ellipsis'];
			}
		}
		else if ( page <= half ) {
			numbers = _range(0, buttons-before);
			numbers.push('ellipsis');

			if (addFirstLast) {
				numbers.push(pages-1);
			}
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range(pages-(buttons-before), pages);
			numbers.unshift('ellipsis');

			if (addFirstLast) {
				numbers.unshift(0);
			}
		}
		else {
			numbers = _range(page-half+before, page+half-after);
			numbers.push('ellipsis');
			numbers.unshift('ellipsis');

			if (addFirstLast) {
				numbers.push(pages-1);
				numbers.unshift(0);
			}
		}

		return numbers;
	}

	var __lengthCounter = 0;

	DataTable.feature.register( 'pageLength', function ( settings, opts ) {
		var features = settings.oFeatures;

		if (! features.bPaginate || ! features.bLengthChange) {
			return null;
		}

		opts = $.extend({
			menu: settings.aLengthMenu,
			text: settings.oLanguage.sLengthMenu
		}, opts);

		var
			classes  = settings.oClasses.length,
			tableId  = settings.sTableId,
			menu     = opts.menu,
			lengths  = [],
			language = [],
			i;

		if (Array.isArray( menu[0] )) {

			lengths = menu[0];
			language = menu[1];
		}
		else {
			for ( i=0 ; i<menu.length ; i++ ) {

				if ($.isPlainObject(menu[i])) {
					lengths.push(menu[i].value);
					language.push(menu[i].label);
				}
				else {

					lengths.push(menu[i]);
					language.push(menu[i]);
				}
			}
		}

		var end = opts.text.match(/_MENU_$/);
		var start = opts.text.match(/^_MENU_/);
		var removed = opts.text.replace(/_MENU_/, '');
		var str = '<label>' + opts.text + '</label>';

		if (start) {
			str = '_MENU_<label>' + removed + '</label>';
		}
		else if (end) {
			str = '<label>' + removed + '</label>_MENU_';
		}

		var tmpId = 'tmp-' + (+new Date())
		var div = $('<div/>')
			.addClass( classes.container )
			.append(
				str.replace( '_MENU_', '<span id="'+tmpId+'"></span>' )
			);

		var textNodes = [];
		Array.from(div.find('label')[0].childNodes).forEach(function (el) {
			if (el.nodeType === Node.TEXT_NODE) {
				textNodes.push({
					el: el,
					text: el.textContent
				});
			}
		});

		var updateEntries = function (len) {
			textNodes.forEach(function (node) {
				node.el.textContent = _fnMacros(settings, node.text, len);
			});
		}

		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.select
		} );

		for ( i=0 ; i<lengths.length ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}

		div.find('label').attr('for', 'dt-length-' + __lengthCounter);
		select.attr('id', 'dt-length-' + __lengthCounter);
		__lengthCounter++;

		div.find('#' + tmpId).replaceWith(select);

		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function() {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );

		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );

				updateEntries(len);
			}
		} );

		updateEntries(settings._iDisplayLength);

		return div;
	}, 'l' );

	$.fn.dataTable = DataTable;

	DataTable.$ = $;

	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );

	return DataTable;
}));