/**
 * @rhwp/core 의 wasm 바이너리를 public/ 으로 복사한다.
 *
 * 브라우저에서 `init({ module_or_path: '/rhwp_bg.wasm' })` 로 받아가야 하는데,
 * node_modules 는 정적으로 서빙되지 않으므로 빌드/개발 서버 시작 전에 옮겨둔다.
 *
 * Dockerfile 이 `npm ci --ignore-scripts` 를 쓰기 때문에 postinstall 로는 동작하지
 * 않는다. prebuild/predev 에 걸어 두 경로 모두에서 확실히 실행되게 한다.
 */
import { copyFile, mkdir, stat } from 'fs/promises';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);

const source = path.join(
  path.dirname(require.resolve('@rhwp/core/package.json')),
  'rhwp_bg.wasm',
);
const destination = path.resolve('public', 'rhwp_bg.wasm');

try {
  await stat(source);
} catch {
  console.error(
    `[copy-rhwp-wasm] ${source} 를 찾지 못했습니다. @rhwp/core 가 설치되어 있는지 확인하세요.`,
  );
  process.exit(1);
}

await mkdir(path.dirname(destination), { recursive: true });
await copyFile(source, destination);

const { size } = await stat(destination);
console.log(
  `[copy-rhwp-wasm] public/rhwp_bg.wasm (${(size / 1024 / 1024).toFixed(1)} MB)`,
);
