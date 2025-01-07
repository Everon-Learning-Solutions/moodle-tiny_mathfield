// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Tiny tiny_mathlive for Moodle.
 *
 * @module      tiny_mathlive/plugin
 * @copyright   2024 CharlieZhang <charlie.zhang@cangloryeducation.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getTinyMCE} from 'editor_tiny/loader';
import {getPluginMetadata} from 'editor_tiny/utils';
import {component, pluginName} from './common';
import * as Commands from 'tiny_mathlive/commands';
import * as Options from 'tiny_mathlive/options';
import * as Configuration from 'tiny_mathlive/configuration';
import "https://unpkg.com/mathlive";

// eslint-disable-next-line no-async-promise-executor
export default new Promise(async (resolve, reject) => {
    try {
        const [tinyMCE, setupCommands, pluginMetadata] = await Promise.all([
            getTinyMCE(),
            Commands.getSetup(),
            getPluginMetadata(component, pluginName),
        ]);

        tinyMCE.PluginManager.add(`${component}/plugin`, (editor) => {
            Options.register(editor);
            setupCommands(editor);
            return pluginMetadata;
        });

        resolve([`${component}/plugin`, Configuration]);
    } catch (error) {
        reject(error);
    }
});
