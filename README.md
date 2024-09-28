# API Documentation for Authentication Services
=====================================
### Authentication Services API
#### Table of Contents
1. [Authenticate user using Google Strategy](#create-slot)
2. [Authenticate user using Local Strategy](#update-slot)
3. [Delete Slot](#delete-slot)
5. [Duplicate Slot from Previous Day](#duplicate-slots-from-previous-day-to-current)
4. [Get all Slots from date](#get-date-specific-slots)
6. [Get all Available Slots](#get-all-available-slots)

<!-- main endpoint for accessing slot api -->
## Main Endpoint
```bash
/auth
```

### Create Slot

- Endpoint: 
```bash 
/create-slot
```
- #### Method: POST
- Description: This API allows a doctor to create a new appointment slot. The doctor must be authenticated and approved.
- #### Authentication: Required (Doctor only)  - JWT Bearer Token


#### Request Body JSON
```json
{
    "date": "DD/MM/YYYY",
    "slots": [
        {
            "startTime": "HH:MM", // (e.g., 10:00 AM)
            "endTime": "HH:MM"  // (e.g., 09:00 )
        }
        // follow the 24 hrs format to send request
    ]
}
```

#### Response  JSON
```json
{
    "success": true,
    "message": "Slot created successfully.",
    "slots": [
        {
            "_id": "new_slot_id",
            "startTime": "timings_entered",
            "endTime": "timings_entered"
        },
        // ...rest of the slots of today if any.
    ]
}
```


### Update Slot

- Endpoint: 
```bash 
/update-slot/{id}
```

- Parameters: id will be the doctor's id of the slot to be updated.
- #### Method: PUT
- Description: This API allows a doctor to update a previous appointment slot. The doctor must be authenticated and approved.
- #### Authentication: Required (Doctor only)  - JWT Bearer Token


#### Request Body JSON
```json
{
    "date": "DD/MM/YYYY",
    "slots": [
        {
            "startTime": HH:MM, // (e.g., 10:00 AM)
            "endTime": HH:MM  // (e.g., 09:00 )
        }
        // follow the 24 hrs format to send request
    ]
}
```

#### Response  JSON
```json
{
    "success": true,
    "message": "Slot created successfully.",
    "slot": [
        {   
            "_id": "new_slot_id",
            "startTime": "timings_entered",
            "endTime": "timings_entered"
        }
    ]
}
```

### Delete Slot

- Endpoint: 
```bash 
/delete-slot/{id}
```

- Parameters:  id will be the slot's id to be deleted.

- #### Method: POST
- Description: This API allows a doctor to delete a appointment slot i.e. if slot is not booked. The doctor must be authenticated and approved.
- #### Authentication: Required (Doctor only)  - JWT Bearer Token


#### Request Body JSON
```json
{
    "empty"
}
```

#### Response  JSON
```json
{
    "success": true,
    "message": "Slot deleted successfully.",
}
```

### Duplicate Slots from previous day to current


- Endpoint:
```bash
/duplicate-slot
```
- Method: POST
- Description: This API allows a doctor to duplicate slots from previous day to current day. The doctor must be authenticated and approved.
- Authentication: Required (Doctor only)  - JWT Bearer Token
#### Request Body JSON
```json
{
    "date": "date of the day we need copy into",
    "selectedSlotIds": ["array of ids of slot that need to be copied"]
}
```
#### Response JSON
```json
{
    "success": true,
    "message": "Selected slots duplicated successfully",
    "date": "date_of_day_selected",
    "slots": [
        "array of slot objects"
    ]
}
```

### Get Date Specific Slots
- Endpoint:
```bash
/all-slots/{id}
```
- Parameters: `id` will be the doctor's id
- Method: GET
- Description: This API allows a `Doctor` or `Admin` to get all slots for a specific date.
- Authentication: Required (User only)  - JWT Bearer Token

#### Request Body JSON
```json
{
    "date": "{date} (DD/MM/YYYY)"
}
```

#### Response JSON
```json
{
    "success": true,
    "date":  "{date} (DD/MM/YYYY)",
    "slots": [ "array of slots" ]
}
```

### Get all available slots
- Endpoint:
```bash
/available/{id}
```
- Parameters: `id` will be the doctor's id
- Method: GET
- Description: This API allows a `User` to get all available slots for  a specific doctor.
- Authentication: Required (User only)  - JWT Bearer Token

#### Request body JSON
```json
{"empty"}
```

#### Response body JSON
```json
{
    "success": true,
    "slots":[{
        "date": "{date} (DD/MM/YYYY)",
        "availableTimes":  [{
            "_id": "id of slot",
            "startTime": "{start} (HH:MM)",
            "endTime": "{end} (HH:MM)",
        }]

    }]
}
```

