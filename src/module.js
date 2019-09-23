import { WaterRate } from './water_rate_ctrl';
import { loadPluginCss } from 'app/plugins/sdk';

loadPluginCss({
    dark: 'plugins/advantech-water-achieving-rate3/css/radar.dark.css',
    light: 'plugins/advantech-water-achieving-rate3/css/radar.light.css',
})

export { WaterRate as PanelCtrl };
