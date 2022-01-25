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
  - Moreover the use of ```QoS 2``` is not necessary from my point of view because the probability of data loss is low and it is not strictly necessary that all data has received

## Topic
the topic of MQTT messages related to operations about public tasks is: ```public/taskId```, where taskId is the id of the task that has been created/modified/deleted

## Retained
my choice has been to set the retain flag to false because in this solution the clients subscribe to ```public/#``` when he click on "Public" button in the navigation and they unsubscribe from ```public/#``` when the click on "My tasks", for this reason it is unless that a client, every time he subscribe to ```public/#```, receives the last operation done for each public task since he has already retrieve the list from the server

## MQTT message structure
As described in the JSON schema *Server/json_schemas/mqtt_public_task_message_schema.json*, the MQTT message related to public tasks information is composed by the following fields:
  - ```operation```: this attribute of type string represend what kind of operation has been performed on the task, it can have three values: 
    - **create**: when a new task is created
    - **delete**: when a task is deleted
    - **update**: when a task is updated
  - ```previousPrivateValue```: this attribute of type boolean is required when ```operation``` is equal to **update** and it represent the value of the ```private``` attribute of the task **before** the update operation, it is useful to identify if a task has become public or not
  - ```taskInfo```: this attribute represent the information about the task and it is a reference to the schema *Server/json_schemas/mqtt_task_message_schema.json*, it is required when the ```operation``` attribute is equal to **create**

## MQTT message management
### operation type
- **create**
- **delete**
- **update**
