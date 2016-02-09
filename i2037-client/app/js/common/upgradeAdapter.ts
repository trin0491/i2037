/**
 * Created by richard on 15/01/2016.
 */
import {UpgradeAdapter} from 'angular2/upgrade';
export const upgradeAdapter = new UpgradeAdapter();

upgradeAdapter.upgradeNg1Provider('$location');
upgradeAdapter.upgradeNg1Provider('Session');
