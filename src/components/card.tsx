import { Card as MantineCard } from "@mantine/core";

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  const styles: React.CSSProperties = { height: "300px", ...style };
  return (
    <MantineCard style={styles} shadow="xl" p="sm" radius={"md"} withBorder>
      {children}
    </MantineCard>
  );
};

export default Card;
