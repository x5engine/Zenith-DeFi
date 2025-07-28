import React from 'react';
import styled from 'styled-components';
import { 
  Home, 
  FileText, 
  Bell, 
  Settings, 
  Calendar, 
  User, 
  BarChart3, 
  Wallet, 
  Folder, 
  Shield, 
  Globe,
  Hexagon,
  Circle
} from 'lucide-react';

const SidebarContainer = styled.div`
  width: 280px;
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  border-right: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.4);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 20px 32px 20px;
  border-bottom: 1px solid #2a2a2a;
  margin-bottom: 0;
  background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
`;

const LogoIcon = styled.div`
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 22px;
  color: white;
  margin-right: 14px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const LogoText = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.025em;
`;

const NavSection = styled.div`
  flex: 1;
  padding: 20px 0;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 20px;
  margin: 2px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${props => props.active ? '#ffffff' : '#a0a0a0'};
  background: ${props => props.active ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' : 'transparent'};
  border: ${props => props.active ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent'};
  box-shadow: ${props => props.active ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none'};
  position: relative;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)'};
    color: #ffffff;
    transform: translateX(4px);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${props => props.active ? 'linear-gradient(180deg, #8b5cf6 0%, #a855f7 100%)' : 'transparent'};
    border-radius: 0 2px 2px 0;
  }
`;

const NavIcon = styled.div`
  margin-right: 14px;
  display: flex;
  align-items: center;
  opacity: ${props => props.active ? 1 : 0.8};
`;

const NavText = styled.span`
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
`;

const BottomSection = styled.div`
  padding: 20px;
  border-top: 1px solid #2a2a2a;
  background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
`;

const BottomItem = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  margin: 6px 0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: #a0a0a0;
  border: 1px solid transparent;

  &:hover {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
    color: #ffffff;
    border-color: rgba(139, 92, 246, 0.3);
    transform: translateX(2px);
  }
`;

const Sidebar = () => {
  const navItems = [
    { icon: Home, text: 'Onaresd', active: true },
    { icon: FileText, text: 'Obrair' },
    { icon: Bell, text: 'R' },
    { icon: Settings, text: 'O' },
    { icon: Calendar, text: 'Onwer' },
    { icon: User, text: 'Grication' },
    { icon: BarChart3, text: 'CRA' },
    { icon: Wallet, text: 'Groellets' },
    { icon: Folder, text: 'Del' },
    { icon: BarChart3, text: 'Traantiohiües' },
    { icon: Shield, text: 'Rek' },
    { icon: Globe, text: 'Deim Gice' },
  ];

  return (
    <SidebarContainer>
      <Logo>
        <LogoIcon>Z</LogoIcon>
        <LogoText>Zenith Defi</LogoText>
      </Logo>
      
      <NavSection>
        {navItems.map((item, index) => (
          <NavItem key={index} active={item.active}>
            <NavIcon active={item.active}>
              <item.icon size={20} />
            </NavIcon>
            <NavText>{item.text}</NavText>
          </NavItem>
        ))}
      </NavSection>

      <BottomSection>
        <BottomItem>
          <NavIcon>
            <Hexagon size={20} color="#8b5cf6" />
          </NavIcon>
          <NavText>Zentre</NavText>
        </BottomItem>
        <BottomItem>
          <NavIcon>
            <Circle size={20} color="#10b981" />
          </NavIcon>
          <NavText>Obroodcard</NavText>
        </BottomItem>
      </BottomSection>
    </SidebarContainer>
  );
};

export default Sidebar; 