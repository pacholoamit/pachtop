import React from "react";
import styled from "styled-components";

interface EllipsisProps {
  width?: string;
  height?: string;
  zIndex?: string;
  top?: string;
  left?: string;
  right?: string;
  blur?: string;
  colors?: string[];
}

const EllipsisWrapper = styled.div<EllipsisProps>`
  pointer-events: none;
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  right: ${(props) => props.right};
  z-index: ${(props) => props.zIndex};
  width: -webkit-fill-available;
  max-width: ${(props) => props.width};
  height: ${(props) => props.height};
  filter: ${(props) => `blur(${props.blur})`};
`;

const EllipsisItem = styled.div<EllipsisProps>`
  width: 100%;
  height: 100%;
  background: ${(props) =>
    `linear-gradient(97.62deg, ${props.colors?.[0]} 2.27%, ${props.colors?.[1]} 50.88%, ${props.colors?.[2]} 98.48%)`};
`;

const Ellipsis: React.FC<EllipsisProps> = ({
  width = "10rem",
  height = "10rem",
  zIndex = "10",
  top = "0",
  left = "auto",
  right = "auto",
  blur = "50px",
  colors = ["rgba(0, 71, 225, 0.22)", "rgba(26, 214, 255, 0.22)", "rgba(0, 220, 130, 0.22)"],
}) => (
  <EllipsisWrapper
    width={width}
    height={height}
    zIndex={zIndex}
    top={top}
    left={left}
    right={right}
    blur={blur}
    colors={colors}
  >
    <EllipsisItem colors={colors} />
  </EllipsisWrapper>
);

export default Ellipsis;
