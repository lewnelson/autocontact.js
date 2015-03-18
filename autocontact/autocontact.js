/*
 |------------------------------------------------------------------------------------
 |	autocontact.js by lewis nelson @ http://lewnelson.com
 |
 |	Project & documentation on github @ https://github.com/lewnelson/autocontact.js
 |------------------------------------------------------------------------------------
 */

// Set generic configuration here
function auto_contact_generic_config(){
	generic_config = ({
		email_div: '#email-div',		// Must set this to the div you wish to use to populate with your email address(es)
		email_separator: '<br><br>',	// HTML code that separates your email addresses. Default is <br>
		email_enabled: true,			// Is email writing enabled? Defaults to true. If false then your email won't be written.
		check_email: true,				// Runs validation checks on email configuration
		warnings: true					// Turns on warnings during validation checks
	});
	
	return generic_config;
}

function auto_contact_email_config(){
	auto_email = {};
	
	auto_email['my_email'] = {
		lhs: 'username',  			//Enter the username (left part) of the email address here must be set
		rhs: 'domainname.com',		//Enter the domain (right part) of the email address here must be set
		subject: 'Email Subject',	//Enter the default email subject here (optional)
		body: "Email Body",			//Optional enter email body text for line breaks insert \n (optional)
		wrap: '{}',					//Option to wrap email address with brackets etc. To wrap in brackets Just insert '()' the first character is inserted before email address and The second character after the email address (optional)
		target: false,				//Set <a target=""> default is blank (optional)
		class_name: false,			//lets you set an optional class for the anchor (optional)
		id_name: false,				//lets you set an optional id for the anchor (optional)
		name: false,				//lets you set an optional name for the anchor (optional)
		alternative_text: false		//lets you set an alternative to the email address appearing if you want text and email then put [insert-email] where you want email to appear (optional)
	};
	
	return auto_email;
}

function verify_auto_email(auto_email,index){
	var lhs = /^\w+([\.-]?\w+)*$/;
	var rhs = /^\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	var valid_targets = ['blank','self','parent','top'];
	var count_valid_targets = valid_targets.length - 1;
	var warnings = '';
	if(lhs.test(auto_email[index]['lhs']) == false){
		return 'Critical Error: lhs of email address "' + index + '" - format invalid.';
	}
	if(rhs.test(auto_email[index]['rhs']) == false){
		return 'Critical Error: rhs of email address "' + index + '" - format invalid.';
	}
	if(!(auto_email[index]['subject'] === false || auto_email[index]['subject'] === undefined)){
		if(auto_email[index]['subject'] == ''){
			var warnings = warnings + 'Warning: subject of email address "' + index + '" is empty.\n\n';
		}
	}
	if(!(auto_email[index]['wrap'] === false || auto_email[index]['wrap'] === undefined)){
		if(auto_email[index]['wrap'].length > 2){
			var warnings = warnings + 'Warning: wrap of email address "' + index + '" contains more than 2 characters. Only the first two characters are used for wrapping.\n\n';
		}
	}
	if(!(auto_email[index]['target'] === false || auto_email[index]['target'] === undefined)){
		var return_string = '';
		if($.inArray(auto_email[index]['target'], valid_targets) == -1){
			$.each(valid_targets, function(i, value){
				if(i == (count_valid_targets)){
					return_string = return_string + "or " + value + ".";
				}else{
					return_string = return_string + value + ", ";
				} 
			});
			return 'Critical Error: target of email address "' + index + '" - "' + auto_email[index]['target'] + '" is not a valid option. Options are ' + return_string;
		}
	}
	if(warnings == ''){
		return true;
	}else{
		return warnings;
	}
}

function auto_contact_options(option,optional_email_index,generic_config){	
	var valid_options = ({
		email: 'email_enabled',
	});
	
	var valid_indexes = [];
	
	$.each(valid_options, function(ind, val){
		valid_indexes.push(ind);
	});
	
	$.each(valid_options, function(ind, val){
		if($.isArray(option)){
			$.each(option, function(inde, valu){
				if($.inArray(valu, valid_indexes) == -1){
					alert("Critical Error: Invalid option '" + val + "' set for write_contact().");
					throw new Error("Critical Error: Invalid option '" + val + "' set for write_contact().");
				}
			});
		}else{
			if($.inArray(option, valid_indexes) == -1){
				alert("Critical Error: Invalid option '" + option + "' set for write_contact().");
				throw new Error("Critical Error: Invalid option '" + option + "' set for write_contact().");
			}
		}
	});
	
	$.each(valid_options, function(ind, val){
		if($.isArray(option)){
			if($.inArray(ind, option) == -1){
				generic_config[val] = false;
			}
		}else{
			if(option !== ind){
				generic_config[val] = false;
			}
		}
	});
	
	if(generic_config['email_enabled'] === true){
		if(!(optional_email_index === undefined)){
			var valid_options = [];
			$.each(auto_email, function(ind, val){
				valid_options.push(ind);
			});
			
			$.each(valid_options, function(ind, val){
				if($.isArray(optional_email_index)){
					$.each(optional_email_index, function(inde, valu){
						if($.inArray(valu, valid_options) == -1){
							alert("Critical Error: Invalid index. You don't have an email named '" + valu + "' in your configuration.");
							throw new Error("Critical Error: Invalid index. You don't have an email named '" + valu + "' in your configuration.");
						}
					});
				}else{
					if($.inArray(optional_email_index, valid_options) == -1){
						alert("Critical Error: Invalid index. You don't have an email named '" + optional_email_index + "' in your configuration.");
						throw new Error("Critical Error: Invalid index. You don't have an email named '" + optional_email_index + "' in your configuration.");
					}
				}
			});
			
			$.each(valid_options, function(ind, val){
				if($.isArray(optional_email_index)){
					if($.inArray(val, optional_email_index) == -1){
						auto_email[val]['display'] = false;
					}
				}else{
					if(optional_email_index !== val){
						auto_email[val]['display'] = false;
					}
				}
			});
		}
	}
}

