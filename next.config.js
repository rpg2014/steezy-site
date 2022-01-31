const withPWA = require('next-pwa')
const nextConfig = {
    reactStrictMode: true,
    webpack(config, { isServer, dev }) {
        config.experiments = {
          asyncWebAssembly: true,
          layers: true,
        };
    
        if (!dev && isServer) {
          config.output.webassemblyModuleFilename = "chunks/[id].wasm";
          config.plugins.push(new WasmChunksFixPlugin());
        }
    
        config.module.rules.push({
          test: /\.svg$/,
          use: ["@svgr/webpack"],
        });
    
        return config;
      },
}

module.exports = withPWA(
    {
        ...nextConfig,
        pwa: {
            dest: 'public',
            disable: process.env.NODE_ENV === 'development',
            register: false,
            skipWaiting: false,
        }
    }
);

// Found here https://github.com/vercel/next.js/issues/29362, I hope this'll work
class WasmChunksFixPlugin {
    apply(compiler) {
      compiler.hooks.thisCompilation.tap("WasmChunksFixPlugin", (compilation) => {
        compilation.hooks.processAssets.tap(
          { name: "WasmChunksFixPlugin" },
          (assets) =>
            Object.entries(assets).forEach(([pathname, source]) => {
              if (!pathname.match(/\.wasm$/)) return;
              compilation.deleteAsset(pathname);
  
              const name = pathname.split("/")[1];
              const info = compilation.assetsInfo.get(pathname);
              compilation.emitAsset(name, source, info);
            })
        );
      });
    }
  }
