import React from 'react';
import { PoPoAxios } from '@/lib/axios.instance';
import { INotice } from '@/types/notice.interface';
import { IUser } from '@/types/user.interface';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Image, Icon } from 'semantic-ui-react';
import styled from 'styled-components';

interface NoticeCardProps {
  notice: INotice;
  user: IUser | null;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice, user }) => {
  const router = useRouter();
  const [isLike, setIsLike] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  const user_id = user ? user.uuid : null;
  const notice_id = notice.id;

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!user_id) return;

      const status = await PoPoAxios.get(
        `/noticeLike/status/${user_id}/${notice_id}`,
      );
      setIsLike(status.data);
    };

    const fetchLikeCount = async () => {
      const count = await PoPoAxios.get(`/noticeLike/count/${notice_id}`);
      setLikeCount(count.data);
    };

    fetchLikeStatus();
    fetchLikeCount();
  }, [user_id, notice_id]);

  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/auth/login');
      return;
    }

    if (isLike) {
      await PoPoAxios.delete(`/noticeLike/${user_id}/${notice_id}`)
        .then(() => setLikeCount(likeCount - 1))
        .catch((err) => {
          const errMsg = err.response.data.message;
          alert(`공지 좋아요 취소에 실패했습니다.\n${errMsg}`);
          console.log(err);
        });
    } else {
      await PoPoAxios.post('/noticeLike', {
        user_id: user_id,
        notice_id: notice_id,
      })
        .then(() => setLikeCount(likeCount + 1))
        .catch((err) => {
          const errMsg = err.response.data.message;
          alert(`공지 좋아요에 실패했습니다.\n${errMsg}`);
          console.log(err);
        });
    }
    // toggle my like status
    setIsLike(!isLike);
  };

  return (
    <NoticeCardContainer>
      <div style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none' }}>
        {notice.link ? (
          <a
            href={notice.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'black' }}
          >
            {notice.title} 🔗
          </a>
        ) : (
          notice.title
        )}
      </div>
      <div style={{ marginTop: 8, whiteSpace: 'pre-line', textAlign: 'left' }}>
        {notice.content}
      </div>
      {notice.image_url ? (
        <Image src={notice.image_url} alt={notice.title} />
      ) : null}
      <hr />
      <div style={{ marginTop: 8, paddingRight: 4, textAlign: 'right' }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
          onClick={handleLike}
        >
          {isLike ? (
            <Icon name="heart" color="red" />
          ) : (
            <Icon name="heart outline" color="grey" />
          )}
        </button>
        <span style={{ marginLeft: 4 }}>{likeCount}</span>
      </div>
    </NoticeCardContainer>
  );
};

export default NoticeCard;

const NoticeCardContainer = styled.div`
  background: #eeeeee;
  border-radius: 0.4em;
  padding: 14px;
`;
