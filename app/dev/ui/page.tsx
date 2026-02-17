'use client';

import styled from 'styled-components';
import {
  Button,
  Input,
  Textarea,
  Card,
  SectionCard,
  TabsRoot,
  Tab,
  ProgressBarTrack,
  ProgressBarFill,
  Chip,
  Divider,
  InlineAlert,
  Skeleton,
  EmptyStateRoot,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/ui';

const Section = styled.section`
  margin-bottom: 24px;

  & > h2 {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 8px;
`;

export default function DevUIPage() {
  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>UI 컴포넌트</h1>

      <Section>
        <h2>Button</h2>
        <Row>
          <Button $variant="primary">Primary</Button>
          <Button $variant="secondary">Secondary</Button>
          <Button $variant="ghost">Ghost</Button>
        </Row>
        <Row>
          <Button $variant="primary" disabled>
            Disabled
          </Button>
          <Button $variant="primary" $loading>
            Loading
          </Button>
        </Row>
      </Section>

      <Section>
        <h2>Input / Textarea</h2>
        <Row>
          <Input placeholder="Input placeholder" style={{ maxWidth: 200 }} />
        </Row>
        <Textarea placeholder="Textarea placeholder" style={{ maxWidth: 300 }} />
      </Section>

      <Section>
        <h2>Card / SectionCard</h2>
        <Card style={{ marginBottom: 8 }}>Card content</Card>
        <SectionCard>
          <h3>Section title</h3>
          Section card content
        </SectionCard>
      </Section>

      <Section>
        <h2>Tabs (3개)</h2>
        <TabsRoot>
          <Tab $active>Minimal</Tab>
          <Tab>Natural</Tab>
          <Tab>Upgrade</Tab>
        </TabsRoot>
      </Section>

      <Section>
        <h2>ProgressBar</h2>
        <ProgressBarTrack>
          <ProgressBarFill $percent={60} />
        </ProgressBarTrack>
      </Section>

      <Section>
        <h2>Chip / Badge</h2>
        <Row>
          <Chip>default</Chip>
          <Chip $variant="success">DONE</Chip>
          <Chip $variant="warning">IN_PROGRESS</Chip>
          <Chip $variant="error">LOCKED</Chip>
        </Row>
      </Section>

      <Section>
        <h2>Divider</h2>
        <p>Above</p>
        <Divider />
        <p>Below</p>
      </Section>

      <Section>
        <h2>InlineAlert</h2>
        <InlineAlert $variant="info" style={{ marginBottom: 8 }}>
          Info message
        </InlineAlert>
        <InlineAlert $variant="success" style={{ marginBottom: 8 }}>
          Saved
        </InlineAlert>
        <InlineAlert $variant="error">Error message</InlineAlert>
      </Section>

      <Section>
        <h2>Skeleton</h2>
        <Skeleton style={{ height: 20, width: '100%', marginBottom: 8 }} />
        <Skeleton style={{ height: 40, width: '80%' }} />
      </Section>

      <Section>
        <h2>EmptyState</h2>
        <EmptyStateRoot>
          <EmptyStateTitle>No entries yet</EmptyStateTitle>
          <EmptyStateDescription>Start your first diary.</EmptyStateDescription>
          <Button $variant="primary">Start Today</Button>
        </EmptyStateRoot>
      </Section>
    </div>
  );
}
