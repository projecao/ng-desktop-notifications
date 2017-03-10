import path from 'path';
import babel from 'rollup-plugin-babel';

export default {
  entry: './src/ng-desktop-notifications.js',
  format: 'cjs',
  dest: path.resolve(__dirname, 'dist/ng-desktop-notifications.js'),
  plugins: [ 
      babel()
  ],
  sourceMap: true
};