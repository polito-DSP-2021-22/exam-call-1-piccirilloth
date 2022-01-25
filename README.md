# Exam Call 1

The structure of this repository is the following:
  - "Client" contains the code of the REACT client implementation;
  - "Mosquitto Configuration" contains the Eclipse Mosquitto configuration file;
  - "REST APIs Design" contains the OpenAPI document describing the design of the REST APIs;
  - "Server" contains the code of the ToDoManager service application;
  - "Server/json_schemas" contains the design of the JSON Schemas.

# MQTT design:
## QoS 
my choice has been to use QoS 1 (at most once) mainly for these reasons:
  - Since the app is executed locally, the network is stable
  - In the remote possibility of data loss, it would not be a big problem because during a normal user experience he often refresh data (by changing the current list he is viewing)
  - The use of QoS 1 would have introduced the handle of duplicates, and, for the obove reasons, I didn't consider it as necessary
  - Moreover the use of QoS 2 is not necessary from my point of view because the probability of data loss is low and it is not strictly necessary that all data has received
## Retained
my choice has been to set the retain flag to false because:
  - 
