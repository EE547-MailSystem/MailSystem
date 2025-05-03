Table: User
userId String
username String
password String


Table: Email
EmailId String
userId String
# Email Data Table Structure

The following is an example data structure for a DynamoDB table designed to store email information:

## Primary Keys
- **Partition Key**: `email_id` (String, it's the unique key in the dataset)  
  Example: `test_001`


## Attributes
| Field Name | Type | Example/Description |
|------------|------|---------------------|
| `from` | String | `example@123.com` |
| `body` | String | Promotional email content, e.g.:<br>`"your chance to save big on [product/service name]... [Offer valid only until [tomorrow's date]]"` |
| `subject` | String | `"Exclusive offer"` |
| `to` | String | `example@123.com` |
| `category` | String | `"Promotions"` |
| `tags` | String Set | Supports multiple tags, e.g.:<br>- `"Exclusive Offer"`<br>- `"Limited Time"`<br>- `"Discount"` |
| `summary` | String | Email content summary, e.g.:<br>`"Exclusive offer ending tomorrow with a chance to save big..."` |
| `urgent_status` | Boolean | `True` or `False` |
| `read_status` | Boolean | `True` or `False` |

## Example JSON Representation
```json
{
  "email_id": "test_001",
  "timestamp": "2025-04-09T14:30:00Z",
  "from": "example@123.com",
  "body": "your chance to save big on [product/service name]...",
  "subject": "Exclusive offer",
  "to": "example@123.com",
  "category": "Promotions",
  "tags": ["Exclusive Offer", "Limited Time", "Discount"],
  "summary": "Exclusive offer ending tomorrow...",
  "urgent_status": true,
  "read_status": false
}
