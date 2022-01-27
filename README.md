# Exam Call 1

The structure of this repository is the following:
  - "Client" contains the code of the REACT client implementation;
  - "Mosquitto Configuration" contains the Eclipse Mosquitto configuration file;
  - "REST APIs Design" contains the OpenAPI document describing the design of the REST APIs;
  - "Server" contains the code of the ToDoManager service application;
  - "Server/json_schemas" contains the design of the JSON Schemas.

# MQTT design:
## QoS 
my choice has been to use ```QoS 0``` (at most once) mainly for these reasons:
  - Since the app is executed locally, the network is stable
  - In the remote possibility of data loss, it would not be a big problem because during a normal user experience he often refresh data (by changing the current list he is viewing)
  - The use of ```QoS 1``` would have introduced the handle of duplicates, and, for the obove reasons, I didn't consider it as necessary
  - Moreover the use of ```QoS 2``` is not necessary from my point of view because of the reasons described in the first two points

## Topic
the topic of MQTT messages related to operations about public tasks is: ```public/taskId```, where taskId is the id of the task that has been created/modified/deleted

## Retained
my choice has been to set the retain flag to **false** because in this solution the clients subscribe to *public/#* when he click on "Public" button in the navigation bar and they unsubscribe from *public/#* when the click on "My tasks", for this reason it is unless that a client, every time he subscribe to *public/#*, receives the last operation done for each public task since he has already retrieve the list from the server, moreover a pagination system is implemented and so it is not a problem if, when the user clicks on Public button, a call to the db has done since the size of the returned list will never exceed the page size

## MQTT message structure
As described in the JSON schema *Server/json_schemas/mqtt_public_task_message_schema.json*, the MQTT message related to public tasks information is composed by the following fields:
  - ```operation```: this attribute of type string represend what kind of operation has been performed on the task, it can have three values: 
    - **create**: when a new task is created
    - **delete**: when a task is deleted
    - **update**: when a task is updated
  - ```previousPrivateValue```: this attribute of type boolean is required when ```operation``` is equal to **update** and it represent the value of the ```private``` attribute of the task **before** the update operation, it is useful to identify if a task has become public or not
  - ```taskInfo```: this attribute represent the information about the task and it is a reference to the schema *Server/json_schemas/mqtt_task_message_schema.json*, it is required when the ```operation``` attribute is equal to **create** or equal to **update**

## MQTT message management
### operation type:
- **create**: when a new public task is created, the server publish an MQTT message on topic *public/taskId* that contains all the information related to the new task and the ```operation``` attribute is set to *create*. When this message is received from a client, it performs the following operations:
  - if in the current page there are less then 10 elements, the new element is added in the current page and the local information about the *totalItems* are incremented by 1
  - if the current page is full, the number of element of the las page is analyzed, if the last page is not full, then the local information about the *totalItems* is incremented by 1
  - if also the last page is full, then a call to the server is done because the number of pages must be incremented accordingly
- **delete**: when an existing public task is deleted, the server publish an MQTT message on topic *public/taskId* that contains only the ```operation``` filed setted to *delete*: When this message is received from a client, it performs the following operations:
  - if the element is in the current page, it is deleted from the local list and the local information about *totalItems* are decremented by 1
  - if the element is not in the current page, I verify if the current page is the last page and if the number of elements in the current page is greater than 1, if so the local information about *totalItems* are decremented by 1
  - if not, it means that the number of pages could has been modified, so in this case a call to the server is done to retrieve again the public tasks
- **update**: when an existing public task is updated, the server publish an MQTT message on topic *public/taskId* that contains the ```operation``` filed setted to *update*, the content of the task that has been updated and the field ```previousPrivateValue``` setted according with the old value of ```private```. When this message is received from a client, it performs the following operations:
  - if the task has become private, it has to be deleted, so the same operations of the *delete* action are executed
  - if the element is in the current page, simply the information about the task are updated
  - if the element is not present in the current page and the value of ```private``` field has become *false*, the task has to be added to the local list, so the same operations of the *create* action are executed
