const { MakerSquirrel } = require('@electron-forge/maker-squirrel');
const { MakerZIP } = require('@electron-forge/maker-zip');
const { MakerDeb } = require('@electron-forge/maker-deb');
const { MakerRpm } = require('@electron-forge/maker-rpm');
const { MakerDMG } = require('@electron-forge/maker-dmg');
const { WebpackPlugin } = require('@electron-forge/plugin-webpack');

const mainConfig = require('./webpack.main.config');
const rendererConfig = require('./webpack.renderer.config');

module.exports = {
  packagerConfig: {
    appBundleId: 'com.example.tinkers',
    appCategoryType: 'public.app-category.developer-tools',
    icon: './assets/icon.png'
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: 'tinkers',
      authors: 'Your Name',
      description: 'A Tinkerwell-like app for running code snippets',
      iconUrl: 'https://raw.githubusercontent.com/yourusername/tinkers/main/assets/icon.ico',
      setupIcon: './assets/icon.ico'
    }),
    new MakerZIP({}, ['darwin', 'win32']),
    // Temporarily removing DMG maker due to path configuration issues
    // We'll focus on ZIP installers for now which are working correctly
    // new MakerDMG({
    //   format: 'ULFO',
    //   name: 'Tinkers',
    //   icon: './assets/icon.png',
    //   background: './assets/dmg-background.png',
    //   iconSize: 80,
    //   contents: [
    //     { x: 448, y: 344, type: 'link', path: '/Applications' },
    //     { x: 192, y: 344, type: 'file', path: 'tinkers.app' }
    //   ]
    // }),
    new MakerDeb({
      options: {
        maintainer: 'Your Name',
        homepage: 'https://github.com/yourusername/tinkers'
      }
    }),
    new MakerRpm({
      options: {
        maintainer: 'Your Name',
        homepage: 'https://github.com/yourusername/tinkers'
      }
    })
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/renderer/index.html',
            js: './src/renderer/index.tsx',
            name: 'main_window',
            preload: {
              js: './src/preload/preload.ts'
            }
          }
        ]
      }
    })
  ]
};
