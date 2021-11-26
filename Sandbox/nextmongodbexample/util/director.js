// import script from "./script";

import { handleOpTypeBroadcast, handleOpTypeInteraction } from "./handleOpType";

//Services
import { jobDetailsAbridged, postFeedbackById } from "../services/jobService";

class Director {
  constructor(
    setClapperboard,
    setActionFlag,
    setIdsToRender,
    getActorAction,
    handleRouting,
    script
  ) {
    this.setClapperboard = setClapperboard;
    this.setActionFlag = setActionFlag;
    this.setIdsToRender = setIdsToRender;
    this.getActorAction = getActorAction;
    this.handleRouting = handleRouting;
    this.script = script;
    this.operations = script.operations;
    this.humanInput = {};
    this.currentOp = undefined;
    this.currentJob = undefined;
  }

  executeScript() {
    this.executeOperations(this.operations, 1);
  }

  async executeOperations(operations, opNumber) {
    if (opNumber !== undefined) {
      //console.log(opNumber);
      const operation = this.getOperation(operations, opNumber);
      var opCompleteFlag = await this.handleOp(operation, operations);
      if (operation.triggerOut.type !== "user") {
        const [nextOpId] = operation.nextOpId;

        this.executeOperations(operations, nextOpId);
      }
    } else {
      return;
    }
  }

  getOperation(operations, requiredOpNumber) {
    const [op] = operations.filter(
      (operation) => operation.opId === requiredOpNumber
    );
    this.currentOp = op;
    //console.log(this.currentOp);

    return op;
  }

  handleOp(operation) {
    console.log(operation);
    return new Promise((resolve, reject) => {
      if (operation.type === "broadcast") {
        const opCompleteFlag = handleOpTypeBroadcast(
          operation,
          this.setActionFlag,
          this.setClapperboard
        );
        resolve(opCompleteFlag);
      }
      if (operation.type == "interaction") {
        const opCompleteFlag = handleOpTypeInteraction(
          operation,
          this.setActionFlag,
          this.setClapperboard,
          this.setIdsToRender,
          this.operations
        );
        resolve(opCompleteFlag);
      }

      if (operation.type == "navigation") {
        const opCompleteFlag = this.handleRouting(operation);

        resolve(opCompleteFlag);
      }
    });
  }

  getNextOperation(operations, requiredOpNumber) {
    console.log(operations);
    //console.log(requiredOpNumber);
    const [op] = operations.filter(
      (operation) => operation.opId === requiredOpNumber
    );
    // console.log(op);

    return op;
  }

  //// Handle Op Types ////
  handleOpTypeBroadcast(operation) {
    if (operation.subType === "image") {
      const subTypeCompleteFlag = this.handleOpSubTypeImage(
        operation,
        this.setActionFlag,
        this.setClapperboard
      );
      return subTypeCompleteFlag;
    }
    if (operation.subType === "richText") {
      const subTypeCompleteFlag = this.handleOpSubTypeRichText(
        operation,
        this.setActionFlag,
        this.setClapperboard
      );
      return subTypeCompleteFlag;
    }
  }
  handleOpTypeInteraction(operation) {
    if (operation.subType === "question") {
      const subTypeCompleteFlag = this.handleOpSubTypeQuestion(
        operation,
        this.setActionFlag,
        this.setClapperboard,
        this.setIdsToRender
      );
      return subTypeCompleteFlag;
    }
  }

  async handleTriggers(operation) {
    var triggerInCompleteFlag = await this.handleTriggerIn(operation.triggerIn);
    var triggerOutCompleteFlag = await this.handleTriggerOut(
      triggerInCompleteFlag,
      operation
    );
    return triggerOutCompleteFlag;
  }

  checkTriggerInTypeIsEqual(objects) {
    return new Promise((resolve, reject) => {
      const triggerInEqual = objects.every(
        (object) => object.triggerIn.type === objects[0].triggerIn.type
      );
      resolve(triggerInEqual);
    });
  }

  extractObjectKeys(jsonObject) {
    for (var i in jsonObject) {
      var key = i;
      var val = jsonObject[i];
      // console.log(key);

      for (var j in val) {
        var sub_key = j;
        var sub_val = val[j];
      }
      return key;
    }
  }

