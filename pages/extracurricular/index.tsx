import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { Activity } from '@/components/extracurricular/types';

const ALL = '전체';

const ExtracurricularIndexPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await PoPoAxios.get<Activity[]>('/activity');
        setActivities(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('비교과활동 목록을 불러오지 못했습니다:', err);
        setLoadError(true);
      }
    };
    fetchActivities();
  }, []);

  // 카테고리는 하드코딩하지 않고 실제 등록된 활동에서 뽑는다.
  const categories = [
    ALL,
    ...Array.from(
      new Set(activities.map((act) => act.category).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b, 'ko')),
  ];

  const filteredActivities = activities.filter((act) => {
    const matchesCategory =
      selectedCategory === ALL || act.category === selectedCategory;
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <Container>
        <HeaderSection>
          <h1>비교과활동 수기집</h1>
          <SubTitle>
            세계문화탐방대, 노벨위크 등 선배들의 생생한 활동 수기를 한곳에서
            확인하세요.
          </SubTitle>

          <SearchFilterWrapper>
            <CategoryGroup>
              {categories.map((cat) => (
                <CategoryChip
                  key={cat}
                  active={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </CategoryChip>
              ))}
            </CategoryGroup>
            <SearchInput
              type="text"
              placeholder="활동명 또는 내용으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchFilterWrapper>
        </HeaderSection>

        <Grid>
          {filteredActivities.map((act) => (
            <CardLink key={act.uuid} href={`/extracurricular/${act.uuid}`}>
              <Card>
                <CardHeader>
                  <CategoryBadge>{act.category}</CategoryBadge>
                  <IconTag>📘</IconTag>
                </CardHeader>
                <CardTitle>{act.title}</CardTitle>
                <CardDescription>{act.description}</CardDescription>

                <CardMeta>
                  <MetaRow>
                    <MetaLabel>모집/시행</MetaLabel>
                    <MetaVal>{act.period}</MetaVal>
                  </MetaRow>
                  <MetaRow>
                    <MetaLabel>지원 대상</MetaLabel>
                    <MetaVal>{act.target}</MetaVal>
                  </MetaRow>
                </CardMeta>

                <CardFooter>
                  <span>수기 및 상세 보기</span>
                  <span>→</span>
                </CardFooter>
              </Card>
            </CardLink>
          ))}
        </Grid>

        {filteredActivities.length === 0 && (
          <EmptyState>
            <p>
              {loadError
                ? '비교과활동을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
                : '검색 조건에 해당되는 비교과활동이 없습니다.'}
            </p>
          </EmptyState>
        )}
      </Container>
    </Layout>
  );
};

export default ExtracurricularIndexPage;

const Container = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 40px 20px 80px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const HeaderSection = styled.div`
  margin-bottom: 40px;
`;

const SubTitle = styled.p`
  font-size: 16px;
  color: #4b5563;
  margin: 0 0 28px 0;
  line-height: 1.6;
`;

const SearchFilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const CategoryGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CategoryChip = styled.button<{ active: boolean }>`
  border: 1px solid ${(props) => (props.active ? '#111827' : '#e5e7eb')};
  background-color: ${(props) => (props.active ? '#111827' : '#ffffff')};
  color: ${(props) => (props.active ? '#ffffff' : '#374151')};
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #111827;
  }
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  max-width: 320px;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: #9ca3af;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CategoryBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  background-color: #f3f4f6;
  padding: 4px 10px;
  border-radius: 6px;
`;

const IconTag = styled.span`
  font-size: 20px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 10px 0;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 20px 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  border-top: 1px solid #f3f4f6;
  padding-top: 14px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MetaRow = styled.div`
  display: flex;
  font-size: 13px;
`;

const MetaLabel = styled.span`
  color: #9ca3af;
  width: 70px;
  flex-shrink: 0;
`;

const MetaVal = styled.span`
  color: #374151;
  font-weight: 500;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #2563eb;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 0;
  color: #6b7280;
  font-size: 15px;
`;
