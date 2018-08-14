/* vim: set expandtab sw=4 ts=4 sts=4: */

/**
 * Module imports
 */
import { PMA_sprintf } from '../utils/sprintf';
import { PMA_showCurrentNavigation } from '../functions/navigation';
/**
 *
 * Holds common parameters such as server, db, table, etc
 *
 * The content for this is normally loaded from Header.php or
 * Response.php and executed by ajax.js
 *
 * @module CommonParams
 *
 */
const CommonParams = (function () {
    /**
     * @type {hash} params An associative array of key value pairs
     *
     * @access private
     */
    var params = {};
    /**
     * The returned object is the public part of the module.
     *
     * @method
     *
     * @access public
     */
    return {
        /**
         * Saves all the key value pair that
         * are provided in the input array
         *
         * @param {Hash} obj The input array
         *
         * @return void
         */
        setAll: function (obj) {
            // var reload = false;
            var updateNavigation = false;
            for (var i in obj) {
                if (params[i] !== undefined && params[i] !== obj[i]) {
                    if (i === 'db' || i === 'table') {
                        updateNavigation = true;
                    }
                }
                params[i] = obj[i];
            }
            if (updateNavigation
                && $('#pma_navigation_tree').hasClass('synced')
            ) {
                PMA_showCurrentNavigation();
            }
        },
        /**
         * Retrieves a value given its key
         * Returns empty string for undefined values
         *
         * @param {string} name The key
         *
         * @return {string}
         */
        get: function (name) {
            return params[name];
        },
        /**
         * Saves a single key value pair
         *
         * @param {string} name The key
         *
         * @param {string} value The value
         *
         * @return {self} For chainability
         */
        set: function (name, value) {
            var updateNavigation = false;
            if (name === 'db' || name === 'table' &&
                params[name] !== value
            ) {
                updateNavigation = true;
            }
            params[name] = value;
            if (updateNavigation &&
                    $('#pma_navigation_tree').hasClass('synced')
            ) {
                PMA_showCurrentNavigation();
            }
            return this;
        },
        /**
         * Returns the url query string using the saved parameters
         *
         * @return {string}
         */
        getUrlQuery: function () {
            var common = this.get('common_query');
            var separator = '?';
            var argsep = CommonParams.get('arg_separator');
            if (common.length > 0) {
                separator = argsep;
            }
            return PMA_sprintf(
                '%s%sserver=%s' + argsep + 'db=%s' + argsep + 'table=%s',
                this.get('common_query'),
                separator,
                encodeURIComponent(this.get('server')),
                encodeURIComponent(this.get('db')),
                encodeURIComponent(this.get('table'))
            );
        }
    };
}());

/**
 * Module Export
 */
export default CommonParams;