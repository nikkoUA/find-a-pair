/**
 * Autor Nikolai Khilkovsky
 * Email: khilkovn@gmail.com
 * Github: https://github.com/nikkoUA
 *
 * @todo: Add Timer
 * @todo: Add messages "GAME OVER", "YOU WIN", "YOU LOSE"
 * @todo: Add best result saving and showing
 * @todo: Add game pause
 */

"use strict";

/**
 * Main App module
 *
 * @type module
 */
var findPairApp = angular.module('findPairApp', []);

/**
 * Cards list for game
 *
 * @type Array
 */
findPairApp.constant('cardsList', ['A', 'B', 'C', 'D', 'E', 'I', 'F', 'G', 'H']);

/**
 * Opened card
 *
 * @type Object
 */
findPairApp.value('cardOpened', {});

/**
 * Service for work with cards
 *
 * @param  {Array} - value.cards
 * @type Object
 * @return Object
 */
findPairApp.service('cards', ['cardsList', 'cardOpened', function (cardsList, cardOpened) {
    return {
        /**
         * Function create cards for game
         *
         * @returns {Array}
         */
        list: function(){
            var result = [],
                cardsForGame = cardsList.concat(cardsList);
            cardsForGame.sort(function(){
                return Math.random() - 0.5;
            });
            for (var i = 0; i < cardsForGame.length; i++){
                result.push({
                    value: cardsForGame[i],
                    className: '',
                    hide: false
                })
            }
            return result;
        },

        /**
         * Event listener of card click. Show card content, check for previous card, hide cards
         *
         * @param card {Object} - clicked card object
         */
        cardClick: function(card){
            if (card.className === 'open' || card.className === 'hide'){
                return false;
            }
            card.className = 'open';
            if (cardOpened.value && cardOpened.value == card.value){
                card.className = 'hide';
                cardOpened.className = 'hide';
            }
            else {
                cardOpened.className = '';
                cardOpened = card;
            }
        }
    };
}]);

/**
 * Main app controller
 *
 * @param $scope
 * @param cards {Function} - service.cards
 */
findPairApp.controller('findPairCtrl', ['$scope', 'cards', function ($scope, cards) {
    $scope.startGame = function(){
        $scope.cards = cards.list();
    };
    $scope.check = cards.cardClick;
}]);