  async handleTriggerTypeUser(humanSelection) {
    return new Promise((resolve, reject) => {
      this.humanActionFlag = true;
      console.log("handleTriggerTypeUser called");
      console.log(humanSelection);

      /////////////////////////////////////////////////////////////////////////////////////////////////// WIP START

      if (humanSelection.type === "feedback") {
        if (!this.humanInput.feedback) {
          console.log("no feedback object");
          this.humanInput.feedback = {};
          this.humanInput.feedback[
            humanSelection.label
          ] = humanSelection.data.toString();
        }

        if (this.humanInput.feedback) {
          console.log("feedback object already");
          this.humanInput.feedback[
            humanSelection.label
          ] = humanSelection.data.toString();
        }

        console.log(this.humanInput);
        const feedback = this.postFeedback();
        console.log(feedback);
      }
      ///////////////////////////////////////////////////////////////////////////////////// WIP END

      if (humanSelection.nextOpId) {
        var [operation] = this.operations.filter(
          (op) => op.opId === humanSelection.nextOpId[0]
        );

        if (operation.type === "navigation") {
          this.handleRouting(operation);
          resolve(true);
        } else {
          this.executeOperations(this.operations, humanSelection.nextOpId[0]);

          resolve(true);
        }
      }

      if (humanSelection.propertyNumber) {
        // CODE REVIEW: combine these two ifs into one

        const key = this.extractObjectKeys(humanSelection);
        this.humanInput[key] = humanSelection.propertyNumber;
        this.executeOperations(this.operations, 4); //CODE REVIEW: remove int

        //Call Job Service
        if (this.humanInput.propertyNumber && this.humanInput.postCode) {
          const jobDetails = this.getJobDetails();
          console.log(jobDetails);
        }
      }

      if (humanSelection.postCode) {
        const key = this.extractObjectKeys(humanSelection);
        this.humanInput[key] = humanSelection.postCode;
        //this.executeOperations(this.operations, 6); //CODE REVIEW: remove int

        //Call Job Service
        if (this.humanInput.propertyNumber && this.humanInput.postCode) {
          // Authenticate

          // Search Jobs to get user name
          //Search Users to get username and password

          // Login as customer using usename and password

          const jobDetails = this.getJobDetails();

          console.log(jobDetails);
        }
      }
    });
  }

  async getJobDetails() {
    //console.log(this.humanInput);

    const newOperation = {
      opId: undefined,
      nextOpId: undefined,
      type: "broadcast",
      subType: "richText",
      content: undefined,
      triggerIn: { type: "timeRelative", value: 0 },
      triggerOut: { type: "timeRelative", value: 4000 },
      transitionIn: "floatFromMiddleRight",
      transitionOut: "floatToMiddleLeft",
    };
    var { propertyNumber, postCode } = this.humanInput;
    const jobDetails = await jobDetailsAbridged(propertyNumber, postCode);
    const localStorageTokenKey = "jwtToken";
    localStorage.setItem(localStorageTokenKey, jobDetails.data.token);

    if (jobDetails) {
      this.currentJob = jobDetails;
      // const id = jobDetails.data._id;
      const summary = jobDetails.data.summary;
      const firstName = jobDetails.data.firstName;
      const content = `thanks ${firstName}, ah yes... ${summary} there`;
      newOperation.content = content;
      const nextOpId = this.currentOp.nextOpId[0] + 1;
      newOperation.nextOpId = nextOpId;
    } else {
      const content =
        "sorry I can't seem to find a job with those details, could you tell me them again please?";
      newOperation.content = content;
      const nextOpId = this.currentOp.opId - 2;
      newOperation.nextOpId = nextOpId;
      console.log(this.currentOp.opId);
    }

    var opCompleteFlag = await this.handleOp(newOperation);
    this.executeOperations(
      this.operations,
      newOperation.nextOpId,
      opCompleteFlag
    );
  }

  async postFeedback() {
    console.log(this.currentJob);
    const id = this.currentJob.data._id;
    const response = await postFeedbackById(id, this.humanInput.feedback);
  }
}

export default Director;
