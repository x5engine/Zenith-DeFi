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
  background-color: #2a2a2a;
  border-right: 1px solid #3a3a3a;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px 30px 20px;
  border-bottom: 1px solid #3a3a3a;
  margin-bottom: 20px;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  color: white;
  margin-right: 12px;
`;

const LogoText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`;

const NavSection = styled.div`
  flex: 1;
  padding: 0 20px;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? '#ffffff' : '#a0a0a0'};
  background-color: ${props => props.active ? 'rgba(139, 92, 246, 0.1)' : 'transparent'};
  border-left: ${props => props.active ? '3px solid #8b5cf6' : '3px solid transparent'};

  &:hover {
    background-color: rgba(139, 92, 246, 0.05);
    color: #ffffff;
  }
`;

const NavIcon = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
`;

const NavText = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const BottomSection = styled.div`
  padding: 20px;
  border-top: 1px solid #3a3a3a;
`;

const BottomItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #a0a0a0;

  &:hover {
    background-color: rgba(139, 92, 246, 0.05);
    color: #ffffff;
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
            <NavIcon>
              <item.icon size={18} />
            </NavIcon>
            <NavText>{item.text}</NavText>
          </NavItem>
        ))}
      </NavSection>

      <BottomSection>
        <BottomItem>
          <NavIcon>
            <Hexagon size={18} color="#8b5cf6" />
          </NavIcon>
          <NavText>Zentre</NavText>
        </BottomItem>
        <BottomItem>
          <NavIcon>
            <Circle size={18} color="#10b981" />
          </NavIcon>
          <NavText>Obroodcard</NavText>
        </BottomItem>
      </BottomSection>
    </SidebarContainer>
  );
};

export default Sidebar; 