# TextField

- type: string
- formats:
    - date
    - date+time
    - time
- view
    - x..l

- [Type Properties](../Schema.md#type-string)
- [View Properties](../Schema.md#type-string)

Is expected to be the root 

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "view": {
        "sizeMd": 6
      }
    },
    "surname": {
      "type": "string",
      "minLength": 2,
      "maxLength": 30,
      "view": {
        "sizeMd": 6
      }
    },
    "phone": {
      "type": "string",
      "$comment": "pattern: only valid for: (888)555-1212 or 555-1212",
      "pattern": "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$",
      "view": {
        "sizeMd": 6
      }
    }
  }
}
```
