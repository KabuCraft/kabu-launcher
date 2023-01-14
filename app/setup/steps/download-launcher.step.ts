import fs from 'fs';
import * as getFile from 'async-get-file';
import path from 'path';
import * as decompress from 'decompress';

import { SetupStepConfig } from '../types';
import { DATA_DIR, LAUNCHER_DIR } from '../const';

export const downloadLauncherStep: SetupStepConfig = {
  run: async () => {
      if (fs.existsSync(LAUNCHER_DIR)) {
        return;
      }

			if (!fs.existsSync(DATA_DIR)) {
				await fs.promises.mkdir(DATA_DIR);
			}

			const fileName = 'mmc.zip';
			await getFile(
				'https://files.multimc.org/downloads/mmc-stable-windows.zip',
				{
					directory: DATA_DIR,
					filename: fileName,
				},
			);

			const zipDir = path.join(DATA_DIR, fileName);
			await decompress(zipDir, DATA_DIR);
			await fs.promises.rm(zipDir);
  }
}
