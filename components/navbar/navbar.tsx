import styled from 'styled-components';
import { Dropdown, Icon, Image, Menu } from 'semantic-ui-react';
import Link from 'next/link';
import MenuItemUser from './menu.item.user';
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

  position: fixed;
  top: 0;
  z-index: 10;
`;

const NavbarDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: auto;

  max-width: ${({ theme }) => theme.contentWidth};
`;

const NavbarMenu = styled(Menu)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: auto;
  gap: 1rem;

  box-shadow: none !important;
  border: none !important;
  width: 100% !important;
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
  @media only screen and (min-width: 800px) {
    display: none;
  }
`;

const DesktopDiv = styled.span`
  width: 100%;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileNav = () => {
  return (
    <NavbarMenu borderless>
      <Dropdown item icon={'sidebar'}>
        <Dropdown.Menu style={{ width: 200 }}>
          <Dropdown item text="장소/장비 예약">
            <Dropdown.Menu>
              <Dropdown.Item>
                <LinkWithStyle href={'/reservation/place'} passHref>
                  장소 예약
                </LinkWithStyle>
              </Dropdown.Item>
              <Dropdown.Item>
                <LinkWithStyle href={'/reservation/equipment'} passHref>
                  장비 예약
                </LinkWithStyle>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item text="총학생회">
            <Dropdown.Menu>
              <Dropdown.Item>
                <LinkWithStyle href={'/association'} passHref>
                  자치단체 소개
                </LinkWithStyle>
              </Dropdown.Item>
              <Dropdown.Item>
                <LinkWithStyle href={'/benefits'} passHref>
                  제휴 및 할인업체 소개
                </LinkWithStyle>
              </Dropdown.Item>
              <Dropdown.Item>
                <a href={POPOLinks.StudentCouncilArchiveLink} target="_blank">
                  총학생회 기록물관리기관 <Icon name="external" />
                </a>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item text="동아리">
            <Dropdown.Menu>
              <Dropdown.Item>
                <LinkWithStyle href={'/club'} passHref>
                  동아리 소개
                </LinkWithStyle>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item text="생활백서">
            <Dropdown.Menu>
              <Dropdown.Item>
                <LinkWithStyle href={'/whitebook'} passHref>
                  생활백서
                </LinkWithStyle>
              </Dropdown.Item>
              <Dropdown.Item disabled>
                <a href={POPOLinks.InpostackLink} target={'_blank'}>
                  인포스택 <Icon name="external" />
                </a>
              </Dropdown.Item>
              <Dropdown.Item>
                <a href={POPOLinks.PostechDeliveryLink} target={'_blank'}>
                  배달업체 <Icon name="external" />
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

      <MenuItemUser />
    </NavbarMenu>
  );
};

const DesktopNav = () => {
  return (
    <NavbarMenu borderless>
      <Menu.Item style={{ paddingLeft: 0 }}>
        <LinkWithStyle href={'/'} passHref>
          <span style={{ textAlign: 'center' }}>
            <Image centered src={'/popo.svg'} alt={'logo'} size={'small'} />
            <PopoFullText>Postechian&apos;s Portal</PopoFullText>
          </span>
        </LinkWithStyle>
      </Menu.Item>

      <Dropdown item simple text="장소/장비 예약">
        <Dropdown.Menu>
          <Dropdown.Item>
            <LinkWithStyle href={'/reservation/place'} passHref>
              장소 예약
            </LinkWithStyle>
          </Dropdown.Item>
          <Dropdown.Item>
            <LinkWithStyle href={'/reservation/equipment'} passHref>
              장비 예약
            </LinkWithStyle>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown item simple text="총학생회">
        <Dropdown.Menu>
          <Dropdown.Item>
            <LinkWithStyle href={'/association'} passHref>
              자치단체 소개
            </LinkWithStyle>
          </Dropdown.Item>
          <Dropdown.Item>
            <LinkWithStyle href={'/benefits'} passHref>
              제휴 및 할인업체 소개
            </LinkWithStyle>
          </Dropdown.Item>
          <Dropdown.Item
            text={'총학생회 기록물관리기관'}
            target="_blank"
            href={POPOLinks.StudentCouncilArchiveLink}
          />
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown item simple text="동아리">
        <Dropdown.Menu>
          <Dropdown.Item>
            <LinkWithStyle href={'/club'} passHref>
              동아리 소개
            </LinkWithStyle>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown item simple text="생활백서">
        <Dropdown.Menu>
          <Dropdown.Item>
            <LinkWithStyle href={'/whitebook'} passHref>
              생활백서
            </LinkWithStyle>
          </Dropdown.Item>
          <Dropdown.Item
            text={'배달업체'}
            href={POPOLinks.PostechDeliveryLink}
            target={'_blank'}
          />
        </Dropdown.Menu>
      </Dropdown>

      <MenuItemUser />
    </NavbarMenu>
  );
};
