import React from 'react';
import styled from 'styled-components';
import { User, Star, Settings } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatusContainer = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #2a2a2a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
`;

const SectionHeader = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
  letter-spacing: -0.025em;
`;

const SectionSubtitle = styled.p`
  font-size: 15px;
  color: #808080;
  font-weight: 500;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
`;

const MainCard = styled.div`
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #3a3a3a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%);
  }
`;

const MainValue = styled.div`
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
`;

const StatusCard = styled.div`
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #3a3a3a;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.gradient || 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)'};
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
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  background: ${props => props.color};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
`;

const CardSubtitle = styled.div`
  font-size: 13px;
  color: #808080;
  font-weight: 500;
  margin-top: 2px;
`;

const ChartContainer = styled.div`
  height: 220px;
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
  font-size: 13px;
  color: #808080;
  font-weight: 500;
  padding: 12px 0;
  border-top: 1px solid #3a3a3a;
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
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="name" stroke="#808080" fontSize={12} />
                <YAxis stroke="#808080" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #3a3a3a',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
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
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="name" stroke="#808080" fontSize={12} />
                <YAxis stroke="#808080" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #3a3a3a',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
                  }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
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

        <StatusCard gradient="linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)">
          <CardHeader>
            <CardIcon color="linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="name" stroke="#808080" fontSize={11} />
                <YAxis stroke="#808080" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #3a3a3a',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </StatusCard>

        <StatusCard gradient="linear-gradient(90deg, #10b981 0%, #059669 100%)">
          <CardHeader>
            <CardIcon color="linear-gradient(135deg, #10b981 0%, #059669 100%)">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="name" stroke="#808080" fontSize={11} />
                <YAxis stroke="#808080" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #3a3a3a',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
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

        <StatusCard gradient="linear-gradient(90deg, #f59e0b 0%, #f97316 100%)">
          <CardHeader>
            <CardIcon color="linear-gradient(135deg, #f59e0b 0%, #f97316 100%)">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="name" stroke="#808080" fontSize={11} />
                <YAxis stroke="#808080" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #3a3a3a',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
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