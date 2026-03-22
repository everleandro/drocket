type FieldActionEvent = "click:prepend" | "click:append";

export interface UseFieldActionsOptions {
  emit: unknown;
  focus: () => void;
}

export const useFieldActions = ({
  emit,
  focus,
}: UseFieldActionsOptions) => {
  const emitFieldAction = (
    event: FieldActionEvent,
  ): void => {
    (emit as (event: FieldActionEvent) => void)(event);
  };

  const handleClickPrependIcon = (event: MouseEvent): void => {
    void event;
    emitFieldAction("click:prepend");
    focus();
  };

  const handleClickAppendIcon = (event: MouseEvent): void => {
    void event;
    emitFieldAction("click:append");
    focus();
  };

  return {
    handleClickPrependIcon,
    handleClickAppendIcon,
  };
};