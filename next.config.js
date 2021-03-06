const withPWA = require('next-pwa')
const path = require('path')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
    reactStrictMode: true,
    sassOptions: {
        // includePaths: [path.join(__dirname, 'styles')],
      },
      images: {
        disableStaticImages: true
      },
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
        config.module.rules.push({
			test: /\.(svg|png|jpe?g|gif|mp4)$/i,
			use: [
				{
					loader: 'file-loader',
					options: {
						publicPath: '/_next',
						name: 'static/media/[name].[hash].[ext]',
					},
				},
			],
		})
    
        return config;
      },
}

module.exports = withBundleAnalyzer(withPWA(
    {
        ...nextConfig,
        pwa: {
            dest: 'public',
            disable: process.env.NODE_ENV === 'development',
            register: false,
            skipWaiting: false,
            cacheOnFrontEndNav: true
        }
    }
));

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
