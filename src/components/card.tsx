import { memo } from 'react';

import { Card as MantineCard } from '@mantine/core';

interface CardProps {
  children: React.ReactNode;
  height?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, style, height = "300px" }) => {
  const styles: React.CSSProperties = {
    height,
    padding: 16,
    ...style,
    backgroundColor: "transparent",
  };

  return (
    <MantineCard style={styles} shadow="lg" p="md" radius={"md"} withBorder>
      {children}
    </MantineCard>
  );
};

const areEqual = (prev: CardProps, next: CardProps) => {
  return prev.height === next.height && prev.children === next.children;
};

export default memo(Card, areEqual);
