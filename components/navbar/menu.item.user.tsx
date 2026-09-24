import { useEffect, useState } from 'react';
import { Button, Dropdown, Menu } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { IUser } from '@/types/user.interface';
import { PoPoAxios } from '@/lib/axios.instance';

const MenuItemUser = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [user, setUser] = useState<IUser | null>({
    name: '',
  });

  useEffect(() => {
    PoPoAxios.get('/auth/verifyToken')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null)); // Do nothing!
  }, []);

  const handleLogout = async () => {
    try {
      await PoPoAxios.get('/auth/logout');
      await router.push('/');
      window.location.reload();
    } catch (err) {
      alert(t('nav.logoutFailed'));
      console.log(err);
    }
  };

  return (
    <Menu.Item position={'right'}>
      {user ? (
        <Dropdown text={user.name}>
          <Dropdown.Menu>
            <Dropdown.Item text={t('nav.myInfo')} href={'/auth/my-info'} />
            <Dropdown.Item
              text={t('nav.myReservation')}
              href={'/auth/my-reservation'}
            />
            <Dropdown.Item text={t('nav.logout')} onClick={handleLogout} />
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button
          href={'/auth/login'}
          style={{ border: 'none', background: 'none' }}
        >
          {t('nav.login')}
        </Button>
      )}
    </Menu.Item>
  );
};

export default MenuItemUser;
