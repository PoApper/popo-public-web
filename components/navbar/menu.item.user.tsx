import { useEffect, useState } from 'react';
import { Button, Dropdown, Menu } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import { IUser } from '@/types/user.interface';
import { PoPoAxios } from '@/lib/axios.instance';

const MenuItemUser = () => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>({
    name: '',
  });

  useEffect(() => {
    PoPoAxios.get('/auth/verifyToken', {
      withCredentials: true,
    })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null)); // Do noting!
  }, []);

  const handleLogout = async () => {
    try {
      await PoPoAxios.get('/auth/logout', {
        withCredentials: true,
      });
      await router.push('/');
      window.location.reload();
    } catch (err) {
      alert('로그아웃에 실패했습니다.');
      console.log(err);
    }
  };

  return (
    <Menu.Item position={'right'}>
      {user ? (
        <Dropdown text={user.name}>
          <Dropdown.Menu>
            <Dropdown.Item text={'내 정보'} href={'/auth/my-info'} />
            <Dropdown.Item text={'내 예약'} href={'/auth/my-reservation'} />
            <Dropdown.Item text={'로그아웃'} onClick={handleLogout} />
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button
          href={'/auth/login'}
          style={{ border: 'none', background: 'none' }}
        >
          로그인
        </Button>
      )}
    </Menu.Item>
  );
};

export default MenuItemUser;
