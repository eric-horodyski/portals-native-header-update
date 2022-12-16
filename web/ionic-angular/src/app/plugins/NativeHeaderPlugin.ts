/**
 * MARK: NativeHeaderPlugin plugin registration code.
 */
import { registerPlugin, WebPlugin } from '@capacitor/core';
import { environment } from 'src/environments/environment';

interface NativeHeaderPlugin {
  setTitle(opts: { title: string }): Promise<void>;
}

class NativeHeaderWeb extends WebPlugin implements NativeHeaderPlugin {
  constructor() {
    super();
  }

  setTitle(opts: { title: string }): Promise<void> {
    !environment.production &&
      console.log(`Native Header set to: ${opts.title}`);
    return Promise.resolve();
  }
}

const NativeHeader = registerPlugin<NativeHeaderPlugin>('NativeHeader', {
  web: new NativeHeaderWeb(),
});
export { NativeHeader };
