
var AutoCompleteList = function() {
	var sortables = new Array();
	
	return function (options) {
		var type = options.type;
		var url = options.url;
		var remove_image = options.remove_image;
		var limit = options.limit;
		var onOverLimit = options.onOverLimit;
		var onUnderLimit = options.onUnderLimit;
		
		var self = this;
		
		if (!onOverLimit) {
			var onOverLimit = function() {
				//hide the input box/add button
				$(type + '_name').hide();
				$('add_associated_'+type).hide();
				var example = $(type + "_example");
				if (example)
					example.hide();
				
			}
		}
		
		if (!onUnderLimit) {
			var onUnderLimit = function() {
				//hide the input box/add button
				$(type + '_name').show();
				$('add_associated_'+type).show();
				var example = $(type + "_example");
				if (example)
					example.show();
			}
		}
		
		function isOverLimit() {
			return Sortable.sequence($(type+"_list")).length >= limit;
		}
		
		function updateOrder() {
			$('associated_'+type).value = Sortable.sequence(type+'_list');
		}
		
		this.addItem = function () {
			if (($(type+'_id') != null) && ($(type+'_id').value != '') && ($(type+'_'+$(type+'_id').value) == null)) {
				var id = $(type+'_id').value;
				var li;

				//li  = new Element('li', {'id':type+'_'+id, 'style':'cursor: move;margin-bottom:10px;width:350px;'}).update($(type+'_name').value+"<select name = \"faculty_role[]\" style=\"float:right;margin-right:30px;margin-top:-5px;\"><option value = \"teacher\">Teacher</option><option value = \"tutor\">Tutor</option><option value = \"ta\">Teacher's Assistant</option><option value = \"auditor\">Auditor</option></select>").addClassName('community');
				li  = new Element('li', {'id':type+'_'+id, 'style':'cursor: move;'+((type=='faculty')?'margin-bottom:10px;width:350px;':'')}).update($(type+'_name').value).addClassName('community');
				if(type=='faculty'){
					var select = new Element('select',{style:'float:right;margin-right:30px;margin-top:-5px;'});
					select.insert({bottom:new Element('option', { value: 'teacher'}).update('Teacher')});
					select.insert({bottom:new Element('option', { value: 'tutor'}).update('Tutor')});
					select.insert({bottom:new Element('option', { value: 'ta'}).update('Teacher\'s Assistant')});
					select.insert({bottom:new Element('option', { value: 'auditor'}).update('Auditor')});
					li.insert({bottom:select});
				}
				var img = new Element('img', {'src':remove_image} ).addClassName('list-cancel-image');
				$(type+'_name').value = '';

				li.insert({bottom:img});
				$(type+'_id').value	= '';
				$(type+'_list').appendChild(li);
				img.observe('click', self.removeItem.curry(id));
				Sortable.destroy($(type+'_list'));
				Sortable.create(type+'_list', {onUpdate : updateOrder});
				updateOrder(type);
			} else if ($(type+'_'+$(type+'_id').value) != null) {
				alert('Important: Each user may only be added once.');
				$(type+'_id').value = '';
				$(type+'_name').value = '';
			} else if ($(type+'_name').value != '' && $(type+'_name').value != null) {
				alert('Important: When you see the correct name pop-up in the list as you type, make sure you select the name with your mouse, do not press the Enter button.');
			} 
			if (limit) {
				if (isOverLimit()) {
					document.fire(type+'_autocomplete:overlimit');
				} else {
					document.fire(type+'_autocomplete:underlimit');
				}
			}
			
			if ("fireEvent" in $(type+'_list'))
				$(type+'_list').fireEvent("onchange");
			else
			{
				var evt = document.createEvent("HTMLEvents");
				evt.initEvent("change", false, true);
				$(type+'_list').dispatchEvent(evt);
			}
		}
		
		this.addItemNoError = function () {
			if (($(type+'_id') != null) && ($(type+'_id').value != '') && ($(type+'_'+$(type+'_id').value) == null)) {
				self.addItem();
			}
		}
		
		this.removeItem = function(id) {
			if ($(type+'_'+id)) {
				$(type+'_'+id).remove();
				Sortable.destroy($(type+'_list'));
				Sortable.create(type+'_list', {onUpdate : updateOrder});
				updateOrder();
				if (limit) {
					if (!isOverLimit()) {
						document.fire(type+'_autocomplete:underlimit');
					} else {
						document.fire(type+'_autocomplete:overlimit');
					}
				}
			}
		}

		//-----------------//

		function checkInput() {
			if (($(type+'_name') != null) && ($(type+'_ref') != null) && ($(type+'_id') != null)) {
				if ($(type+'_name').value != $(type+'_ref').value) {
					$(type+'_id').value = '';
				}
			}

			return true;
		}

		function selectInput(id) {
			if ((id != null) && ($(type+'_id') != null)) {
				$(type+'_id').value = id;
			}
		}

		function copyInput() {
			if (($(type+'_name') != null) && ($(type+'_ref') != null)) {
				$(type+'_ref').value = $(type+'_name').value;
			}

			return true;
		}
		
		new Ajax.Autocompleter(	type + '_name', 
				type + '_name_auto_complete', 
				url, 
				{	frequency: 0.2, 
					minChars: 2, 
					afterUpdateElement: function (text, li) {
						selectInput(li.id); 
						copyInput();
					}
				});

		$(type + '_name').observe('keyup', checkInput);
		$(type + '_name').observe('blur', self.addItemNoError);
		$('add_associated_' + type).observe('click', self.addItem);
		$(type + '_name').observe('keypress', function(event){
			if(event.keyCode == Event.KEY_RETURN) {
				self.addItem();
				Event.stop(event);
			}
		});
		if (limit) {
			document.observe(type+'_autocomplete:overlimit',onOverLimit);
			document.observe(type+'_autocomplete:underlimit',onUnderLimit);
		}
		
		Sortable.create(type + '_list', {onUpdate : updateOrder});
		$('associated_'+type).value = Sortable.sequence($(type+'_list'));
		
		if (limit) {
			if (!isOverLimit()) {
				document.fire(type+'_autocomplete:underlimit');
			} else {
				document.fire(type+'_autocomplete:overlimit');
			}
		}
	};
}();