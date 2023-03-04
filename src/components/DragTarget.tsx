import { useAtomValue } from "jotai"
import { ModuleID, SlotAttributes } from "../types"
import { moduleFitsSlot } from "../utils"
import { draggingComponentAtom, draggingDataType } from "./DraggableSources"
import { CompatibleModule, moduleMap } from "./modules"

interface DragTargetProps<S extends readonly SlotAttributes[]> {
  accepts: S,
  onSlotted: (module: CompatibleModule<S>) => void
}

export const DragTarget = <S extends readonly SlotAttributes[]>({accepts, onSlotted}: DragTargetProps<S>) => {
  const isDragging = useAtomValue(draggingComponentAtom)
  if (!isDragging) {
    return null
  }
  const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    const componentID = event.dataTransfer.getData(draggingDataType)
    if (!componentID) {
      return
    }
    const module = moduleMap[componentID as ModuleID]
    if (moduleFitsSlot(module, accepts)) {
      event.preventDefault()
      onSlotted(module)
    }
  }

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
  }

  return (<div onDrop={handleDrop} onDragOver={handleDragOver} style={{backgroundColor: '#3b3b3b'}}>Drage here!</div>)
}