var ipc = require('ipc');
var fs 	= require('fs');
var remote = require('remote');
var dialog = remote.require('dialog');
var editor = require('./js/editor.js');
var filePath = null;

//Splitter vars
var splitterSizeRatio = 0.5;
var width = 774;

$(document).ready(function () {
	$("#splitter").splitter({
		splitVertical: true,
		outline: true,
		anchorToWindow: true,
		resizeTo: window,
		accessKey: "I"
	});
	$("#splitter").trigger("resize");
	
	$('#editor').on('input', function(){
		editor.compileText(false);
	});
	
	$('.vsplitbar').on('mouseup', function(){
		setTimeout(function() {
			var splitterLeftSideSize = $('#splitterLeftSide').css('width').split('px')[0];
			splitterSizeRatio = splitterLeftSideSize / width;
			console.log(splitterSizeRatio);
		}, 100);
		
		
	});
	
	$('.toolbar-button').on('click', function(event){
		console.log(event);
		applyEffectOnSelection(event.toElement.className.split(" ")[1]);
	});
});

function getInputSelection(elem){
 if(typeof elem != "undefined"){
  s=elem[0].selectionStart;
  e=elem[0].selectionEnd;
  return elem.val().substring(s, e);
 }else{
  return '';
 }
}

//IPCs
ipc.on('resize', function(message) {
	setTimeout(function(){
		var splitterLeftSideSize = $('#splitterLeftSide').css('width').split('px')[0];
		var splitterRightSideSize = $('#splitterRightSide').css('width').split('px')[0];
		width = parseInt(splitterLeftSideSize)+parseInt(splitterRightSideSize)
		$('#splitterLeftSide').css('width', width*splitterSizeRatio);
		$("#splitter").trigger("resize");
	},100);
});
ipc.on('file-new', function(){
	newFileDialog();
});
ipc.on('file-open', function() {
	openFileDialog();
});
ipc.on('file-save', function(as) {
	saveFileDialog(as);
});
ipc.on('edit-markdown', function(effect){
	applyEffectOnSelection(effect);
});

//Editing functions
function applyEffectOnSelection(effect){
	var selectionRequired = true;
	if(effect == "line")
		selectionRequired = false;
		
	var selection = getInputSelection($("#editor"));
	if(selection.length>0 || effect=="line"){
		var editedSelection =  selection;
		switch(effect){
			case "bold":
				editedSelection = editor.boldSelection(selection);
				break;
			case "italic":
				editedSelection = editor.italicSelection(selection);
				break;
			case "strikethrough":
				editedSelection = editor.strikeThroughSelection(selection);
				break;
			case "h1":
				editedSelection = editor.h1Selection(selection);
				break;
			case "h2":
				editedSelection = editor.h2Selection(selection);
				break;
			case "h3":
				editedSelection = editor.h3Selection(selection);
				break;
			case "h4":
				editedSelection = editor.h4Selection(selection);
				break;
			case "h5":
				editedSelection = editor.h5Selection(selection);
				break;
			case "h6":
				editedSelection = editor.h6Selection(selection);
				break;
			case "bullet":
				editedSelection = editor.bulletSelection(selection);
				break;
			case "line":
				editedSelection = editor.lineSelection(selection);
				break;
		}
		
		var selectionStart = $("#editor")[0].selectionStart;
		var selectionEnd = $("#editor")[0].selectionEnd;
		var preText = $("#editor").val().substring(0, selectionStart);
		var postText = $("#editor").val().substring(selectionEnd);
		
		$("#editor").val(preText+editedSelection+postText);
		$("#editor")[0].selectionStart = preText.length;
		$("#editor")[0].selectionEnd = preText.length + editedSelection.length;
			
		console.log(selection);
		editor.compileText(false);
	}
}

//File managment functions
function newFileDialog(){
	if(editor.unsaved){
		var response = saveChangesMessageDialog();
		if(response == 1){
			return;
		}else if(response == 0){
			saveFileDialog(false);
		}
	}
	  $(".editor-input").val("");
	  remote.getCurrentWindow().setTitle("New file - Gitme");
	  editor.compileText(true);
}

function openFileDialog(){
	if(editor.unsaved){
		var response = saveChangesMessageDialog();
		if(response == 1){
			return;
		}else if(response == 0){
			saveFileDialog(false);
		}
	}
	var files = dialog.showOpenDialog({ 
		properties: [ 'openFile' ], 
		filters: [
		  { name: 'Readme', extensions: ['md', 'txt'] },
		]
	});
	console.log(files);
	if(files){
		remote.getCurrentWindow().setTitle(files[0].split('\\')[files[0].split('\\').length-1] +" - Gitme");
		fs.readFile(files[0],{encoding:'utf8'}, function (err, data) {
		  if (err) throw err;
		  $(".editor-input").val(data);
		  console.log(data);
		  editor.compileText(true);
		  filePath = files[0];
		  ipc.send('add-recent-file', filePath);
		});
	}
}

function saveFileDialog(as){
	if(!filePath || as){
		var files = dialog.showSaveDialog({ 
			properties: [ 'saveFile' ], 
			filters: [
			  { name: 'Readme', extensions: ['md', 'txt'] },
			]
		});
		filePath = files;
	}
	if(filePath){
		remote.getCurrentWindow().setTitle(filePath.split('\\')[filePath.split('\\').length-1] +" - Gitme");
		fs.writeFile(filePath, $(".editor-input").val(),{encoding:'utf8'}, function (err) {
		  if (err) throw err;
		});
		editor.unsaved = false;
	}
}
function saveChangesMessageDialog(callback){
	return dialog.showMessageBox(remote.getCurrentWindow(), {type: "warning", buttons: ["Save", "Cancel", "Don't Save"], title:"Save Changes", message:"Do you want to save changes to this file?", detail: "Your changes will be lost if you don't save them!"});
}


//On close button pressed
remote.getCurrentWindow().on('close', function(event) {
	if(editor.unsaved){
		var response = saveChangesMessageDialog();
		if(response == 1){
			return;
		}else if(response == 0){
			saveFileDialog(false);
		}
	}
	remote.getCurrentWindow().destroy();
});

