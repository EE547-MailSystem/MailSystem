# Data Structure

## email\_preview:

* id  
* timestamp  
* from  
* subject  
* summary  
* tags  
* urgent\_status  
* read\_status

## email\_view:

* id  
* timestamp  
* from  
* subject  
* summary  
* body  
* tags  
* urgent\_status

# GET Method:

## 	Get Category:

		**Method:** GET  
		**URL:** /categories  
		**Response:**   
– 200 OK: Successful, Body: \[String,String,String….\](category string list)  
– 404 Not Found

## 	Get emails in one Category:

		**Method:** GET  
		**URL:** /emails/\[:category\]/preview  
			example: /emails/work  
			special: /emails/all  
		**Response:**   
– 200 OK: Successful, Body: \[**email\_preview**\])  
– 404 Not Found  
	  
Get one email by ID:  
		**Method:** GET  
**URL:**	 /emails/\[:ID\]  
**Response:**   
– 200 OK: Successful, Body: \[**email\_view**\])  
– 404 Not Found

# POST Method:

## 	POST updated importance prompt:

		Method: POST  
		URL: /prompt  
		Request Body:    
user\_prompt(String)  
		Response:

- 200 OK: Successful, Body: String: ImportancePrompt  
- 400 Wrong Value

## 	POST new category:

		Method: POST  
		URL: /categories  
		Request Body:    
newAdd\_catogries: List\[String\]  
		Response:

- 200 OK: Successful, Body: \[String,String,String….\](category string   
- 400 Wrong Value


	POST updated urgent status:  
		Method: POST  
		URL: /urgentStatus  
		Request Body:    
email\_id: String  
urgent\_status: Boolean  
		Response:

- 200 OK: Successful,   
- 400 Wrong Value

