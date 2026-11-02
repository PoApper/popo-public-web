import styled from 'styled-components';
import { Dropdown, Icon, Image, Menu } from 'semantic-ui-react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next/pages';
import MenuItemUser from './menu.item.user';
import LanguageSwitcher from './language.switcher';
import { POPOLinks } from '@/components/common/popo-links';

const Navbar = () => {
  return (
    <NavbarNav>
      <NavbarDiv>
        <MobileDiv>
          <MobileNav />
        </MobileDiv>
        <DesktopDiv>
          <DesktopNav />
        </DesktopDiv>
      </NavbarDiv>
    </NavbarNav>
  );
};

export default Navbar;

const NavbarNav = styled.nav`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: white;

  font-weight: bold;
  width: 100%;
  overflow: visible;

  position: fixed;
  top: 0;
  z-index: 10;
`;

const NavbarDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: auto;
  width: 100%;
  max-width: ${({ theme }) => theme.contentWidth};
  box-sizing: border-box;
`;

const NavbarMenu = styled(Menu)`
  display: flex !important;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  margin: auto;
  gap: 1rem;

  box-shadow: none !important;
  border: none !important;
  width: 100% !important;
  min-width: 0 !important;
`;

const DesktopMenu = styled(NavbarMenu)`
  > .ui.dropdown.item {
    flex: 0 0 auto;
    overflow: visible;
  }

  > .nav-brand.item,
  > .right.menu {
    flex: 0 0 auto;
    max-width: none;
  }

  > .ui.dropdown.item > .text {
    white-space: nowrap;
  }

  > .ui.dropdown.item > .dropdown.icon {
    flex-shrink: 0;
  }

  > .ui.dropdown.item > .menu {
    overflow: visible;
    min-width: 12rem;
  }

  @media only screen and (max-width: 1100px) {
    gap: 0.5rem;

    > .ui.dropdown.item {
      padding-left: 0.55em !important;
      padding-right: 0.55em !important;
    }
  }
`;

const PopoFullText = styled.h1`
  text-align: center;
  margin-top: -0.4em;
  font-family: 'Caveat', serif;
  font-size: medium;
`;

const LinkWithStyle = styled(Link)`
  color: black;
  text-decoration: none;
`;

const MobileDiv = styled.div`
  width: 100%;

  > .ui.menu {
    gap: 0.5rem;
  }

  @media only screen and (min-width: 1024px) {
    display: none;
  }
`;

const DesktopDiv = styled.span`
  width: 100%;
  min-width: 0;
  @media only screen and (max-width: 1023px) {
    display: none;
  }
