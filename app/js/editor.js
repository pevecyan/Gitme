
module.exports = {
	compileText: function(automatic){
		var remote = require('remote');
		if(!module.exports.unsaved && !automatic){
			remote.getCurrentWindow().setTitle("● "+remote.getCurrentWindow().getTitle());
		}
		module.exports.unsaved = !automatic;
		$("#status").html("🔃");
		
		
		var text = $(".editor-input").val();
		
		var md = require('markdown-it')();
		var result = md.render(text);
		setTimeout(function(){$("#status").html("✔");},1000);
		
		$(".preview-content").empty().append(result);	
	},
	boldSelection: function(text){
		return "**"+text+"**";
	},
	italicSelection: function(text){
		return "*"+text+"*";
	},
	strikeThroughSelection: function(text){
		return  "~~"+text+"~~";
	},
	h1Selection: function(text){
		return "# "+text;
	},
	h2Selection: function(text){
		return "## "+text;
	},
	h3Selection: function(text){
		return "### "+text;
	},
	h4Selection: function(text){
		return "#### "+text;
	},
	h5Selection: function(text){
		return "##### "+text;
	},
	h6Selection: function(text){
		return "###### "+text;
	},
	bulletSelection: function(text){
		return "* "+text;
	},
	lineSelection: function(text){
		return "---" ;	
	},
	usaved: false,	
};
