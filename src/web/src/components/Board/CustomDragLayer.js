import { useDragLayer } from 'react-dnd'
import { useMemo } from 'react'

import { DND } from '../../constants/dnd'
import { Category } from './Category'
import { Card } from './Card'

const getItemStyles = (initialOffset, currentOffset) => {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }
  let { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

export const CustomDragLayer = () => {
  const { itemType, item, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  const renderItem = useMemo(() => {
    if (itemType === DND.CARD) {
      return <Card card={item.card} index={item.index} className="transform rotate-6 w-64" />
    }

    if (itemType === DND.CATEGORY) {
      return <Category category={item.category} index={item.index} className="transform rotate-3" />
    }

    return null
  }, [itemType, item])

  return (
    <div className="fixed z-50 left-0 top-0 w-full h-full pointer-events-none">
      <div style={getItemStyles(initialOffset, currentOffset)}>{renderItem}</div>
    </div>
  )
}
