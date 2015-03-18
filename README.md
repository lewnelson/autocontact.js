# autocontact.js
A script to generate email addresses using javascript.

##**DESCRIPTION**

This is a script which requires jQuery and is used to write out email addresses to your HTML web page to help prevent spam. All the configuration is setup in the same file as the functions so only one file to load. This script is designed to help you write out any amount of email addresses via javascript with some basic configuration. It is not 100% guaranteed that you will not receive any spam, it is however a fairly effective way in helping to prevent spam bots from harvesting email addresses.

##**REQUIREMENTS**

All this script requires is the standard jQuery library. I have included a copy. Just make sure you load jQuery into your HTML before you load autocontact.js.

##**CONFIGURATION**

All of the configuration is done inside autocontact.js. A brief description is provided next to each option. For a full list of options to see what the script is capable of read the section called options.

All of the configuration is done using javascript objects. You can have multiple email configurations by adding new indexes to the object auto_email.

Once you have setup your basic configuration you can just call the function using write_contact() with no parameters. This will write all of your configured emails. If you only want to write a specific email then you can use 
```javascript
write_contact('email', 'email_index_you_want_to_use');
```

To call multiple emails first create an array which contains each email configuration you want to use then call write_contact like this
```javascript
var email_array = ['my_email_1', 'my_email_2', 'my_email_3', 'my_email_4'];

write_contact('email', email_array);
```

To call the function immediately use
```javascript
$(function() {
  write_contact();
});
```

##**OPTIONS**

 1. **Generic Config**
    * email_div - Required. Assigns the div to which your email is written to.
    * email_separator - Optional. Defaults to '<br>', this is what separates multiple email addresses.
    * email_enabled - Optional. Boolean. Defaults to TRUE. If it is FALSE then emails are disabled.
    * check_email - Optional. Boolean. Defaults to TRUE. Runs validation checks on email configuration. I recommend disabling this once you have setup a working email configuration. It is useful for debugging.
    * warnings - Optional. Boolean. Defaults to TRUE. Turns on warnings during validation checks. Warnings are logged to the console or alerted to the screen.
 2. **Email Config**
    * lhs - Required. Writes the left hand side of the email address.
    * rhs - Required. Writes the right hand side of the email address.
    * subject - Optional. Provides a subject for your mailto link.
    * body - Optional. Provides a body for your mailto link.
    * wrap - Optional. Maximum of two characters. Wraps the email address between first and second character. For more flexibility use alternative text instead.
    * target - Optional. Add the target attribute to the mailto anchor. Defaults to blank. Valid options are blank, self, parent or top.
    * class_name - Optional. Assign a class name to the mailto anchor.
    * id_name - Optional. Assign an id to the mailto anchor.
    * name - Optional. Assign a name attribute to the mailto anchor.
    * alternative_text - Optional. Instead of writing your email address as text you can override it here and write whatever you want. If you want to include your email address in the string then just add the string [insert-email] where you want your email address to appear.

##**SOME EXAMPLES**

###Example 1
Configuration in autocontact.js
```javascript
auto_email['my_email'] = {
  lhs: 'test',
  rhs: 'domain.com',
  subject: 'hello world!',
  alternative_text: 'this is my email address [insert-email]'
}
```

Calling function on load.
```javascript
$(function() {
  write_contact();
});
```

This would produce :
```html
<a href="mailto:test%40domain.com?Subject=hello%20world!" target="_blank">this is my email address test@domain.com</a>
```

###Example 2
Configuration in autocontact.js
```javascript
auto_email['my_email'] = {
  lhs: 'test',
  rhs: 'domain.com',
  subject: 'hello world!',
  alternative_text: 'this is my email address [insert-email]'
}

auto_email['my_second_email'] = {
  lhs: 'info',
  rhs: 'domain.com',
  subject: 'Ask me something',
  wrap: '{}',
  class_name: 'second-address'
}
```

Calling function on load.
```javascript
$(function() {
  write_contact('email', 'my_second_email');
});
```

This would produce :
```html
<a href="mailto:info%40domain.com?Subject=Ask%20me%20something" class="second-address" target="_blank">{info@domain.com}</a>
```

###Example 3
Configuration in autocontact.js
```javascript
generic_config = ({
  email_div: "#email-addresses",
  email_separator: "<br><br>"
});

auto_email['my_email'] = {
  lhs: 'test',
  rhs: 'domain.com',
  subject: 'hello world!',
  alternative_text: 'this is my email address [insert-email]'
}

auto_email['my_second_email'] = {
  lhs: 'info',
  rhs: 'domain.com',
  subject: 'Ask me something',
  wrap: '{}',
  class_name: 'second-address'
}

auto_email['my_third_email'] = {
  lhs: 'service',
  rhs: 'domain.com'
}
```

Calling function on load.
```javascript
$(function() {
  var email_array = ['my_email', 'my_third_email'];
  write_contact('email', email_array);
});
```

This would produce :
```html
<div id="email-addresses">
  <a href="mailto:test%40domain.com?Subject=hello%20world!" target="_blank">this is my email address test@domain.com</a>
  <br>
  <br>
  <a href="mailto:service%40domain.com" target="_blank">service@domain.com</a>
  <br>
  <br>
</div>
```
