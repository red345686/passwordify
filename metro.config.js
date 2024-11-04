// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');
defaultConfig.resolver.assetExts.push('firebase');

module.exports = {
    ...defaultConfig,
    resolver: {
        ...defaultConfig.resolver,
        extraNodeModules: {
            '@firebase/auth': require.resolve('@firebase/auth'),
        }
    }
};