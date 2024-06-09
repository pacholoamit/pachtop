import { Command } from '@/lib/types';
import { invoke as invokeTauri, InvokeArgs } from 'core';

export const invoke = <T extends InvokeArgs, V = any>(cmd: Command, args?: T) => invokeTauri(cmd, args) as Promise<V>;
