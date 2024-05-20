import { useContext } from 'react';

import { ServerEventsContext } from '@/providers/server-events.provider';

const useServerEventsContext = () => useContext(ServerEventsContext);

export default useServerEventsContext;
