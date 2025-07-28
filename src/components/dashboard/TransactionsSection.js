import React from 'react';
import styled from 'styled-components';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const TransactionsContainer = styled.div`
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

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
`;

const ChartCard = styled.div`
  background: linear-gradient(135deg, #3a3a3a, #2a2a2a);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #4a4a4a;
`;

const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 16px;
`;

const MainValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #8b5cf6;
  margin-bottom: 8px;
`;

const ValueSubtitle = styled.div`
  font-size: 12px;
  color: #a0a0a0;
  margin-bottom: 16px;
`;

const ChartContainer = styled.div`
  height: 150px;
  margin-top: 16px;
`;

const ChartLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 12px;
  color: #a0a0a0;
`;

const TransactionsSection = () => {
  // Mock data for area charts
  const areaData = [
    { name: '1007', value: 198 },
    { name: 'BADA', value: 208 },
    { name: '2154', value: 433 },
    { name: '02A', value: 300 },
    { name: 'ADS', value: 500 },
  ];

  const areaData2 = [
    { name: '1', value: 150 },
    { name: '2', value: 250 },
    { name: '3', value: 350 },
    { name: '4', value: 450 },
    { name: '5', value: 550 },
  ];

  const areaData3 = [
    { name: 'P140', value: 200 },
    { name: '000', value: 300 },
    { name: '7RWY', value: 400 },
    { name: '16300', value: 500 },
    { name: 'Lovare', value: 600 },
  ];

  return (
    <TransactionsContainer>
      <SectionHeader>
        <SectionTitle>Traantiohiües</SectionTitle>
      </SectionHeader>

      <ChartGrid>
        <ChartCard>
          <CardTitle>Konstn. Mestites</CardTitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
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
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  fill="rgba(139, 92, 246, 0.2)" 
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          <ChartLabels>
            <span>198</span>
            <span>208</span>
            <span>433</span>
          </ChartLabels>
        </ChartCard>

        <ChartCard>
          <CardTitle>bove COX</CardTitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData2}>
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
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  fill="rgba(139, 92, 246, 0.2)" 
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          <ChartLabels>
            <span>1</span>
          </ChartLabels>
        </ChartCard>

        <ChartCard>
          <MainValue>$8A16:3802</MainValue>
          <ValueSubtitle>Surades</ValueSubtitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData3}>
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
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  fill="rgba(139, 92, 246, 0.2)" 
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          <ChartLabels>
            <span>P140</span>
            <span>000</span>
            <span>7RWY</span>
            <span>16300</span>
            <span>Lovare</span>
          </ChartLabels>
        </ChartCard>
      </ChartGrid>
    </TransactionsContainer>
  );
};

export default TransactionsSection; 