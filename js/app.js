/**
 * Autor Nikolai Khilkovsky
 * Email: khilkovn@gmail.com
 * Github: https://github.com/nikkoUA
 *
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
 * Default game time in seconds
 *
 * @type Number
 */
findPairApp.constant('gameTime', 10);

/**
 * Opened card
 *
 * @type Object
 */
findPairApp.value('game', {
    cardOpened: {},
    cardLeft: 0,
    gameRun: false,
    timeLeft: 0
});

/**
 * Service for work with cards
 *
 * @param cardsList {Array} - constant.cardsList
 * @param card {Object} - value.card
 * @return Object
 */
findPairApp.service('cards', ['cardsList', 'game', function (cardsList, game) {
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
         * @param cardClicked {Object} - clicked card object
         */
        cardClick: function(cardClicked){
            if (cardClicked.className === 'open' || cardClicked.className === 'hide'){
                return false;
            }
            cardClicked.className = 'open';
            if (game.cardOpened.value && game.cardOpened.value == cardClicked.value){
                cardClicked.className = 'hide';
                game.cardOpened.className = 'hide';
            }
            else {
                game.cardOpened.className = '';
                game.cardOpened = cardClicked;
            }
        }
    };
}]);

/**
 * Service Timer
 *
 * @return Object
 */
findPairApp.service('timer', ['$rootScope', 'game', function ($rootScope, game) {
    return {
        /**
         * Function start game timer
         */
        start: function(){
            var that = this;
            setTimeout(function(){
                game.timeLeft--;
                $rootScope.$digest();
                //scope.timeLeft--;
                if (game.gameRun){
                    if (game.timeLeft > 0){
                        that.start();
                    }
                    else {
                        that.stop();
                    }
                }
            }, 1000);
        },

        /**
         * Function pause game timer
         */
        pause: function(){
        },

        /**
         * Function stop game timer
         */
        stop: function(){
        }
    };
}]);


/**
 * Main app controller
 *
 * @param $scope
 * @param cards {Function} - service.cards
 * @param gameTime {Function} - service.gameTime
 */
findPairApp.controller('findPairCtrl', ['$scope', 'cardsList', 'gameTime', 'game', 'cards', 'timer', function ($scope, cardsList, gameTime, game, cards, timer) {
    $scope.startGame = function(){
        $scope.cards = cards.list();
        game.cardLeft = cardsList.length;
        game.gameRun = true;
        game.timeLeft = gameTime;
        $scope.timeLeft = game.timeLeft;
        timer.start();
    };
    $scope.$watch(function(){
        return game.timeLeft;
    }, function(a, b){
        if (a != b){
            $scope.timeLeft = game.timeLeft;
            if (!$scope.timeLeft){
                $scope.cards = [];
                game.gameRun = false;
            }
        }
    });
    $scope.check = cards.cardClick;
}]);
