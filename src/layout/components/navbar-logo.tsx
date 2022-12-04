import useMediaQuery from "@/hooks/useMediaQuery";
import logoWithText from "/logo-white.png";
import logoOnly from "/logo-only.png";

import { Image, Space } from "@mantine/core";

const NavbarLogo = () => {
  const { isSmallerThanMd } = useMediaQuery();

  if (isSmallerThanMd) {
    return (
      <>
        <Space h="md" />
        <Image src={logoOnly} alt="Logo" withPlaceholder />
      </>
    );
  }
  return <Image src={logoWithText} alt="Logo" withPlaceholder />;
};

export default NavbarLogo;
