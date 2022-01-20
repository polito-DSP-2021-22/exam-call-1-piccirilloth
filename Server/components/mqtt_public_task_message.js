'use strict'

class MQTTPublicTaskMessage {
    constructor(operation, taskProps) {
        this.operation = operation;
        let description = taskProps.description;
        let important = taskProps.important;
        let deadline = taskProps.deadline;
        let priv = taskProps.private;
        let project = taskProps.project;
        let completed = taskProps.completed;
        let owner = taskProps.owner;
        if(description) this.description = description;
        if(important) this.important = important;
        if(deadline) this.deadline = deadline;
        if(priv) this.private = priv;
        if(project) this.project = project;
        if(completed) this.completed = completed;
        if(owner) this.owner = owner;
    }
}

module.exports = MQTTPublicTaskMessage;