function write_contact(option,optional_email_index){
	
	var generic_config = auto_contact_generic_config();
	var auto_email = auto_contact_email_config();
	
	if(!(option === undefined)){
		auto_contact_options(option,optional_email_index,generic_config);
	}
	
	var email_count = Object.keys(auto_email).length;
	
	if((generic_config['email_enabled'] === true || generic_config['email_enabled'] === undefined)){
		if(email_count > 0){
			$.each(auto_email, function(index, value){
				if((auto_email[index]['display'] === true || auto_email[index]['display'] === undefined)){
					if((generic_config['check_email'] === true || generic_config['check_email'] === undefined)){
						var confirm = verify_auto_email(auto_email,index);
						if(confirm !== true){
							if(confirm.substring(0, 8) == "Critical"){
								alert(confirm);
								throw new Error(confirm);
							}else{
								if((generic_config['warnings'] === true || generic_config['warnings'] === undefined)){
									console.warn(confirm);
								}
							}
						}
					}
					var email_address = auto_email[index]['lhs'] + "@" + auto_email[index]['rhs'];
					var encoded_email_address = encodeURIComponent(email_address);
					var elb = ["<a href=\"mailto:","?Subject=","&body=","\""," ","class=\"","id=\"","name=\"","target=\"",">","</a>"];
					if(!(auto_email[index]['subject'] === false || auto_email[index]['subject'] === undefined)){
						var subject = encodeURIComponent(auto_email[index]['subject']);
						if(!(auto_email[index]['body'] === false || auto_email[index]['body'] === undefined)){
							var body = encodeURIComponent(auto_email[index]['body']);
							var email_link = elb[0]+encoded_email_address+elb[1]+subject+elb[2]+body+elb[3];
						}else{
							var email_link = elb[0]+encoded_email_address+elb[1]+subject+elb[3];
						}
					}else{
						var email_link = elb[0]+encoded_email_address+elb[3];
					}
					if(!(auto_email[index]['class_name'] === false || auto_email[index]['class_name'] === undefined)){
						email_link = email_link+elb[4]+elb[5]+auto_email[index]['class_name']+elb[3];
					}
					if(!(auto_email[index]['id_name'] === false || auto_email[index]['id_name'] === undefined)){
						email_link = email_link+elb[4]+elb[6]+auto_email[index]['id_name']+elb[3];
					}
					if(!(auto_email[index]['name'] === false || auto_email[index]['name'] === undefined)){
						email_link = email_link+elb[4]+elb[7]+auto_email[index]['name']+elb[3];
					}
					if(!(auto_email[index]['target'] === false || auto_email[index]['target'] === undefined)){
						var target = "_" + auto_email[index]['target'];
						email_link = email_link+elb[4]+elb[8]+target+elb[3];
					}else{
						var target = "_blank";
						email_link = email_link+elb[4]+elb[8]+target+elb[3];
					}
					email_link = email_link+elb[9];
					if(!(auto_email[index]['wrap'] === false || auto_email[index]['wrap'] === undefined)){
						var wrap = auto_email[index]['wrap'].split('');
						if(!(auto_email[index]['alternative_text'] === false || auto_email[index]['alternative_text'] === undefined)){
							var alternative_text = auto_email[index]['alternative_text'].replace('[insert-email]', email_address);
							email_link = email_link+wrap[0]+alternative_text+wrap[1]+elb[10];
						}else{
							email_link = email_link+wrap[0]+email_address+wrap[1]+elb[10];
						}
					}else{
						if(!(auto_email[index]['alternative_text'] === false || auto_email[index]['alternative_text'] === undefined)){
							var alternative_text = auto_email[index]['alternative_text'].replace('[insert-email]', email_address);
							email_link = email_link+alternative_text+elb[10];
						}else{
							email_link = email_link+email_address+elb[10];
						}
					}
					if(!($(generic_config['email_div']) === false || $(generic_config['email_div']) === undefined || $(generic_config['email_div']) === '')){
						if(generic_config['email_div'].indexOf(",") > -1){
							var email_div = generic_config['email_div'].replace(" ", "");
							var email_div = email_div.split(",");
							$.each(email_div, function(index, value){
								$(value).append(email_link);
								if(email_count > 1){
									if(!(generic_config['email_separator'] === false || generic_config['email_separator'] === undefined)){
										$(value).append(generic_config['email_separator']);
									}else{
										if(!(generic_config['separator'] === false || generic_config['separator'] === undefined)){
											$(value).append(generic_config['separator']);
										}else{
											var default_separator = '<br />';
											$(value).append(default_separator);
										}
									}
								}
							});
						}else{
							$(generic_config['email_div']).append(email_link);
							if(email_count > 1){
								if(!(generic_config['email_separator'] === false || generic_config['email_separator'] === undefined)){
									$(generic_config['email_div']).append(generic_config['email_separator']);
								}else{
									if(!(generic_config['separator'] === false || generic_config['separator'] === undefined)){
										$(generic_config['email_div']).append(generic_config['separator']);
									}else{
										var default_separator = '<br />';
										$(generic_config['email_div']).append(default_separator);
									}
								}
							}
						}
					}else{
						alert("please enter a valid div selector in generic_config['email_div']");
						throw new Error("please enter a valid div selector in generic_config['email_div']");
					}
				}
			});
		}
	}
}