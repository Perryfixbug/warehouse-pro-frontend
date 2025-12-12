import { Button } from '@/components/ui/button'
import { fetchClient } from '@/lib/fetchClient'
import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Notification } from '@/type/type'
import { useNoficationChannel } from '@/hooks/useNotificationChannel'

const NotificationBell = () => {
  const [notiOpen, setNotiOpen] = useState(false)
  const [notiContent, setNotiContent] = useState<Notification[]>([])

  useNoficationChannel((newNoti)=>{
    setNotiContent(prev=>[newNoti, ...prev])
  })

  const handleMarkAllRead = async()=>{
    const res = await fetchClient('/notifications', "POST")
    const data = res.data
    setNotiContent(data)
  }

  const handleMarkAsRead = async(id: number)=>{
    const res = await fetchClient(`/notifications/${id}`, "PUT")
    const data = res.data
    setNotiContent(prev=>
      prev.map((noti: Notification)=>(
        noti.id === id ? data : noti
      ))
    )
  }

  useEffect(()=>{
    async function fetchNotiContent(){
      const res = await fetchClient('/notifications')
      const data = res.data
      setNotiContent(data)
    }
    fetchNotiContent()
  },[])

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setNotiOpen(!notiOpen)}
        className="z-50 relative"
      >
        <Bell size={20} />

        {/* Noti chưa đọc */}
        {notiContent?.some((n) => !n.read) && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </Button>

      {notiOpen && (
        <div className="absolute top-10 right-0 w-80 bg-white border shadow-lg rounded-md py-2 z-40">
          <div className="px-3 py-2 border-b flex justify-between">
            <h2 className="font-semibold text-sm">Thông báo</h2>
            <h2 className="font-semibold text-[12px] text-blue-500 hover:underline hover:cursor-pointer"
            onClick={handleMarkAllRead}
            >Đọc tất cả</h2>
          </div>

          <ul className="max-h-64 overflow-y-auto divide-y">
            {notiContent?.length === 0 && (
              <li className="text-center py-4 text-gray-500 text-sm">
                Không có thông báo
              </li>
            )}

            {notiContent?.map((noti: Notification) => (
              <li
                key={noti.id}
                className={`px-3 py-3 text-sm cursor-pointer hover:bg-gray-50 ${
                  !noti.read ? "bg-gray-100" : ""
                }`}
                onClick={()=>handleMarkAsRead(noti.id)}
              >
                <div className="font-medium">{noti.content}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(noti.created_at).toLocaleString("vi-VN")}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