`;

const MobileNav = () => {
  const { t } = useTranslation('common');

  return (
    <NavbarMenu borderless>
      <Dropdown item icon={'sidebar'}>
        <Dropdown.Menu style={{ width: 200 }}>
          <Dropdown item text={t('nav.reservationMenu')}>
            <Dropdown.Menu>
              <Dropdown.Item>
                <LinkWithStyle href={'/reservation/place'} passHref>
                  {t('nav.placeReservation')}
                </LinkWithStyle>
              </Dropdown.Item>
              <Dropdown.Item>
                <LinkWithStyle href={'/reservation/equipment'} passHref>
                  {t('nav.equipReservation')}
                </LinkWithStyle>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item text={t('nav.studentCouncil')}>
            <Dropdown.Menu>
              <Dropdown.Item>
                <LinkWithStyle href={'/association'} passHref>
                  {t('nav.associationIntro')}
                </LinkWithStyle>
              </Dropdown.Item>
              <Dropdown.Item>
                <LinkWithStyle href={'/benefits'} passHref>
                  {t('nav.benefitsIntro')}
                </LinkWithStyle>
              </Dropdown.Item>
              <Dropdown.Item>
                <a href={POPOLinks.StudentCouncilArchiveLink} target="_blank">
                  {t('nav.archive')} <Icon name="external" />
                </a>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item text={t('nav.club')}>
            <Dropdown.Menu>
              <Dropdown.Item>
                <LinkWithStyle href={'/club'} passHref>
                  {t('nav.clubIntro')}
                </LinkWithStyle>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item text={t('nav.studentAssociation')}>
            <Dropdown.Menu>
              <Dropdown.Item>
                <LinkWithStyle href={'/student_association'} passHref>
                  {t('nav.studentAssociationIntro')}
                </LinkWithStyle>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item text={t('nav.whitebook')}>
            <Dropdown.Menu>
              <Dropdown.Item>
                <LinkWithStyle href={'/whitebook'} passHref>
                  {t('nav.whitebook')}
                </LinkWithStyle>
              </Dropdown.Item>
              <Dropdown.Item>
                <LinkWithStyle href={'/extracurricular'} passHref>
                  {t('nav.extracurricular')}
                </LinkWithStyle>
              </Dropdown.Item>
              <Dropdown.Item>
                <a href={POPOLinks.PostechDeliveryLink} target={'_blank'}>
                  {t('nav.delivery')} <Icon name="external" />
                </a>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Dropdown.Menu>
      </Dropdown>

      <Menu.Item position={'left'} style={{ paddingLeft: 0 }}>
        <Link href={'/'} passHref>
          <Image
            src={'/popo.svg'}
            alt={'logo'}
            size={'tiny'}
            style={{ margin: 'rgba(255, 255, 255, 0.7)' }}
          />
        </Link>
      </Menu.Item>

      <Menu.Menu position="right">
        <LanguageSwitcher />
        <MenuItemUser />
      </Menu.Menu>
    </NavbarMenu>
  );
};

const DesktopNav = () => {
  const { t } = useTranslation('common');

  return (
    <DesktopMenu borderless>
      <Menu.Item className="nav-brand" style={{ paddingLeft: 0 }}>
        <LinkWithStyle href={'/'} passHref>
          <span style={{ textAlign: 'center' }}>
            <Image centered src={'/popo.svg'} alt={'logo'} size={'small'} />
            <PopoFullText>Postechian&apos;s Portal</PopoFullText>
          </span>
        </LinkWithStyle>
      </Menu.Item>

      <Dropdown item simple text={t('nav.reservationMenu')}>
        <Dropdown.Menu>
          <Dropdown.Item>
            <LinkWithStyle href={'/reservation/place'} passHref>
              {t('nav.placeReservation')}
            </LinkWithStyle>
          </Dropdown.Item>
          <Dropdown.Item>
            <LinkWithStyle href={'/reservation/equipment'} passHref>
              {t('nav.equipReservation')}
            </LinkWithStyle>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown item simple text={t('nav.studentCouncil')}>
        <Dropdown.Menu>
          <Dropdown.Item>
            <LinkWithStyle href={'/association'} passHref>
              {t('nav.associationIntro')}
            </LinkWithStyle>
          </Dropdown.Item>
          <Dropdown.Item>
            <LinkWithStyle href={'/benefits'} passHref>
              {t('nav.benefitsIntro')}
            </LinkWithStyle>
          </Dropdown.Item>
          <Dropdown.Item
            text={t('nav.archive')}
            target="_blank"
            href={POPOLinks.StudentCouncilArchiveLink}
          />
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown item simple text={t('nav.club')}>
        <Dropdown.Menu>
          <Dropdown.Item>
            <LinkWithStyle href={'/club'} passHref>
              {t('nav.clubIntro')}
            </LinkWithStyle>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown item simple text={t('nav.studentAssociation')}>
        <Dropdown.Menu>
          <Dropdown.Item>
            <LinkWithStyle href={'/student_association'} passHref>
              {t('nav.studentAssociationIntro')}
            </LinkWithStyle>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown item simple text={t('nav.whitebook')}>
        <Dropdown.Menu>
          <Dropdown.Item>
            <LinkWithStyle href={'/whitebook'} passHref>
              {t('nav.whitebook')}
            </LinkWithStyle>
          </Dropdown.Item>
          <Dropdown.Item>
            <LinkWithStyle href={'/extracurricular'} passHref>
              {t('nav.extracurricular')}
            </LinkWithStyle>
          </Dropdown.Item>
          <Dropdown.Item
            text={t('nav.delivery')}
            href={POPOLinks.PostechDeliveryLink}
            target={'_blank'}
          />
        </Dropdown.Menu>
      </Dropdown>

      <Menu.Menu position="right">
        <LanguageSwitcher />
        <MenuItemUser />
      </Menu.Menu>
    </DesktopMenu>
  );
};
