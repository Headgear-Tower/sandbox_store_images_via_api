//Internal Functions
async function handleTriggerIn(triggerIn, setActionFlag) {
  if (triggerIn.type === "timeRelative") {
    const triggerInFlag = await handleTriggerTypeTimeRelative(
      true,
      triggerIn.value,
      setActionFlag
    );
    return triggerInFlag;
  }
}

async function handleTriggerOut(triggerInFlag, operation, setActionFlag) {
  if (operation.triggerOut.type == "timeRelative") {
    const triggerOutFlag = await handleTriggerTypeTimeRelative(
      false,
      operation.triggerOut.value,
      setActionFlag
    );
    return triggerOutFlag;
  }

  if (operation.triggerOut.type == "timeInfinite") {
    const triggerOutFlag = await handleTriggerTypeTimeInfinite(
      true,
      setActionFlag
    );
    return triggerOutFlag;
  }
  if (operation.triggerOut.type == "machine") {
    const triggerOutFlag = await handleTriggerTypeMachine(true, setActionFlag);
    return triggerOutFlag;
  }
}
function handleTriggerTypeTimeRelative(actionFlag, value, setActionFlag) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      setActionFlag(actionFlag);
      resolve(true);
    }, value);
  });
}

function handleTriggerTypeTimeInfinite(actionFlag, setActionFlag) {
  return new Promise((resolve, reject) => {
    setActionFlag(actionFlag);
    resolve(true);
  });
}

function handleTriggerTypeUser(actionFlag, value, setActionFlag) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      setActionFlag(actionFlag);
      resolve(true);
    }, value);
  });
}

function handleTriggerTypeMachine(actionFlag, value, setActionFlag) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      setActionFlag(actionFlag);
      resolve(true);
    }, value);
  });
}
function createOptions(opIds, operations) {
  var sceneOperations = [];
  opIds.forEach((requiredOpNumber) => {
    var filteredOperations = operations.filter(
      (operation) => operation.opId === requiredOpNumber
    );
    sceneOperations.push(filteredOperations[0]);
  });

  return sceneOperations;
}

//External Functions
export async function handleOpSubTypeImage(
  operation,
  setActionFlag,
  setClapperboard
) {
  setActionFlag(false);
  const sceneOperations = [operation];
  setClapperboard(sceneOperations);

  const triggerInCompleteFlag = await handleTriggerIn(
    operation.triggerIn,
    setActionFlag
  );
  const triggerOutCompleteFlag = await handleTriggerOut(
    triggerInCompleteFlag,
    operation,
    setActionFlag
  );
  return triggerOutCompleteFlag;
}

export async function handleOpSubTypeRichText(
  operation,
  setActionFlag,
  setClapperboard
) {
  console.log("handleOpSubTypeRichText called");
  setActionFlag(false);
  const sceneOperations = [operation];
  setClapperboard(sceneOperations);
  const triggerInCompleteFlag = await handleTriggerIn(
    operation.triggerIn,
    setActionFlag
  );
  const triggerOutCompleteFlag = await handleTriggerOut(
    triggerInCompleteFlag,
    operation,
    setActionFlag
  );
  return triggerOutCompleteFlag;
}

export async function handleOpSubTypeQuestion(
  operation,
  setActionFlag,
  setClapperboard,
  setIdsToRender,
  operations
) {
  console.log("handleOpSubTypeQuestion called");
  // Define the scene
  var sceneOperations = [];
  var sceneOpIds = [];
  const questionOperation = operation;
  sceneOperations.push(questionOperation);

  const optionOperations = createOptions(operation.nextOpId, operations);
  sceneOperations = sceneOperations.concat(optionOperations);
  sceneOperations.forEach((op) => {
    sceneOpIds.push(op.opId);
  });

  //console.log(sceneOperations);
  // Execute the scene
  setActionFlag(false);
  setClapperboard(sceneOperations);

  var idsToRenderSetFlag = await setIdsToRender(sceneOpIds);
  var [questionOp] = sceneOperations.filter((op) => op.subType === "question");
  const sceneExecutedFlag = await handleTriggerIn(
    questionOp.triggerIn,
    setActionFlag
  );

  //await user input flag before handle trigger out

  return sceneExecutedFlag;
}
