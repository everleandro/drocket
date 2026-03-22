export interface UseFieldActionsOptions {
  emit: unknown;
  focus: () => void;
}

export const useFieldActions = ({
  emit,
  focus,
}: UseFieldActionsOptions) => {
  const emitFieldAction = (
    event: "click:prepend" | "click:append",
    value: MouseEvent,
  ): void => {
    (emit as (event: typeof event, value: MouseEvent) => void)(event, value);
  };

  const handleClickPrependIcon = (event: MouseEvent): void => {
    emitFieldAction("click:prepend", event);
    focus();
  };

  const handleClickAppendIcon = (event: MouseEvent): void => {
    emitFieldAction("click:append", event);
    focus();
  };

  return {
    handleClickPrependIcon,
    handleClickAppendIcon,
  };
};