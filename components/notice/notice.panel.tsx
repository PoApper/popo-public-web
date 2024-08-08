import { PoPoAxios } from '@/lib/axios.instance';
import { INotice } from '@/types/notice.interface';
import { IUser } from '@/types/user.interface';
import { useEffect, useState } from 'react';
import NoticeCard from './notice.card';

const NoticePanel = ({ noticeList }: { noticeList: INotice[] }) => {
  const [user, setUser] = useState<IUser | null>({
    name: '',
  });

  useEffect(() => {
    PoPoAxios.get('/auth/verifyToken', {
      withCredentials: true,
    })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {noticeList.map((notice) => (
        <NoticeCard key={notice.id} notice={notice} user={user} />
      ))}
    </div>
  );
};

export default NoticePanel;
