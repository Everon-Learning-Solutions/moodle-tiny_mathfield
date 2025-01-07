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
 * Commands helper for the Moodle tiny_mathlive plugin.
 *
 * @module      tiny_mathlive/commands
 * @copyright   2024 CharlieZhang <charlie.zhang@cangloryeducation.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import { getButtonImage } from 'editor_tiny/utils';
import { get_string as getString } from 'core/str';
import { handleAction } from 'tiny_mathlive/ui';
import { getSelectedEquation } from 'tiny_mathlive/equation';
import {isTexFilterActive} from 'tiny_equation/options';
import {
    component,
    mathliveButtonButtonName,
    mathliveMenuMenuItemName,
    icon,
} from './common';

/**
 * Tiny Mathlive commands.
 *
 * @module      tiny_mathlive/commands
 * @copyright   2022 Huong Nguyen <huongnv13@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export const getSetup = async () => {
    const [
        mathliveButtonButtonNameTitle,
        mathliveMenuMenuItemNameTitle,
        buttonImage,
    ] = await Promise.all([
        getString('button_mathliveButton', component),
        getString('menuitem_mathliveMenu', component),
        getButtonImage('icon', component),
    ]);

    return (editor) => {
        if (isTexFilterActive(editor)) {
            // Register the Moodle SVG as an icon suitable for use as a TinyMCE toolbar button.
            editor.ui.registry.addIcon(icon, buttonImage.html);
            // Register the Menu Button as a toggle.
            // This means that when highlighted over an existing Equation element it will show as toggled on.

            editor.ui.registry.addToggleButton(mathliveButtonButtonName, {
                icon,
                tooltip: mathliveButtonButtonNameTitle,
                onAction: () => {
                    handleAction(editor);
                },
                onSetup: (api) => {
                    editor.on('NodeChange', () => {
                        const result = getSelectedEquation(editor);
                        api.setActive(result);
                    });
                },
            });

            // Add the mathliveMenu Menu Item.
            // This allows it to be added to a standard menu, or a context menu.
            editor.ui.registry.addMenuItem(mathliveMenuMenuItemName, {
                icon,
                text: mathliveMenuMenuItemNameTitle,
                onAction: () => handleAction(editor),
            });
        }
    };
};
