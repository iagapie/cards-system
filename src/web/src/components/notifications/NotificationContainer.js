import { useSelector } from 'react-redux'

import { getNotifications } from '@/store/selectors'

import { Notification } from './Notification'

export const NotificationContainer = () => {
  const { notifications } = useSelector(getNotifications)

  return (
    <div className="notifications">
      <div className="notifications__container">
        {notifications.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  )
}
