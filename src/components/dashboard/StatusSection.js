import React from 'react';
import styled from 'styled-components';
import { User, Star, Settings } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatusContainer = styled.div`
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #3a3a3a;
`;

const SectionHeader = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
`;

const SectionSubtitle = styled.p`
  font-size: 14px;
  color: #a0a0a0;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
`;

const MainCard = styled.div`
  background: linear-gradient(135deg, #3a3a3a, #2a2a2a);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #4a4a4a;
`;

const MainValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #8b5cf6;
  margin-bottom: 16px;
`;

const StatusCard = styled.div`
  background: linear-gradient(135deg, #3a3a3a, #2a2a2a);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #4a4a4a;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background: ${props => props.color};
`;

const CardTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
`;

const CardSubtitle = styled.div`
  font-size: 12px;
  color: #a0a0a0;
`;

const ChartContainer = styled.div`
  height: 200px;
  margin-top: 16px;
`;

const BarContainer = styled.div`
  height: 100px;
  margin-top: 16px;
`;

const ChartData = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 12px;
  color: #a0a0a0;
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
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                <XAxis dataKey="name" stroke="#a0a0a0" />
                <YAxis stroke="#a0a0a0" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#2a2a2a', 
                    border: '1px solid #3a3a3a',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <BarContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                <XAxis dataKey="name" stroke="#a0a0a0" />
                <YAxis stroke="#a0a0a0" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#2a2a2a', 
                    border: '1px solid #3a3a3a',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#10b981" />
                <Bar dataKey="value" fill="#8b5cf6" />
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

        <StatusCard>
          <CardHeader>
            <CardIcon color="linear-gradient(135deg, #8b5cf6, #a855f7)">
              <User size={20} color="white" />
            </CardIcon>
            <div>
              <CardTitle>11027</CardTitle>
              <CardSubtitle>STTEE UPT</CardSubtitle>
            </div>
          </CardHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                <XAxis dataKey="name" stroke="#a0a0a0" />
                <YAxis stroke="#a0a0a0" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#2a2a2a', 
                    border: '1px solid #3a3a3a',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </StatusCard>

        <StatusCard>
          <CardHeader>
            <CardIcon color="linear-gradient(135deg, #10b981, #059669)">
              <Star size={20} color="white" />
            </CardIcon>
            <div>
              <CardTitle>coinestars</CardTitle>
              <CardSubtitle>Acesta trop</CardSubtitle>
            </div>
          </CardHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                <XAxis dataKey="name" stroke="#a0a0a0" />
                <YAxis stroke="#a0a0a0" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#2a2a2a', 
                    border: '1px solid #3a3a3a',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <ChartData>
            <span>T.9 31</span>
            <span>0217</span>
          </ChartData>
        </StatusCard>

        <StatusCard>
          <CardHeader>
            <CardIcon color="linear-gradient(135deg, #f59e0b, #f97316)">
              <Settings size={20} color="white" />
            </CardIcon>
            <div>
              <CardTitle>Terme Ootlimer</CardTitle>
              <CardSubtitle>Dismete U</CardSubtitle>
            </div>
          </CardHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                <XAxis dataKey="name" stroke="#a0a0a0" />
                <YAxis stroke="#a0a0a0" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#2a2a2a', 
                    border: '1px solid #3a3a3a',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
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