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
  width: 380px;
  background: #000000;
  border-right: 4px solid #8b5cf6;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-shadow: 12px 0 48px rgba(0, 0, 0, 0.9);
  position: relative;
  min-height: 100vh;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent 0%, #8b5cf6 50%, transparent 100%);
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  padding: 32px 24px 40px 24px;
  border-bottom: 4px solid #1a1a1a;
  margin-bottom: 0;
  background: linear-gradient(135deg, #000000 0%, #0a0a0a 100%);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #8b5cf6 50%, transparent 100%);
  }
`;

const LogoIcon = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%);
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 28px;
  color: white;
  margin-right: 16px;
  box-shadow: 0 12px 48px rgba(139, 92, 246, 0.6);
  border: 3px solid #8b5cf6;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%);
    z-index: -1;
  }
`;

const LogoText = styled.div`
  font-size: 22px;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.025em;
  text-transform: uppercase;
  text-shadow: 0 4px 16px rgba(139, 92, 246, 0.6);
`;

const NavSection = styled.div`
  flex: 1;
  padding: 24px 0;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #000000;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #8b5cf6;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a855f7;
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  margin: 4px 20px;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  color: ${props => props.active ? '#ffffff' : '#666666'};
  background: ${props => props.active ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)' : 'transparent'};
  border: ${props => props.active ? '3px solid #8b5cf6' : '3px solid transparent'};
  box-shadow: ${props => props.active ? '0 12px 48px rgba(139, 92, 246, 0.5)' : 'none'};
  position: relative;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)' : 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)'};
    color: #ffffff;
    transform: translateX(12px);
    border-color: #8b5cf6;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6px;
    background: ${props => props.active ? 'linear-gradient(180deg, #8b5cf6 0%, #a855f7 100%)' : 'transparent'};
  }

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${props => props.active ? 'linear-gradient(180deg, #8b5cf6 0%, #a855f7 100%)' : 'transparent'};
  }
`;

const NavIcon = styled.div`
  margin-right: 16px;
  display: flex;
  align-items: center;
  opacity: ${props => props.active ? 1 : 0.8};
`;

const NavText = styled.span`
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const BottomSection = styled.div`
  padding: 24px;
  border-top: 4px solid #1a1a1a;
  background: linear-gradient(135deg, #000000 0%, #0a0a0a 100%);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #8b5cf6 50%, transparent 100%);
  }
`;

const BottomItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  margin: 8px 0;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  color: #666666;
  border: 3px solid transparent;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%);
    color: #ffffff;
    border-color: #8b5cf6;
    transform: translateX(8px);
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
    { icon: Settings, text: 'Additional Item 1' },
    { icon: User, text: 'Additional Item 2' },
    { icon: BarChart3, text: 'Additional Item 3' },
    { icon: Wallet, text: 'Additional Item 4' },
    { icon: Folder, text: 'Additional Item 5' },
    { icon: Shield, text: 'Additional Item 6' },
    { icon: Globe, text: 'Additional Item 7' },
    { icon: Settings, text: 'Additional Item 8' },
    { icon: User, text: 'Additional Item 9' },
    { icon: BarChart3, text: 'Additional Item 10' },
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
              <item.icon size={22} />
            </NavIcon>
            <NavText>{item.text}</NavText>
          </NavItem>
        ))}
      </NavSection>

      <BottomSection>
        <BottomItem>
          <NavIcon>
            <Hexagon size={22} color="#8b5cf6" />
          </NavIcon>
          <NavText>Zentre</NavText>
        </BottomItem>
        <BottomItem>
          <NavIcon>
            <Circle size={22} color="#10b981" />
          </NavIcon>
          <NavText>Obroodcard</NavText>
        </BottomItem>
      </BottomSection>
    </SidebarContainer>
  );
};

export default Sidebar; 