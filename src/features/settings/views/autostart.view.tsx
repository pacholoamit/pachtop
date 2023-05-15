import { Skeleton, Switch } from "@mantine/core";
import { useEffect, useState } from "react";
import { autostart } from "@/lib";

const AutoStartSettingsView = () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const checkAutoStart = async () => setChecked(await autostart.isEnabled());

  useEffect(() => {
    checkAutoStart();
    setLoading(false);
  }, [checkAutoStart]);

  const onChange = () => {
    if (!checked) {
      autostart.enable();
    } else {
      autostart.disable();
    }
    setChecked(!checked);
  };

  if (loading) {
    return (
      <>
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </>
    );
  }
  return <Switch checked={checked} onChange={onChange} label="Start on system startup" />;
};

export default AutoStartSettingsView;
