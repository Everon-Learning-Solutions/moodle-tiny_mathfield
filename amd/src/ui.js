// This file is part of Moodle - http://moodle.org/
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
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Tiny Mathlive UI.
 *
 * @module      tiny_mathlive/ui
 * @copyright   2024 CharlieZhang <charlie.zhang@cangloryeducation.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import { getCurrentEquationData, setEquation } from 'tiny_mathlive/equation';
import Selectors from 'tiny_mathlive/selectors';

/**
 * Handle action.
 *
 * @param {TinyMCE} editor
 */
export const handleAction = (editor) => {
    displayDialogue(editor);
};

/**
 * Display the mathlive dialogue.
 *
 * @param {TinyMCE} editor
 * @returns {Promise<void>}
 */
const displayDialogue = async (editor) => {

    let data = {};
    const currentEquationData = getCurrentEquationData(editor);
    if (currentEquationData) {
        Object.assign(data, currentEquationData);
    }

    const modal = getMathliveModal(data);

    const input = modal.querySelector(Selectors.elements.equationTextArea);

    modal.querySelector(Selectors.actions.submit).addEventListener('click', () => {
        setEquation(input, editor);
        closeMathliveModal();
    });
};
/**
 * get mathlive input
 * @param {*} data
 * @returns {HTMLElement} The popup modal element
 */

const getMathliveModal = (data) => {
    let overlay = document.getElementById('popup-overlay');
    let popup = document.getElementById('popup');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'popup-overlay';
        document.body.appendChild(overlay);
    }

    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'popup';
        document.body.appendChild(popup);
    }
    const equation = data && Object.keys(data).length > 0 && data.equation ? data.equation : '';

    popup.innerHTML = `<div class="modal-header">
            <h5 class="modal-title">
                Mathlive editor
            </h5>
            <button type="button" class="close modal__close">
                <span>×</span>
            </button>
        </div><div class="modal__content">
        <math-field class="tiny_mathlive_equation w-100" contenteditable="true" tabindex="0">`+ equation + `</math-field>
        </div><div class="modal-footer"><button type="button" class="btn btn-primary" data-action="save">save</button></div>`;
    document.body.appendChild(popup);
    document.body.classList.add('no-scroll');

    popup.style.display = 'block';
    overlay.style.display = 'block';
    popup.querySelector('.modal__close').addEventListener('click', (event) => {
        event.preventDefault();
        closeMathliveModal();
    });

    return popup;
};

/**
 * close modal
 */
const closeMathliveModal = () => {
    let overlay = document.getElementById('popup-overlay');
    let popup = document.getElementById('popup');

    popup.style.display = 'none';
    overlay.style.display = 'none';
    popup.remove();
    overlay.remove();
    document.body.classList.remove('no-scroll');
};