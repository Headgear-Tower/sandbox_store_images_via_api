import {
  handleOpSubTypeImage,
  handleOpSubTypeRichText,
  handleOpSubTypeQuestion,
  handleOpSubTypeResponseInput,
} from "./handleOpSubType";

export function handleOpTypeBroadcast(
  operation,
  setActionFlag,
  setClapperboard
) {
  if (operation.subType === "image") {
    const subTypeCompleteFlag = handleOpSubTypeImage(
      operation,
      setActionFlag,
      setClapperboard
    );
    return subTypeCompleteFlag;
  }
  if (operation.subType === "richText") {
    const subTypeCompleteFlag = handleOpSubTypeRichText(
      operation,
      setActionFlag,
      setClapperboard
    );
    return subTypeCompleteFlag;
  }
}

export function handleOpTypeInteraction(
  operation,
  setActionFlag,
  setClapperboard,
  setIdsToRender,
  operations
) {
  if (operation.subType === "question") {
    const subTypeCompleteFlag = handleOpSubTypeQuestion(
      operation,
      setActionFlag,
      setClapperboard,
      setIdsToRender,
      operations
    );
    return subTypeCompleteFlag;
  }
}
