import { atom, useSetAtom } from "jotai";
import { AllModules, modules } from "./formComponentMap";

export const draggingComponentAtom = atom(false);
export const draggingDataType = "slot"

export const DraggableSources = () => {
  const setIsDragging = useSetAtom(draggingComponentAtom)

  const handleDragStartHOF = (module: AllModules) => {
    const handleDragStart: React.DragEventHandler<HTMLSpanElement> = (
      event
    ) => {
      setTimeout(() => setIsDragging(true), 10)
      event.dataTransfer.setData(draggingDataType, module.SchemaDefaults._id);
    };
    return handleDragStart;
  };

  const handleDragEnd: React.DragEventHandler<HTMLSpanElement> = () => {
    setIsDragging(false)
  }

  return (
    <span style={{ display: "inline-flex", gap: "4px" }}>
      {modules.map((m) => {
        const id = m.SchemaDefaults._id;
        return (
          <span
            key={id}
            draggable={true}
            onDragStart={handleDragStartHOF(m)}
            onDragEnd={handleDragEnd}
            style={{
              backgroundColor: "#3b3b3b",
              color: "#9ED0E6",
              padding: "0 4px",
              borderRadius: "2px",
            }}
          >
            {id}
          </span>
        );
      })}
    </span>
  );
};
