import { Card as MantineCard } from '@mantine/core';

interface CardProps {
  children: React.ReactNode;
  height?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, style, height = "300px" }) => {
  const styles: React.CSSProperties = { height, padding: 16, ...style };
  return (
    <MantineCard style={styles} shadow="xl" p="sm" radius={"md"} withBorder>
      {children}
    </MantineCard>
  );
};

export default Card;
