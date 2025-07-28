import React from 'react';
import styled from 'styled-components';
import { User, Star, Settings } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatusContainer = styled.div`
  background: #000000;
  border-radius: 0;
  padding: 32px;
  border: 3px solid #8b5cf6;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.8);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%);
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 6px;
  letter-spacing: -0.025em;
  text-transform: uppercase;
  text-shadow: 0 4px 16px rgba(139, 92, 246, 0.5);
`;

const SectionSubtitle = styled.p`
  font-size: 14px;
  color: #666666;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
`;

const MainCard = styled.div`
  background: #0a0a0a;
  border-radius: 0;
  padding: 32px;
  border: 3px solid #1a1a1a;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.8);
  position: relative;
  overflow: hidden;
  grid-column: span 2;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #8b5cf6 50%, transparent 100%);
  }
`;

const MainValue = styled.div`
  font-size: 42px;
  font-weight: 900;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 16px rgba(139, 92, 246, 0.5);
`;

const StatusCard = styled.div`
  background: #0a0a0a;
  border-radius: 0;
  padding: 24px;
  border: 3px solid #1a1a1a;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.8);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.gradient || 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)'};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #8b5cf6 50%, transparent 100%);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  background: ${props => props.color};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
  border: 2px solid #8b5cf6;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: ${props => props.color};
    z-index: -1;
  }
`;

const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.01em;
  text-transform: uppercase;
`;

const CardSubtitle = styled.div`
  font-size: 12px;
  color: #666666;
  font-weight: 700;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ChartContainer = styled.div`
  height: 180px;
  margin-top: 20px;
`;

const BarContainer = styled.div`
  height: 120px;
  margin-top: 20px;
`;

const ChartData = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 12px;
  color: #666666;
  font-weight: 700;
  padding: 12px 0;
  border-top: 2px solid #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatusSection = () => {
  // Mock data for charts
  const lineData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  const barData = [
    { name: 'A', value: 400 },
    { name: 'B', value: 300 },
    { name: 'C', value: 600 },
    { name: 'D', value: 800 },
    { name: 'E', value: 500 },
  ];

  return (
    <StatusContainer>
      <SectionHeader>
        <SectionTitle>State Flateh Sttatus</SectionTitle>
        <SectionSubtitle>Fisde tieth tire damned/7/18 3776</SectionSubtitle>
      </SectionHeader>

      <MainGrid>
        <MainCard>
          <MainValue>$82.10</MainValue>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="name" stroke="#666666" fontSize={12} fontWeight={700} />
                <YAxis stroke="#666666" fontSize={12} fontWeight={700} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000000', 
                    border: '2px solid #8b5cf6',
                    borderRadius: '0',
                    boxShadow: '0 16px 64px rgba(0, 0, 0, 0.8)',
                    color: '#ffffff',
                    fontWeight: 700
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <BarContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="name" stroke="#666666" fontSize={12} fontWeight={700} />
                <YAxis stroke="#666666" fontSize={12} fontWeight={700} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000000', 
                    border: '2px solid #8b5cf6',
                    borderRadius: '0',
                    boxShadow: '0 16px 64px rgba(0, 0, 0, 0.8)',
                    color: '#ffffff',
                    fontWeight: 700
                  }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </BarContainer>
          <ChartData>
            <span>000</span>
            <span>00</span>
            <span>806%</span>
            <span>1829</span>
            <span>40</span>
            <span>08.8</span>
          </ChartData>
        </MainCard>

        <StatusCard gradient="linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)">
          <CardHeader>
            <CardIcon color="linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)">
              <User size={24} color="white" />
            </CardIcon>
            <div>
              <CardTitle>11027</CardTitle>
              <CardSubtitle>STTEE UPT</CardSubtitle>
            </div>
          </CardHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="name" stroke="#666666" fontSize={10} fontWeight={700} />
                <YAxis stroke="#666666" fontSize={10} fontWeight={700} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000000', 
                    border: '2px solid #8b5cf6',
                    borderRadius: '0',
                    boxShadow: '0 16px 64px rgba(0, 0, 0, 0.8)',
                    color: '#ffffff',
                    fontWeight: 700
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </StatusCard>

        <StatusCard gradient="linear-gradient(90deg, #10b981 0%, #059669 50%, #10b981 100%)">
          <CardHeader>
            <CardIcon color="linear-gradient(135deg, #10b981 0%, #059669 50%, #10b981 100%)">
              <Star size={24} color="white" />
            </CardIcon>
            <div>
              <CardTitle>coinestars</CardTitle>
              <CardSubtitle>Acesta trop</CardSubtitle>
            </div>
          </CardHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="name" stroke="#666666" fontSize={10} fontWeight={700} />
                <YAxis stroke="#666666" fontSize={10} fontWeight={700} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000000', 
                    border: '2px solid #8b5cf6',
                    borderRadius: '0',
                    boxShadow: '0 16px 64px rgba(0, 0, 0, 0.8)',
                    color: '#ffffff',
                    fontWeight: 700
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <ChartData>
            <span>T.9 31</span>
            <span>0217</span>
          </ChartData>
        </StatusCard>

        <StatusCard gradient="linear-gradient(90deg, #f59e0b 0%, #f97316 50%, #f59e0b 100%)">
          <CardHeader>
            <CardIcon color="linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #f59e0b 100%)">
              <Settings size={24} color="white" />
            </CardIcon>
            <div>
              <CardTitle>Terme Ootlimer</CardTitle>
              <CardSubtitle>Dismete U</CardSubtitle>
            </div>
          </CardHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="name" stroke="#666666" fontSize={10} fontWeight={700} />
                <YAxis stroke="#666666" fontSize={10} fontWeight={700} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000000', 
                    border: '2px solid #8b5cf6',
                    borderRadius: '0',
                    boxShadow: '0 16px 64px rgba(0, 0, 0, 0.8)',
                    color: '#ffffff',
                    fontWeight: 700
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <ChartData>
            <span>P1010</span>
            <span>D</span>
            <span>DOWSITI</span>
            <span>DES</span>
            <span>$500</span>
            <span>80</span>
            <span>88 Pe</span>
            <span>1634,80 Me</span>
            <span>1810</span>
          </ChartData>
        </StatusCard>
      </MainGrid>
    </StatusContainer>
  );
};

export default StatusSection; 